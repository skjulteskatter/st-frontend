import { appSession } from "@/services/session";

export default class LocaleString implements ILocaleString {
    [key: string]: string;

    constructor(i: ILocaleString) {
        for (const e of Object.entries(i)) {
            this[e[0]] = e[1];
        }
    }

    public get default() {
        return this[appSession.Language] ?? this.en ?? Object.values(this)[0];
    }
}
