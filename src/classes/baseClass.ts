import { useStore } from "@/store";

export default class BaseClass {
    protected store = useStore();
    public name: LocaleString = {};

    public getName(language?: string) {
        language ??= this.store.getters.languageKey;
        return this.name[language] ?? this.name.en ?? this.name[Object.keys(this.name)?.[0]];
    }

    public getTranslatedProperty(property: LocaleString | undefined, language: string) {
        if (property) {
            return property[language] ?? property.en ?? property[Object.keys(property)?.[0]];
        }
    }
}
