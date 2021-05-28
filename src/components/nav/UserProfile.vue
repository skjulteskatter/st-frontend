<template>
    <div class="text-sm flex items-center gap-4 w-full p-4 bg-gray-100" v-if="user">
        <img :src="image" class="rounded-full max-h-12 object-cover flex-shrink-0" />
        <div class="flex-grow overflow-hidden overflow-ellipsis whitespace-nowrap">
            <b class="block">
                {{ user.displayName }}
            </b>
            <small class="text-gray-500">{{ user.email }}</small>
        </div>
        <base-dropdown
            label="N"
            icon="exclamation"
            size="24"
            class="flex-shrink-0 cursor-pointer"
        >
            <base-button @click="clearNotifications()">Clear</base-button>
            <notification 
                v-for="n in notifications"
                :key="n.id"
                :body="n.content"
                :icon="n.icon"
                :id="n.id"
                :title="n.title"
                :persist="true"
            />
        </base-dropdown>
        <Icon
            name="settings"
            size="24"
            @click="$router.push({ name: 'settings' })"
            class="flex-shrink-0 cursor-pointer"
        />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Icon } from "@/components/icon";
import { BaseDropdown } from "@/components/inputs";
import Notification from "@/components/notification/Notification.vue";
import { useStore } from "@/store";
import auth from "@/services/auth";
import { notifications } from "@/services/notifications";

@Options({
    name: "user-profile",
    components: {
        Icon,
        BaseDropdown,
        Notification,
    },
})
export default class UserProfile extends Vue {
    public store = useStore();

    public get user() {
        return this.store.getters.user;
    }

    public get image(): string {
        return auth.image || "/img/portrait-placeholder.png";
    }

    public get notifications() {
        return this.store.getters.notifications;
    }

    public async clearNotifications() {
        await notifications.clear();
    }
}
</script>
