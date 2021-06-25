import { notifications } from "./notifications";

export const notify = (type: "warning" | "error" | "success" | "info", title: string, icon: string, content?: string, timeout?: number, callback?: Function, store = true) => {
    notifications.notify({type, title, icon, content, callback, timeout, store});
};
