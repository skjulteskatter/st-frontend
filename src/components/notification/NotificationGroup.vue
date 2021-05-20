<template>
    <div class="notification-group">
        <notification
            v-for="notification in notifications"
            :key="notification.title"
            :title="notification.title"
            :icon="notification.icon"
            :type="notification.type"
            :body="notification.content"
        />
    </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { Options, Vue } from "vue-class-component";
import Notification from "./Notification.vue";

@Options({
    name: "notification-group",
    components: {
        Notification,
    },
})
export default class NotificationGroup extends Vue {
    private store = useStore();

    public get notifications() {
        return this.store.getters.notifications;
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

    z-index: 99999;
}
</style>
