<template>
    <div v-if="showSheetMusic">
        <open-sheet-music-display
            :url="url"
            :originalKey="originalKey"
            :initialTransposition="transposition"
            :embed="embed"
            :initialZoom="zoom"
        ></open-sheet-music-display>
    </div>
    <div id="osmd-canvas"></div>
    <div id="pb-canvas"></div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import OpenSheetMusicDisplay from "@/components/OSMD.vue"; 
import { useStore } from "vuex";
import { songKey } from "@/store";
import { osmd } from "@/services/osmd";
import { SheetMusicOptions } from "@/store/songs";

@Options({
    components: {
        OpenSheetMusicDisplay,
    },
})
export default class SheetMusic extends Vue {
    public searchParams = new URLSearchParams(window.location.search);
    public songStore = useStore(songKey);

    public async mounted() {
        const canvas = document.getElementById("osmd-canvas");
        const pbcanvas = document.getElementById("pb-canvas");
        await osmd.init(canvas, pbcanvas);

        const o: SheetMusicOptions = {
            show: true,
            url: this.url,
            originalKey: this.originalKey,
            transposition: this.transposition,
        }

        this.songStore.commit("sheetMusic", o) 
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
}
</script>