import { Collection, CollectionItem, Song } from "@/classes";
import SongFilter from "@/classes/songFilter";
import { ISearchResultGroup } from "hiddentreasures-js/build/models/searchResultGroup";
import type { SheetMusicOptions } from "songtreasures";
import type { ApiContributor, IMediaFile } from "songtreasures-api";


export type SongViewType = "default" | "performance" | "chords";

export type AudioTrack = {
    file: IMediaFile;
    collection?: Collection;
}

/** The version of a sheet being shown (sheetEdits id, null for the original). */
export type SheetEditState = {
    fileId: string;
    editId: string | null;
};

export type State = {
    collectionId?: string;
    language: string;
    song?: Song;
    songId?: string;
    transposition?: number;
    newMelody: boolean;
    lines: string[];
    collections: Collection[];
    initialized: boolean;
    list: string;
    contributorItem?: CollectionItem<ApiContributor>;
    filter: SongFilter;
    audio?: AudioTrack;
    sheetMusic?: SheetMusicOptions;
    /** Set by the open sheet; published to band sync followers when leading. */
    sheetEdit?: SheetEditState | null;
    search?: string;
    searchResult?: ISearchResultGroup;
    view: SongViewType;
}

export const state: State = {
    collections: [],
    lines: [],
    initialized: false,
    list: "default",
    newMelody: false,
    filter: new SongFilter({
        themes: [],
        videoFiles: [],
        audioFiles: [],
        origins: [],
        categoryIds: [],
        contentTypes: [],
        sheetMusicTypes: [],
        hasAudioFiles: false,
        hasLyrics: false,
        hasSheetMusic: false,
        hasVideoFiles: false,
    }),
    language: "en",
    view: "default",
};
