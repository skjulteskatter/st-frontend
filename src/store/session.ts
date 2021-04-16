/* eslint-disable no-console */
import api, { activity, playlists } from "@/services/api";
import { InjectionKey } from "vue";
import { Commit, createStore, Store } from "vuex";
import auth from "@/services/auth";
import router from "@/router";
import { ensureLanguageIsFetched } from "@/i18n";
import { Collection } from "@/classes";
import { songStore } from "./songs";
import { ApiActivity, ApiPlaylist, ApiSong } from "dmb-api";

const smTs: {
    [key: string]: number;
} = {
    "C": 0,
    "Db": -1,
    "D": -2,
    "Eb": 9,
    "E": 8,
    "F": 7,
    "F#": 6,
    "G": 5,
    "Ab": 4,
    "A": 3,
    "Bb": 2,
    "B": 1,
};

const ts: {
    [key: string]: number;
} = {
    "C": 0,
    "Db": -1,
    "D": 10,
    "Eb": -3,
    "E": 8,
    "F": 7,
    "F#": 6,
    "G": 5,
    "Ab": -8,
    "A": 3,
    "Bb": -10,
    "B": 1,
};

let redirectAfterLogin = "/";

async function init(commit: Commit): Promise<void> {
    const user = await api.session.getCurrentUser();
    user.displayName = auth.user?.displayName ?? user.displayName;

    commit("user", user);
    try {
        const languages = await api.items.getLanguages();
        commit("languages", languages);
        const collections = await api.songs.getCollections();
        commit("collections", collections);
        const playlists = await api.playlists.getPlaylists();
        commit("playlists", playlists);

        const items = JSON.parse(localStorage.getItem("activities") ?? "[]") as ApiActivity[];

        if (items.length) {
            await api.activity.pushActivities(items);
            localStorage.setItem("activities", "[]");
        }

        const activites = await api.activity.getActivities();
        commit("setLogItems", activites);
    } catch (e) {
        console.log(e);
    }
    if (router.currentRoute.value.name == "login") {
        router.push(redirectAfterLogin);
    }
    commit("initialized", true);
    songStore.commit("smTransposition", smTs[user.settings?.defaultTransposition ?? "C"]);
    songStore.commit("transposition", ts[user.settings?.defaultTransposition ?? "C"]);
}

export interface Session {
    currentUser?: User;
    languages: Language[];
    initialized: boolean;
    collections: Collection[];
    extend: boolean;
    error: string;
    playlists: ApiPlaylist[];
    activities: ApiActivity[];
}

export const sessionKey: InjectionKey<Store<Session>> = Symbol();

