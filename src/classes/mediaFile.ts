import { appSession } from "@/services/session";
import { IMediaFile, MediaType } from "songtreasures-api";
import { Participant, Song } from ".";

export default class MediaFile implements IMediaFile {
    public id: string;
    public songId: string;
    public name: string;
    public type: MediaType;
    public category: string;
    public number: number;
    public languageKey: string;
    public transposition: string;
    public information: string;
    public directUrl: string;
    public instrumentId?: string | undefined;
    public participants: Participant[];
    public collectionIds: string[];
    
    constructor(i: IMediaFile) {
        this.id = i.id;
        this.songId = i.songId;
        this.name = i.name;
        this.type = i.type;
        this.category = i.category;
        this.number = i.number;
        this.languageKey = i.languageKey;
        this.transposition = i.transposition;
        this.information = i.information;
        this.directUrl = i.directUrl;
        this.instrumentId = i.instrumentId;
        this.participants = i.participants.map(i => new Participant(i));
        this.collectionIds = i.collectionIds;
    }

    private _song: Song | null = null;

    public getSong() {
        return this._song ?? (this._song = appSession.songs.find(i => i.id === this.songId) as Song);
    }

    public getInstrument() {
        return appSession.instruments.find(i => i.id === this.instrumentId);
    }

    public getLanguage() {
        return this.languageKey ? appSession.languages.find(i => i.key === this.languageKey) : null;
    }
}
