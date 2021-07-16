<template>
	<div class="p-2 flex gap-2 items-center rounded-md border border-gray-300 text-gray-500 dark:border-gray-500 dark:text-gray-300">
		<icon name="arrowLeft" @click="$emit('previous')" class="cursor-pointer p-1 rounded" />
		<p v-if="label">{{ label }}</p>
		<icon name="arrowRight" @click="$emit('next')" class="cursor-pointer p-1 rounded" />
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
	},
	emits: ["next", "previous"],
})
export default class SongChanger extends Vue {
	public label?: string;
}
</script>
