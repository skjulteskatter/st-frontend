<template>
    <div>
        <open-sheet-music-display
            :url="url"
            :originalKey="originalKey"
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
    public get url() {
        return `https://dmb-cdn.azureedge.net/files/${this.$route.params.id}`;
    }

    public get originalKey() {
        return (new URLSearchParams(window.location.search)).get("originalKey")?.replace("sharp", "#").replace("flat", "b");
    }
}
</script>