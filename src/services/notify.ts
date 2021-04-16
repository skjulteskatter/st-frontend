import { notificationStore } from "@/store";

export const notify = (type: string, title: string, icon: string, content?: string) => {
    notificationStore.dispatch("addNotification", {type, title, icon, content});
};
