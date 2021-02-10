import { Lyrics, Collection, Song, Contributor } from '@/classes';
import { createStore, Store } from 'vuex';
import { InjectionKey } from 'vue';
import { sessionStore } from './session';
import api from '@/services/api';

export type SongFilter = {
    themes: string[];
    origins: string[];
    videoFiles: string[];
    audioFiles: string[];
}

export interface Songs {
    collectionId?: string;
    song?: Song;
    songNumber?: number;
    lyrics?: Lyrics;
    transposedLyrics?: Lyrics;
    transposition?: number;
    verses: Verse[];
    lines: string[];
    collections: Collection[];
    initialized: boolean;
    list: string;
    contributor?: Contributor;
    filter: SongFilter;
}
export const songKey: InjectionKey<Store<Songs>> = Symbol();

export const songStore = createStore<Songs>({
    state: {
        collections: [],
        verses: [],
        lines: [],
        initialized: false,
        list: 'default',
        filter: {
            themes: [],
            videoFiles: [],
            audioFiles: [],
            origins: [],
        }
    },
    actions: {
        async selectCollection({dispatch, state, commit, getters}, id: string) {
            if (!state.initialized) {
                commit('collections', sessionStore.getters.collections);
            }

            commit('collection', id );
            const list = state.list;
            commit('list', 'default');
            const collection = getters.collection as Collection;

            if (collection) {
                collection.load(sessionStore.getters.languageKey).then(() => {
                    dispatch('setList', list);
                });
            }
        },
        async selectSong({getters, commit}, number: number) {
            const collection = getters.collection as Collection | undefined;
            if (!collection) {
                return;
            }
            commit('song', number);
            let lyrics = collection?.lyrics.find(l => l.number == number);

            if (!lyrics) {
                const song = collection?.songs.find(s => s.number == number);
                if (song) {
                    const language = Object.keys(song.name)[0];

                    lyrics = await collection.getLyrics(number, language);
                }
            }

            commit('lyrics', lyrics);
        },
        async selectContributor({getters, commit}, contributorId: string) {
            const collection = getters.collection as Collection | undefined;
            if (!collection) {
                return;
            }
            const contributor = await api.songs.getContributor(collection.key, contributorId);
            if (contributor) {
                commit('contributor', new Contributor(contributor.contributor));
            }
        },
        async transpose({commit, getters}, transpose: number) {
            const collection = getters.collection as Collection | undefined;
            if (!collection || !getters.song) {
                return;
            }

            const lyrics = await collection.transposeLyrics(getters.song.number, transpose);

            commit('transposedLyrics', lyrics);
            commit('transposition', transpose);
        },
        async setList({commit, getters}, value: string) {
            const r = await (getters.collection as Collection).getList(value);
            if (r == 0) {
                commit('list', 'default');
            } else {
                commit('list', value);
            }
        }
    },
    mutations: {
        collections(state, collections: Collection[]) {
            state.collections = collections;
            state.initialized = true;
        },
        collection(state, collectionId: string) {
            state.collectionId = collectionId;
            state.lyrics = undefined;
            state.songNumber = undefined;
            state.transposedLyrics = undefined;
            state.transposition = undefined;
            state.song = undefined;
            state.contributor = undefined;
        },
        contributor(state, contributor: Contributor) {
            state.contributor = contributor;
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
        transposedLyrics(state, lyrics: Lyrics) {
            state.transposedLyrics = lyrics;
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
        },
        filter(state, filter: SongFilter) {
            state.filter = filter;
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
            return (getters.collection as Collection | undefined)?.songs.find(s => s.number == state.songNumber);
        },
        lyrics(state, getters) {
            return (getters.collection as Collection | undefined)?.lyrics.find(l => l.number == state.songNumber) ?? state.lyrics;
        },
    },
});