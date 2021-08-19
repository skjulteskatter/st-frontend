<template>
    <div class="fixed bottom-0 right-0 p-4 md:p-8 flex flex-col gap-4 items-end">
        <notification
            v-for="notification in notifications"
            :key="notification.title"
            :title="notification.title"
            :icon="notification.icon"
            :type="notification.type"
            :body="notification.content"
            :timeout="notification.timeout"
            :callback="notification.callback"
            :id="notification.id"
        />
    </div>
</template>

<script lang="ts">
import { notifications } from "@/services/notifications";
import { useStore } from "@/store";
import { Options, Vue } from "vue-class-component";
import Notification from "./NotificationItem.vue";

@Options({
    name: "notification-group",
    components: {
        Notification,
    },
})
export default class NotificationGroup extends Vue {
    private store = useStore();

    public async mounted() {
        await notifications.init();
    }

    public get notifications() {
        return this.store.getters.notifications.filter(n => {
            const diff = new Date().getTime() - n.dateTime.getTime();

            return diff < 5000;
        });
    }
}
</script>
