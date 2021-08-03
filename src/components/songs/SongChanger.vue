<template>
	<div class="p-2 flex gap-2 items-center rounded-md border border-gray-300 text-gray-500 dark:border-gray-500 dark:text-gray-300">
		<icon :style="hasPrevious ? '' : 'opacity: 0.2'" name="arrowLeft" @click="$emit('previous')" class="cursor-pointer p-1 rounded fill-current" />
		<p v-if="label">{{ label }}</p>
		<icon :style="hasNext ? '' : 'opacity: 0.2'" name="arrowRight" @click="$emit('next')" class="cursor-pointer p-1 rounded fill-current" />
	</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

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
	emits: ["next", "previous"],
})
export default class SongChanger extends Vue {
	public label?: string;

	public hasNext?: boolean;
	public hasPrevious?: boolean;
}
</script>
