<template>
    <div>
        <button @click="load">LOAD</button>
        <div id="osmd"></div>
    </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

export default class OSMD extends Vue {

    public load() {
        const o = new OpenSheetMusicDisplay("osmd");

        o.setOptions({
            backend: "svg",
            drawTitle: true,
        });

        o.load("https://dmb-cdn.azureedge.net/files/osmdtest.mxl").then(() => {
            o.render();
        });
    }
}
</script>