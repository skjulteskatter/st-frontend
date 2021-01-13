import { SongService } from '@/services/songService';
import { Song, Lyrics } from '@/classes';
import { createStore, Store } from 'vuex';
import { InjectionKey } from 'vue';
import api from '@/services/api';

export interface Songs {
    lyrics?: Lyrics;
    collection?: Collection;
    songService: SongService;
    song?: Song;
    verses: Verse[];
}

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
        async initSongService({ commit }, collections: Collection[]) {
            const songService = new SongService();
            await songService.init(collections);
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