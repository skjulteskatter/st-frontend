import { Lyrics, Collection, Song, Contributor, ContributorCollectionItem } from '@/classes';
import { createStore, Store } from 'vuex';
import { InjectionKey } from 'vue';
import { sessionStore } from './session';
import api from '@/services/api';
import { MediaFile } from 'dmb-api';

export type SongFilter = {
    themes: string[];
    origins: string[];
    videoFiles: string[];
    audioFiles: string[];
    contentTypes: string[];
    sheetMusicTypes: string[];
    hasLyrics: boolean;
    hasAudioFiles: boolean;
    hasVideoFiles: boolean;
    hasSheetMusic: boolean;
}

export enum SheetMusicTypes {
    PDF = "sheetmusic-pdf",
    XML = "sheetmusic"
}

export type SheetMusicOptions = {
    show: boolean;
    url?: string;
    originalKey?: string;
    transposition?: number;
    zoom?: number;
    type?: string;
}

export type AudioTrack = {
    file: MediaFile;
    song?: Song;
    collection?: Collection;
}

export interface Songs {
    collectionId?: string;
    language: string;
    transcode: string;
    song?: Song;
    songNumber?: number;
    lyrics?: Lyrics;
    transposedLyrics?: Lyrics;
    transposition?: number;
    smTransposition?: number;
    verses: Verse[];
    lines: string[];
    collections: Collection[];
    initialized: boolean;
    list: string;
    contributorItem?: ContributorCollectionItem;
    filter: SongFilter;
    audio?: AudioTrack;
    view: string;
    sheetMusic: SheetMusicOptions;
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
            contentTypes: [],
            sheetMusicTypes: [],
            hasAudioFiles: false,
            hasLyrics: false,
            hasSheetMusic: false,
            hasVideoFiles: false,
        },
        language: 'en',
        view: 'default',
        transcode: 'common',
        sheetMusic: {
            show: false,
        }
    },
    actions: {
        async selectCollection({ dispatch, state, commit, getters }, id: string) {
            if (!state.initialized) {
                commit('collections', sessionStore.getters.collections);
            }

            commit('language', sessionStore.getters.languageKey);
            commit('transcode', sessionStore.state.currentUser?.settings?.defaultTranscode ?? 'common');
            commit('collection', id);
            const list = state.list;
            commit('list', 'default');
            const collection = getters.collection as Collection;

            if (collection) {
                collection.load(state.language).then(() => {
                    dispatch('setList', list);
                });
            }
        },
        async selectSong({ getters, commit }, number: number) {
            const collection = getters.collection as Collection | undefined;
            if (!collection) {
                return;
            }
            commit('song', number);

            if (!getters.lyrics) {
                
                const song = collection?.songs.find(s => s.number == number);

                if (song && song.type == "lyrics") {
                    const language = Object.keys(song.name)[0];
                    commit('language', language);

                    await collection.getLyrics(number, language);
                }
            }
        },
        async selectContributor({ commit }, contributorId: string) {
            // const collection = getters.collection as Collection | undefined;
            // if (!collection) {
            //     return;
            // }
            const contributor = await api.songs.getContributor(contributorId);
            if (contributor) {
                commit('contributor', contributor);
            }
        },
        async transpose({ commit, getters }, transpose: number) {
            const collection = getters.collection as Collection | undefined;
            if (!collection || !getters.song) {
                return;
            }

            const lyrics = await collection.transposeLyrics(getters.song.number, transpose);

            commit('transposedLyrics', lyrics);
            commit('transposition', transpose);
        },
        async setList({ commit, getters }, value: string) {
            const r = await (getters.collection as Collection).getList(value);
            if (r == 0) {
                commit('list', 'default');
            } else {
                commit('list', value);
            }
        },
    },
    mutations: {
        language(state, language: string) {
            state.language = language;
        },
        transcode(state, transcode: string) {
            state.transcode = transcode;
        },
        collections(state, collections: Collection[]) {
            state.collections = collections;
            state.initialized = true;
        },
        collection(state, collectionId: string) {
            state.collectionId = collectionId;
            state.lyrics = undefined;
            state.songNumber = undefined;
            state.transposedLyrics = undefined;
            state.song = undefined;
            state.contributorItem = undefined;
        },
        contributor(state, contributor: { songIds: string[]; item: Contributor; songs: Song[] }) {
            state.contributorItem = contributor;
        },
        list(state, list: string) {
            state.list = list;
        },
        song(state, songNumber: number) {
            state.songNumber = songNumber;
            state.lyrics = undefined;
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
        smTransposition(state, transposition: number) {
            state.smTransposition = transposition;
        },
        lines(state, lines: string[]) {
            state.lines = lines;
        },
        setSong(state, song: Song) {
            state.song = song;
        },
        filter(state, filter: SongFilter) {
            state.filter = filter;
        },
        audio(state, audio: AudioTrack) {
            state.audio = audio;
        },
        view(state, view: string) {
            state.view = view;
        },
        sheetMusic(state, o: SheetMusicOptions) {
            state.sheetMusic = o;
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
            return (getters.collection as Collection | undefined)?.lyrics.find(l => l.number == state.songNumber && l.language.key == state.language);
        },
    },
});