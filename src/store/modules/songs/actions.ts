import { Collection, Song } from "@/classes";
import { getContributors } from "@/functions/helpers";
import { songs } from "@/services/api";
import { cache } from "@/services/cache";
import { notify } from "@/services/notify";
import { ApiSong } from "dmb-api";
import { ActionContext, ActionTree } from "vuex";
import { State } from ".";
import { RootState } from "../..";
import { SongsActionTypes } from "./action-types";
import { SongsMutationTypes } from "./mutation-types";
import { Mutations } from "./mutations";

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1],
    ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;

export interface Actions {
    [SongsActionTypes.SELECT_COLLECTION](context: AugmentedActionContext, payload: string): Promise<void>;
    [SongsActionTypes.SELECT_SONG](context: AugmentedActionContext, payload: number): Promise<void>;
    [SongsActionTypes.SELECT_CONTRIBUTOR](context: AugmentedActionContext, payload: string): Promise<void>;
    [SongsActionTypes.TRANSPOSE](context: AugmentedActionContext, payload: number): Promise<void>;
    [SongsActionTypes.SET_LIST](context: AugmentedActionContext, payload: string): Promise<void>;
    [SongsActionTypes.INIT](context: AugmentedActionContext): Promise<void>;
}

export const actions: ActionTree<State, RootState> & Actions = {
    async [SongsActionTypes.INIT]({commit}) {
        let s: Song[] = [];
        const offline = (await cache.get("config", "offline")) == "true";
        
        if (offline) {
            if (navigator.onLine) {
                try {
                    const key = "last_updated_songs";
                    const lastUpdated = await cache.get("config", key) as string | undefined;
                    const updateSongs = await songs.getAllSongs(lastUpdated);
    
                    await cache.replaceEntries("songs", updateSongs.reduce((a, b) => {
                        a[b.id] = b;
                        return a;
                    }, {} as {
                        [id: string]: ApiSong;
                    }));
    
                    const now = new Date();
    
                    await cache.set("config", key, new Date(now.getTime() - 172800).toISOString());
                }
                catch(e) {
                    notify("error", "Error occured", "warning", e);
                    s = (await songs.getAllSongs()).map(s => new Song(s));
                }
            }
            
            s = s.length > 0 ? s : (await cache.getAll("songs")).map(s => new Song(s));
        } else {
            s = (await songs.getAllSongs()).map(s => new Song(s));
        }

        commit(SongsMutationTypes.SET_SONGS, s);
    },
    async [SongsActionTypes.SELECT_COLLECTION]({ dispatch, state, commit, getters }, id: string): Promise<void> {
        if (!state.initialized) {
            commit(SongsMutationTypes.COLLECTIONS, getters.collections);
        }

        commit(SongsMutationTypes.LANGUAGE, getters.languageKey);
        commit(SongsMutationTypes.TRANSCODE,getters.user?.settings?.defaultTranscode ?? "common");
        commit(SongsMutationTypes.COLLECTION, id);
        const list = state.list;
        commit(SongsMutationTypes.SET_LIST, "default");
        const collection = getters.collection as Collection;

        if (collection) {
            collection.load(state.language).then(() => {
                dispatch(SongsActionTypes.SET_LIST, list);
            });
        }
    },
    async [SongsActionTypes.SELECT_SONG]({ getters, commit }, number: number): Promise<void> {
        const collection = getters.collection as Collection | undefined;
        if (!collection) {
            return;
        }
        commit(SongsMutationTypes.SET_SONG_NUMBER, number);

        if (!getters.lyrics) {
            
            const song = collection?.songs.find(s => s.number == number);

            if (song && song.type == "lyrics") {
                const lans = Object.keys(song.name);
                const language = lans.includes("en") ? "en" : lans[0];
                commit(SongsMutationTypes.LANGUAGE, language);

                await collection.getLyrics(number, language);
            }
        }
    },
    async [SongsActionTypes.SELECT_CONTRIBUTOR]({ commit, getters }, contributorId: string): Promise<void> {
        // const collection = getters.collection as Collection | undefined;
        // if (!collection) {
        //     return;
        // }
        commit(SongsMutationTypes.CONTRIBUTOR, undefined);

        const contributor = getters.collection?.settings.offline ? (await getContributors(true)).find(c => c.id == contributorId) : await songs.getContributor(contributorId);
        if (contributor) {
            commit(SongsMutationTypes.CONTRIBUTOR, contributor);
        }
    },
    async [SongsActionTypes.TRANSPOSE]({ commit, getters }, transpose: number): Promise<void> {
        const collection = getters.collection as Collection | undefined;
        if (!collection || !getters.song) {
            return;
        }

        const lyrics = await collection.transposeLyrics(getters.song.number, transpose);

        // commit(SongsMutationTypes.SET_LYRICS_TRANSPOSED, lyrics);
        commit(SongsMutationTypes.SET_TRANSPOSITION, lyrics.transposition);
    },
    async [SongsActionTypes.SET_LIST]({ commit, getters }, value: string): Promise<void> {
        const r = await (getters.collection as Collection).getList(value);
        if (r == 0) {
            commit(SongsMutationTypes.SET_LIST, "default");
        } else {
            commit(SongsMutationTypes.SET_LIST, value);
        }
    },
};
