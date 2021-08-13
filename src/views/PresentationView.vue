<template>
    <div class="presentation-view">

    </div>
</template>
<script lang="ts">
import { viewer } from "@/classes/presentation/viewer";
import { appSession } from "@/services/session";
import { Vue } from "vue-class-component";

export default class PresentationView extends Vue {
    public async mounted() {
        await appSession.init();
        viewer.init();

        console.log(this.lyrics);
        console.log(this.song);
    }

    public get lyrics() {
        return viewer.Lyrics;
    }

    public get song() {
        return viewer.Song;
    }
}
</script>
