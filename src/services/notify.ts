import { notifications } from "./notifications";

export const notify = (type: "warning" | "error" | "success" | "info", title: string, icon: string, content?: string) => {
    notifications.notify({type, title, icon, content});
};
