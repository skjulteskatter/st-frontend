import api, { admin } from '@/services/api'
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import auth from '@/services/auth'
import router from '@/router';

export interface Session {
    currentUser: User;
    isAuthenticated: boolean;
}

type SocialLogin = {
    provider: string;
    stayLoggedIn: boolean;
};

export const key: InjectionKey<Store<Session>> = Symbol()

export const store = createStore<Session>({
    state: {
        currentUser: {} as User,
        isAuthenticated: false,
    },
    actions: {
        async socialLogin(state, obj: SocialLogin) {
            await auth.login(obj.provider, obj.stayLoggedIn);
            if (auth.isAuthenticated) {
                const user = await api.session.getCurrentUser();
                this.commit('currentUser', user);
                if (router.currentRoute.value.name == "login") {
                    if (state.getters.isAdmin) {
                        router.replace("/users");   
                    } else {
                        router.replace("/about")
                    }
                }
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
            return state.currentUser?.roles?.find(r => r.name == "administrator")?.id !== undefined;
        }
    }
})