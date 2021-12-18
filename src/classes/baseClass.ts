import { appSession } from "@/services/session";
import { useStore } from "@/store";
import { ILocaleString } from "songtreasures";
import LocaleString from "./localeString";

export default class BaseClass {
    protected store = useStore();
    public name: LocaleString = new LocaleString({});

    public getName(language?: string) {
        language ??= appSession.Language;
        return this.name[language] ?? this.name.en ?? this.name[Object.keys(this.name)?.[0]];
    }

    public getTranslatedProperty(property: ILocaleString | undefined, language?: string) {
        if (property) {
            language ??= appSession.Language;
            return property[language] ?? property.en ?? property[Object.keys(property)?.[0]];
        }
    }
}
