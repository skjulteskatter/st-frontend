interface SongInterface {
    number: number;
    collection: Collection;
    name: {
        [languageKey: string]: {
            name: string;
            title: string;
        };
    };
    authors: Contributor[];
    composers: Contributor[];
    melodyOrigin: Origin;
    leadSheetUrl: string;
    yearWritten: number;
    originCountry: Country;
    soundFiles: MediaFile[];
    videoFiles: MediaFile[];
    biography: MediaFile;
}

interface MediaFile {
    id: string;
    type: string;
    number: number;
    language: Language;
    name: string;
    directUrl: string;
}

interface Contributor {
    name: string;
    birthYear: number;
    country: string;
}

interface Collection {
    id: string;
    name: {
        [lang: string]: string;
    };
    key: string;
    image: string;
}

// LYRICS
interface LyricsInterface {
    collection: Collection;
    language: Language;
    content: {
        [key: string]: {
            name: string;
            content: string[];
        };
    };
    format: string;
    hasChords: boolean;
    originalKey: string;
    transposedToKey?: string;
    song: SongInterface;
}

interface Verse {
    type: string;
    name: string;
    content: string[];
}

interface Product {
    name: {
        [languageKey: string]: string;
    };
    collections: Collection[];
    image: string;
    priceId: string;
}
