<template>
    <div class="loader" v-if="loading"></div>
    <div v-if="!loading && initialized && song" class="song-viewer">
        <div class="song-viewer__content">
            <back-button />
            <song-info-card
                :song="song"
                :languageKey="languageKey"
            ></song-info-card>
            <base-button
                @click="showSheetMusic = !showSheetMusic"
                v-if="sheetMusicUrl"
            >
                {{ $t("song.leadSheet") }}
            </base-button>
            <open-sheet-music-display
                :url="sheetMusicUrl"
                :originalKey="song.originalKey"
                v-if="showSheetMusic"
            >
            </open-sheet-music-display>
            <lyrics-card
                v-if="lyrics"
                :song="song"
                :lyrics="lyrics"
                :collection="collection"
            >
            </lyrics-card>
            <div class="loader" v-if="loadingLyrics"></div>
        </div>

        <aside class="song-viewer__sidebar" v-if="sidebar">
            <div class="song-viewer__sidebar__buttons">
                <base-button @click="sidebar = false">
                    {{ $t("common.close") }}
                </base-button>
                <base-button
                    v-if="extended"
                    @click="extend"
                    class="song-viewer__sidebar__buttons--advanced"
                >
                    {{ $t("song.advanced") }}
                </base-button>
            </div>
            <div class="song-viewer__sidebar__content">
                <song-files-card :song="song"></song-files-card>
                <lyrics-settings
                    v-if="isExtended"
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

import { Options, Vue } from "vue-class-component";
import {
    LyricsSettings,
    LyricsCard,
    BaseButton,
    OpenSheetMusicDisplay,
    BaseCard,
    BackButton,
} from "@/components";
import { useStore } from "vuex";
import { sessionKey, songKey } from "@/store";
import { Collection, Lyrics } from "@/classes";

@Options({
    components: {
        LyricsSettings,
        LyricsCard,
        BaseButton,
        SongInfoCard,
        SongFilesCard,
        OpenSheetMusicDisplay,
        BaseCard,
        BackButton,
    },
})
export default class SongViewer extends Vue {
    public store = useStore(sessionKey);
    public songStore = useStore(songKey);
    public number = 0;
    public selectedLanguage = this.languageKey;
    public sidebar = true;
    public showSheetMusic = false;

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
    }

    public get extended() {
        return this.store.getters.extended;
    }

    public get isExtended() {
        return this.store.state.extend;
    }

    public get loading() {
        return this.songStore.getters.collection?.loading;
    }

    public get loadingLyrics() {
        return this.collection?.loadingLyrics || false;
    }

    public extend() {
        this.store.commit("extend");
    }

    public get lyrics(): Lyrics | undefined {
        return this.songStore.getters.lyrics;
    }

    public get song() {
        return this.collection?.songs.find((s) => s.number == this.number);
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get initialized() {
        return this.store.state.initialized;
    }

    public get collection(): Collection | undefined {
        return this.songStore.getters.collection;
    }

    public get sheetMusicUrl() {
        return this.song?.sheetMusic?.find((s) => s.category === "leadsheet")
            ?.directUrl;
    }
}
</script>

<style lang="scss">
@import "../style/mixins";

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

        @include breakpoint("medium") {
            padding: var(--st-spacing);
        }

        & > *:not(:last-child) {
            margin-bottom: var(--st-spacing);
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

        @include breakpoint("small") {
            border-top: 1px solid var(--st-border-color);
            position: fixed;
            top: auto;
            bottom: 0;
            min-width: 0;
            width: 100%;

            .song-viewer__sidebar__buttons--advanced {
                display: none;
            }
        }

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