<template>
	<div
		v-if="song"
		class="rounded-lg p-4 bg-white shadow-md file-card w-full text-left hover:ring-2 hover:ring-gray-400"
		:title="song.name.default"
	>
		<h1 v-if="collection">{{collection.key}} {{song.getNumber(collection?.id)}}</h1>
		<h3 class="font-semibold">{{ song.name.default }}</h3>
		<button v-for="file in files" @click="callback(file)" :key="file.id" class="w-max cursor-pointer flex gap-2 items-center mt-2 px-2 py-1 rounded-md bg-black/5 uppercase text-xs tracking-wider">
			<component :is="icon(file)" class="w-4 h-4 opacity-50" />
			<span v-if="file.getInstrument()">{{ $t(`instrument_${file.getInstrument()?.identifier}`) }}</span>
			<span v-else-if="file.category">{{ $t(`types_${file.category}`) }}</span>
		</button>
		<!-- TODO: add link to song if .available -->
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { PlayIcon, VolumeUpIcon } from "@heroicons/vue/solid";
import { Collection, MediaFile, Song } from "@/classes";
import { AudioTrack } from "@/store/modules/songs/state";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";

export default defineComponent({
	name: "song-file-card",
	components: {
		PlayIcon,
		VolumeUpIcon,
	},
	props: {
		song: {
			type: Object as PropType<Song>,
			required: true,
		},
		type: {
			type: String,
			default: "audio",
		},
		files: {
			type: Array as PropType<MediaFile[]>,
			required: true,
		},
		collection: {
			type: Object as PropType<Collection>,
		},
		defaultInstrumentId: {
			type: String,
			required: true,
		},
	},
	data: () => ({
		store: useStore(),
	}),
	methods: {
		callback(file?: MediaFile) {
			if (!file) {
				file = this.files.find(f => f.instrumentId === this.defaultInstrumentId) || this.files[0];
			}
			if(file.type === "audio") {
				this.selectAudio(file);
			}
			else if(file.type === "video") {
				this.$emit("selectVideo", file.directUrl);
			}
		},
		icon(file: MediaFile) {
			return file.type === "video" ? "PlayIcon" : "VolumeUpIcon";
		},
		selectAudio(file: MediaFile) {
            const track: AudioTrack = {
                file,
                collection: this.collection,
            };
            this.store.commit(SongsMutationTypes.SET_AUDIO, track);
        },
	},
});
</script>

<style scoped>
.file-card {
	break-inside: avoid;
}
</style>
