import { Collection, Song } from "@/classes";
import { ApiSong } from "dmb-api";
import { ref } from "vue";
import { songs } from "./api";
import { cache } from "./cache";
import { notify } from "./notify";

let initialized: boolean | undefined;

export class Session {
    private _initialized = ref(initialized);
    public songs: Song[] = [];
    public collections: Collection[] = [];

    public get initialized() {
        return this._initialized.value == true;
    }

    public async init() {
        if (this._initialized.value == false) {
            while(this._initialized.value == false) {
                await new Promise(r => setTimeout(r, 100));
            }
            return;
        }

        this._initialized.value = false;
        this.collections = (await songs.getCollections()).map(c => new Collection(c));
        
        const offline = (await cache.get("config", "offline")) == true;
        
        if (offline) {
            if (navigator.onLine) {
                try {
                    const key = "last_updated_songs";
                    const lastUpdated = await cache.get("config", key) as string | undefined;

                    const now = new Date();

                    if (lastUpdated == undefined || (now.getTime() - new Date(lastUpdated).getTime()) > 86400000) {
                        const updateSongs = await songs.getAllSongs(lastUpdated);
    
                        await cache.replaceEntries("songs", updateSongs.reduce((a, b) => {
                            a[b.id] = b;
                            return a;
                        }, {} as {
                            [id: string]: ApiSong;
                        }));
        
                        await cache.set("config", key, now.toISOString());
                    }
                }
                catch(e) {
                    notify("error", "Error occured", "warning", e);
                    this.songs = (await songs.getAllSongs()).map(s => new Song(s));
                }
            }
            
            this.songs = this.songs.length > 0 ? this.songs : (await cache.getAll("songs")).map(s => new Song(s));
        } else {
            this.songs = (await songs.getAllSongs()).map(s => new Song(s));
        }
        this._initialized.value = true;
    }
}

export const appSession = new Session();
