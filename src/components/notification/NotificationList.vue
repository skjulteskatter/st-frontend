<template>
	<base-dropdown class="cursor-pointer" origin="right">
		<template #button>
			<icon name="bell" />
		</template>
		<div class="flex justify-between items-center gap-4 mb-2">
			<b>Notifications</b>
			<base-button v-if="notifications.length" theme="tertiary" @click="clearNotifications()">Clear</base-button>
		</div>
		<div class="flex flex-col gap-2 min-w-max overflow-y-auto max-h-80" v-if="notifications.length">
			<notification
				v-for="n in notifications"
				:key="n.id"
				:body="n.content"
				:icon="n.icon"
				:id="n.id"
				:title="n.title"
				:type="n.type"
				:persist="true"
			/>
		</div>
		<p v-else class="bg-gray-100 p-4 text-center text-sm rounded whitespace-nowrap">No notifications</p>
	</base-dropdown>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Notification from "./Notification.vue";
import { BaseDropdown } from "@/components/inputs";
import { notifications } from "@/services/notifications";
import { Icon } from "@/components/icon";
import { useStore } from "vuex";

@Options({
	name: "notification-list",
	components: {
		Notification,
		BaseDropdown,
		Icon,
	},
})
export default class NotificationList extends Vue {
    public store = useStore();

	public get notifications() {
        return this.store.getters.notifications;
    }

    public async clearNotifications() {
        await notifications.clear();
    }
}
</script>

<style>

</style>