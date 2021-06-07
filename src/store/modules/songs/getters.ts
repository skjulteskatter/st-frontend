import { Collection, Lyrics } from "@/classes";
import { RootState } from "../..";
import { GetterTree } from "vuex";
import { State } from "./state";


export type Getters = {
    collection(state: State): Collection | undefined;
    lyrics(state: State, getters: unknown): Lyrics | undefined;
}

export const getters: GetterTree<State, RootState> & Getters = {
    collection(state): Collection | undefined {
        return state.collectionId ? state.collections.find(c => c.id == state.collectionId || c.getKeys().includes(state.collectionId as string)) : undefined;
    },
    lyrics(state, getters: {collection: Collection | undefined}): Lyrics | undefined {
        const format = state.view == "transpose" ? "html" : "json";
        const transposition = format == "html" ? state.transposition : null;

        for (const l of getters.collection?.lyrics ?? []) {
            if (l.songId == state.songId && l.languageKey == state.language) {
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
