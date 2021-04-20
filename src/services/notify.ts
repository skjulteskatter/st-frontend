import { useStore } from "@/store";
import { NotificationActionTypes } from "@/store/modules/notifications/action-types";

export const notify = (type: string, title: string, icon: string, content?: string) => {
    useStore().dispatch(NotificationActionTypes.ADD_NOTIFICATION, {type, title, icon, content});
};
