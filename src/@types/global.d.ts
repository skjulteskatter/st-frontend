interface User {
    id: string;
    displayName: string;
    email: string;
    language: string;
    subscriptions: Subscription[];
    roles: Role[];
    settings: {
        defaultLanguage: string;
    };
}

interface Subscription {
    id: string;
    collection: Collection;
    creationDate: Date;
    validTo: Date;
}

interface Lyrics {
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
    transposedToKey: string?;
}

interface Collection {
    id: string;
    name: {
        [lang: string]: string;
    };
    key: string;
    image: string;
}

interface Role {
    id: string;
    name: string;
}

interface Language {
    key: string;
    name: string;
}

interface SongInterface {
    number: number;
    collection: Collection;
    name: {
        [languageKey: string]: string;
    };
    authors: Contributor[];
    composers: Contributor[];
    melodyOrigin: any;
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

interface Country {
    name: string;
    countryCode: string;
}