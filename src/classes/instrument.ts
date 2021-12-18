import { IInstrument } from "songtreasures-api";

export default class Instrument implements IInstrument {
    public id: string;
    public updatedAt: string;
    public identifier: string;
    public icon: string;

    constructor(i: IInstrument) {
        this.id = i.id;
        this.updatedAt = i.updatedAt;
        this.identifier = i.identifier;
        this.icon = i.icon;
    }
}
