<template>
    <loader :loading="osmd.loading" />
    <div class="sheetmusic-viewer" :style="osmd.loading ? 'opacity: 0' : ''">
        <div v-if="!embed && song" class="sheetmusic-viewer__info">
            <h2 class="sheetmusic-viewer__info__title">
                {{ song.getName(languageKey) }}
            </h2>
            <p
                v-for="c in song.authors"
                :key="c.id"
                class="sheetmusic-viewer__info__author"
            >
                {{ $t("song.author") }}: {{ c.name }}
            </p>
            <p
                v-for="c in song.composers"
                :key="c.id"
                class="sheetmusic-viewer__info__composer"
            >
                {{ $t("song.composer") }}: {{ c.name }}
            </p>
        </div>

        <div class="sheetmusic-wrapper">
            <!-- <base-button
                v-if="type != pdfType"
                icon="settings"
                class="pbcontrol-toggle"
                style="position: fixed"
                @click="osmd.toggleControls()"
                >Controls</base-button
            > -->
            <open-sheet-music-display
                v-if="
                    loaded &&
                    type != pdfType &&
                    url &&
                    ['sheet-music', 'sheet-music-embed'].includes(routeName)
                "
                :options="options"
            ></open-sheet-music-display>
            <object
                v-if="type == pdfType"
                :data="options.url"
                type="application/pdf"
                width="100%"
                height="100%"
            >
                <p>Couldn't load PDF</p>
            </object>
            <div id="osmd-canvas"></div>
            <!-- <div id="pb-canvas"></div>
            <div class="sheetmusic-controlpanel"
                v-if="type != pdfType"
            >
                <base-button
                    icon="refresh"
                    theme="tertiary"
                    @click="osmd.reset()"
                    >RESET</base-button
                >
                <base-button
                    :icon="osmd.playing ? 'pause' : 'play'"
                    :theme="osmd.playing ? 'error' : 'secondary'"
                    @click="osmd.playing ? osmd.pause() : osmd.play()"
                    >{{ osmd.playing ? "PAUSE" : "PLAY" }}</base-button
                >
            </div> -->
        </div>
    </div>
    <!-- </loader> -->
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { osmd } from "@/services/osmd";
import { ApiSong } from "dmb-api";
import { SheetMusicTypes, Song } from "@/classes";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import OpenSheetMusicDisplay from "@/components/OSMD.vue";
import http from "@/services/http";
import { songs } from "@/services/api";
// import { SheetMusicOptions } from "@/store/songs";

@Options({
    components: {
        OpenSheetMusicDisplay,
    },
    name: "sheet-music",
})
export default class SheetMusic extends Vue {
    public store = useStore();
    public searchParams = new URLSearchParams(window.location.search);
    public osmd = osmd;
    public pdfType = SheetMusicTypes.PDF;
    public song: Song | null = null;

    public loaded = false;

    public async mounted() {
        const c = document.getElementById("osmd-canvas");
        const pbc = document.getElementById("pb-canvas");

        const token = this.searchParams.get("token");

        if (token) {
            http.setToken(token);
            const file = await songs.getFile(this.$route.params.id as string);

            const options: SheetMusicOptions = {
                show: true,
                originalKey: file.song?.originalKey ?? "C",
                url: file.directUrl,
                type: file.type,
                transposition: (this.transposeKey ? parseInt(this.transposeKey) : undefined),
                zoom: this.zoom,
                clef: "treble",
            };
            this.store.commit(SongsMutationTypes.SET_SHEETMUSIC_OPTIONS, options);
        }

        if (this.type != SheetMusicTypes.PDF) {
            await osmd.init(c, pbc);
        }

        const song = localStorage.getItem("song_item");

        if (song) {
            this.song = new Song(JSON.parse(song) as ApiSong);
        }
        // const o: SheetMusicOptions = {
        //     show: true,
        //     url: this.url,
        //     originalKey: this.originalKey,
        //     transposition: this.transposition,
        // }

        // this.songStore.commit("sheetMusic", o)

        this.loaded = true;
    }

    public get sheetMusic() {
        return this.store.state.songs.sheetMusic ?? {} as SheetMusicOptions;
    }

    public get url() {
        return (
            this.sheetMusic.url ??
            `https://dmb-cdn.azureedge.net/files/${this.$route.params.id}`
        );
    }

