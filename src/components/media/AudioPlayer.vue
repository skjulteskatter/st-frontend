<template>
    <div class="audio-player" v-if="activeAudio && activeAudio.id">
        <b>{{ activeAudio.name }}</b>
        <audio
            class="audio-player__player"
            :src="activeAudio.directUrl"
        ></audio>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseCard } from "@/components";
import Plyr from "plyr";
import { songKey } from "@/store";
import { useStore } from "vuex";

@Options({
    components: {
        BaseCard,
    },
})
export default class AudioPlayer extends Vue {
    public updated() {
        new Plyr(".audio-player__player", {
            settings: [],
        }).play();
    }

    public get activeAudio() {
        return useStore(songKey).state.activeAudio;
    }
}
</script>

<style lang="scss">
:root {
    --plyr-color-main: var(--st-primary-color);
    --plyr-audio-controls-background: var(--st-background-color);
    --plyr-audio-control-color: var(--st-text-color);
}
.audio-player {
    width: 100%;
    text-align: center;

    background: var(--st-background-color);
    padding: var(--st-spacing);
    border-top: 1px solid var(--st-border-color);

    animation: appearFromBottom 0.5s;

    .plyr__controls {
        padding: 0;
    }
}
</style>