<template>
	<BaseDropdown class="cursor-pointer" origin="right">
		<template #button>
			<button :title="$t('common_notifications')" class="relative p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:ring-white hover:bg-black/5 dark:hover:bg-white/10">
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
					class="text-xs tracking-wide text-red-700 py-1 px-2 rounded-md bg-red-500/10 hover:bg-red-500/20 dark:text-red-400"
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
				<Icon v-if="n.icon" :name="n.icon" size="18" :class="{ 'text-green-700': n.type == 'success', 'text-red-700 dark:text-red-400': n.type == 'error' }" />
				<div class="flex-grow text-xs">
					<strong class="block">{{ n.title }} </strong>
					<span v-if="n.content" style="">{{ n.content }}</span>
				</div>
			</div>
		</div>
		<p v-else class="p-4 text-center text-sm rounded-md whitespace-nowrap">{{ $t('notifications_noNotifications') }}</p>
	</BaseDropdown>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { BellIcon } from "@heroicons/vue/outline";
import { notifications } from "@/services/notifications";
import { useStore } from "@/store";

export default defineComponent({
	name: "notification-list",
	components: {
		BellIcon,
	},
	data: () => ({
		store: useStore(),
	}),
	computed: {
		notifications() {
			const nots = this.store.getters.notifications;
			return nots.sort((a, b) => a.dateTime > b.dateTime ? -1 : 1);
		},
		filteredNotifications() {
			return this.notifications.filter(n => n.store);
		},
	},
	methods: {
		async clearNotifications() {
			await notifications.clear();
		},
	},
});
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
