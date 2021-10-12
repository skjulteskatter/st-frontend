import { ApiSettings } from "dmb-api";

export default class UserSettings implements ApiSettings {
    public defaultTranscode;
    public defaultTransposition;
    public defaultClef;
    public languageKey;
    public theme;

    constructor(i: ApiSettings) {
        this.defaultTranscode = i.defaultTranscode ?? "common";
        this.defaultTransposition = i.defaultTransposition ?? "C";
        this.defaultClef = i.defaultClef ?? "treble";
        this.languageKey = i.languageKey ?? "en";
        this.theme = i.theme ?? "light";
    }
}
