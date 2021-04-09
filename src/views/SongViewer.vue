<template>
    <div class="loader" v-if="loading"></div>
    <div v-if="!loading && initialized && song" class="song-viewer">
        <div class="song-viewer__content">
            <div class="song-viewer__header">
                <back-button />
                <div class="song-viewer__header__buttons">
                    <!-- <router-link
                        v-if="sheetMusicUrl"
                        :to="`/sheetmusic/${sheetMusicUrl}?originalKey=${song.originalKey}&transposition=${transposition}`"
                    >
                        <base-button icon="music">
                            {{ $t("common.show") }}
                            {{ $t("song.sheetmusic").toLowerCase() }}
                        </base-button>
                    </router-link> -->
                    <base-button v-if="leadSheet" @click="sheetMusic">{{ $t("song.sheetmusic") }}</base-button>
                    <base-button @click="sidebar = !sidebar" icon="documents">
                        {{ $t(`common.${sidebar ? "close" : "show"}`) }}
                        {{ $t("song.files").toLowerCase() }}
                    </base-button>
                </div>
            </div>
            <song-info-card
                :song="song"
                :languageKey="languageKey"
            ></song-info-card>
            <lyrics-card
                v-if="lyrics"
                :song="song"
                :lyrics="lyrics"
                :collection="collection"
            >
            </lyrics-card>
            <!-- <iframe v-if="sheetMusicUrl && showSheetMusic" :src="`/sheetmusic/${sheetMusicUrl}?originalKey=${song.originalKey}&transposition=${transposition}`" style="width:100%; height:80%">
            </iframe> -->
            <!-- <iframe src="http://localhost:8000" style="width:100%; height:80%"></iframe> -->
            <!-- <open-sheet-music-display
                :url="'https://dmb-cdn.azureedge.net/files/' + sheetMusicUrl"
                :initialTransposition="transposition"
                v-if="sheetMusicUrl"
            >
            </open-sheet-music-display> -->
            <div class="loader" v-if="loadingLyrics"></div>
        </div>

        <aside class="song-viewer__sidebar" v-if="sidebar">
            <div class="song-viewer__sidebar__buttons">
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
import OpenSheetMusicDisplay from "@/components/OSMD.vue";
import { Options, Vue } from "vue-class-component";
import {
    LyricsSettings,
    LyricsCard,
    BaseButton,
    BaseCard,
    BackButton,
} from "@/components";
import { useStore } from "vuex";
import { sessionKey, songKey } from "@/store";
import { Collection, Lyrics } from "@/classes";
// import { osmd } from "@/services/osmd";
import { SheetMusicOptions } from "@/store/songs";

@Options({
    components: {
        LyricsSettings,
        LyricsCard,
        BaseButton,
        SongInfoCard,
        SongFilesCard,
        BaseCard,
        BackButton,
        OpenSheetMusicDisplay,
    },
})
export default class SongViewer extends Vue {
    public store = useStore(sessionKey);
    public songStore = useStore(songKey);
    public number = 0;
    public selectedLanguage = this.languageKey;
    public sidebar = false;

    // public unmounted() {
    //     this.songStore.commit("sheetMusic", {show: false});
    // }

    public async mounted() {
        this.songStore.commit("sheetMusic", {show: false});
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

        while (this.collection?.loading) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        await this.songStore.dispatch("selectSong", this.number);
        this.songStore.commit("song", this.number);
    }

    public sheetMusic() {
        // this.$router.push({name: "songs-sheet-music"});
        // osmd.load(this.songStore.state.sheetMusic);
        const options: SheetMusicOptions = {
            show: true,
            url: this.leadSheet?.directUrl,
            originalKey: this.song?.originalKey,
            transposition: this.transposition,
        };

        localStorage.setItem("sheetmusic_options", JSON.stringify(options));

        window.open("/sheetmusic", "Sheet Music", "resizeable,scrollbars");
    }

    public get leadSheet() {
        return this.song?.sheetMusic?.find((s) => s.category === "leadsheet");
    }


    public get transposition() {
        return this.songStore.state.smTransposition;
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
}
</script>

<style lang="scss">
@import "../style/mixins";

// ::-webkit-scrollbar {
//     display: none;
// }

.song-viewer {
    display: flex;
    height: 100%;

    .sheetmusic {
        width: 100%;
        height: 80%;
        border: none;
    }

    &__header {
        display: flex;
        justify-content: space-between;

        &__buttons {
            display: flex;
            align-items: center;
            gap: var(--st-spacing);
        }
    }

    &__content {
        flex-grow: 1;
        flex-wrap: wrap;
        gap: var(--st-spacing);
        padding: calc(var(--st-spacing) * 2);
        //overflow-y: auto;

        @include breakpoint("medium") {
            padding: var(--st-spacing);
            //overflow-y: scroll;
        }

        & > *:not(:last-child) {
            margin-bottom: var(--st-spacing);
        }
    }

    &__sidebar {
        min-width: 350px;
        max-height: 100vh;
        position: sticky;
        top: 0;
        padding: var(--st-spacing);
        background-color: var(--st-color-background-light);
        border-left: 1px solid var(--st-color-border);
        animation: slideInFromRight 0.5s;

        overflow-y: auto;

        display: flex;
        flex-direction: column;
        gap: var(--st-spacing);

        @include breakpoint("small") {
            border-top: 1px solid var(--st-color-border);
            position: fixed;
            top: auto;
            bottom: 0;
            min-width: 0;
            width: 100%;
            overflow-y: scroll;

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

            @include breakpoint("small") {
                overflow-y: scroll;
            }
        }

        &__buttons {
            display: flex;
            gap: calc(var(--st-spacing) / 2);
        }

        .language-dropdown {
            &__item {
                cursor: pointer;

                &:hover {
                    color: var(--st-color-primary);
                }
            }
        }
    }
}
</style>