<template>
    <div>
        <!-- <open-sheet-music-display
            :url="url"
            :originalKey="originalKey"
            :initialTransposition="transposition"
            :embed="embed"
            :initialZoom="zoom"
        ></open-sheet-music-display> -->
        <open-sheet-music-display
            v-if="url"
            :options="options"
        ></open-sheet-music-display>
        <div id="osmd-canvas"></div>
        
        <div id="pb-canvas">
            <base-button @click="osmd.toggleControls()">Controls</base-button>
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

    public async created() {
        const c = document.getElementById("osmd-canvas");
        const pbc = document.getElementById("pb-canvas");

        await osmd.init(c, pbc);
        // const o: SheetMusicOptions = {
        //     show: true,
        //     url: this.url,
        //     originalKey: this.originalKey,
        //     transposition: this.transposition,
        // }
        console.log(this.songStore.state.sheetMusic);

        // this.songStore.commit("sheetMusic", o) 
    }

    public get url() {
        return this.songStore.state.sheetMusic.url ?? `https://dmb-cdn.azureedge.net/files/${this.$route.params.id}`;
    }

    public get originalKey() {
        return this.songStore.state.sheetMusic.originalKey ?? this.searchParams.get("originalKey")?.replace("sharp", "#").replace("flat", "b");
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
</style>