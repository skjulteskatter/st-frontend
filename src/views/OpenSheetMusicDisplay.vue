<template>
    <div>
        <button @click="load">LOAD</button>
        <div id="osmd"></div>
    </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { OpenSheetMusicDisplay} from "opensheetmusicdisplay";

export default class OSMD extends Vue {

    public load() {
        const o = new OpenSheetMusicDisplay("osmd");

        o.setOptions({
            backend: "svg",
            drawTitle: true,
        });

        const xhr = new XMLHttpRequest();

        try {
            xhr.open("GET", "https://dmb-cdn.azureedge.net/files/23475b94-103b-588a-aa86-7c51262f2e0a", false);

            xhr.onload = () => {
                console.log(xhr.responseText);

                o.load(xhr.responseText).then(() => {
                    o.render();         

                    
                    
                });
            }

            xhr.send();
        }
        catch {
            console.log("bruh")
        }
    }
}
</script>