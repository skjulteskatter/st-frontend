<template>
    <div v-if="initialized && song">
        <div class="loader" v-if="loading"></div>
        <div v-if="!loading" class="song-viewer">
            <div class="song-viewer__content">
                <song-info-card
                    :song="song"
                    :languageKey="languageKey"
                    :verses="lyrics ? Object.keys(lyrics.content).length : 0"
                ></song-info-card>

                <transposed-lyrics-viewer
                    v-if="transposed"
                    :languageKey="languageKey"
                    :song="song"
                ></transposed-lyrics-viewer>

                <song-details
                    v-if="!transposed"
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
                    <base-dropdown
                        class="language-dropdown"
                        :label="$t('common.language')"
                    >
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
                <song-files-card :song="song"></song-files-card>
                <lyrics-settings
                    v-if="isExtended && !transposed"
                    :languageKey="languageKey"
                    :lyrics="lyrics"
                    :song="song"
                ></lyrics-settings>
            </aside>
        </div>
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
        flex-grow: 1;
        flex-wrap: wrap;
        gap: var(--st-spacing);
        padding: var(--st-spacing);
        overflow-y: auto;
    }

    &__sidebar {
        min-width: 400px;
        height: 100vh;
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