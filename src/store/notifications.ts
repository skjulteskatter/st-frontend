import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";

export type Notification = {
	id: string;
	type: string;
	title: string;
	content?: string;
	icon?: string;
	hidden: boolean;
}

export interface Notifications {
	notifications: Notification[];
}

export const notificationKey: InjectionKey<Store<Notifications>> = Symbol();

export const notificationStore = createStore<Notifications>({
    state: {
        notifications: [],
    },
    actions: {
        addNotification({ commit }, notification: Notification): void {
            commit("addNotification", notification);
        },
    },
    mutations: {
        addNotification(state, notification: Notification): void {
            state.notifications.push({ ...notification, id: `${Date.now()}` });
        },
    },
});
