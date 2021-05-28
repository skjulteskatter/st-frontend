import { Notification } from "@/services/notifications";

export type State = {
    notifications: Notification[];
}

export const state: State = {
    notifications: [],
};
