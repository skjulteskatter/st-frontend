<template>
    <div class="w-full bg-white p-4 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center gap-2 sticky left-0 bottom-0" v-if="audio && audio.directUrl && song">
        <Icon
            class="md:hidden absolute top-4 right-2"
            name="error"
            @click="closePlayer"
        />
        <div class="flex flex-col items-center md:items-start">    
            <b>{{ audio.name }}</b>
            <small class="">
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
                <router-link class="flex gap-2" v-else :to="{name: 'song', params: {collection: collection, number: song.number}}">
                    <b class="text-gray-500">
                        {{ song.number }}
                    </b>
                    <span>{{ song.getName(languageKey) }}</span>
                </router-link>
            </small>
        </div>
        <div class="max-w-2xl w-full" ref="audioPlayer">
            <audio id="audio-player" :src="audio.directUrl"></audio>
        </div>
        <div class="hidden md:block">
            <base-button theme="tertiary" @click="closePlayer" icon="error">
                <span>
                    {{ $t("common.close") }}
                </span>
            </base-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseCard } from "@/components";
import { Icon } from "@/components/icon";
import Plyr from "plyr";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { Collection } from "@/classes";

@Options({
    name: "audio-player",
    components: {
        BaseCard,
        Icon,
    },
})
export default class AudioPlayer extends Vue {
    public store = useStore();
    public player: Plyr = {} as Plyr;

    public updated() {
        this.player = new Plyr("#audio-player", {
            settings: [],
        });

        if (this.audio?.directUrl) {
            this.player.play();
        }
    }

    public get audio() {
        return this.store.state.songs.audio?.file;
    }

    public get song() {
        return this.store.state.songs.audio?.song;
    }

    public get collection(): string | undefined {
        return this.store.getters.collection?.key;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public closePlayer() {
        // this.player.stop();
        this.store.commit(SongsMutationTypes.SET_AUDIO, undefined);
    }
}
</script>

<style lang="scss">
#app {
    // Plyr styling
    --plyr-color-main: var(--st-color-primary);
    --plyr-audio-controls-background: var(--st-color-background-light);
    --plyr-audio-control-color: var(--st-color-text);
    --plyr-control-spacing: var(--st-spacing);
    --plyr-control-radius: var(--st-border-radius);
    --plyr-range-thumb-background: var(--st-color-primary);
}

.plyr__controls,
.plyr__control {
    padding: calc(var(--st-spacing)/2) !important;
}
</style>
