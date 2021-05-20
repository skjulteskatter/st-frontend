declare module "dmb-api" {

    type ApiActivity = {
        id?: string;
        type: "contributor";
        itemId: string;
        item?: ApiContributor;
        loggedDate: string;
    } | {
        id?: string;
        type: "song";
        itemId: string;
        item?: ApiSong;
        loggedDate: string;
    }

    interface ApiCollection {
        id: string;
        defaultType: string;
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
        collectionIds: string[];
        collections?: ApiCollection[];
        number: number;
        type: string;
        image?: string;
        name: LocaleString;
        participants: ApiParticipant[];
        yearWritten: number;
        originalKey: string;
        hasLyrics: boolean;
        hasChords: boolean;
        themeIds: string[];
        copyrights: {
            type: string;
            copyrightId?: string;
            copyright?: ApiCopyright;
        }[];
        origins: {
            type: string;
            country: string;
            description: LocaleString;
        }[];
        transpositions?: {
            [key: string]: number;
        };
        verses: number;
        details?: LocaleString;
        themes?: Theme[];
        files?: MediaFile[];
        newMelody: boolean;
    }

    interface ApiLyrics {
        id: string;
        songId: string;
        number: number;
        title: string;
        collectionIds: string[];
        languageKey: string;
        content: JsonContent | string;
        format: "json" | "html";
        hasChords: boolean;
        originalKey: string;
        transposedToKey: string;
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

    interface ApiPlaylist {
        id: string;
        name: string;
        userId: string;
        entries: ApiPlaylistEntry[];
        sharedWithIds: string[];
        shareKey: string;
    }

    interface ApiPlaylistEntry {
        id: string;
        type: string;
        addedAt: string;
        addedById: string;
        songId: string;
        song?: ApiSong;
    }

    interface ApiTag {
        id: string;
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
        type: string;
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

    interface ApiCopyright {
        id: string;
        name: LocaleString;
    }
}

interface Copyright {
    id: string;
    name: LocaleString;
}

interface Theme {
    id: string;
    name: LocaleString;
}

interface JsonContent {
    [key: string]: {
        name: string;
        content: string[];
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

