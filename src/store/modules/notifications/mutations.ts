import { Notification } from "@/services/notifications";
import { MutationTree } from "vuex";
import { State } from ".";
import { NotificationMutationTypes } from "./mutation-types";

export type Mutations<S = State> = {
    [NotificationMutationTypes.ADD_NOTIFICATION](state: S, payload: Notification): void;
    [NotificationMutationTypes.ADD_NOTIFICATIONS](state: S, payload: Notification[]): void;
}

export const mutations: MutationTree<State> & Mutations = {
    [NotificationMutationTypes.ADD_NOTIFICATION](state, notification) {
        state.notifications.push({ ...notification, id: `${Date.now()}` });
    },
    [NotificationMutationTypes.ADD_NOTIFICATIONS](state, notifications) {
        state.notifications = [...state.notifications, ...notifications];
    }
};