    public get originalKey() {
        return (
            this.sheetMusic.originalKey ??
            this.searchParams
                .get("originalKey")
                ?.replace("sharp", "#")
                .replace("flat", "b")
        );
    }

    public get routeName() {
        return this.$route.name?.toString() ?? "";
    }

    public get transposeKey() {
        return this.searchParams.get("transposition");
    }

    public get transposition() {
        return (
            this.sheetMusic.transposition ??
            (this.transposeKey ? parseInt(this.transposeKey) : undefined)
        );
    }

    public get embed() {
        const query = this.searchParams.get("embed");

        const embed = ["", "true"].includes(query ?? "false");

        return embed;
    }

    public get zoom() {
        const query = this.searchParams.get("zoom");

        const zoom = query ? parseInt(query) / 100 : undefined;

        return zoom;
    }

    public get showSheetMusic() {
        return this.sheetMusic.show;
    }

    public get type() {
        return (
            this.sheetMusic.type ??
            this.searchParams.get("type")
        );
    }

    public get options(): SheetMusicOptions {
        return {
            show: this.showSheetMusic,
            url: this.url,
            originalKey: this.originalKey,
            transposition: this.transposition,
            type: this.type ?? undefined,
            clef: "treble",
        };
    }

    public get languageKey() {
        return useStore().getters.languageKey;
    }
}
</script>
<style lang="scss">
@import "../style/mixins";

.sheetmusic-viewer {
    height: 100vh;
    max-width: 1600px;
    margin: auto;
    padding: calc(var(--st-spacing) * 2);

    @include breakpoint("medium") {
        padding: var(--st-spacing);
    }

    &__info {
        margin-bottom: var(--st-spacing);

        &__author,
        &__composer {
            color: var(--st-color-primary);
            margin: 0.5em 0;
        }

        &__title {
            margin-top: 0;
            margin-bottom: calc(var(--st-spacing) / 2);
        }
    }
}

#pb-canvas .control-panel {
    background-color: var(--st-color-background-medium);
    border-radius: var(--st-border-radius);
    width: 350px;
    left: unset;
}

.sheetmusic-controlpanel {
    position: fixed;
    bottom: calc(var(--st-spacing) * 2);
    left: 50%;
    transform: translateX(-50%);

    width: 100%;
    display: flex;
    justify-content: center;
    gap: var(--st-spacing);

    @include breakpoint("small") {
        bottom: var(--st-spacing);
    }
}

.sheetmusic-wrapper {
    width: 100%;
    height: 90%;
}

// .sheetmusic-content {
//     max-width: 1200px;
//     margin: auto;
// }

#pb-canvas {
    width: 100%;
    text-align: center;
}

.playback-buttons {
    display: none;
    // position: fixed;
    // bottom: 10px;
    // width: 100%;
    // left: 0;

    // .reset-button {
    //     position: relative;

    //     &:before {
    //         content: "";
    //         position: absolute;
    //         top: 0;
    //         left: 0;
    //         width: 100%;
    //         height: 100%;

    //         background-color: var(--st-color-primary);
    //         border-radius: var(--st-border-radius);
    //     }

    //     &:after {
    //         content: url("./sheetmusic/reset.svg");
    //         position: absolute;
    //         top: 50%;
    //         left: 50%;
    //         width: 1.5em;
    //         height: 1.5em;
    //         transform: translate(-50%, -50%);
    //     }
    // }

    // .playpause-button {
    //     position: relative;

    //     &:before {
    //         content: "";
    //         position: absolute;
    //         top: 0;
    //         left: 0;
    //         width: 100%;
    //         height: 100%;

    //         background-color: var(--st-color-primary);
    //         border-radius: var(--st-border-radius);
    //     }

    //     &:after {
    //         content: url("./sheetmusic/play.svg");
    //         position: absolute;
    //         top: 50%;
    //         left: 50%;
    //         width: 1.5em;
    //         height: 1.5em;
    //         transform: translate(-50%, -50%);
    //     }
    // }
}

.pbcontrol-toggle {
    position: fixed;
    z-index: 50;
    bottom: 10px;

    @include breakpoint("small") {
        .button__content {
            display: none;
        }
    }
}
</style>
