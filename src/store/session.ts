/* eslint-disable no-console */
import api from '@/services/api'
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import auth from '@/services/auth'
import router from '@/router';

export interface Session {
    currentUser: User;
    isAuthenticated: boolean;
    languages: Language[];
    initialized: boolean;
}

export const sessionKey: InjectionKey<Store<Session>> = Symbol()

export const sessionStore = createStore<Session>({
    state: {
        currentUser: {} as User,
        isAuthenticated: false,
        languages: [],
        initialized: false,
    },
    actions: {
        async socialLogin(state, provider: string) {
            await auth.login(provider);
            if (auth.isAuthenticated) {
                const user = await api.session.getCurrentUser();
                state.commit('currentUser', user);
                try {
                    const languages = await api.items.getLanguages();
                    state.commit('languages', languages);
                } catch (e) {
                    console.log(e);
                }
                if (router.currentRoute.value.name == "login") {
                    if (state.getters.isAdmin) {
                        router.replace("/users");
                    } else {
                        router.replace("/about")
                    }
                }
                state.commit('initialized', true);
            }
        },
        async initialize(state) {
            await auth.init();
            if (auth.isAuthenticated) {
                const user = await api.session.getCurrentUser();
                state.commit('currentUser', user);
                try {
                    const languages = await api.items.getLanguages();
                    state.commit('languages', languages);
                } catch (e) {
                    console.log(e);
                }
                if (router.currentRoute.value.name == "login") {
                    if (state.getters.isAdmin) {
                        router.replace("/users");
                    } else {
                        router.replace("/dashboard")
                    }
                }
                state.commit('initialized', true);
            }
        },
        async loginWithEmailPassword({ getters, commit }, obj: {
            email: string;
            password: string;
            stayLoggedIn: boolean;
        }) {
            await auth.loginEmail(obj.email, obj.password, obj.stayLoggedIn);
            if (auth.isAuthenticated) {
                const user = await api.session.getCurrentUser();
                commit('currentUser', user);
                if (router.currentRoute.value.name == "login") {
                    if (getters.isAdmin) {
                        router.replace("/users");
                    } else {
                        router.replace("/dashboard")
                    }
                }
            }
        },
        async saveSettings({ state, commit }) {
            if (state.currentUser.settings) {
                const user = await api.session.saveUser(state.currentUser.settings)
                commit('currentUser', user);
            }
        }
    },
    mutations: {
        currentUser(state, user: User) {
            state.currentUser = user;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.currentUser = {} as User;
        },
        settings(state, settings: UserSettings) {
            state.currentUser.settings = settings;
        },
        languages(state, languages: Language[]) {
            state.languages = languages;
        },
        initialized(state, initialized: boolean) {
            state.initialized = initialized;
        }
    },
    getters: {
        currentUser(state) {
            return state.currentUser;
        },
        isAdmin(state) {
            return state.currentUser?.roles?.find(r => r.name == "administrator")?.id !== undefined;
        },
        languageKey(state) {
            return state.currentUser.settings?.languageKey ?? "no"
        },
        languages(state) {
            return state.languages;
        },
        initialized(state) {
            return state.initialized;
        },
        collections(state) {
            const collections = [];

            for (const sub of state.currentUser?.subscriptions) {
                for (const col of sub.collections) {
                    if (["HV", "MB"].includes(col.key)) {
                        collections.push(col);
                    }
                }
            }
            return collections;
        }
    }
})