import { Collection } from "@/classes";
import { songs } from "@/services/api";
import { logs } from "@/services/logs";
import { appSession } from "@/services/session";
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
    [SongsActionTypes.SELECT_SONG](context: AugmentedActionContext, payload: number | string): Promise<void>;
    [SongsActionTypes.SELECT_CONTRIBUTOR](context: AugmentedActionContext, payload: string): Promise<void>;
}

export const actions: ActionTree<State, RootState> & Actions = {
    async [SongsActionTypes.SELECT_COLLECTION]({ state, commit, getters }, id: string): Promise<void> {
        if (!state.initialized) {
            commit(SongsMutationTypes.COLLECTIONS, appSession.collections);
        }

        commit(SongsMutationTypes.LANGUAGE, getters.languageKey);
        commit(SongsMutationTypes.COLLECTION, id);
        const collection = getters.collection as Collection;

        if (collection) {
            await collection.load(state.language);

            // console.log(collection.authors);
        }
    },
    async [SongsActionTypes.SELECT_SONG]({ state, getters, commit }, number): Promise<void> {
        const collection = getters.collection as Collection | undefined;

        if (!collection) {
            return;
        }
        const song = collection?.songs.find(s => s.getNumber(collection.id) == number || s.id == number);
        commit(SongsMutationTypes.SET_SONG_ID, song?.id);

        if (!getters.lyrics) {
            
            const song = collection?.songs.find(s => s.number == number);

            if (song && song.type == "lyrics") {
                logs.event("song_view", {
                    "song_id": song.id,
                    "collection_id": collection.id,
                });
                const lans = Object.keys(song.name);
                const language = lans.includes(state.language) ? state.language : lans.includes("en") ? "en" : lans[0];
                commit(SongsMutationTypes.LANGUAGE, language);
            }
        }
    },
    async [SongsActionTypes.SELECT_CONTRIBUTOR]({ commit }, contributorId: string): Promise<void> {
        // const collection = getters.collection as Collection | undefined;
        // if (!collection) {
        //     return;
        // }
        commit(SongsMutationTypes.CONTRIBUTOR, undefined);

        const contributor = appSession.contributors.find(c => c.id == contributorId) ?? await songs.getContributor(contributorId);
        if (contributor) {
            logs.event("contributor_view", {
                "contributor_id": contributor.id,
            });

            commit(SongsMutationTypes.CONTRIBUTOR, contributor);
        }
    },
};
