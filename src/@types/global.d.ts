/* eslint-disable @typescript-eslint/interface-name-prefix */

interface Step {
    name: string;
    id: string;
    type: string;
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix


interface ILocale<T> {
    [code: string]: T;
}

type ILocaleString = ILocale<string>;

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
