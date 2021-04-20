import { GetterTree } from "vuex";
import { RootState } from "../..";
import { Notification, State } from "./state";

export type Getters = {
    notifications(state: State): Notification[];
}

export const getters: GetterTree<State, RootState> & Getters = {
    notifications(state) {
        return state.notifications;
    },
};
