<template>
    <div class="notification-group">
        <notification
            v-for="notification in notifications"
            :key="notification.title"
            :title="notification.title"
            :icon="notification.icon"
            :type="notification.type"
        />
    </div>
</template>

<script lang="ts">
import { notificationStore } from "@/store";
import { Options, Vue } from "vue-class-component";
import Notification from "./Notification.vue";

@Options({
    components: {
        Notification,
    },
})
export default class NotificationGroup extends Vue {
    private store = notificationStore;

    public get notifications() {
        return this.store.state.notifications;
    }
}
</script>

<style lang="scss">
.notification-group {
    position: fixed;
    bottom: 0;
    right: 0;
    padding: var(--st-spacing);
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    gap: var(--st-spacing);
}

.notifications-enter-active,
.notifications-leave-active {
    transition: all 0.5s;
}

.notifications-enter-from,
.notifications-leave-to {
    opacity: 0;
    transform: translateY(var(--st-spacing));
}
</style>