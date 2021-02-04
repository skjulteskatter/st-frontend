import { Lyrics, Collection, Song } from '@/classes';
import { createStore, Store } from 'vuex';
import { InjectionKey } from 'vue';
import { sessionStore } from './session';

export interface Songs {
    collectionId?: string;
    song?: Song;
    songNumber?: number;
    lyrics?: Lyrics;
    transposition?: number;
    verses: Verse[];
    lines: string[];
    collections: Collection[];
    initialized: boolean;
    list: string;
}

export const songKey: InjectionKey<Store<Songs>> = Symbol();

export const songStore = createStore<Songs>({
    state: {
        collections: [],
        verses: [],
        lines: [],
        initialized: false,
        list: 'default',
    },
    actions: {
        async selectCollection({state, commit, getters}, id: string) {
            if (!state.initialized) {
                commit('collections', sessionStore.getters.collections);
            }

            commit('collection', id );
            const collection = getters.collection as Collection;

            if (collection) {
                collection.load(sessionStore.getters.languageKey);
            }
        },
        async selectSong({getters, commit}, number: number) {
            const collection = getters.collection as Collection | undefined;
            if (!collection) {
                return;
            }
            commit('song', number);
        },
        async transpose({commit, getters}, transpose: number) {
            const collection = getters.collection as Collection | undefined;
            if (!collection || !getters.song) {
                return;
            }

            const lyrics = await collection.transposeLyrics(getters.song.number, transpose);

            commit('lyrics', lyrics);
            commit('transposition', transpose);
        }
    },
    mutations: {
        collections(state, collections: Collection[]) {
            state.collections = collections;
            state.initialized = true;
        },
        collection(state, collectionId: string) {
            state.collectionId = collectionId;
        },
        list(state, list: string) {
            state.list = list;
        },
        song(state, songNumber: number) {
            state.songNumber = songNumber;
            state.lyrics = undefined;
            state.transposition = undefined;
        },
        lyrics(state, lyrics: Lyrics) {
            state.lyrics = lyrics;
        },
        verses(state, verses: Verse[]) {
            state.verses = verses;
        },
        transposition(state, transposition: number) {
            state.transposition = transposition;
        },
        lines(state, lines: string[]) {
            state.lines = lines;
        },
        setSong(state, song: Song) {
            state.song = song;
        }
    },
    getters: {
        songs(state, getters) {
            return getters.collection?.songs ?? [];
        },
        collection(state) {
            return state.collections.find(c => c.id == state.collectionId || c.key == state.collectionId);
        },
        song(state, getters) {
            return (getters.collection as Collection)?.songs.find(s => s.number == state.songNumber);
        },
        lyrics(state, getters) {
            return (getters.collection as Collection)?.lyrics.find(l => l.number == state.songNumber);
        }
    },
});