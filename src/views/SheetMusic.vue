<template>
    <div class="loader" v-if="osmd.loading"></div>
    <div class="sheetmusic-viewer" :style="osmd.loading ? 'opacity: 0' : ''">
        <div v-if="!embed && song">
            <h1>
                {{song.getName(languageKey)}}
            </h1>
            <h3 v-for="c in song.authors" :key="c.id">
                {{c.name}}
            </h3>
            <h3 v-for="c in song.composers" :key="c.id">
                {{c.name}}
            </h3>
        </div>

        <div class="sheetmusic-wrapper">
            <div class="sheetmusic-content">
                <base-button v-if="type != pdfType" class="pbcontrol-toggle" style="position:fixed;" @click="osmd.toggleControls()">Controls</base-button>
                <open-sheet-music-display
                    v-if="type != pdfType && url && ['sheet-music', 'sheet-music-embed'].includes(routeName)"
                    :options="options"
                ></open-sheet-music-display>
                <object v-if="type == pdfType" :data="options.url" type="application/pdf" width="100%" height="100%">
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
import { useStore } from "vuex";
import { sessionKey, songKey } from "@/store";
import { osmd } from "@/services/osmd";
import { SheetMusicOptions, SheetMusicTypes } from "@/store/songs";
import { ApiSong } from "dmb-api";
import { Song } from "@/classes";
// import { SheetMusicOptions } from "@/store/songs";

@Options({
    components: {
        OpenSheetMusicDisplay,
        BaseButton,
    },
    name: "sheet-music",
})
export default class SheetMusic extends Vue {
    public searchParams = new URLSearchParams(window.location.search);
    public songStore = useStore(songKey);
    public osmd = osmd;
    public pdfType = SheetMusicTypes.PDF;
    public song?: Song;

    public created() {
        const o = localStorage.getItem("sheetmusic_options");

        if (o && !this.$route.params.id) {
            const options = JSON.parse(o) as SheetMusicOptions;
            if (!this.songStore.state.sheetMusic.url) {
                this.songStore.commit("sheetMusic", options);
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
        return this.songStore.state.sheetMusic.url ?? `https://dmb-cdn.azureedge.net/files/${this.$route.params.id}`;
    }

    public get originalKey() {
        return this.songStore.state.sheetMusic.originalKey ?? this.searchParams.get("originalKey")?.replace("sharp", "#").replace("flat", "b");
    }

    public get routeName() {
        return this.$route.name?.toString() ?? "";
    }

    public get transposeKey() {
        return this.searchParams.get("transposition");
    }

    public get transposition() {
        return this.songStore.state.sheetMusic.transposition ?? (this.transposeKey ? parseInt(this.transposeKey) : undefined);
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
        return this.songStore.state.sheetMusic.show;
    }

    public get type() {
        return this.songStore.state.sheetMusic.type ?? this.searchParams.get("type");
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
        return useStore(sessionKey).getters.languageKey;
    }
}
</script>
<style lang="scss">
.sheetmusic-viewer {
    height: 100vh;
}

#pb-canvas .control-panel {
    background-color: var(--st-color-ui-lm-medium);
    width: 350px;
    left: unset;
}

.sheetmusic-wrapper {
    width: 100%;
}

.sheetmusic-content {
    max-width: 1200px;
    margin: auto;
}

#pb-canvas {
    width: 100%;
    text-align: center;
}

.playback-buttons {
    position: fixed;
    bottom: 10px;
}

.pbcontrol-toggle {
    position: fixed;
    z-index: 50;
    bottom: 10px;
}
</style>