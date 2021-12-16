<template>
	<button
		v-if="file"
		class="rounded-lg p-4 bg-white shadow-md file-card w-full text-left hover:ring-2 hover:ring-gray-400"
		@click="callback"
		:title="$t(`types_${file.type}`)"
	>
		<h1 v-if="collection">{{collection.key}} {{file.getSong().getNumber(collection?.id)}}</h1>
		<h3 class="font-semibold">{{ file.getSong().name.default }}</h3>
		<span class="w-max flex gap-2 items-center mt-2 px-2 py-1 rounded-md bg-black/5 uppercase text-xs tracking-wider">
			<component :is="icon" class="w-4 h-4 opacity-50" />
			<span v-if="file.category">{{ $t(`types_${file.category}`) }}</span>
		</span>
		<!-- TODO: add link to song if .available -->
	</button>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { PlayIcon, VolumeUpIcon } from "@heroicons/vue/solid";
import { Collection, MediaFile } from "@/classes";
import { AudioTrack } from "@/store/modules/songs/state";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";

export default defineComponent({
	name: "file-card",
	components: {
		PlayIcon,
		VolumeUpIcon,
	},
	props: {
		file: {
			type: Object as PropType<MediaFile>,
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
			return this.file.type === "video" ? "PlayIcon" : "VolumeUpIcon";
		},
	},
	methods: {
		callback() {
			if(this.file.type === "audio") {
				this.selectAudio();
			}
			else if(this.file.type === "video") {
				this.$emit("selectVideo", this.file.directUrl);
			}
		},
		selectAudio() {
            const track: AudioTrack = {
                file: this.file,
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
