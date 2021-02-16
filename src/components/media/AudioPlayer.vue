<template>
    <div class="audio-player" v-if="audio && audio.directUrl && song">
        <div class="audio-player__info">
            <b class="audio-player__name">{{ audio.name }}</b>
            <small class="audio-player__title">
                <router-link
                    v-if="
                        audio.category == 'probackmusic' || song.type == 'track'
                    "
                    :to="{
                        name: 'contributor',
                        params: {
                            collection: 'PBM',
                            contributor: song.composers[0].id,
                        },
                    }"
                >
                    {{ song.composers[0].name }}
                </router-link>
                <router-link v-else to="">
                    <b class="audio-player__title__number">
                        {{ song.number }}
                    </b>
                    <span>{{ song.getName(languageKey) }}</span>
                </router-link>
            </small>
        </div>
        <div class="audio-player__controls" ref="audioPlayer">
            <audio class="audio-player__player" :src="audio.directUrl"></audio>
        </div>
        <div class="audio-player__close">
            <base-button theme="secondary" :action="closePlayer" icon="error">
                <span style="margin-right: 0.5em">
                    {{ $t("common.close") }}
                </span>
            </base-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseCard, BaseButton } from "@/components";
import Plyr from "plyr";
import { sessionKey, songKey } from "@/store";
import { useStore } from "vuex";

@Options({
    components: {
        BaseCard,
        BaseButton,
    },
})
export default class AudioPlayer extends Vue {
    public store = useStore(songKey);
    public player: Plyr = {} as Plyr;

    public updated() {
        this.player = new Plyr(".audio-player__player", {
            settings: [],
        });

        if (this.audio?.directUrl) {
            this.player.play();
        }
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

    public closePlayer() {
        // this.player.stop();
        this.store.commit("audio", {});
    }
}
</script>

<style lang="scss">
:root {
    // Plyr styling
    --plyr-color-main: var(--st-primary-color);
    --plyr-audio-controls-background: var(--st-background-color);
    --plyr-audio-control-color: var(--st-text-color);
    --plyr-control-spacing: var(--st-spacing);
    --plyr-control-radius: var(--st-border-radius);
    --plyr-range-thumb-background: var(--st-primary-color);
}
.audio-player {
    width: 100%;

    background: var(--st-background-color);
    padding: var(--st-spacing);
    border-top: 1px solid var(--st-border-color);

    animation: appearFromBottom 0.5s;

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--st-spacing);

    &__title {
        & > * {
            text-decoration: none;
            color: var(--st-text-color);
        }

        &__number {
            opacity: 0.5;
            margin-right: calc(var(--st-spacing) * 0.5);
        }
    }

    &__info {
        display: flex;
        flex-direction: column;
    }

    &__controls {
        max-width: 900px;
        width: 100%;
    }

    .plyr__controls {
        padding: 0;
    }
}
</style>