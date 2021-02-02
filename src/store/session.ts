/* eslint-disable no-console */
import api from '@/services/api'
import { InjectionKey } from 'vue'
import { Commit, createStore, Store } from 'vuex'
import auth from '@/services/auth'
import router from '@/router';
import { ensureLanguageIsFetched } from '@/i18n';
import { Collection } from '@/classes';

async function init(commit: Commit) {
    const user = await api.session.getCurrentUser();
    commit('user', user);
    try {
        const languages = await api.items.getLanguages();
        commit('languages', languages);
        const collections = (await api.songs.getCollections()).map(c => new Collection(c));
        commit('collections', collections);
    } catch (e) {
        console.log(e);
    }
    if (router.currentRoute.value.name == "login") {
        router.replace({name: 'main'});
    }
    commit('initialized', true);
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
        async startSession({commit}) {
            if (auth.isAuthenticated) {
                await init(commit);
            }
        },
        async socialLogin({commit}, provider: string) {
            await auth.login(provider);

            if (auth.isAuthenticated) {
                await init(commit);
            }
        },
        async createUser({commit}, object: { 
            email: string; 
            password: string; 
            displayName: string;
        }) {
            await auth.createEmailAndPasswordUser(object.email, object.password);

            if (auth.isAuthenticated) {
                await init(commit);
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
        }
    },
    mutations: {
        user(state, user: User) {
            state.currentUser = user;
            if (user.settings) localStorage.setItem('languageKey', user.settings.languageKey);
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
        }
    },
    getters: {
        isAdmin(state): boolean {
            return state.currentUser?.roles?.find(r => r.name == "administrator")?.id !== undefined;
        },
        languageKey(state): string {
            return state.currentUser?.settings?.languageKey ?? localStorage.getItem('languageKey') ?? 'en';
        },
        collections(state): Collection[] {
            if (state.currentUser) {
                const subscriptions = state.currentUser.subscriptions;
                return state.collections.filter(c => subscriptions
                    .map(s => s.collectionIds)
                    .some(i => i.includes(c.id)))
                    .map(c => new Collection(c));
            } else {
                return [];
            }
        },
        extended(state): boolean {
            return state.currentUser?.roles.find(r => ["extended", "administrator"].includes(r.name)) !== undefined;
        },
        isAuthenticated(): boolean {
            return auth.isAuthenticated;
        }
    }
})