<template>
    <div class="audio-player" v-if="audio">
        <div class="audio-player__info">
            <b class="audio-player__name">{{ audio.name }}</b>
            <small class="audio-player__title" v-if="song">
                {{ song.getName(languageKey) }}
            </small>
        </div>
        <div class="audio-player__controls">
            <audio class="audio-player__player" :src="audio.directUrl"></audio>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseCard } from "@/components";
import Plyr from "plyr";
import { sessionKey, songKey } from "@/store";
import { useStore } from "vuex";

@Options({
    components: {
        BaseCard,
    },
})
export default class AudioPlayer extends Vue {
    public store = useStore(songKey);
    public updated() {
        new Plyr(".audio-player__player", {
            settings: [],
        }).play();
    }

    public get audio() {
        return this.store.state.audio?.file;
    }

    public get song() {
        return this.store.state.audio?.song;
    }

    public get languageKey() {
        return useStore(sessionKey).getters.languageKey;
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

    background: var(--st-background-color);
    padding: var(--st-spacing);
    border-top: 1px solid var(--st-border-color);

    animation: appearFromBottom 0.5s;

    display: flex;
    justify-content: space-between;
    gap: var(--st-spacing);

    &__info {
        display: flex;
        flex-direction: column;
    }

    &__controls {
        max-width: 1000px;
        width: 100%;
    }

    .plyr__controls {
        padding: 0;
    }
}
</style>