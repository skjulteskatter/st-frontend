import api from '@/services/api'
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import auth from '@/services/auth'

export interface Session {
    currentUser: User;
    isAuthenticated: boolean;
}

export const key: InjectionKey<Store<Session>> = Symbol()

export const store = createStore<Session>({
    state: {
        currentUser: {} as User,
        isAuthenticated: false,
    },
    actions: {
        async socialLogin() {
            await auth.login();
            if (auth.isAuthenticated) {
                console.log("what")
                const user = await api.session.getCurrentUser();
                console.log(user);
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
        },
        isAdmin(state) {
            return state.currentUser?.roles?.find(r => r.name == "administrator") !== null;
        }
    }
})