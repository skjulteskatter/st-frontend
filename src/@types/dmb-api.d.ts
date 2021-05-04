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
        number: number;
        type: string;
        image?: string;
        collectionId: string;
        collection?: ApiCollection;
        name: {
            [languageKey: string]: string;
        };
        participants: ApiParticipant[];
        melodyOrigin: Origin;
        leadSheetUrl: string;
        yearWritten: number;
        themes: Theme[];
        originCountry: Country;
        audioFiles: MediaFile[];
        videoFiles: MediaFile[];
        sheetMusic: MediaFile[];
        hasLyrics: boolean;
        hasChords: boolean;
        copyright: {
            text?: Copyright;
            melody?: Copyright;
        };
        transpositions: {
            [key: string]: number;
        };
        originalKey: string;
        verses: number;
        details: {
            [languageKey: string]: string;
        };
    }

    interface ApiLyrics {
        id: string;
        songId: string;
        number: number;
        title: string;
        collectionId: string;
        collectionKey: string;
        language: Language;
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
        biography: {
            [languageKey: string]: string;
        };
    }
    
    interface ApiContributorCollectionItem {
        id: string;
        contributor: ApiContributor;
        songIds: string[];
        songs?: ApiSong[];
        fileIds: string[];
        files?: MediaFile[];
    }

    interface ApiThemeCollectionItem {
        theme: Theme;
        songIds: string[];
        songs: ApiSong[];
    }
    
    interface ApiCountryCollectionItem {
        country: Country;
        songIds: string[];
        songs: ApiSong[];
    }

    interface ApiParticipant {
        contributorId: string;
        contributor?: ApiContributor;
        type: "composer" | "author" | "arranger";
    }

    interface ApiPlaylist {
        id: string;
        name: string;
        userId: string;
        entries: ApiPlaylistEntry[];
        sharedWithIds: string[];
        shareKey: string;
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

    interface ApiPlaylistEntry {
        id: string;
        type: string;
        addedAt: string;
        addedById: string;
        songId: string;
        song: ApiSong;
    }

    interface MediaFile {
        id: string;
        type: string;
        collection?: ApiCollection;
        category: string;
        number: number;
        language: Language;
        name: string;
        directUrl: string;
        contributors: ApiContributor[];
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

