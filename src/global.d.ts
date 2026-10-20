declare module "songtreasures" {
    interface ILocale<T> {
        [code: string]: T;
    }
    
    type ILocaleString = ILocale<string>;
    
    type Language = {
        key: string;
        name: string;
    }
    
    interface Origin {
        country: string;
        description: ILocaleString;
    }
    
    type SheetMusicOptions = {
        fileId: string;
        show: boolean;
        url?: string;
        type?: string;
        originalKey: string;
        transposition?: number;
        zoom?: number;
        clef: "bass" | "treble" | "alto";
        /** Version of the sheet to open (sheetEdits id), e.g. from a shared link. */
        editId?: string;
    }
}
