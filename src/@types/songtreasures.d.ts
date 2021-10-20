/* eslint-disable @typescript-eslint/interface-name-prefix */
declare module "songtreasures" {
    interface IUser {
        id: string;
        displayName: string;
        image: string;
        email: string;
        subscriptions: ISubscription[];
        roles: string[];
        birthDay: string;
        gender: "male" | "female" | "unknown";
        settings?: ISettings;
        lastLogin: Date;
        privacyPolicy: boolean;
        termsAndConditions: boolean;
    }

    type ISettings = {
        languageKey?: string;
        defaultTransposition?: string;
        defaultTranscode?: string;
        defaultClef?: "treble" | "bass" | "alto";
        theme?: "light" | "dark";
    }

    type ISubscription = {
        id: string;
        productIds: string[];
        collectionIds: string[];
        validTo: Date;
        valid: boolean;
    }

    type IActivity = {
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

    interface ICollection {
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

    interface ISong {
        id: string;
        available: boolean;
        collections: {
            id: string;
            collection?: ICollection;
            number?: number;
        }[];
        type: string;
        image?: string;
        name: LocaleString;
        participants: IParticipant[];
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

    interface ILyrics {
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
    
    interface ICollectionItem<T> {
        id: string;
        item: T;
        songIds: string[];
        songs?: ISong[];
        fileIds: string[];
        files?: MediaFile[];
    }

    interface IParticipant {
        contributorId: string;
        contributor?: ApiContributor;
        type: "composer" | "author" | "arranger" | "artist";
    }

    interface ICustomCollection {
        id: string;
        type: "playlist";
        name: string;
        userId: string;
        entries: ICustomCollectionEntry[];
        sharedWithIds: string[];
        shareKey: string;
    }

    type IPlaylist = ICustomCollection;

    interface ICustomCollectionEntry {
        id: string;
        type: string;
        addedAt: string;
        addedById: string;
        songId: string;
    }

    interface ITag {
        id: string;
        type: "tag";
        name: string;
        color: string;
        userId: string;
        songIds: string[];
        songs?: ISong[];
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
        participants: IParticipant[];
        song?: ISong;
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

    interface IItem {
        id: string;
        name: LocaleString;
    }

    type ICopyright = IItem;

    type ITheme = IItem;

    interface ICountry extends IItem {
        countryCode: string;
    }

    interface IGenre extends IItem {
        description: LocaleString;
    }

    type ICategory = IItem;

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
