import { MutationTree } from "vuex";
import { State } from ".";
import { NotificationMutationTypes } from "./mutation-types";
import { Notification } from "./state";

export type Mutations<S = State> = {
    [NotificationMutationTypes.ADD_NOTIFICATION](state: S, payload: Notification): void;
}

export const mutations: MutationTree<State> & Mutations = {
    [NotificationMutationTypes.ADD_NOTIFICATION](state, notification) {
        state.notifications.push({ ...notification, id: `${Date.now()}` });
    },
};
