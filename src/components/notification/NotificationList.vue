<template>
	<base-dropdown class="cursor-pointer" origin="right">
		<template #button>
			<button class="relative p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white hover:bg-black/5 dark:hover:bg-white/10">
				<span class="sr-only">View notifications</span>
				<BellIcon class="w-6 h-6 opacity-50" />
			</button>
			<span v-if="filteredNotifications.length" class="w-4 h-4 bg-primary rounded-full text-xs text-white flex justify-center items-center absolute -top-1 -right-1">
				{{ filteredNotifications.length }}
			</span>
		</template>
		<template #header>
			<div class="flex justify-between items-center gap-4">
				<b>{{ $t('common_notifications') }}</b>
				<button 
					v-if="filteredNotifications.length"
					@click="clearNotifications()"
					class="text-xs tracking-wide text-red-500 py-1 px-2 rounded-md bg-red-500/10 hover:text-red-700 hover:bg-red-500/20"
				>{{ $t('common_remove') }}</button>
			</div>
		</template>
		<div class="flex flex-col gap-2 min-w-max overflow-y-auto max-h-80 shadow-scroll" v-if="filteredNotifications.length">
			<div
				v-for="n in filteredNotifications"
				:key="n.id"
				class="p-2 rounded-md bg-transparent max-w-sm relative flex gap-2 border border-black/10 dark:border-white/10"
				@click="n.callback?.()"
			>
				<icon v-if="n.icon" :name="n.icon" size="18" :class="{ 'text-green-700': n.type == 'success', 'text-red-700': n.type == 'error' }" />
				<div class="flex-grow text-xs">
					<strong class="block">{{ n.title }} </strong>
					<span v-if="n.content" style="">{{ n.content }}</span>
				</div>
			</div>
		</div>
		<p v-else class="p-4 text-center text-sm rounded-md whitespace-nowrap">{{ $t('notifications_noNotifications') }}</p>
	</base-dropdown>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BellIcon } from "@heroicons/vue/outline";
import { notifications } from "@/services/notifications";
import { useStore } from "@/store";

@Options({
	name: "notification-list",
	components: {
		BellIcon,
	},
})
export default class NotificationList extends Vue {
    private store = useStore();

	public get notifications() {
        return this.store.getters.notifications.sort((a, b) => a.dateTime > b.dateTime ? -1 : 1);
    }

	public get filteredNotifications() {
		return this.notifications.filter(n => n.store);
	}

    public async clearNotifications() {
        await notifications.clear();
    }
}
</script>

<style lang="scss">
@import "../../style/mixins";

.shadow-scroll {
    @include scrollShadow(white);
}

.dark {
    .shadow-scroll {
        @include scrollShadow(#213F47);
    }
}
</style>
