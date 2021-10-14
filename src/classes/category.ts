import { useStore } from "@/store";
import { ApiCategory } from "dmb-api";

export default class Category implements ApiCategory {
    protected store = useStore();
    public id;
    public name: LocaleString = {};
    
    public getName(language?: string) {
        language ??= this.store.getters.languageKey;
        return this.name[language] ?? this.name.en ?? this.name[Object.keys(this.name)?.[0]];
    }

    constructor(props: ApiCategory) {
        this.id = props.id;
        this.name = props.name;
    }
}
