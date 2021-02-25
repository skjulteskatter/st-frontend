<template>
    <div class="loader" v-if="loading"></div>
    <div v-if="!loading && initialized && song" class="song-viewer">
        <div class="song-viewer__content">
            <song-info-card
                :song="song"
                :languageKey="languageKey"
                :verses="lyrics ? Object.keys(lyrics.content).length : 0"
            ></song-info-card>

            <base-card class="song-viewer__lyrics" header>
                <template #header>
                    <!-- <base-button @click="exitTransposition">
                        {{$t("common.close")}}
                    </base-button>
                    <select
                        id="language"
                        name="language"
                        v-model="selectedLanguage"
                        @change="translateTo"
                    >
                        <option
                            v-for="l in languages"
                            :value="l.key"
                            :key="l.key"
                        >
                            {{ l.name }}
                        </option>
                    </select> -->
                    <div class="song-viewer__lyrics__header">
                        <div class="song-viewer__lyrics__header__item">
                            <select
                                v-if="transposed"
                                id="transposition"
                                name="transposition"
                                v-model="selectedTransposition"
                                @change="transpose"
                            >
                                <option
                                    v-for="t in Object.keys(
                                        this.transpositions
                                    )"
                                    :value="this.transpositions[t]"
                                    :key="t"
                                >
                                    {{ t }}
                                </option>
                            </select>
                        </div>
                        <div class="song-viewer__lyrics__header__settings">
                            <base-button @click="transposeToggle" icon="music">
                                {{ $t("song.chords") }}
                            </base-button>
                            <select
                                id="language"
                                name="language"
                                v-model="selectedLanguage"
                                @change="translateTo"
                            >
                                <option
                                    v-for="l in languages"
                                    :value="l.key"
                                    :key="l.key"
                                >
                                    {{ l.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                </template>
                <transposed-lyrics-viewer
                    v-if="type === 'transpose' && lyrics"
                    :lyrics="transposedLyrics"
                    ref="transposed"
                >
                </transposed-lyrics-viewer>
                <song-details
                    v-if="type !== 'transpose' && lyrics"
                    :languageKey="languageKey"
                    :lyrics="lyrics"
                    :song="song"
                >
                </song-details>
            </base-card>

            <div class="transposed-lyrics__header__settings"></div>

            <!-- <open-sheet-music-display v-if="sheetMusicUrl" :url="sheetMusicUrl">
            </open-sheet-music-display> -->

            <div class="loader" v-if="loadingLyrics"></div>
        </div>

        <aside class="song-viewer__sidebar" v-if="sidebar">
            <div class="song-viewer__sidebar__buttons">
                <base-button @click="sidebar = false">
                    {{ $t("common.close") }}
                </base-button>
                <base-button v-if="extended && !transposed" @click="extend">
                    {{ $t("song.advanced") }}
                </base-button>
            </div>
            <div class="song-viewer__sidebar__content">
                <song-files-card :song="song"></song-files-card>
                <lyrics-settings
                    v-if="isExtended && !transposed"
                    :languageKey="languageKey"
                    :lyrics="lyrics"
                    :song="song"
                ></lyrics-settings>
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
    OpenSheetMusicDisplay,
    BaseCard,
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
        OpenSheetMusicDisplay,
        BaseCard,
    },
})
export default class SongViewer extends Vue {
    public store = useStore(sessionKey);
    public songStore = useStore(songKey);
    public number = 0;
    public currentTransposition = 0;
    public audioPlayer = false;
    public selectedLanguage = this.languageKey;
    public sidebar = true;
    public selectedTransposition = this.transposition
        ? this.transpositions[this.transposition]
        : 0;

    public async mounted() {
        this.number = parseInt(this.$route.params.number as string);
        if (
            this.songStore.getters.collection?.key !==
            (this.$route.params.collection as string)
        ) {
            await this.songStore.dispatch(
                "selectCollection",
                this.$route.params.collection
            );
        }
        await this.songStore.dispatch("selectSong", this.number);
        this.songStore.commit("song", this.number);

        if (this.type === "transpose") {
            if (this.song?.hasLyrics) {
                this.transposeView();
            } else {
                this.songStore.commit("view", "default");
            }
        }

        this.selectedLanguage =
            (this.languages.find((l) => l.key == this.languageKey)
                ? this.languageKey
                : this.languages[0]?.key) ?? this.languageKey;
    }

    public get extended() {
        return this.store.getters.extended;
    }

    public get transposedLyrics() {
        return this.songStore.state.transposedLyrics;
    }

    public transposeToggle() {
        if (this.type === "transpose") {
            this.songStore.commit("view", "default");
        } else {
            this.transposeView();
        }
    }

    public get transpositions() {
        return this.transposedLyrics?.transpositions ?? {};
    }

    public get transposition() {
        return (
            this.transposedLyrics?.transposedToKey ??
            this.lyrics?.originalKey ??
            ""
        );
    }

    public get transposed() {
        return this.type === "transpose";
    }

    public async transpose() {
        if (this.lyrics) {
            const lyrics = await this.collection?.transposeLyrics(
                this.lyrics.number,
                this.selectedTransposition,
                this.languageKey
            );
            this.songStore.commit("transposedLyrics", lyrics);
        }
    }

    public async transposeView() {
        this.store.commit("extend", false);
        const lyrics = await this.collection?.transposeLyrics(
            this.song?.number ?? 0,
            0,
            this.songStore.state.language
        );
        this.songStore.commit("transposedLyrics", lyrics);
        this.songStore.commit("view", "transpose");
    }

    public get type() {
        return this.songStore.state.view;
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
        return this.collection?.songs.find((s) => s.number == this.number);
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

    public get sheetMusicUrl() {
        return this.song?.sheetMusic[0]?.directUrl;
    }

    public async translateTo() {
        if (this.song) {
            await this.collection?.getLyrics(
                this.song.number,
                this.selectedLanguage
            );
            this.songStore.commit("language", this.selectedLanguage);
            if (this.type === "transpose") {
                (this.$refs.transposed as TransposedLyricsViewer).transpose();
            }
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
        flex-grow: 1;
        flex-wrap: wrap;
        gap: var(--st-spacing);
        padding: calc(var(--st-spacing) * 2);
        overflow-y: auto;

        & > *:not(:last-child) {
            margin-bottom: var(--st-spacing);
        }
    }

    &__lyrics {
        width: 100%;

        &__header {
            width: 100%;
            display: flex;
            gap: calc(var(--st-spacing) / 2);

            &__label {
                display: block;
                opacity: 0.5;
                margin-bottom: 0.2em;
            }

            &__settings {
                width: 100%;
                display: flex;
                justify-content: flex-end;
                gap: calc(var(--st-spacing) / 2);
            }
        }
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
            gap: calc(var(--st-spacing) / 2);
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