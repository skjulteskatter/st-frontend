<template>
	<base-dropdown class="cursor-pointer" origin="right">
		<template #button>
			<button class="relative p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white hover:bg-black/5 dark:hover:bg-white/10">
				<span class="sr-only">View notifications</span>
				<BellIcon class="w-6 h-6 opacity-50" />
			</button>
			<span v-if="notifications.length" class="w-4 h-4 bg-primary rounded-full text-xs text-white flex justify-center items-center absolute -top-1 -right-1">
				{{ notifications.length }}
			</span>
		</template>
		<div class="flex justify-between items-center gap-4 mb-4">
			<b>{{ $t('common.notifications') }}</b>
			<button 
				v-if="notifications.length"
				@click="clearNotifications()"
				class="text-sm text-red-700 hover:underline"
			>{{ $t('common.remove') }}</button>
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
		<p v-else class="bg-black bg-opacity-10 p-4 text-center text-sm rounded-md whitespace-nowrap">{{ $t('notifications.noNotifications') }}</p>
	</base-dropdown>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Notification from "./Notification.vue";
import { BellIcon } from "@heroicons/vue/outline";
import { notifications } from "@/services/notifications";
import { useStore } from "@/store";

@Options({
	name: "notification-list",
	components: {
		Notification,
		BellIcon,
	},
})
export default class NotificationList extends Vue {
    public store = useStore();

	public get notifications() {
        return this.store.getters.notifications.sort((a, b) => a.dateTime > b.dateTime ? -1 : 1);
    }

    public async clearNotifications() {
        await notifications.clear();
    }
}
</script>
