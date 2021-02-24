<template>
    <div>
        <button @click="load">LOAD</button>
        <div id="osmd"></div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
// import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
// import zip from "jszip";
// import http from "http";

@Options({
    props: {
        url: {
            type: String
        }
    }
})
export default class OSMD extends Vue {
    public url?: string;

    public async load() {
        // if (!this.url) return;

        // const req = http.get(this.url, (res) =>{
        //     if (res.statusCode !== 200) {
        //         console.log(res.statusCode);
        //         // handle error
        //         return;
        //     }
        //     const data: Buffer[] = [];
        //     let dataLen = 0;

        //     // don't set the encoding, it will break everything !
        //     // or, if you must, set it to null. In that case the chunk will be a string.

        //     res.on("data", function (chunk: Buffer) {
        //         data.push(chunk);
        //         dataLen += chunk.length;
        //     });

        //     res.on("end", function () {
        //         const buf = Buffer.concat(data);

        //         console.log(buf.toString());
        //         const o = new OpenSheetMusicDisplay("osmd");

        //         o.setOptions({
        //             backend: "svg",
        //             drawTitle: true,
        //         });

        //         o.load(buf.toString()).then(() => {
        //             o.render();
        //         });
                    
                    
        //         // });

        //         // // here we go !
        //         // zip.loadAsync(buf).then(function (z) {
        //         //     const fileName = Object.keys(z.files).find(f => !f.startsWith("META")) ?? '';
        //         //     return z.file(fileName)?.async("string") ?? '';
        //         // }).then(function (text) {

        //         //     const o = new OpenSheetMusicDisplay("osmd");

        //         //     o.setOptions({
        //         //         backend: "svg",
        //         //         drawTitle: true,
        //         //     });

        //         //     o.load(text).then(() => {
        //         //         o.render();         

                        
                        
        //         //     });

        //         //     console.log(text);
        //         // });
        //     });
        // });

        // req.on("error", function(err) {
        // // handle error
        // });
    }
}
</script>