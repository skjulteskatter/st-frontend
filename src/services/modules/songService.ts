import { Song } from "@/classes";
import { ISong } from "songtreasures";
import api from "../api";
import { cache } from "../cache";
import { notify } from "../notify";
import { appSession } from "../session";
import BaseService from "./baseService";

export type SongViewType = "performance" | "chords" | "default";

class SongService extends BaseService<Song> {
    public async get(id: string) {
        let song = this.items.find(i => i.id === id);
        if (!song) {
            song = new Song(await cache.getFromHash("songs", id) ?? await api.songs.get(id));

            this.items.push(song);
        }

        return song;
    }

    private _loaded = false;

    private async load() {
        if (!this._loaded) {
            const lastTimeUpdated = await cache.get("config", "last_updated_songs") as Date | undefined;
            const shouldUpdate = !lastTimeUpdated || lastTimeUpdated.getTime() < (new Date().getTime() - 3600000);
    
            if (shouldUpdate) {
                await cache.set("config", "last_updated_songs", new Date());
            }
    
            try {
                const key = "last_updated_songs_value";
                const lastUpdated = await cache.get("config", key) as Date | undefined;
    
                if (shouldUpdate) {
                    const updateSongs = await api.songs.list(lastUpdated);
    
                    await cache.replaceEntries("songs", updateSongs.result.reduce((a, b) => {
                        a[b.id] = b;
                        return a;
                    }, {} as {
                        [id: string]: ISong;
                    }));
    
                    await cache.set("config", key, new Date(updateSongs.lastUpdated));
                }
    
                this.items = (await cache.getAll("songs")).map(i => new Song(i));
            }
            catch (e) {
                notify("error", "Error occured", "warning", JSON.stringify(e));
                this.items = (await api.songs.list()).result.map(s => new Song(s));
            }
        }
    }

    public async list(collectionId: string) {
        await this.load();

        return this.items.filter(i => i.collections.some(c => c.id === collectionId));
    }

    public sheetMusicOptions?: SheetMusicOptions;

    private _songId?: string;

    public setSong(id?: string) {
        this._songId = id;
    }

    public currentSong() {
        return this.items.find(i => i.id === this._songId);
    }

    public view: SongViewType = "default";
    public transposition?: number;
    
    public newMelody = false;
    public language = appSession.Language;
}

export default new SongService();
