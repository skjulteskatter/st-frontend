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
			<div
				v-for="n in notifications"
				:key="n.id"
				class="p-2 rounded-md bg-white shadow-md max-w-sm relative flex gap-4 border border-l-4 dark:text-gray-800"
				:class="{ 'border-green-700': n.type == 'success', 'border-red-700': n.type == 'error' }" 
				@click="n.callback?.()"
			>
				<icon v-if="n.icon" :name="n.icon" size="18" />
				<div class="flex-grow text-xs">
					<strong class="block">{{ n.title }} </strong>
					<span v-if="n.content" style="">{{ n.content }}</span>
				</div>
			</div>
		</div>
		<p v-else class="p-4 text-center text-sm rounded-md whitespace-nowrap">{{ $t('notifications.noNotifications') }}</p>
	</base-dropdown>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import NotificationItem from "./NotificationItem.vue";
import { BellIcon } from "@heroicons/vue/outline";
import { notifications } from "@/services/notifications";
import { useStore } from "@/store";

@Options({
	name: "notification-list",
	components: {
		BellIcon,
		NotificationItem,
	},
})
export default class NotificationList extends Vue {
    private store = useStore();

	public get notifications() {
        return this.store.getters.notifications.sort((a, b) => a.dateTime > b.dateTime ? -1 : 1);
    }

    public async clearNotifications() {
        await notifications.clear();
    }
}
</script>
