<template>
    <div class="loader" v-if="osmd.loading"></div>
    <div :style="osmd.loading ? 'opacity: 0' : ''">
        <!-- <open-sheet-music-display
            :url="url"
            :originalKey="originalKey"
            :initialTransposition="transposition"
            :embed="embed"
            :initialZoom="zoom"
        ></open-sheet-music-display> -->
        <base-button class="pbcontrol-toggle" style="position:fixed;" @click="osmd.toggleControls()">Controls</base-button>
        <open-sheet-music-display
            v-if="url && ['sheet-music', 'songs-sheet-music'].includes(routeName)"
            :options="options"
        ></open-sheet-music-display>
        <div class="sheetmusic-footer">
            <div id="osmd-canvas"></div>
            
            <div id="pb-canvas">
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import OpenSheetMusicDisplay from "@/components/OSMD.vue"; 
import { BaseButton } from "@/components";
import { useStore } from "vuex";
import { songKey } from "@/store";
import { osmd } from "@/services/osmd";
import { SheetMusicOptions } from "@/store/songs";
// import { SheetMusicOptions } from "@/store/songs";

@Options({
    components: {
        OpenSheetMusicDisplay,
        BaseButton
    },
    name: "SheetMusic"
})
export default class SheetMusic extends Vue {
    public searchParams = new URLSearchParams(window.location.search);
    public songStore = useStore(songKey);
    public osmd = osmd;

    public created() {
        const o = localStorage.getItem("sheetmusic_options");

        if (o && this.$route.params.id?.length < 10) {
            const options = JSON.parse(o) as SheetMusicOptions;
            if (!this.songStore.state.sheetMusic.url) {
                this.songStore.commit("sheetMusic", options);
            }
        }
    }

    public async mounted() {
        const c = document.getElementById("osmd-canvas");
        const pbc = document.getElementById("pb-canvas");

        await osmd.init(c, pbc);
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
        return this.$route.name?.toString() ?? '';
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

    public get options(): SheetMusicOptions {
        return {
            show: this.showSheetMusic,
            url: this.url,
            originalKey: this.originalKey,
            transposition: this.transposition,
        }
    }
}
</script>
<style lang="scss">
#pb-canvas .control-panel {
    background-color: var(--st-color-ui-lm-medium);
    width: 350px;
    left: unset;
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