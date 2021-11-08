
interface Step {
    name: string;
    id: string;
    type: string;
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface ILocaleString {
    [code: string]: string;
}

interface Language {
    key: string;
    name: string;
}

interface Origin {
    country: string;
    description: ILocaleString;
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
