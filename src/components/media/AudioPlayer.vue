<template>
    <div
        class="w-full bg-white p-4 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center gap-2 sticky left-0 bottom-0 z-30 dark:bg-secondary dark:border-gray-500" 
        v-if="audio && audio.directUrl && Song"
    >
        <button class="md:hidden absolute top-4 right-2" @click="closePlayer">
            <XIcon class="w-4 h-4" />
        </button>
        <div class="flex flex-col items-center md:items-start">    
            <b>{{ audio.name }}</b>
            <small v-if="audio.category == 'probackmusic' || Song.type == 'track'">
                <router-link
                    class="mr-2"
                    v-for="i in Song.Composers"
                    :key="i.id"
                    :to="{
                        name: 'contributor',
                        params: {
                            collection: 'PBM',
                            contributor: i.id,
                        },
                    }"
                >
                    {{ i.name }}
                </router-link>
            </small>
            <small v-else>
                <router-link class="flex gap-2" v-for="c in Song.collectionIds" :key="c" :to="{name: 'song', params: {collection: c, number: Song?.getNumber(c)}}">
                    <b class="text-gray-500">
                        {{ Song?.getNumber(c) }}
                    </b>
                    <span>{{ Song?.getName() }}</span>
                </router-link>
            </small>
        </div>
        <div class="max-w-2xl w-full" ref="audioPlayer">
            <audio id="audio-player" :src="audio.directUrl"></audio>
        </div>
        <div class="hidden md:block">
            <BaseButton theme="tertiary" @click="closePlayer">
                <template #icon>
                    <XIcon class="w-4 h-4" />
                </template>
                {{ $t("common_close") }}
            </BaseButton>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import Plyr from "plyr";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { appSession } from "@/services/session";
import { XIcon } from "@heroicons/vue/solid";

export default defineComponent({
    name: "audio-player",
    components: {
        XIcon,
    },
    data: () => ({
        store: useStore(),
        player: {} as Plyr,
    }),
    updated() {
        this.player = new Plyr("#audio-player", {
            settings: [],
        });

        if (this.audio?.directUrl) {
            this.player.play();
        }
    },
    computed: {
        audio() {
            return this.store.state.songs.audio?.file;
        },
        Song() {
            return appSession.songs.find(s => s.id == this.audio?.songId) ?? this.store.getters.collection?.songs.find(s => s.id == this.audio?.songId);
        },
        collection(): string | undefined {
            return this.store.getters.collection?.key;
        },
        languageKey() {
            return this.store.getters.languageKey;
        },
    },
    methods: {
        closePlayer() {
            this.store.commit(SongsMutationTypes.SET_AUDIO, undefined);
        },
    },
});
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
