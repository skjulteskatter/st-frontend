<template>
    <div class="view-song">
        {{ song.number }}
        <button @click="toggleChords()">CHORDS</button>
        <button @click="newWindow()">WINDOW</button>
        
        <div id="view-song"></div>
    </div>
</template>
<script lang="ts">
import api from "@/services/api";
import { Vue } from "vue-class-component";

export default class ViewSong extends Vue {
    public song: Song = {} as Song;
    public chords = document.getElementsByClassName('chordpro-chord');
    private hideChords = false;

    async mounted() {
        this.song = await api.songs.getSong("HV", 1);

        const element = document.getElementById("view-song");
        if (element) element.innerHTML = this.song.lyrics.content;
        this.toggleChords();
    }

    newWindow() {
        const page = window.open("/#/songview", this.song.lyrics.content);
        console.log(page);
    }

    toggleChords() {
        this.hideChords = !this.hideChords
        for (let i = 0; i < this.chords.length; i++) {
            (this.chords[i] as HTMLElement).style.display = this.hideChords ? "none" : ""
        }
    }
}
</script>
<style scoped>
.hidden {
    display: none;
}
</style>