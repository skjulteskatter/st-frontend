interface SongInterface {
    id: string;
    number: number;
    type: string;
    collection?: CollectionInterface;
    name: {
        [languageKey: string]: string;
    };
    authors: ContributorInterface[];
    authorIds?: string[];
    composers: ContributorInterface[];
    composerIds?: string[];
    melodyOrigin: Origin;
    leadSheetUrl: string;
    yearWritten: number;
    themes: Theme[];
    originCountry: Country;
    audioFiles: MediaFile[];
    videoFiles: MediaFile[];
    sheetMusic: MediaFile[];
    hasLyrics: boolean;
    copyright: {
        text?: Copyright;
        melody?: Copyright;
    };
    transpositions: {
        [key: string]: number;
    };
    originalKey: string;
    details: {
        [languageKey: string]: string;
    };
}

interface Copyright {
    id: string;
    name: {
        [key: string]: string;
    };
}

interface ContributorCollectionItem {
    contributor: ContributorInterface;
    songs: SongInterface[];
    songIds: string[];
}

interface Theme {
    id: string;
    name: LocaleString;
}

interface MediaFile {
    id: string;
    type: string;
    category: string;
    number: number;
    language: Language;
    name: string;
    directUrl: string;
    contributors: ContributorInterface[];
}

interface ContributorInterface {
    id: string;
    name: string;
    birthYear: number;
    subtitle: string;
    country: string;
    biography: {
        [languageKey: string]: string;
    };
}

interface CollectionInterface {
    id: string;
    defaultType: string;
    name: {
        [lang: string]: string;
    };
    key: string;
    image: string;
    available?: boolean;
}

interface JsonContent {
    [key: string]: {
        name: string;
        content: string[];
    };
}

// LYRICS
interface LyricsInterface {
    number: number;
    title: string;
    collectionKey: string;
    language: Language;
    content: JsonContent | string;
    format: string;
    hasChords: boolean;
    originalKey: string;
    transposedToKey: string;
    transpositions: {
        [key: string]: number;
    };
}

interface Verse {
    type: string;
    name: string;
    content: string[];
}

interface Price {
    id: string;
    value: string;
    name: string;
    type: string;
}

interface Product {
    id: string;
    name: {
        [languageKey: string]: string;
    };
    collections: Collection[];
    prices: Price[];
}

interface ThemeCollectionItem {
    theme: Theme;
    songIds: string[];
    songs: SongInterface[];
}

interface CountryCollectionItem {
    country: Country;
    songIds: string[];
    songs: SongInterface[];
}
