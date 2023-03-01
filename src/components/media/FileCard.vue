<template>
	<button
		v-if="file"
		class="rounded-lg p-4 bg-white dark:bg-secondary shadow-md file-card w-full text-left hover:ring-2 hover:ring-gray-400"
		@click="callback"
		:title="$t(`types_${file.type}`)"
	>
		<p v-if="collection && file.getSong()" class="opacity-50">{{collection.key}} {{file.getSong()?.getNumber(collection?.id)}}</p>
		<h3 class="font-semibold mb-2">{{ file.getSong()?.name.default ?? file.name }}</h3>
		<BaseButton theme="neutral" size="small">
			<template #icon>
				<component :is="icon" class="w-4 h-4 opacity-50" />
			</template>
			<span v-if="file.category">{{ $t(`types_${file.category}`) }}</span>
		</BaseButton>
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
