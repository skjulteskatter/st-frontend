<template>
	<select multiple class="rounded-md border border-black/20 dark:border-white/20 dark:bg-secondary" v-model="selectedValues" @change="apply">
		<optgroup v-for="type in contentTypes" :key="type" :label="$t(`types_${type}`)">
			<option v-for="value in filterValues[type]" :key="value" :value="value">{{ $t(`types_${value}`) }}</option>
		</optgroup>
	</select>
</template>

<script lang="ts">
import SongFilter from "@/classes/songFilter";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";

@Options({
	name: "song-filter-select",
})
export default class SongFilterSelect extends Vue {
	private store = useStore();

	public contentTypes = ["lyrics", "audio", "video", "sheetmusic"];
	public filterValues: {
		[key: string]: string[];
	} = {
		lyrics: ["lyrics"],
		audio: [
			"gathering",
			"studio",
			"instrumental",
			"live_performance",
			"demo",
			"playback",
		],
		video: ["karaoke"],
		sheetmusic: ["leadsheet", "5part"],
	};
	public selectedValues: string[] = [];

	public apply() {
		const audio = this.selectedValues.filter(v => this.filterValues["audio"].includes(v));
		const video = this.selectedValues.filter(v => this.filterValues["video"].includes(v));
		const sheetMusic = this.selectedValues.filter(v => this.filterValues["sheetmusic"].includes(v));
		const types = this.selectedValues.filter(v => this.contentTypes.includes(v));

		const filter: SongFilter = this.store.state.songs.filter;

		filter.audioFiles = audio;
		filter.videoFiles = video;
		filter.sheetMusicTypes = sheetMusic;
		filter.contentTypes = types;

		this.store.commit(SongsMutationTypes.SET_FILTER, filter);
        this.$emit("apply");
	}
}
</script>
