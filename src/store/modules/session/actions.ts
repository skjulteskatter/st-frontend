import router from "@/router";
import api from "@/services/api";
import auth from "@/services/auth";
import { ensureLanguageIsFetched } from "@/i18n";
import { RootState } from "../..";
import { IActivity, ApiContributor, ISong } from "songtreasures-api";
import { ActionContext, ActionTree, Commit } from "vuex";
import { SessionActionTypes } from "./action-types";
import { SessionMutationTypes } from "./mutation-types";
import { Mutations } from "./mutations";
import { State } from "./state";
import { SongsMutationTypes } from "../songs/mutation-types";
import { appSession } from "@/services/session";
import { notify } from "@/services/notify";
import { cache } from "@/services/cache";
import { User } from "@/classes";



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

async function init(state: State, commit: Commit): Promise<void> {
    const expiry = new Date().getTime() + 10000;

    await appSession.init();

    const user = appSession.user;
    
    commit(SessionMutationTypes.SET_PLAYLISTS, appSession.customCollections);

    const items = JSON.parse(localStorage.getItem("activities") ?? "[]") as IActivity[];

    if (items.length) {
        api.activity.pushActivities(items).then(() => {
            localStorage.setItem("activities", "[]");
        });
    }

    commit(SessionMutationTypes.SET_USER, user);
    try {
        await appSession.init();
        commit(SessionMutationTypes.SET_TAGS, appSession.tags);
    } catch (e) {
        //console.log(e);
    }

    cache.getOrCreateAsync("activities", api.activity.getActivities, expiry).then(a => {
        commit(SessionMutationTypes.SET_LOG_ITEMS, a);
    });

    if (["login-page", "login-view", "create-user-view"].includes(router.currentRoute.value.name?.toString() ?? "")) {
        router.push(state.redirect ?? "/");
    }
    await ensureLanguageIsFetched();

    commit(SessionMutationTypes.INITIALIZED);
    // commit(SongsMutationTypes.SET_SHEETMUSIC_TRANSPOSITION, smTs[user.settings?.defaultTransposition ?? "C"]);
    commit(SongsMutationTypes.SET_TRANSPOSITION, ts[user.settings?.defaultTransposition ?? "C"]);
}

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1],
    ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;

export interface Actions {
    /**
     * Initialize session.
     * @param param0 
     */
    [SessionActionTypes.SESSION_START]({ state, commit }: AugmentedActionContext): Promise<void>;
    [SessionActionTypes.SESSION_CLEAR]({ commit }: AugmentedActionContext): Promise<void>;
    [SessionActionTypes.SESSION_LOGIN_SOCIAL]({ state, commit }: AugmentedActionContext, payload: string): Promise<void>;
    [SessionActionTypes.SESSION_LOGIN_EMAIL_PASSWORD]({ state, commit }: AugmentedActionContext, payload: {
        email: string;
        password: string;
        stayLoggedIn: boolean;
    }): Promise<void>;
    [SessionActionTypes.SESSION_CREATE_USER]({ state, commit }: AugmentedActionContext, payload: { 
        email: string; 
        password: string; 
        displayName: string;
    }): Promise<void>;
    [SessionActionTypes.SESSION_SAVE_SETTINGS]({ commit }: AugmentedActionContext): Promise<void>;

    [SessionActionTypes.SET_DISPLAY_NAME]({ state, commit }: AugmentedActionContext, payload: string): Promise<void>;
    
    [SessionActionTypes.PLAYLIST_CREATE]({ commit }: AugmentedActionContext, payload: { name: string }): Promise<void>;
    [SessionActionTypes.PLAYLIST_DELETE]({ commit }: AugmentedActionContext, payload: string): Promise<void>;
    // [SessionActionTypes.PLAYLIST_ADD_FILE]({ commit }: AugmentedActionContext, payload: {
    //     playlistId: string;
    //     fileId: string;
    // }): Promise<void>;
    [SessionActionTypes.PLAYLIST_ADD_SONG]({ commit }: AugmentedActionContext, payload: {
        playlistId: string;
        songId: string;
        transposition?: number;
    }): Promise<void>;
    [SessionActionTypes.PLAYLIST_REMOVE_ENTRY]({ commit }: AugmentedActionContext, payload: {
        playlistId: string;
        entryId: string;
    }): Promise<void>;

    [SessionActionTypes.LOG_SONG_ITEM]({ commit }: AugmentedActionContext, payload: ISong): Promise<void>;
    [SessionActionTypes.LOG_CONTRIBUTOR_ITEM]({ commit }: AugmentedActionContext, payload: ApiContributor): Promise<void>;
    [SessionActionTypes.ADMIN_IMPORT_FROM_LANDAX]({ commit }: AugmentedActionContext): Promise<void>;
}

