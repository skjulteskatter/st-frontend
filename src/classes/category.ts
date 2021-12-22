import { useStore } from "@/store";
import { ICategory } from "songtreasures-api";
import LocaleString from "./localeString";

export default class Category implements ICategory {
    protected store = useStore();
    public id;
    public name: LocaleString;
    
    public getName(language?: string) {
        language ??= this.store.getters.languageKey;
        return this.name[language] ?? this.name.en ?? this.name[Object.keys(this.name)?.[0]];
    }

    constructor(props: ICategory) {
        this.id = props.id;
        this.name = new LocaleString(props.name ?? {});
    }
}
