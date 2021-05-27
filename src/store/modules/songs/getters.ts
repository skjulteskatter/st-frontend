import { Collection, Lyrics, Song } from "@/classes";
import { RootState } from "../..";
import { GetterTree } from "vuex";
import { State } from "./state";


export type Getters = {
    songs(state: State, getters: unknown): Song[];
    collection(state: State): Collection | undefined;
    song(state: State, getters: unknown): Song | undefined;
    lyrics(state: State, getters: unknown): Lyrics | undefined;
}

export const getters: GetterTree<State, RootState> & Getters = {
    songs(state, getters): Song[] {
        return (getters as {collection: Collection | undefined}).collection?.songs ?? [];
    },
    collection(state): Collection | undefined {
        return state.collectionId ? state.collections.find(c => c.id == state.collectionId || c.getKeys().includes(state.collectionId as string)) : undefined;
    },
    song(state, getters): Song | undefined {
        return (getters as {collection: Collection | undefined}).collection?.songs.find(s => s.number == state.songNumber);
    },
    lyrics(state, getters: {collection: Collection | undefined; song: Song | undefined}): Lyrics | undefined {
        const format = state.view == "transpose" ? "html" : "json";
        const transposition = format == "html" ? state.transposition : null;

        for (const l of getters.collection?.lyrics ?? []) {
            if (l.songId == getters.song?.id && l.languageKey == state.language) {
                if (l.format != format) 
                    continue;
                if (transposition !== null) {
                    if (l.transposition == transposition) {
                        return l;
                    }
                } else {
                    return l;
                }
            }
        }
    },
};