export const actions: ActionTree<State, RootState> & Actions = {
    async [SessionActionTypes.SESSION_START]({state, commit}): Promise<void> {
        if (auth.isAuthenticated) {
            if (!state.initialized) {
                await init(state, commit);
            }
        }
    },
    async [SessionActionTypes.SESSION_CLEAR]({ commit }): Promise<void> {
        await auth.logout();
        commit(SessionMutationTypes.CLEAR_SESSION, undefined);
    },
    async [SessionActionTypes.SESSION_LOGIN_SOCIAL]({ state, commit }, provider): Promise<void> {
        await auth.login(provider);

        if (auth.isAuthenticated) {
            await init(state, commit);
        } else {
            await auth.sendLinkToEmail();
        }
    },
    async [SessionActionTypes.SESSION_LOGIN_EMAIL_PASSWORD]({ state, commit }, obj): Promise<void> {
        await auth.loginWithEmailAndPassword(obj.email, obj.password, obj.stayLoggedIn);

        if (auth.isAuthenticated) {
            await init(state, commit);
        } else {
            await auth.sendLinkToEmail();
        }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async [SessionActionTypes.SESSION_CREATE_USER]({ state, commit }, object ): Promise<void> {
        await auth.createEmailAndPasswordUser(object.email, object.password, object.displayName);

        // if (auth.isAuthenticated) {
        //     await init(state, commit);
        // }
    },
    async [SessionActionTypes.SESSION_SAVE_SETTINGS]({ state, commit }): Promise<void> {
        if (state.currentUser?.settings) {
            appSession.user = new User(await api.session.saveUser(state.currentUser.settings));
            commit(SessionMutationTypes.SET_USER, appSession.user);
            await ensureLanguageIsFetched();
        }
    },

    async [SessionActionTypes.SET_DISPLAY_NAME]({ state, commit }, name: string): Promise<void> {
        await auth.setDisplayName(name);
        
        commit(SessionMutationTypes.SET_USER, Object.assign({
            displayName: name,
        }, state.currentUser));
    },

    // PLAYLIST RELATED ACTIONS
    async [SessionActionTypes.PLAYLIST_CREATE]({ commit }, obj: { name: string }): Promise<void> {
        const res = await api.playlists.createPlaylist(obj.name);

        commit(SessionMutationTypes.SET_PLAYLIST, res);
    },
    async [SessionActionTypes.PLAYLIST_DELETE]({ commit }, id): Promise<void> {
        await api.playlists.deletePlaylist(id);
        commit(SessionMutationTypes.DELETE_PLAYLIST, id);
    },
    async [SessionActionTypes.PLAYLIST_ADD_SONG]({ state, commit }, obj): Promise<void> {
        const playlist = Object.assign({}, state.playlists.find(p => p.id == obj.playlistId));

        const res = await api.playlists.addToPlaylist(obj.playlistId, obj.songId, obj.transposition);

        if (res) {
            playlist.entries = [...playlist.entries, ...res];
            commit(SessionMutationTypes.UPDATE_PLAYLIST, playlist);
        }
    },
    async [SessionActionTypes.PLAYLIST_REMOVE_ENTRY]({ commit }, obj): Promise<void> {
        const res = await api.playlists.removeEntryFromPlaylist(obj.playlistId, obj.entryId);

        if (res) {
            commit(SessionMutationTypes.UPDATE_PLAYLIST, res);
        }
    },

    // LOG ITEMS
    async [SessionActionTypes.LOG_SONG_ITEM]({ commit, state }, item: ISong): Promise<void> {
        const items = state.activities ?? JSON.parse(localStorage.getItem("activities") ?? "[]") as IActivity[];

        if (items?.find(a => a.itemId == item.id && new Date(a.loggedDate).getTime() > (new Date().getTime() - 60000))) {
            return;
        }

        const i: IActivity = {
            loggedDate: new Date().toISOString(),
            type: "song",
            itemId: item.id,
        };

        items.push(i);

        if (items.length >= 10) {
            await api.activity.pushActivities(items);
            localStorage.setItem("activities", "[]");
        } else {
            try {
                localStorage.setItem("activities", JSON.stringify(items));
            }
            catch {
                // Err
            }
        }

        commit(SessionMutationTypes.SET_LOG_ITEMS, [i]);
    },
    async [SessionActionTypes.LOG_CONTRIBUTOR_ITEM]({ commit, state }, item: ApiContributor): Promise<void> {
        const items = JSON.parse(localStorage.getItem("activities") ?? "[]") as IActivity[];

        if (state.activities?.find(a => a.itemId == item.id && new Date(a.loggedDate).getTime() > (new Date().getTime() - 60000))) {
            return;
        }

        const i: IActivity = {
            loggedDate: new Date().toISOString(),
            type: "contributor",
            itemId: item.id,
        };

        items.push(i);

        if (items.length >= 10) {
            await api.activity.pushActivities(items);
            localStorage.setItem("activities", "[]");
        } else {
            localStorage.setItem("activities", JSON.stringify(items));
        }

        commit(SessionMutationTypes.SET_LOG_ITEMS, [i]);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async [SessionActionTypes.ADMIN_IMPORT_FROM_LANDAX](_) {
        const result = await api.admin.importFromLandax();

        if (result) {
            notify("success", "Imported from Landax", "refresh", result);
        }
    },
};
