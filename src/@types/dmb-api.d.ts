declare module "dmb-api" {
    interface ApiUser {
        id: string;
        displayName: string;
        image: string;
        email: string;
        subscriptions: ApiSubscription[];
        roles: string[];
        address: {};
        birthDay: string;
        gender: "male" | "female" | "unknown";
        settings?: ApiSettings;
        lastLogin: Date;
        privacyPolicy: boolean;
        termsAndConditions: boolean;
    }

    type ApiSettings = {
        languageKey?: string;
        defaultTransposition?: string;
        defaultTranscode?: string;
    }

    type ApiSubscription = {
        id: string;
        productIds: string[];
        collectionIds: string[];
        validTo: Date;
        valid: boolean;
    }

    type ApiActivity = {
        id?: string;
        type: "contributor";
        itemId: string;
        loggedDate: string;
    } | {
        id?: string;
        type: "song";
        itemId: string;
        loggedDate: string;
    }

    type Sort = "default" | "number" | "title" | "author" | "composer" | "genre" | "categories" | "views" | "countries" | "themes";

    type Format = "json" | "performance";

    interface ApiCollection {
        id: string;
        enabled: boolean;
        defaultType: string;
        defaultSort: Sort;
        freeSongs: boolean;
        name: {
            [lang: string]: string;
        };
        key: string;
        keys: LocaleString;
        image: string;
        available?: boolean;
        details?: LocaleString;
        hasChords: {
            [lang: string]: boolean;
        };
    }

    interface ApiSong {
        id: string;
        available: boolean;
        collections: {
            id: string;
            collection?: ApiCollection;
            number?: number;
        }[];
        type: string;
        image?: string;
        name: LocaleString;
        participants: ApiParticipant[];
        yearWritten?: number;
        yearComposed?: number;
        originalKey: string;
        hasLyrics: boolean;
        hasChords: boolean;
        themeIds: string[];
        genreIds: string[];
        categoryIds: string[];
        copyrights: {
            type: string;
            copyrightId?: string;
        }[];
        origins: {
            type: "text" | "melody";
            country: string;
            description: LocaleString;
        }[];
        transpositions?: {
            [key: string]: number;
        };
        verses: number;
        details?: LocaleString;
        newMelody: boolean;
        newMelodies: string[];
    }

    interface ApiLyrics {
        id: string;
        songId: string;
        collectionIds: string[];
        languageKey: string;
        content: LyricsContent | LyricsChordContent[] | string;
        format: Format;
        hasChords: boolean;
        originalKey: string;
        transposedToKey: string;
        secondaryChords: boolean;
        notes: string;
        transpositions: {
            [key: string]: number;
        };
    }

    interface ApiContributor {
        id: string;
        name: string;
        birthYear: number;
        subtitle: string;
        country: string;
        image?: string;
        biography?: {
            [languageKey: string]: string;
        };
    }
    
    interface ApiCollectionItem<T> {
        id: string;
        item: T;
        songIds: string[];
        songs?: ApiSong[];
        fileIds: string[];
        files?: MediaFile[];
    }

    interface ApiParticipant {
        contributorId: string;
        contributor?: ApiContributor;
        type: "composer" | "author" | "arranger" | "artist";
    }

    interface ApiCustomCollection {
        id: string;
        type: "playlist";
        name: string;
        userId: string;
        entries: ApiPlaylistEntry[];
        sharedWithIds: string[];
        shareKey: string;
    }

    type ApiPlaylist = ApiCustomCollection;

    interface ApiPlaylistEntry {
        id: string;
        type: string;
        addedAt: string;
        addedById: string;
        songId: string;
    }

    interface ApiTag {
        id: string;
        type: "tag";
        name: string;
        color: string;
        userId: string;
        songIds: string[];
        songs?: ApiSong[];
        canEdit: boolean;
    }

    interface MediaFile {
        id: string;
        songId: string;
        name: string;
        type: "audio" | "video" | "sheetmusic" | "sheetmusic-pdf";
        collectionIds: string[];
        category: string;
        number: number;
        languageKey: string;
        transposition: string;
        information: string;
        directUrl: string;
        participants: ApiParticipant[];
        song?: ApiSong;
    }

    interface CreditSong {
        id: string;
        name: LocaleString;
        collection: LocaleString;
        number: number;
        authors: string[];
        composers: string[];
        arrangers: string[];
        textCopyright: LocaleString;
        melodyCopyright: LocaleString;
    }

    interface ShareKey {
        itemId: string;
        key: string;
        userId: string;
        type: string;
        validTo: string;
        usedByIds: string[];
    }

    interface PublicUser {
        id: string;
        displayName: string;
        image: string;
    }

    interface ApiItem {
        id: string;
        name: LocaleString;
    }

    type ApiCopyright = ApiItem;

    type ApiTheme = ApiItem;

    interface ApiCountry extends ApiItem {
        countryCode: string;
    }

    interface ApiGenre extends ApiItem {
        description: LocaleString;
    }

    type ApiCategory = ApiItem;

    type LyricsContent = {
        [key: string]: {
            name: string;
            content: string[];
        };
    }
    
    type LyricsChordContent = {
        key: string;
        name: string;
        content: {
            chords: string[];
            parts: string[];
        }[];
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
    type: "month" | "year";
}

interface Result<T> {
    result: T;
    success: boolean;
    error: string;
    lastUpdated: string;
}

interface AnalyticsItem {
    count: number; 
    activity: {
        dateHour: Date;
        countries: {
            country: string;
            count: number;
        }[];
        count: number;
    }[];
    lyrics: {
        language: string;
        dateHour: Date;
        count: string;
    }[];
}

declare module "songtreasures/search" {
    interface ApiSearchResultItem {
        id: string;
        context: {
            [key: string]: string;
        };
    }

    interface ApiSearchResult {
        songs: ApiSearchResultItem[];
        contributors: ApiSearchResultItem[];
    }
}
