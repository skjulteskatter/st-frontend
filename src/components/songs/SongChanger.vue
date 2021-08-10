<template>
	<div class="p-2 flex gap-2 items-center rounded-md border border-gray-300 text-gray-500 dark:border-gray-500 dark:text-gray-300">
		<button @click="$emit('previous')" class="cursor-pointer p-1 rounded">
			<ChevronLeftIcon class="h-5 w-5" :class="{ 'opacity-50': !hasPrevious }" />
		</button>
		<p class="text-sm" v-if="label">{{ label }}</p>
		<button @click="$emit('next')" class="cursor-pointer p-1 rounded">
			<ChevronRightIcon class="h-5 w-5" :class="{ 'opacity-50': !hasNext }" />
		</button>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/vue/solid";

@Options({
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
})
export default class SongChanger extends Vue {
	public label?: string;

	public hasNext?: boolean;
	public hasPrevious?: boolean;
}
</script>
