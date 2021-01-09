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
    roles: string[];
}

export interface Songs {
    lyrics?: Lyrics;
    collection?: Collection;
    songService: SongService;
    song?: Song;
    verses: Verse[];
}

type SocialLogin = {
    provider: string;
    stayLoggedIn: boolean;
};

export const usersKey: InjectionKey<Store<Users>> = Symbol();

export const usersStore = createStore<Users>({
    state: {
        users: [],
        roles: []
    },
    actions: {
        async getUsers() {
            const result = await api.admin.getAllUsers();
            this.commit('users', result ?? []);
        },
        async getRoles() {
            const result = await api.admin.getRoles();
            this.commit('roles', result ?? []);
        }
    },
    mutations: {
        users(state, users: User[]) {
            state.users = users;
        },
        roles(state, roles: string[]) {
            state.roles = roles;
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
        verses: [],
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
        },
        verses(state, verses: Verse[]) {
            state.verses = verses;
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
        },
        verses(state) {
            return state.verses;
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
        async saveUser({ state }) {
            await api.session.saveUser(state.currentUser.settings);
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