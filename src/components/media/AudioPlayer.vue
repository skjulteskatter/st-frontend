<template>
    <base-card class="audio-player" v-if="currentAudioFile && show">
        <b>{{ currentAudioFile.name }}</b>
        <audio class="audio-player__player">
            <source :src="currentAudioFile.directUrl" />
        </audio>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Song } from "@/classes";
import { BaseCard } from "@/components";
import Plyr from "plyr";
import { songKey } from "@/store";
import { useStore } from "vuex";

@Options({
    components: {
        BaseCard,
    },
    props: {
        song: {
            type: Song,
        },
        show: {
            type: Boolean,
        },
    },
})
export default class AudioPlayer extends Vue {
    public song: Song = {} as Song;
    public show = false;

    public mounted() {
        new Plyr(".audio-player__player");
    }

    public get currentAudioFile() {
        return useStore(songKey).getters.song?.audioFiles[0];
    }
}
</script>

<style lang="scss">
:root {
    --plyr-color-main: var(--st-primary-color);
}
.audio-player {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;

    animation: slideInFromBottom 0.2s;
}
</style>