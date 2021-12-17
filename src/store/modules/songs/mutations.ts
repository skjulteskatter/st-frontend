import { Collection, CollectionItem, Song } from "@/classes";
import SearchResult from "@/classes/search/searchResult";
import SongFilter from "@/classes/songFilter";
import { ApiContributor } from "songtreasures-api";
import { MutationTree } from "vuex";
import { State } from ".";
import { SongsMutationTypes } from "./mutation-types";
import { AudioTrack, SongViewType } from "./state";

export type Mutations<S = State> = {
    [SongsMutationTypes.COLLECTION](state: S, payload: string): void;
    [SongsMutationTypes.COLLECTIONS](state: S, payload: Collection[]): void;
    [SongsMutationTypes.LANGUAGE](state: S, payload: string): void;
    [SongsMutationTypes.CONTRIBUTOR](state: S, payload: CollectionItem<ApiContributor> | undefined): void;

    [SongsMutationTypes.SET_LIST](state: S, payload: string): void;
    [SongsMutationTypes.SET_SONG_ID](state: S, payload: string | undefined): void;

    [SongsMutationTypes.VIEW](state: S, payload: SongViewType): void;

    // [SongsMutationTypes.SET_LYRICS](state: S, payload: Lyrics): void;
    // [SongsMutationTypes.SET_LYRICS_TRANSPOSED](state: S, payload: Lyrics): void;

    [SongsMutationTypes.SET_TRANSPOSITION](state: S, payload: number): void;
    [SongsMutationTypes.SET_NEW_MELODY](state: S, payload: boolean): void;
    [SongsMutationTypes.SET_LINES](state: S, payload: string[]): void;
    [SongsMutationTypes.SET_SONG](state: S, payload: Song): void;
    [SongsMutationTypes.SET_FILTER](state: S, payload: SongFilter): void;
    [SongsMutationTypes.SET_AUDIO](state: S, payload: AudioTrack): void;

    [SongsMutationTypes.SET_SHEETMUSIC_OPTIONS](state: S, payload: SheetMusicOptions): void;
    // [SongsMutationTypes.SET_SHEETMUSIC_TRANSPOSITION](state: S, payload: number): void;

    [SongsMutationTypes.SEARCH](state: S, payload?: string): void;
    [SongsMutationTypes.SEARCH_RESULT](state: S, payload: SearchResult): void;
}

export const mutations: MutationTree<State> & Mutations = {
    [SongsMutationTypes.COLLECTIONS](state, collections) {
        state.collections = collections;
        state.initialized = true;
    },
    [SongsMutationTypes.COLLECTION](state, collectionId) {
        state.collectionId = collectionId;
    },
    [SongsMutationTypes.LANGUAGE](state, language) {
        state.language = language;
    },
    [SongsMutationTypes.SET_NEW_MELODY](state, payload) {
        state.newMelody = payload;
    },
    [SongsMutationTypes.CONTRIBUTOR](state, contributor): void {
        state.contributorItem = contributor;
    },

    [SongsMutationTypes.SET_LIST](state, list: string): void {
        state.list = list;
    },
    [SongsMutationTypes.SET_SONG_ID](state, id: string): void {
        state.songId = id;
        // state.lyrics = undefined;
    },
    [SongsMutationTypes.VIEW](state, t: SongViewType) {
        state.view = t;
    },
    // [SongsMutationTypes.SET_LYRICS](state, lyrics: Lyrics): void {
    //     state.lyrics = lyrics;
    // },
    // [SongsMutationTypes.SET_LYRICS_TRANSPOSED](state, lyrics: Lyrics): void {
    //     state.transposedLyrics = lyrics;
    // },
    [SongsMutationTypes.SET_TRANSPOSITION](state, transposition: number): void {
        state.transposition = transposition;
    },
    [SongsMutationTypes.SET_LINES](state, lines: string[]): void {
        state.lines = lines;
    },
    [SongsMutationTypes.SET_SONG](state, song: Song): void {
        state.song = song;
    },
    [SongsMutationTypes.SET_FILTER](state, filter: SongFilter): void {
        state.filter = filter;
    },
    [SongsMutationTypes.SET_AUDIO](state, audio: AudioTrack): void {
        state.audio = audio;
    },

    [SongsMutationTypes.SET_SHEETMUSIC_OPTIONS](state, o: SheetMusicOptions): void {
        state.sheetMusic = o;
    },
    // [SongsMutationTypes.SET_SHEETMUSIC_TRANSPOSITION](state, transposition: number): void {
    //     state.smTransposition = transposition;
    // },

    [SongsMutationTypes.SEARCH](state, payload) {
        state.search = payload;
    },
    [SongsMutationTypes.SEARCH_RESULT](state, payload) {
        state.searchResult = payload;
    },
};
