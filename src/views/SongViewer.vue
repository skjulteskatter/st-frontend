<template>
    <div class="loader" v-if="loading"></div>
    <div v-if="!loading && initialized && song" class="song-viewer">
        <div class="song-viewer__content">
            <song-info-card
                :song="song"
                :languageKey="languageKey"
                :verses="lyrics ? Object.keys(lyrics.content).length : 0"
            ></song-info-card>
            <base-card style="top:0" class="song-viewer__settings">
                <base-button @click="transpose">
                    {{ $t("song.transpose") }}
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
            </base-card>

            <transposed-lyrics-viewer
                v-if="type === 'transpose' && lyrics"
                :lyrics="transposedLyrics"
                :song="song"
                ref="transposed"
            ></transposed-lyrics-viewer>

            <!-- <open-sheet-music-display v-if="sheetMusicUrl" :url="sheetMusicUrl">
            </open-sheet-music-display> -->

            <div class="loader" v-if="loadingLyrics"></div>

            <song-details
                v-if="type !== 'transpose' && lyrics"
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
                <!-- <base-dropdown class="language-dropdown" :label="language">
                    <p
                        class="language-dropdown__item selectable"
                        @click="translateTo(l.key)"
                        v-for="l in languages"
                        :key="l.key"
                    >
                        {{ l.name }}
                    </p>
                </base-dropdown> -->
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
    public transposed = false;
    public number = 0;
    public currentTransposition = 0;
    public audioPlayer = false;
    public selectedLanguage = this.languageKey;

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
                this.transpose();
            } else {
                this.songStore.commit("view", "default");
            }
        }
    }

    public get extended() {
        return this.store.getters.extended;
    }

    public get transposedLyrics() {
        return this.songStore.state.transposedLyrics;
    }

    public async transpose() {
        if (this.type === "transpose") {
            this.songStore.commit("view", "default");
            this.transposed = false;
        } else {
            console.log(this.languageKey);
            this.store.commit("extend", false);
            const lyrics = await this.collection?.transposeLyrics(
                this.song?.number ?? 0,
                0,
                this.songStore.state.language,
            );
            this.songStore.commit("transposedLyrics", lyrics);
            this.songStore.commit("view", "transpose");
            this.transposed = true;
        }
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

    public get sheetMusicUrl() {
        console.log(this.song?.sheetMusic);

        return this.song?.sheetMusic[0]?.directUrl;
    }

    public async translateTo() {
        if (this.song) {
            await this.collection?.getLyrics(this.song.number, this.selectedLanguage);
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
        display: flex;
        flex-grow: 1;
        flex-wrap: wrap;
        gap: var(--st-spacing);
        padding: calc(var(--st-spacing) * 2);
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

    &__settings {
        display: flex;
        align-items: flex-end;
    }
}
</style>