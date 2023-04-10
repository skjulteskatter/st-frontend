interface ILocale<T> {
    [code: string]: T;
}

type ILocaleString = ILocale<string>;

declare module "songtreasures-api" {
    type GenderType = "male" | "female" | "unknown";

    interface ILocale<T> {
        [code: string]: T;
    }
    
    type ILocaleString = ILocale<string>;
    
    interface IUser {
        id: string;
        displayName: string;
        image: string;
        email: string;
        subscriptions: ISubscription[];
        roles: string[];
        birthDay: string;
        gender: GenderType;
        settings?: ISettings;
        lastLogin: Date;
        privacyPolicy: boolean;
        termsAndConditions: boolean;
        registered: boolean;
    }

    type ThemeType = "light" | "dark";
    type ClefType = "treble" | "bass" | "alto";

    type ISettings = {
        languageKey?: string;
        defaultTransposition?: string;
        defaultTranscode?: string;
        defaultClef?: ClefType;
        theme?: ThemeType;
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

    type CollectionType = "song" | "scripture" | "publication";

    interface ICollection {
        id: string;
        enabled: boolean;
        type: CollectionType;
        priority: number;
        defaultType: string;
        defaultSort: Sort;
        freeSongs: boolean;
        name: {
            [lang: string]: string;
        };
        key: string;
        keys: ILocaleString;
        image: string;
        available?: boolean;
        details?: ILocaleString;
        hasChords: {
            [lang: string]: boolean;
        };
    }

    type SongType = "lyrics" | "sheetMusic" | "audio";

    interface ISong {
        id: string;
        available: boolean;
        enabled: boolean;
        collections: {
            id: string;
            collection?: ICollection;
            number?: number;
        }[];
        type: string;
        image?: string;
        name: ILocaleString;
        participants: IParticipant[];
        yearWritten?: number;
        yearComposed?: number;
        yearPublished?: number;
        originalKey: string;
        minor: boolean;
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
            description: ILocaleString;
        }[];
        transpositions?: {
            [key: string]: number;
        };
        verses: number;
        details?: ILocaleString;
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

    interface IChord {
        imageArray: string[];
        chordName: string;
        instrument: string;
    }

    type MediaType = "audio" | "video" | "sheetmusic" | "sheetmusic-pdf";

    interface IMediaFile {
        id: string;
        songId: string;
        name: string;
        type: MediaType;
        category: string;
        number: number;
        languageKey: string;
        transposition: string;
        information: string;
        directUrl: string;
        instrumentId?: string;
        participants: IParticipant[];
        collectionIds: string[];
    }

    interface IInstrument {
        id: string;
        updatedAt: string;
        identifier: string;
        icon: string;
    }

    interface CreditSong {
        id: string;
        name: ILocaleString;
        collection: ILocaleString;
        number: number;
        authors: string[];
        composers: string[];
        arrangers: string[];
        textCopyright: ILocaleString;
        melodyCopyright: ILocaleString;
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
        name: ILocaleString;
    }

    type ICopyright = IItem;

    type ITheme = IItem;

    interface ICountry extends IItem {
        countryCode: string;
    }

    interface IGenre extends IItem {
        description: ILocaleString;
    }

    type ICategory = IItem;

    type LyricsContent = {
        [key: string]: {
            name: string;
            content: string[];
            bibleReferences: BibleReference[];
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

    type TDocument = {
        id: string;
        updatedAt: string;
    }

    interface IScripture extends TDocument {
        title: ILocaleString;
        key: ILocaleString;
        icon: string;
        image: string;
    }

    interface ITranslation extends TDocument {
        scriptureId: string;
        title: string;
        shortTitle: string;
        sourceName: string;
        icon: string;
        image: string;
        language: string;
    }

    interface IBook extends TDocument {
        translationId: string;
        title: string;
        shortTitle: string;
        number: number;
        color: string;
        chapters: IChapter[] | null;
    }

    interface IChapter extends TDocument {
        bookId: string;
        number: number;
        title: string;
        preview: string | null;
        verses: IVerse[] | null;
    }

    interface IVerse {
        key: string;
        number: number;
        content: string;
    }

    type BibleReference = {
        book: number;
        chapter: number;
        verseFrom: number;
        verseTo: number;
    }
    
    interface Notification {
        id?: string;
        type: "primary" | "error";
        title: string;
        icon: string;
        content?: string;
        timeout?: number;
        dateTime?: Date;
        callback?: () => void;
        store?: boolean;
        delete?: () => Promise<void>;
        read?: () => Promise<void>;
    }
    
    interface IAnalyticsItem {
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

    interface IPrice {
        id: string;
        value: string;
        name: string;
        type: "month" | "year";
    }
}

declare module "songtreasures-api/checkout" {
    interface SessionRequest {
        productIds: string[];
        successUrl: string;
        cancelUrl: string;
        country?: string;
        type: "year" | "month";
    }

    interface SessionResponse {
        sessionId: string;
    }

    interface PortalRequest {
        sessionId: string;
    }
    
    interface SetupResponseCollection {
        id: string;
        name: string;
    }

    interface SetupResponse {
        key: string;
        products: ApiProduct[];
    }
    
    interface ApiProduct {
        id: string;
        name: ILocaleString;
        collectionIds: string[];
        prices: Price[];
        priority: number;
    }
}

declare module "songtreasures-api/publications" {
    interface IPublication {
        id: string;
        updatedAt: string;
        collectionId: string;
        datePublished: string;
        title: string;
        key: ILocaleString;
        description: string;
        icon: string;
        image: string;
    }

    interface IArticleContent {
        articleId: string;
        translationId: string | null;
        translatorId: string | null;
        updatedAt: string;
        language: string;
        introduction: string;
        content: string;
    }

    interface IArticle {
        id: string;
        updatedAt: string;
        publicationId: string;
        authorId: string;
        dateWritten: string;
        number: number;
        icon: string;
        image: string;
        title: string;
        content: IArticleContent | null;
    }
}
