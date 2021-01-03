<template>
    <div class="view-song">
        <input id="number-input" type="number" placeholder="Number">
        <input id="language-input" type="text" maxlength="2" placeholder="Language">
        <br>
        <button @click="getNumber()">GET</button>
        <br>
        {{ lyrics.number }}
        <button @click="toggleChords()">CHORDS</button>
        
        <div id="view-song"></div>
    </div>
</template>
<script lang="ts">
import songService from "@/services/songs";
import { Vue } from "vue-class-component";

export default class ViewSong extends Vue {
    private _lyrics: Lyrics = {} as Lyrics;
    public chords = document.getElementsByClassName('chordpro-chord');
    private hideChords = false;

    async viewLyrics(number: number, language: string) {

        this._lyrics = await songService.HV.getLyrics(number, language, "html");

        const element = document.getElementById("view-song");
        if (element) element.innerHTML = this._lyrics.content;
        this.hideChords = false;
        this.toggleChords();
    }

    toggleChords() {
        this.hideChords = !this.hideChords
        for (let i = 0; i < this.chords.length; i++) {
            (this.chords[i] as HTMLElement).style.display = this.hideChords ? "none" : ""
        }
    }

    getNumber() {
        const numberElement = document.getElementById("number-input") as HTMLInputElement;
        const number = parseInt(numberElement.value);
        const languageElement = document.getElementById("language-input") as HTMLInputElement;
        const language = languageElement.value;

        this.viewLyrics(number, language || "no");
    }

    public get lyrics() {
        return this._lyrics;
    }
}
</script>
<style scoped>
.hidden {
    display: none;
}
</style>