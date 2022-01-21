<template>
	<div
		v-if="song"
		class="rounded-lg p-4 bg-white shadow-md file-card w-full text-left"
		:title="song.name.default"
	>
		<p v-if="collection" class="opacity-50 text-sm">{{collection.key}} {{song.getNumber(collection?.id)}}</p>
		<h3 class="font-semibold mb-2">{{ song.name.default }}</h3>
		<div>
			<div class="flex gap-2 flex-wrap" v-if="tutorialFiles.length">
				<BaseButton size="small" theme="neutral" v-for="file in tutorialFiles" @click="callback(file)" :key="file.id">
					<template #icon>
						<component :is="icon(file)" class="w-4 h-4 opacity-50" />
					</template>
					<span v-if="file.getInstrument()">{{ $t(`instrument_${file.getInstrument()?.identifier}`) }}</span>
					<span v-else-if="file.category">{{ $t(`types_${file.category}`) }}<span v-if="file.getLanguage()" class="ml-1">({{file.getLanguage()?.name}})</span></span>
				</BaseButton>
			</div>
			<div v-if="tutorialFiles.length" class="mt-4"></div>
			<div class="flex gap-2 flex-wrap" v-if="karaokeFiles.length">
				<BaseButton size="small" theme="neutral" v-for="file in karaokeFiles" @click="callback(file)" :key="file.id">
					<template #icon>
						<component :is="icon(file)" class="w-4 h-4 opacity-50" />
					</template>
					<span v-if="file.getInstrument()">{{ $t(`instrument_${file.getInstrument()?.identifier}`) }}</span>
					<span v-else-if="file.category">{{ $t(`types_${file.category}`) }}<span v-if="file.getLanguage()" class="ml-1">({{file.getLanguage()?.name}})</span></span>
				</BaseButton>
			</div>
		</div>
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
		language: {
			type: String,
		},
	},
	data: () => ({
		store: useStore(),
	}),
	computed: {
		tutorialFiles() {
			return this.files.filter(i => i.category === "tutorial");
		},
		karaokeFiles() {
			return this.files.filter(i => i.category === "karaoke");
		},
	},
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
