<template>
    <div v-if="initialized && song">
        <div class="loader" v-if="loading"></div>
        <div v-if="!loading" class="song-viewer">
            <div class="song-viewer__content">
                <base-button v-if="extended && !transposed" @click="extend"
                    >Advanced</base-button
                >
                <base-button @click="transpose">Transpose</base-button>

                <song-info-card
                    :song="song"
                    :languageKey="languageKey"
                    :verses="lyrics ? Object.keys(lyrics.content).length : 0"
                ></song-info-card>

                <song-files-card :song="song"></song-files-card>

                <lyrics-settings
                    v-if="isExtended && !transposed"
                    :languageKey="languageKey"
                    :lyrics="lyrics"
                    :song="song"
                ></lyrics-settings>

                <transposed-lyrics-viewer
                    v-if="transposed"
                    :languageKey="languageKey"
                    :song="song"
                ></transposed-lyrics-viewer>

                <song-details
                    v-if="!isExtended && !transposed"
                    :languageKey="languageKey"
                    :lyrics="lyrics"
                    :song="song"
                ></song-details>
            </div>

            <aside class="song-viewer__sidebar">
                <div class="song-details__buttons">
                    <base-dropdown label="Språk">
                        <base-button
                            :action="() => translateTo(l.key)"
                            v-for="l in languages"
                            :key="l.key"
                        >
                            {{ l.name }}
                        </base-button>
                    </base-dropdown>
                </div>
            </aside>
        </div>
    </div>
</template>
<script lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import { SongInfoCard, SongFilesCard } from "@/components/songs";
import { BaseDropdown } from "@/components/inputs";

import { Options, Vue } from "vue-class-component";
import {
    LyricsSettings,
    SongDetails,
    TransposedLyricsViewer,
} from "@/components";
import { useStore } from "vuex";
import { sessionKey, songKey } from "@/store";
import { Collection, Lyrics, Song } from "@/classes";

@Options({
    components: {
        LyricsSettings,
        SongDetails,
        TransposedLyricsViewer,
        BaseButton,
        SongInfoCard,
        SongFilesCard,
        BaseDropdown,
    },
})
export default class SongViewer extends Vue {
    public store = useStore(sessionKey);
    public songStore = useStore(songKey);
    public transposed = false;

    public async mounted() {
        if (!this.songStore.getters.collection) {
            await this.songStore.dispatch(
                "selectCollection",
                this.$route.params.collection
            );
        }
        await this.songStore.dispatch("selectSong", this.$route.params.number);
    }

    public get extended() {
        return this.store.getters.extended;
    }

    public async transpose() {
        this.store.commit("extend", false);
        this.songStore.dispatch("transpose", 0);
        this.transposed = true;
    }

    public get loading() {
        return this.songStore.getters.collection?.loading;
    }

    public get isExtended() {
        return this.store.state.extend;
    }

    public extend() {
        this.store.commit("extend");
    }

    public get lyrics(): Lyrics | undefined {
        return this.songStore.state.lyrics ?? this.songStore.getters.lyrics;
    }

    public get song(): Song | undefined {
        return this.songStore.getters.song;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get languages() {
        const languages = this.store.state.languages;

        return languages.filter((l) => this.song?.name[l.key]);
    }

    public get initialized() {
        return this.store.state.initialized;
    }

    public get collection(): Collection | undefined {
        return this.songStore.getters.collection;
    }

    public async translateTo(language: string) {
        if (this.song) {
            const lyrics = await this.collection?.getLyrics(
                this.song.number,
                language
            );

            this.songStore.commit("lyrics", lyrics);
        }
    }
}
</script>

<style lang="scss">
.song-viewer {
    display: flex;

    &__content {
        display: flex;
        flex-wrap: wrap;
        gap: var(--st-spacing);
        padding: var(--st-spacing);
        overflow-y: auto;
    }

    &__sidebar {
        height: 100vh;
        position: sticky;
        top: 0;
        padding: var(--st-spacing);
        background-color: var(--st-background-color);
        border-left: 1px solid var(--st-border-color);
    }
}
</style>