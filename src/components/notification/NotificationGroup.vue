<template>
    <div class="fixed bottom-0 right-0 p-4 md:p-8 flex flex-col gap-4 items-end">
        <Notification
            v-for="notification in notifications"
            :key="notification.title"
            :title="notification.title"
            :type="notification.type"
            :body="notification.content"
            :timeout="notification.timeout"
            :callback="notification.callback"
            :id="notification.id"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useNotifications } from "@/services/notifications";
import { useStore } from "@/store";
import Notification from "./NotificationItem.vue";

export default defineComponent({
    name: "notification-group",
    components: {
        Notification,
    },
    data: () => ({
        store: useStore(),
    }),
    async mounted() {
        await useNotifications().init();
    },
    computed: {
        notifications() {
            return this.store.getters.notifications.filter(n => {
                const diff = new Date().getTime() - n.dateTime.getTime();
                return diff < 5000;
            });
        },
    },
});
</script>
