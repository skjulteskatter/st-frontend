<template>
    <div class="audio-player" v-if="audio && audio.directUrl && song">
        <Icon
            class="audio-player__close--mobile"
            name="error"
            @click="closePlayer"
        />
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
            <base-button theme="tertiary" @click="closePlayer" icon="error">
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
import { Icon } from "@/components/icon";
import Plyr from "plyr";
import { sessionKey, songKey } from "@/store";
import { useStore } from "vuex";

@Options({
    name: "audio-player",
    components: {
        BaseCard,
        BaseButton,
        Icon,
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
@import "../../style/mixins";

#songtreasures {
    // Plyr styling
    --plyr-color-main: var(--st-color-primary);
    --plyr-audio-controls-background: var(--st-color-background-light);
    --plyr-audio-control-color: var(--st-color-text);
    --plyr-control-spacing: var(--st-spacing);
    --plyr-control-radius: var(--st-border-radius);
    --plyr-range-thumb-background: var(--st-color-primary);
}
.audio-player {
    width: 100%;

    background: var(--st-color-background-light);
    padding: var(--st-spacing);
    border-top: 1px solid var(--st-color-border);

    animation: appearFromBottom 0.5s;

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--st-spacing);

    position: relative;

    @include breakpoint("medium") {
        flex-direction: column;

        .audio-player__info {
            align-items: center;
        }

        .audio-player__close {
            display: none;

            &--mobile {
                display: block;
                position: absolute;
                top: var(--st-spacing);
                right: var(--st-spacing);
            }
        }
    }

    &__close--mobile {
        display: none;
    }

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

    .plyr__controls,
    .plyr__control {
        padding: 0;
    }
}
</style>
