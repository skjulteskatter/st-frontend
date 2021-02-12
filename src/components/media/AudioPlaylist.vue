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
import { Options, Vue } from "vue-class-component";

@Options({
    props: {
        audiofiles: {
            type: undefined,
            required: true,
        },
    },
})
export default class AudioPlaylist extends Vue {
    public audiofiles = [];

    public selectAudio(audio: object) {
        console.log("Active audio: ", audio);
    }
}
</script>

<style lang="scss">
.audio-playlist {
    border: 1px solid var(--st-border-color);
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
            border-left: 1px solid var(--st-border-color);
        }

        &__name {
            padding: calc(var(--st-spacing) * 0.5);
            transition: all 0.2s;
        }

        &:hover {
            .audio-playlist__file__name {
                color: var(--st-primary-color);
                margin-left: var(--st-border-radius);
            }
        }

        &:not(:last-child) {
            border-bottom: 1px solid var(--st-border-color);
        }
    }
}
</style>