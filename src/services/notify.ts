import { notifications } from "./notifications";

export const notify = (type: any, title: string, icon: string, content?: string) => {
    notifications.notify({type, title, icon, content});
};
