<template>
    <div class="flex flex-col gap-2">
        <button
            class="cursor-pointer p-2 rounded border border-gray-300 hover:border-gray-500 flex gap-2 items-center focus:ring focus:ring-primary focus:outline-none"
            v-for="audio in audiofiles"
            :key="audio.id"
            @click="selectAudio(audio)"
        >
            <icon name="music" size="14" class="text-gray-500" />
            <small>
                {{$t(`types.${audio.category}`) + (audio.languageKey ? ' (' + audio.languageKey + ')' : '')}}
                <!-- <span style="opacity: 0.5">{{ $t(`types.${audio.category}`).toLowerCase() }}</span> -->
            </small>
        </button>
    </div>
</template>

<script lang="ts">
import { Collection, Song } from "@/classes";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { MediaFile } from "dmb-api";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "audio-playlist",
    props: {
        audiofiles: {
            type: Array,
            required: true,
        },
    },
})
export default class AudioPlaylist extends Vue {
    public store = useStore();
    public audiofiles: MediaFile[] = [];

    public selectAudio(audio: MediaFile) {
        const track: AudioTrack = {
            file: audio,
            song: this.song,
            collection: this.collection,
        };
        this.store.commit(SongsMutationTypes.SET_AUDIO, track);
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get song(): Song | undefined {
        return this.store.getters.song;
    }

    public get collection(): Collection | undefined {
        return this.store.getters.collection;
    }
}
</script>
