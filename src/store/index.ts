import api from '@/services/api'
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

export interface Session {
    currentUser: User;
}

export const key: InjectionKey<Store<Session>> = Symbol()

export const store = createStore<Session>({
    state: {
        currentUser: {} as User,
    },
    actions: {
        async startSession() {
            await api.session.startSession();
            if (api.session.isAuthenticated) {
                const user = await api.session.getCurrentUser();
                this.commit('currentUser', user);
            }
        },
        async login() {
            await api.session.login();
            if (api.session.isAuthenticated) {
                const user = await api.session.getCurrentUser();
                this.commit('currentUser', user);
            }
        }
    },
    mutations: {
        currentUser(state, user: User) {
            state.currentUser = user;
        }
    },
    getters: {
        currentUser(state) {
            return state.currentUser;
        }
    }
})