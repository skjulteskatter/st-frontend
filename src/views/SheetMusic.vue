<template>
    <div class="loader" v-if="osmd.loading"></div>
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
            <div class="sheetmusic-content">
                <base-button
                    v-if="type != pdfType"
                    icon="settings"
                    class="pbcontrol-toggle"
                    style="position: fixed"
                    @click="osmd.toggleControls()"
                    >Controls</base-button
                >
                <open-sheet-music-display
                    v-if="
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
                <div id="pb-canvas"></div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import OpenSheetMusicDisplay from "@/components/OSMD.vue";
import { BaseButton } from "@/components";
import { osmd } from "@/services/osmd";
import { ApiSong } from "dmb-api";
import { SheetMusicTypes, Song } from "@/classes";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
// import { SheetMusicOptions } from "@/store/songs";

@Options({
    components: {
        OpenSheetMusicDisplay,
        BaseButton,
    },
    name: "sheet-music",
})
export default class SheetMusic extends Vue {
    public store = useStore();
    public searchParams = new URLSearchParams(window.location.search);
    public osmd = osmd;
    public pdfType = SheetMusicTypes.PDF;
    public song?: Song;

    public created() {
        const o = localStorage.getItem("sheetmusic_options");

        if (o && !this.$route.params.id) {
            const options = JSON.parse(o) as SheetMusicOptions;
            if (!this.store.state.songs.sheetMusic.url) {
                this.store.commit(
                    SongsMutationTypes.SET_SHEETMUSIC_OPTIONS,
                    options,
                );
            }
        }
    }

    public async mounted() {
        const c = document.getElementById("osmd-canvas");
        const pbc = document.getElementById("pb-canvas");

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
    }

    public get url() {
        return (
            this.store.state.songs.sheetMusic.url ??
            `https://dmb-cdn.azureedge.net/files/${this.$route.params.id}`
        );
    }

    public get originalKey() {
        return (
            this.store.state.songs.sheetMusic.originalKey ??
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
            this.store.state.songs.sheetMusic.transposition ??
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
        return this.store.state.songs.sheetMusic.show;
    }

    public get type() {
        return (
            this.store.state.songs.sheetMusic.type ??
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
    max-width: 1200px;
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

.sheetmusic-wrapper {
    width: 100%;
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
    position: fixed;
    bottom: 10px;

    .reset-button {
        position: relative;

        &:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            background-color: var(--st-color-primary);
            border-radius: var(--st-border-radius);
        }

        &:after {
            content: url("./sheetmusic/reset.svg");
            position: absolute;
            top: 50%;
            left: 50%;
            width: 1.5em;
            height: 1.5em;
            transform: translate(-50%, -50%);
        }
    }

    .playpause-button {
        position: relative;

        &:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            background-color: var(--st-color-primary);
            border-radius: var(--st-border-radius);
        }

        &:after {
            content: url("./sheetmusic/play.svg");
            position: absolute;
            top: 50%;
            left: 50%;
            width: 1.5em;
            height: 1.5em;
            transform: translate(-50%, -50%);
        }
    }
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
