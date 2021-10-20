import { ISettings } from "songtreasures";

export default class UserSettings implements ISettings {
    public defaultTranscode;
    public defaultTransposition;
    public defaultClef;
    public languageKey;
    public theme;

    constructor(i: ISettings) {
        this.defaultTranscode = i.defaultTranscode ?? "common";
        this.defaultTransposition = i.defaultTransposition ?? "C";
        this.defaultClef = i.defaultClef ?? "treble";
        this.languageKey = i.languageKey ?? "en";
        this.theme = i.theme ?? "light";
    }
}
