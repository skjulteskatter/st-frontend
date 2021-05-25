import { cache } from "./cache";

export interface Notification {
    id: string;
    type: "warning" | "error" | "success" | "info";
    title: string;
    icon: string;
    content: string;
}

export class Notifications {
    public notifications: {
        [key: string]: Notification;
    } = {};

    private getNotifications() {
        return cache.getAll("notifications");
    }

    private async saveNotification(n: Notification) {
        this.notifications[n.id] = n;
        await cache.set("notifications", n.id, n);
    }
}

// const notifications = new Notifications();

// class NotificationItem implements Notification {
//     public id;
//     public type;
//     public title;
//     public icon;
//     public content;

//     constructor(n: Notification) {
//         this.id = n.id;
//         this.type = n.type;
//         this.title = n.title;
//         this.icon = n.icon;
//         this.content = n.content;
//     }

//     public delete() {
//         delete notifications.notifications[this.id];
//     }
// }
