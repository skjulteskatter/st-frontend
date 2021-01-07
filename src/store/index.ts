import api from '@/services/api'
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import auth from '@/services/auth'
import router from '@/router';
import { SongService } from '@/services/songService';

export interface Session {
    currentUser: User;
    isAuthenticated: boolean;
    songService: SongService;
}

export interface Users {
    users: User[];
}

type SocialLogin = {
    provider: string;
    stayLoggedIn: boolean;
};

export const usersKey: InjectionKey<Store<Users>> = Symbol();

export const usersStore = createStore<Users>({
    state: {
        users: [],
    },
    actions: {
        async getUsers() {
            const result = await api.admin.getAllUsers();
            if (result?.length > 0) {
                this.commit('users', result);
            }
        }
    },
    mutations: {
        users(state, users: User[]) {
            state.users = users;
        }
    }
});

export const sessionKey: InjectionKey<Store<Session>> = Symbol()

export const sessionStore = createStore<Session>({
    state: {
        currentUser: {} as User,
        isAuthenticated: false,
        songService: {} as SongService,
    },
    actions: {
        async socialLogin(state, obj: SocialLogin) {
            await auth.login(obj.provider, obj.stayLoggedIn);
            if (auth.isAuthenticated) {
                const user = await api.session.getCurrentUser();
                state.commit('currentUser', user);
                if (router.currentRoute.value.name == "login") {
                    if (state.getters.isAdmin) {
                        router.replace("/users");   
                    } else {
                        router.replace("/about")
                    }
                }
            }
        },
        async initSongService({commit}) {
            const songService = new SongService();
            await songService.init();

            commit('songService', songService);
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
        songService(state, songService: SongService) {
            state.songService = songService;
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