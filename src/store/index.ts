import api from '@/services/api'
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import auth from '@/services/auth'
import router from '@/router';
import { SongService } from '@/services/songService';
import { Song, Lyrics } from '@/classes';

export interface Session {
    currentUser: User;
    isAuthenticated: boolean;
}

export interface Users {
    users: User[];
}

export interface Songs {
    lyrics?: Lyrics;
    collection?: Collection;
    songService: SongService;
    song?: Song;
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

export const songKey: InjectionKey<Store<Songs>> = Symbol();

export const songStore = createStore<Songs>({
    state: {
        lyrics: undefined,
        collection: undefined,
        songService: {} as SongService,
        song: undefined,
    },
    actions: {
        async initSongService({ commit }) {
            const songService = new SongService();
            await songService.init();
            commit('songService', songService);
        },
        async getLyrics({ state, commit }, languageCode: string) {
            const song = state.song;
            if (song == undefined) return;
            commit('setLyrics', undefined);
            const lyrics = new Lyrics(await api.songs.getLyrics(song.collection.key, song.number, languageCode, "json", 0));
            commit('setLyrics', lyrics);
        }
    },
    mutations: {
        songService(state, songService: SongService) {
            state.songService = songService;
        },
        selectCollection(state, collection: Collection) {
            state.collection = collection;
            state.song = undefined;
        },
        selectSong(state, song: Song) {
            state.song = song;
        },
        setLyrics(state, lyrics: Lyrics) {
            state.lyrics = lyrics;
        }
    },
    getters: {
        collections(state) {
            return state.songService.collections;
        },
        collection(state) {
            return state.collection;
        },
        songs(state) {
            if (state.collection) {
                return state.songService.songs.filter(s => s.collection.id == state.collection?.id);
            }
        },
        song(state) {
            return state.song;
        },
        lyrics(state) {
            return state.lyrics;
        }
    },
});

export const sessionKey: InjectionKey<Store<Session>> = Symbol()

export const sessionStore = createStore<Session>({
    state: {
        currentUser: {} as User,
        isAuthenticated: false,
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