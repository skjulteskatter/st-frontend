<template>
    <div class="view-song">
        <div class="search-form">
            <input class="input" id="number-input" type="number" placeholder="Song number" @keydown.enter="getSong()">
            <select class="input" id="language-input" type="text" maxlength="2" placeholder="Language">
                <!-- <option v-for="language in " :value="language" :key="language.id">NO</option> -->
            </select>
            <button type="submit" @click="getSong()">Get song</button>
        </div>

        <div class="songbooks">
            <Card v-for="songbook in Songbooks" :key="songbook.id" class="songbooks__book">
                <h2 class="songbooks__book__title">{{ songbook.collection }}</h2>
            </Card>
        </div>
        
        <div class="lyrics">
            <h1 class="lyrics__number">{{ lyrics.number }}</h1>
            <h2 class="lyrics__title">{{ lyrics.title }}</h2>
            <div class="lyrics__verse" v-for="verse in lyrics.content" :key="verse.id">
                <span class="lyrics__verse__number">{{ verse.name }}</span>
                <p class="lyrics__verse__line" v-for="line in verse.content" :key="line.id">{{ line }}</p>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import songService from "@/services/songs";
import { Vue } from "vue-class-component";
import Card from '@/components/Card.vue'

export default class ViewSong extends Vue {
    private lyrics: Lyrics = {} as Lyrics;

    async viewLyrics(number: number, language: string) {
        this.lyrics = await songService.HV.getLyrics(number, language, "json");
    }

    getSong() {
        const numberElement = document.getElementById("number-input") as HTMLSelectElement;
        const number = parseInt(numberElement.value);
        const languageElement = document.getElementById("language-input") as HTMLInputElement;
        const language = languageElement.value;

        this.viewLyrics(number, language || "no");
    }

    public get Songbooks(){
        return songService;
    }

    public get Lyrics() {
        return this.lyrics;
    }
}
</script>
<style lang="scss" scoped>
.view-song {
    padding-top: 2em;
}

.input {
    padding: .5em;
}

.lyrics {
    &__verse {
    margin-bottom: 2em;

    &__number {
        font-weight: bold;
    }

    &__line {
        margin: .5em;
    }
}
}
</style>