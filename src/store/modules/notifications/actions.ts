import { ActionContext, ActionTree } from "vuex";
import { State } from ".";
import { RootState } from "../..";
import { Mutations } from "./mutations";
import { NotificationActionTypes } from "./action-types";
import { NotificationMutationTypes } from "./mutation-types";
import { Notification } from "@/services/notifications";

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1],
    ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;

export interface Actions {
    [NotificationActionTypes.ADD_NOTIFICATION]({ commit }: AugmentedActionContext, notification: Notification): Promise<void>;
}

export const actions: ActionTree<State, RootState> & Actions = {
    async [NotificationActionTypes.ADD_NOTIFICATION]({ commit }, notification: Notification) {
        commit(NotificationMutationTypes.ADD_NOTIFICATION, notification);
    },
};
