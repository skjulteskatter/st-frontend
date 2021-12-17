import { useStore } from "@/store";
import { IItem } from "songtreasures-api";

export default class BaseItem implements IItem {
    public id;
    public name;

    private store = useStore();

    public getName(language?: string) {
        language ??= this.store.getters.languageKey;
        return this.name[language] ?? this.name.en ?? this.name[Object.keys(this.name)?.[0]];
    }

    constructor(i: IItem) {
        this.id = i.id;
        this.name = i.name;
    }
}
