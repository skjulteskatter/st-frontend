<template>
    <div class="loader" v-if="loading"></div>
    <div v-if="!loading && initialized && song" class="song-viewer">
        <div class="song-viewer__content">
            <song-info-card
                :song="song"
                :languageKey="languageKey"
                :verses="lyrics ? Object.keys(lyrics.content).length : 0"
            ></song-info-card>

            <transposed-lyrics-viewer
                v-if="transposed && lyrics"
                :languageKey="languageKey"
                :song="song"
            ></transposed-lyrics-viewer>

            <div class="loader" v-if="loadingLyrics"></div>

            <song-details
                v-if="!transposed && lyrics"
                :languageKey="languageKey"
                :lyrics="lyrics"
                :song="song"
            ></song-details>
        </div>

        <aside class="song-viewer__sidebar">
            <div class="song-viewer__sidebar__buttons">
                <base-button v-if="extended && !transposed" @click="extend">
                    {{ $t("song.advanced") }}
                </base-button>
                <base-button @click="transpose">
                    {{ $t("song.transpose") }}
                </base-button>
                <base-dropdown class="language-dropdown" :label="language">
                    <p
                        class="language-dropdown__item selectable"
                        @click="translateTo(l.key)"
                        v-for="l in languages"
                        :key="l.key"
                    >
                        {{ l.name }}
                    </p>
                </base-dropdown>
            </div>
            <div class="song-viewer__sidebar__content">
                <song-files-card :song="song"></song-files-card>
                <lyrics-settings
                    v-if="isExtended && !transposed"
                    :languageKey="languageKey"
                    :lyrics="lyrics"
                    :song="song"
                ></lyrics-settings>
                <div v-if="transposed">
                    <div>{{ currentTransposition }}</div>
                    <base-button
                        :action="
                            () =>
                                currentTransposition < 11
                                    ? (currentTransposition += 1)
                                    : undefined
                        "
                    >
                        UP
                    </base-button>
                    <base-button
                        :action="
                            () =>
                                currentTransposition > -11
                                    ? (currentTransposition -= 1)
                                    : undefined
                        "
                    >
                        DOWN
                    </base-button>
                    <base-button :action="apply">APPLY</base-button>
                </div>
            </div>
        </aside>
    </div>
</template>
<script lang="ts">
import { SongInfoCard, SongFilesCard } from "@/components/songs";
import { BaseDropdown, ButtonGroup } from "@/components/inputs";

import { Options, Vue } from "vue-class-component";
import {
    LyricsSettings,
    SongDetails,
    TransposedLyricsViewer,
    BaseButton,
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
        ButtonGroup,
    },
})
export default class SongViewer extends Vue {
    public store = useStore(sessionKey);
    public songStore = useStore(songKey);
    public transposed = false;
    public number = 0;
    public currentTransposition = 0;
    public audioPlayer = false;

    public async mounted() {
        this.number = parseInt(this.$route.params.number as string);
        if (!this.songStore.getters.collection) {
            await this.songStore.dispatch(
                "selectCollection",
                this.$route.params.collection
            );
        }
        await this.songStore.dispatch("selectSong", this.number);
        this.songStore.commit("song", this.number);
    }

    public get extended() {
        return this.store.getters.extended;
    }

    public async transpose() {
        this.store.commit("extend", false);
        this.songStore.dispatch("transpose", 0);
        this.transposed = true;
    }

    public async apply() {
        if (this.song) {
            const lyrics = await this.collection?.transposeLyrics(
                this.song.number,
                this.currentTransposition
            );
            this.songStore.commit("transposedLyrics", lyrics);
        }
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
        return this.songStore.getters.lyrics;
    }

    public get loadingLyrics() {
        return this.collection?.loadingLyrics || false;
    }

    public get song(): Song | undefined {
        return this.collection?.songs.find(
            (s) => s.number == parseInt(this.$route.params.number as string)
        );
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get languages() {
        const languages = this.store.state.languages;

        return languages.filter((l) => this.song?.name[l.key]);
    }

    public get language() {
        return this.languages.find(
            (l) => l.key == this.songStore.state.language
        )?.name;
    }

    public get initialized() {
        return this.store.state.initialized;
    }

    public get collection(): Collection | undefined {
        return this.songStore.getters.collection;
    }

    public async translateTo(language: string) {
        if (this.song) {
            await this.collection?.getLyrics(this.song.number, language);
            this.songStore.commit("language", language);
        }
    }
}
</script>

<style lang="scss">
::-webkit-scrollbar {
    display: none;
}

.song-viewer {
    display: flex;
    height: 100%;

    &__content {
        display: flex;
        flex-grow: 1;
        flex-wrap: wrap;
        gap: var(--st-spacing);
        padding: var(--st-spacing);
        overflow-y: auto;
    }

    &__sidebar {
        min-width: 400px;
        max-height: 100vh;
        position: sticky;
        top: 0;
        padding: var(--st-spacing);
        background-color: var(--st-background-color);
        border-left: 1px solid var(--st-border-color);
        animation: slideInFromRight 0.5s;

        overflow-y: auto;

        display: flex;
        flex-direction: column;
        gap: var(--st-spacing);

        &__content {
            display: flex;
            flex-direction: column;
            gap: var(--st-spacing);
            overflow-y: auto;
            flex-grow: 1;
        }

        &__buttons {
            display: flex;
            gap: calc(var(--st-spacing) * 0.5);
        }

        .language-dropdown {
            &__item {
                cursor: pointer;

                &:hover {
                    color: var(--st-primary-color);
                }
            }
        }
    }
}
</style>