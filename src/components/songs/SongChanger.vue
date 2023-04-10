<template>
	<div class="p-1 flex gap-2 items-center rounded-md border border-gray-300 text-gray-500 dark:border-gray-500 dark:text-gray-300">
		<button aria-label="Previous" @click="$emit('previous')" class="cursor-pointer p-1 rounded hover:bg-black/5 dark:hover:bg-white/10">
			<ChevronLeftIcon class="h-5 w-5" :class="{ 'opacity-50 cursor-not-allowed': !hasPrevious }" />
		</button>
		<p class="text-sm" v-if="label">{{ label }}</p>
		<button aria-label="Next" @click="$emit('next')" class="cursor-pointer p-1 rounded hover:bg-black/5 dark:hover:bg-white/10">
			<ChevronRightIcon class="h-5 w-5" :class="{ 'opacity-50 cursor-not-allowed': !hasNext }" />
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/vue/solid";

export default defineComponent({
	name: "song-changer",
	props: {
		label: {
			type: String,
		},
		hasNext: {
			type: Boolean,
		},
		hasPrevious: {
			type: Boolean,
		},
	},
	components: {
		ChevronRightIcon,
		ChevronLeftIcon,
	},
	emits: ["next", "previous"],
});
</script>
