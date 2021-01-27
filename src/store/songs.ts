import { SongService } from '@/services/songService';
import { Song, Lyrics } from '@/classes';
import { createStore, Store } from 'vuex';
import { InjectionKey } from 'vue';
import api from '@/services/api';
import { sessionStore } from './session';

export interface Songs {
    lyrics?: Lyrics;
    transposition?: number;
    collection: Collection;
    songService: SongService;
    initialized: boolean;
    song?: Song;
    verses: Verse[];
    allLyrics: Lyrics[];
    collections: Collection[];
    lines: string[];
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
        initialized: false,
        transposition: undefined,
        collections: [],
        lines: [],
    },
    actions: {
        async initSongService({ commit }) {
            const songService = new SongService();
            await songService.init(sessionStore.getters.collections);
            commit('collections', await api.songs.getCollections());
            commit('songService', songService);
        },
        async load({ state, commit }, object: {
            collectionKey: string; 
            number: number;
            languageKey: string;
        }) {
            while(!state.initialized) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            const collection = state.songService.collections.find(c => c.key == object.collectionKey);
            if (collection) {
                commit('selectCollection', collection);
                await this.dispatch('getAllLyrics', object.languageKey);
                if (!object.number) return;
                const song = state.songService.songs.find(s => s.collection.key == collection.key && s.number == object.number);
                if (song) {
                    commit('selectSong', song);
                    const lyrics = state.allLyrics.find(l => l.number == object.number);
                    if (lyrics) {
                        commit('setLyrics', lyrics);
                    }
                }
            }
        },
        async getLyrics({ state, commit }, languageCode: string) {
            const song = state.song;
            if (song == undefined) return;
            commit('setLyrics', undefined);
            if (song.type == "lyrics") {
                const lyrics = state.allLyrics.find(l => l.number == song.number) ?? new Lyrics(await api.songs.getLyrics(state.collection.key, song.number, languageCode, "json", 0));
                commit('setLyrics', lyrics);
            }
        },
        async getAllLyrics({ state, commit }, languageCode: string) {
            if (state.allLyrics.length == 0) {
                const result = await api.songs.getAllLyrics(state.collection?.key ?? "HV", languageCode, "json", 0);
                const lyrics = result.map(l => new Lyrics(l));
                commit('setAllLyrics', lyrics);
            }
        },
        async getTransposedLyrics({ state, commit }, object: {
            languageCode: string; 
            transposition: number;
        }) {
            const song = state.song;

            if (song && (state.lyrics?.format != 'html' || state.transposition != object.transposition)) {
                const result = new Lyrics(await api.songs.getLyrics(state.collection.key, song.number, object.languageCode, 'html', object.transposition));
                commit('setLyrics', result);
                commit('transposition', object.transposition);
            }
        }
    },
    mutations: {
        songService(state, songService: SongService) {
            state.songService = songService;
            state.initialized = true;
        },
        selectCollection(state, collection: Collection) {
            if (state.collection.key !== collection.key) {
                state.collection = collection;
                state.allLyrics = [];
                state.song = undefined;
            }
        },
        selectSong(state, song: Song) {
            state.song = song;
            state.lyrics = undefined;
            state.transposition = undefined;
        },
        setLyrics(state, lyrics: Lyrics) {
            state.lyrics = lyrics;
        },
        verses(state, verses: Verse[]) {
            state.verses = verses;
        },
        setAllLyrics(state, lyrics: Lyrics[]) {
            state.allLyrics = lyrics ?? [];
        },
        transposition(state, transposition: number) {
            state.transposition = transposition;
        },
        collections(state, collections: Collection[]){
            state.collections = collections;
        },
        lines(state, lines: string[]) {
            state.lines = lines;
        }
    },
    getters: {
        collections(state) {
            return state.collections;
        },
        collection(state) {
            return state.collection;
        },
        songs(state) {
            if (state.collection) {
                return state.songService.songs?.filter(s => s.collection.id == state.collection?.id) ?? [];
            }
        },
        lyrics(state) {
            return state.lyrics;
        },
        verses(state) {
            return state.verses;
        }
    },
});