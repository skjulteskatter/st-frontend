import { SongService } from '@/services/songService';
import { Song, Lyrics } from '@/classes';
import { createStore, Store } from 'vuex';
import { InjectionKey } from 'vue';
import api from '@/services/api';

export interface Songs {
    lyrics?: Lyrics;
    collection: Collection;
    songService: SongService;
    song?: Song;
    verses: Verse[];
    allLyrics: Lyrics[];
}

export const songKey: InjectionKey<Store<Songs>> = Symbol();

export const songStore = createStore<Songs>({
    state: {
        lyrics: undefined,
        collection: {} as Collection,
        songService: {} as SongService,
        song: undefined,
        verses: [],
        allLyrics: [],
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
            const lyrics = new Lyrics(await api.songs.getLyrics(state.collection.key, song.number, languageCode, "json", 0));
            commit('setLyrics', lyrics);
        },
        async getAllLyrics({ state, commit }, languageCode: string) {
            const result = await api.songs.getAllLyrics(state.collection?.key ?? "HV", languageCode, "json", 0);
            const lyrics = result.map(l => new Lyrics(l));
            commit('setAllLyrics', lyrics);
        }
    },
    mutations: {
        songService(state, songService: SongService) {
            state.songService = songService;
        },
        selectCollection(state, collection: Collection) {
            state.collection = collection;
            state.allLyrics = [];
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
        },
        setAllLyrics(state, lyrics: Lyrics[]) {
            state.allLyrics = lyrics ?? [];
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