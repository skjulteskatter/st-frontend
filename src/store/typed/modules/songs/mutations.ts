import { Collection, ContributorCollectionItem, Lyrics, Song } from "@/classes";
import { MutationTree } from "vuex";
import { State } from ".";
import { SongsMutationTypes } from "./mutation-types";

export type Mutations<S = State> = {
    [SongsMutationTypes.COLLECTION](state: S, payload: string): void;
    [SongsMutationTypes.COLLECTIONS](state: S, payload: Collection[]): void;
    [SongsMutationTypes.LANGUAGE](state: S, payload: string): void;
    [SongsMutationTypes.TRANSCODE](state: S, payload: string): void;
    [SongsMutationTypes.CONTRIBUTOR](state: S, payload: ContributorCollectionItem | undefined): void;

    [SongsMutationTypes.SET_LIST](state: S, payload: string): void;
    [SongsMutationTypes.SET_SONG_NUMBER](state: S, payload: number | undefined): void;

    [SongsMutationTypes.SET_LYRICS](state: S, payload: Lyrics): void;
    [SongsMutationTypes.SET_LYRICS_TRANSPOSED](state: S, payload: Lyrics): void;

    [SongsMutationTypes.SET_VERSES](state: S, payload: Verse[]): void;
    [SongsMutationTypes.SET_TRANSPOSITION](state: S, payload: number): void;
    [SongsMutationTypes.SET_LINES](state: S, payload: string[]): void;
    [SongsMutationTypes.SET_SONG](state: S, payload: Song): void;
    [SongsMutationTypes.SET_FILTER](state: S, payload: SongFilter): void;
    [SongsMutationTypes.SET_AUDIO](state: S, payload: AudioTrack): void;
    [SongsMutationTypes.SET_VIEW](state: S, payload: string): void;

    [SongsMutationTypes.SET_SHEETMUSIC_OPTIONS](state: S, payload: SheetMusicOptions): void;
    [SongsMutationTypes.SET_SHEETMUSIC_TRANSPOSITION](state: S, payload: number): void;
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
    [SongsMutationTypes.TRANSCODE](state, transcode) {
        state.transcode = transcode;
    },
    [SongsMutationTypes.CONTRIBUTOR](state, contributor): void {
        state.contributorItem = contributor;
    },

    [SongsMutationTypes.SET_LIST](state, list: string): void {
        state.list = list;
    },
    [SongsMutationTypes.SET_SONG_NUMBER](state, songNumber: number): void {
        state.songNumber = songNumber;
        state.lyrics = undefined;
    },

    [SongsMutationTypes.SET_LYRICS](state, lyrics: Lyrics): void {
        state.lyrics = lyrics;
    },
    [SongsMutationTypes.SET_LYRICS_TRANSPOSED](state, lyrics: Lyrics): void {
        state.transposedLyrics = lyrics;
    },
    [SongsMutationTypes.SET_VERSES](state, verses: Verse[]): void {
        state.verses = verses;
    },
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
    [SongsMutationTypes.SET_VIEW](state, view: string): void {
        state.view = view;
    },

    [SongsMutationTypes.SET_SHEETMUSIC_OPTIONS](state, o: SheetMusicOptions): void {
        state.sheetMusic = o;
    },
    [SongsMutationTypes.SET_SHEETMUSIC_TRANSPOSITION](state, transposition: number): void {
        state.smTransposition = transposition;
    },
};
