import { MusicSheet } from "./MusicSheet";
export declare class InstrumentalGroup {
    constructor(name: string, musicSheet: MusicSheet, parent: InstrumentalGroup);
    private name;
    private musicSheet;
    private parent;
    private instrumentalGroups;
    get InstrumentalGroups(): InstrumentalGroup[];
    get Parent(): InstrumentalGroup;
    get Name(): string;
    set Name(value: string);
    get GetMusicSheet(): MusicSheet;
}
