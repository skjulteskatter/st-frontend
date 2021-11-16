import { IVerse } from "songtreasures";

export default class Verse implements IVerse {
    public key;
    public number;
    public content;

    constructor(i: IVerse) {
        this.key = i.key;
        this.number = i.number;
        this.content = i.content;
    }
}
