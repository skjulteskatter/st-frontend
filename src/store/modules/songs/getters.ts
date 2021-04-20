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
        return state.collections.find(c => c.id == state.collectionId || c.key == state.collectionId);
    },
    song(state, getters): Song | undefined {
        return (getters as {collection: Collection | undefined}).collection?.songs.find(s => s.number == state.songNumber);
    },
    lyrics(state, getters): Lyrics | undefined {
        return (getters as {collection: Collection | undefined}).collection?.lyrics.find(l => l.number == state.songNumber && l.language.key == state.language);
    },
};
