<template>
    <div>
        <open-sheet-music-display
            :url="url"
            :originalKey="originalKey"
            :initialTransposition="transposition"
        ></open-sheet-music-display>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { OpenSheetMusicDisplay } from "@/components"; 

@Options({
    components: {
        OpenSheetMusicDisplay,
    }
})
export default class SheetMusic extends Vue {
    public searchParams = new URLSearchParams(window.location.search);

    public get url() {
        return `https://dmb-cdn.azureedge.net/files/${this.$route.params.id}`;
    }

    public get originalKey() {
        return this.searchParams.get("originalKey")?.replace("sharp", "#").replace("flat", "b");
    }

    public get transposition() {
        return parseInt(this.searchParams.get("transposition") ?? "0");
    }
}
</script>