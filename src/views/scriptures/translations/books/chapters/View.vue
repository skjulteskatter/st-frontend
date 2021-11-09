<template>
    <div>
        <h3 class="text-lg">{{ Chapter.title }} {{ Chapter.number }}</h3>
        <span class="mr-2" v-for="i in Verses" :key="i.key">
            <span class="text-xs opacity-50 mr-1">{{i.number}}</span>
            <span v-html="i.content" />
        </span>
    </div>
</template>
<script lang="ts">
import Chapter from "@/classes/scriptures/chapter";
import Verse from "@/classes/scriptures/verse";
import scriptures from "@/services/modules/scriptures";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "chapter-view",
})
export default class ChapterView extends Vue {
    private service = scriptures;

    public chapter: Chapter | null = null;

    private verses: Verse[] | null = null;

    public get Chapter() {
        return this.chapter ?? {} as Chapter;
    }

    public get Verses() {
        return this.verses ?? [];
    }

    public get Html() {
        return this.Verses.map(v => v.content).join(" ");
    }

    async mounted() {
        await this.load();
    }

    private async load() {
        const {translationId, bookId, chapterId} = this.$route.params as {[key: string]: string};

        if (translationId && bookId && chapterId) {
            this.chapter = await this.service.getChapter(translationId, bookId, chapterId);
            this.verses = await this.service.getVerses(translationId, bookId, chapterId);
        }
    }
}
</script>
