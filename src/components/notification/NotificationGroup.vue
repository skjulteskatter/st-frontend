<template>
    <div class="fixed bottom-0 right-0 p-4 md:p-8 flex flex-col gap-4 items-end z-20">
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
