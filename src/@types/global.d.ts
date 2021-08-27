
interface Step {
    name: string;
    id: string;
    type: string;
}

interface LocaleString {
    [code: string]: string;
}

interface Language {
    key: string;
    name: string;
}

interface Origin {
    country: string;
    description: LocaleString;
}

type SheetMusicOptions = {
    show: boolean;
    url?: string;
    type?: string;
    originalKey: string;
    transposition?: number;
    zoom?: number;
    clef: "bass" | "treble" | "alto";
}

type SongFilter = {
    themes: string[];
    origins: string[];
    videoFiles: string[];
    audioFiles: string[];
    contentTypes: string[];
    sheetMusicTypes: string[];
    hasLyrics: boolean;
    hasAudioFiles: boolean;
    hasVideoFiles: boolean;
    hasSheetMusic: boolean;
}

declare module "songtreasures" {
    interface Notification {
        id?: string;
        type: "warning" | "error" | "success" | "info";
        title: string;
        icon: string;
        content?: string;
        timeout?: number;
        dateTime?: Date;
        callback?: Function;
        store?: boolean;
    }
}
