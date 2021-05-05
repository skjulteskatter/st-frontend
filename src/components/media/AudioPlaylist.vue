<template>
    <div class="audio-playlist">
        <div
            class="audio-playlist__file"
            v-for="audio in audiofiles"
            :key="audio.id"
            @click="selectAudio(audio)"
        >
            <small class="audio-playlist__file__name">
                {{$t(`types.${audio.category}`) + (audio.language ? ' (' + audio.language.key + ')' : '')}}
                <!-- <span style="opacity: 0.5">{{ $t(`types.${audio.category}`).toLowerCase() }}</span> -->
            </small>
        </div>
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

<style lang="scss">
.audio-playlist {
    &__file {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        width: auto;
        border: 1px solid var(--st-color-border);
        border-radius: var(--st-border-radius);

        &__category {
            padding: calc(var(--st-spacing) * 0.5);
            opacity: 0.5;
            border-left: 1px solid var(--st-color-border);
        }

        &__name {
            padding: calc(var(--st-spacing) * 0.5);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        &:hover {
            border-color: var(--st-color-primary);

            .audio-playlist__file__name {
                color: var(--st-color-primary);
            }
        }

        &:not(:last-child) {
            margin-bottom: calc(var(--st-spacing) / 2);
        }
    }
}
</style>