export const sessionStore = createStore<Session>({
    state: {
        languages: [],
        initialized: false,
        collections: [],
        extend: false,
        error: "",
        playlists: [],
        activities: [],
    },
    actions: {
        async startSession({state, commit}): Promise<void> {
            if (auth.isAuthenticated) {
                if (!state.initialized) {
                    await init(commit);
                }
            } else {
                await auth.sendLinkToEmail();
            }
        },
        async socialLogin({commit}, provider: string): Promise<void> {
            await auth.login(provider);

            if (auth.isAuthenticated) {
                await init(commit);
            } else {
                await auth.sendLinkToEmail();
            }
        },
        async createUser({commit}, object: { 
            email: string; 
            password: string; 
            displayName: string;
        }): Promise<void> {
            await auth.createEmailAndPasswordUser(object.email, object.password, object.displayName);

            if (auth.isAuthenticated) {
                await init(commit);
            } else {
                await auth.sendLinkToEmail();
            }
        },
        async loginWithEmailPassword({ commit }, obj: {
            email: string;
            password: string;
            stayLoggedIn: boolean;
        }): Promise<void> {
            await auth.loginWithEmailAndPassword(obj.email, obj.password, obj.stayLoggedIn);

            if (auth.isAuthenticated) {
                await init(commit);
            } else {
                await auth.sendLinkToEmail();
            }
        },
        async saveSettings({ state, commit }): Promise<void> {
            if (state.currentUser?.settings) {
                const user = await api.session.saveUser(state.currentUser.settings);
                commit("user", user);
                await ensureLanguageIsFetched();
            }
        },
        async logout({ commit }): Promise<void> {
            await auth.logout();
            commit("logout");
        },
        async setDisplayName({ state, commit }, name: string): Promise<void> {
            await auth.setDisplayName(name);
            
            commit("user", Object.assign({
                displayName: name,
            }, state.currentUser));
        },
        async createPlaylist({ commit }, obj: { name: string }): Promise<void> {
            const res = await api.playlists.createPlaylist(obj.name);

            commit("playlist", res);
        },
        async deletePlaylist({ commit }, id): Promise<void> {
            const res = await api.playlists.deletePlaylist(id);
            console.log(res, id);

            commit("deletePlaylist", id);
        },
        async addSongToPlaylist({ commit }, obj: {
            playlistId: string;
            songId: string;
        }): Promise<void> {
            const res = await api.playlists.addToPlaylist(obj.playlistId, obj.songId, "song");

            if (res) {
                commit("updatePlaylist", res);
            }
        },
        async addFileToPlaylist({ commit }, obj: {
            playlistId: string;
            fileId: string;
        }): Promise<void> {
            const res = await playlists.addToPlaylist(obj.playlistId, obj.fileId, "file");

            if (res) {
                commit("updatePlaylist", res);
            }
        },
        async removeFromPlaylist({ commit }, obj: {
            playlistId: string;
            entryId: string;
        }): Promise<void> {
            const res = await api.playlists.removeEntryFromPlaylist(obj.playlistId, obj.entryId);

            if (res) {
                commit("updatePlaylist", res);
            }
        },
        async logItem({ commit }, song: ApiSong): Promise<void> {
            const items = JSON.parse(localStorage.getItem("activities") ?? "[]") as ApiActivity[];

            items.push({
                loggedDate: new Date().toISOString(),
                songId: song.id,
                song: song,
            });

            if (items.length >= 10) {
                await activity.pushActivities(items);
                localStorage.setItem("activities", "[]");
            } else {
                localStorage.setItem("activities", JSON.stringify(items));
            }

            commit("setLogItems", items);
        },
    },
    mutations: {
        user(state, user: User): void {
            state.currentUser = user;
            if (user.settings?.languageKey) localStorage.setItem("languageKey", user.settings.languageKey);
        },
        logout(state): void {
            state.currentUser = undefined;
        },
        settings(state, settings: UserSettings): void {
            if (state.currentUser) {
                state.currentUser.settings = settings;
            }
        },
        languages(state, languages: Language[]): void {
            state.languages = languages;
        },
        initialized(state, initialized: boolean): void {
            state.initialized = initialized;
        },
        collections(state, collections: Collection[]): void {
            state.collections = collections;
        },
        collection(state, collection: Collection): void {
            const c = state.collections.find(c => c.id == collection.id);

            if (c) {
                state.collections[state.collections.indexOf(c)] = collection;
            } else {
                state.collections.push(collection);
            }
        },
        playlists(state, playlists: ApiPlaylist[]): void {
            state.playlists = playlists;
        },
        updatePlaylist(state, playlist: ApiPlaylist): void {
            const pl = state.playlists.find(p => p.id == playlist.id);
            if (pl) {
                pl.entries = playlist.entries;
                pl.name = playlist.name;
            }
        },
        playlist(state, playlist: ApiPlaylist): void {
            state.playlists.push(playlist);
        },
        deletePlaylist(state, id: string): void {
            const playlist = state.playlists.find(p => p.id == id);
            if (!playlist) return;

            state.playlists.splice(state.playlists.indexOf(playlist), 1);
        },
        extend(state, value?: boolean): void {
            state.extend = value != undefined ? value : !state.extend;
        },
        error(state, value: string): void {
            state.error = value;
        },
        redirect(state, value: string): void {
            redirectAfterLogin = value;
        },
        /**
         * Update logs. Removes enough so there's always 10 items in the log.
         */ 
        setLogItems(state, value: ApiActivity[]): void {
            state.activities = state.activities.slice(0, 10 - value.length); 
            state.activities.push(...value);
            state.activities = state.activities.sort((a, b) => new Date(b.loggedDate).getTime() - new Date(a.loggedDate).getTime());
        },
        /**
         * Remove all logs
         * @param state 
         */
        clearLogs(state): void {
            state.activities = [];
        },
    },
    getters: {
        isAdmin(state): boolean {
            return state.currentUser?.roles?.includes("administrator") == true;
        },
        languageKey(state): string {
            return state.currentUser?.settings?.languageKey ?? localStorage.getItem("languageKey") ?? "en";
        },
        collections(state): Collection[] {
            if (state.currentUser) {
                if (state.currentUser.roles.some(r => ["administrator", "extended"].includes(r))) {
                    return state.collections;
                }
                const subscriptions = state.currentUser.subscriptions;
                return state.collections.filter(c => subscriptions
                    .map(s => s.collectionIds)
                    .some(i => i.includes(c.id)));
            } else {
                return [];
            }
        },
        extended(state): boolean {
            return state.currentUser?.roles.some(r => ["extended", "administrator"].includes(r)) == true;
        },
        isAuthenticated(): boolean {
            return auth.isAuthenticated;
        },
        image(): string {
            return auth.image;
        },
    },
});
