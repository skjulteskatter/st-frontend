import { useNotifications } from "./notifications";

export const notify = (type: "warning" | "error" | "success" | "info", title: string, icon: string, content?: string, timeout?: number, callback?: () => void, store = true) => {
    useNotifications().notify({type, title, icon, content, callback, timeout, store});
};
