<template>
    <div class="audio-playlist">
        <div
            class="audio-playlist__file"
            v-for="audio in audiofiles"
            :key="audio.id"
            @click="selectAudio(audio)"
        >
            <small class="audio-playlist__file__name">
                {{ audio.name }}
            </small>
            <small class="audio-playlist__file__category">
                {{ audio.category }}
            </small>
        </div>
    </div>
</template>

<script lang="ts">
import { Collection, Song } from "@/classes";
import { sessionKey, songKey } from "@/store";
import { AudioTrack } from "@/store/songs";
import { MediaFile } from "dmb-api";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";

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
    public store = useStore(songKey);
    public sessionStore = useStore(sessionKey);
    public audiofiles: MediaFile[] = [];

    public selectAudio(audio: MediaFile) {
        const track: AudioTrack = {
            file: audio,
            song: this.song,
            collection: this.collection,
        };
        this.store.commit("audio", track);
    }

    public get languageKey() {
        return this.sessionStore.getters.languageKey;
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
    border: 1px solid var(--st-color-border);
    border-radius: var(--st-border-radius);

    &__file {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        width: auto;

        &__category {
            padding: calc(var(--st-spacing) * 0.5);
            opacity: 0.5;
            border-left: 1px solid var(--st-color-border);
        }

        &__name {
            padding: calc(var(--st-spacing) * 0.5);
            transition: all 0.2s;
        }

        &:hover {
            .audio-playlist__file__name {
                color: var(--st-color-primary);
                margin-left: var(--st-border-radius);
            }
        }

        &:not(:last-child) {
            border-bottom: 1px solid var(--st-color-border);
        }
    }
}
</style>
