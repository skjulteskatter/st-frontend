import { Song, Lyrics, Collection } from '@/classes';
import { createStore, Store } from 'vuex';
import { InjectionKey } from 'vue';
import { sessionStore } from './session';

export interface Songs {
    collectionId?: string;
    song?: Song;
    lyrics?: Lyrics;
    transposition?: number;
    verses: Verse[];
    lines: string[];
    collections: Collection[];
    initialized: boolean;
}

export const songKey: InjectionKey<Store<Songs>> = Symbol();

export const songStore = createStore<Songs>({
    state: {
        collections: [],
        lyrics: undefined,
        song: undefined,
        verses: [],
        transposition: undefined,
        lines: [],
        initialized: false,
    },
    actions: {
        async selectCollection({state, commit, getters}, id: string) {
            if (!state.initialized) {
                commit('collections', sessionStore.getters.collections);
            }

            commit('collection', id );
            const collection = getters.collection as Collection;

            if (collection) {
                await collection.load(sessionStore.getters.languageKey);
            }
        },
        async selectSong({getters, commit}, number: number) {
            const collection = getters.collection as Collection | undefined;
            if (!collection) {
                return;
            }
            const song = collection.getSong(number);
            if (song) {
                commit('song', song);
            }
            const lyrics = collection.getLyrics(number);
            if (lyrics) {
                commit('lyrics', lyrics);
            }
        },
        async transpose({state, commit, getters}, transpose: number) {
            const collection = getters.collection as Collection | undefined;
            if (!collection || !state.song) {
                return;
            }

            const lyrics = await collection.transposeLyrics(state.song.number, transpose);

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
        song(state, song: Song) {
            state.song = song;
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
        }
    },
    getters: {
        songs(state, getters) {
            return getters.collection?.songs ?? [];
        },
        collection(state) {
            return state.collections.find(c => c.id == state.collectionId || c.key == state.collectionId);
        }
    },
});