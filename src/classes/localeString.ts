import { useStore } from "@/store";

export default class LocaleString implements ILocaleString {
    [key: string]: string;

    constructor(i: ILocaleString) {
        for (const e of Object.entries(i)) {
            this[e[0]] = e[1];
        }
    }

    public get default() {
        return this[useStore().getters.languageKey] ?? this.en ?? Object.values(this)[0];
    }
}
