<template>
	<button
		v-if="file"
		class="rounded-lg p-4 bg-white shadow-md file-card w-full text-left hover:ring-2 hover:ring-gray-400"
		@click="callback"
		:title="$t(`types_${file.type}`)"
	>
		<h3 class="font-semibold">{{ song?.getName() }}</h3>
		<span class="w-max flex gap-2 items-center mt-2 px-2 py-1 rounded-md bg-black/5 uppercase text-xs tracking-wider">
			<component :is="icon" class="w-4 h-4 opacity-50" />
			<span v-if="file.category">{{ $t(`types_${file.category}`) }}</span>
		</span>
		<!-- TODO: add link to song if .available -->
	</button>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { IMediaFile } from "songtreasures";
import { PlayIcon, VolumeUpIcon } from "@heroicons/vue/solid";
import { Collection } from "@/classes";
import { AudioTrack } from "@/store/modules/songs/state";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { appSession } from "@/services/session";

export default defineComponent({
	name: "file-card",
	components: {
		PlayIcon,
		VolumeUpIcon,
	},
	props: {
		file: {
			type: Object as PropType<IMediaFile>,
			required: true,
		},
		collection: {
			type: Object as PropType<Collection>,
		},
	},
	data: () => ({
		store: useStore(),
	}),
	computed: {
		icon() {
			return this.file.type == "video" ? "PlayIcon" : "VolumeUpIcon";
		},
		song() {
			return appSession.songs.find(s => s.id == this.file.songId);
		},
	},
	methods: {
		async callback() {
			if(this.file.type == "audio") {
				this.selectAudio();
			}
			else if(this.file.type == "video") {
				this.selectVideo();
			}
		},
		selectAudio() {
            const track: AudioTrack = {
                file: this.file,
                collection: this.collection,
            };
            this.store.commit(SongsMutationTypes.SET_AUDIO, track);
        },
		selectVideo() {
			this.$emit("selectVideo", this.file.directUrl);
		},
	},
});
</script>

<style scoped>
.file-card {
	break-inside: avoid;
}
</style>
