<template>
	<select multiple class="rounded-md border border-black/20 dark:border-white/20 dark:bg-secondary" v-model="selectedValues" @change="apply">
		<optgroup v-for="type in contentTypes" :key="type" :label="$t(`types_${type}`)">
			<option v-for="value in filterValues[type]" :key="value" :value="value">{{ $t(`types_${value}`) }}</option>
		</optgroup>
	</select>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import SongFilter from "@/classes/songFilter";

type FilterValues = {
	[key: string]: string[];
}

export default defineComponent({
	name: "song-filter-select",
	data: () => ({
		contentTypes: ["lyrics", "audio", "video", "sheetmusic"],
		selectedValues: [],
		filterValues: {
			lyrics: ["lyrics"],
			audio: [
				"gathering",
				"studio",
				"instrumental",
				"live_performance",
				"demo",
				"playback",
			],
			video: ["karaoke", "tutorial"],
			sheetmusic: ["leadsheet", "5part"],
		} as FilterValues,
	}),
	methods: {
		apply() {
			const audio = this.selectedValues.filter(v => this.filterValues["audio"].includes(v));
			const video = this.selectedValues.filter(v => this.filterValues["video"].includes(v));
			const sheetMusic = this.selectedValues.filter(v => this.filterValues["sheetmusic"].includes(v));
			const types = this.selectedValues.filter(v => this.contentTypes.includes(v));
			const categories = this.selectedValues.filter(v => this.filterValues["category"].includes(v));

			const filter: SongFilter = this.store.state.songs.filter;

			filter.audioFiles = audio;
			filter.videoFiles = video;
			filter.sheetMusicTypes = sheetMusic;
			filter.contentTypes = types;
			filter.categoryIds = categories;

			this.store.commit(SongsMutationTypes.SET_FILTER, filter);
			this.$emit("apply");
		},
	},
});
</script>
