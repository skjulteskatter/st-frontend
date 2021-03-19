/* eslint-disable no-console */
import api from '@/services/api'
import { InjectionKey } from 'vue'
import { Commit, createStore, Store } from 'vuex'
import auth from '@/services/auth'
import router from '@/router';
import { ensureLanguageIsFetched } from '@/i18n';
import { Collection } from '@/classes';
import { songStore } from './songs';

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
}

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
}

let redirectAfterLogin = "/";

async function init(commit: Commit) {
    const user = await api.session.getCurrentUser();
    user.displayName = auth.user?.displayName ?? user.displayName;

    commit('user', user);
    try {
        const languages = await api.items.getLanguages();
        commit('languages', languages);
        const collections = await api.songs.getCollections();
        commit('collections', collections);
    } catch (e) {
        console.log(e);
    }
    if (router.currentRoute.value.name == "login") {
        router.push(redirectAfterLogin);
    }
    commit('initialized', true);
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
}

export const sessionKey: InjectionKey<Store<Session>> = Symbol()

export const sessionStore = createStore<Session>({
    state: {
        languages: [],
        initialized: false,
        collections: [],
        extend: false,
        error: '',
    },
    actions: {
        async startSession({state, commit}) {
            if (auth.isAuthenticated) {
                if (!state.initialized) {
                    await init(commit);
                }
            } else {
                await auth.sendLinkToEmail();
            }
        },
        async socialLogin({commit}, provider: string) {
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
        }) {
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
        }) {
            await auth.loginWithEmailAndPassword(obj.email, obj.password, obj.stayLoggedIn);

            if (auth.isAuthenticated) {
                await init(commit);
            } else {
                await auth.sendLinkToEmail();
            }
        },
        async saveSettings({ state, commit }) {
            if (state.currentUser?.settings) {
                const user = await api.session.saveUser(state.currentUser.settings)
                commit('user', user);
                await ensureLanguageIsFetched();
            }
        },
        async logout({ commit }) {
            await auth.logout();
            commit('logout');
        },
        async setDisplayName({ state, commit }, name: string) {
            await auth.setDisplayName(name);
            
            commit('user', Object.assign({
                displayName: name,
            }, state.currentUser))
        }
    },
    mutations: {
        user(state, user: User) {
            state.currentUser = user;
            if (user.settings?.languageKey) localStorage.setItem('languageKey', user.settings.languageKey);
        },
        logout(state) {
            state.currentUser = undefined;
        },
        settings(state, settings: UserSettings) {
            if (state.currentUser) {
                state.currentUser.settings = settings;
            }
        },
        languages(state, languages: Language[]) {
            state.languages = languages;
        },
        initialized(state, initialized: boolean) {
            state.initialized = initialized;
        },
        collections(state, collections: Collection[]) {
            state.collections = collections;
        },
        collection(state, collection: Collection) {
            const c = state.collections.find(c => c.id == collection.id);

            if (c) {
                state.collections[state.collections.indexOf(c)] = collection;
            } else {
                state.collections.push(collection);
            }
        },
        extend(state, value?: boolean) {
            state.extend = value != undefined ? value : !state.extend;
        },
        error(state, value: string) {
            state.error = value;
        },
        redirect(state, value: string) {
            redirectAfterLogin = value;
        }
    },
    getters: {
        isAdmin(state): boolean {
            return state.currentUser?.roles?.includes("administrator") == true;
        },
        languageKey(state): string {
            return state.currentUser?.settings?.languageKey ?? localStorage.getItem('languageKey') ?? 'en';
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
        }
    }
})