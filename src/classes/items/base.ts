import { useStore } from "@/store";
import { ApiItem } from "dmb-api";

export default class BaseItem implements ApiItem {
    public id;
    public name;

    private store = useStore();

    public getName(language?: string) {
        language ??= this.store.getters.languageKey;
        return this.name[language] ?? this.name.en ?? this.name[Object.keys(this.name)?.[0]];
    }

    constructor(i: ApiItem) {
        this.id = i.id;
        this.name = i.name;
    }
}
