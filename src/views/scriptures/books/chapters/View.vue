<template>
    <div class="flex justify-center">
        <base-card class="max-w-md" v-if="chapter">
            <template #header>
                {{chapter.number}}
            </template>
            <loader :loading="loading">
                <p class="mb-2" v-for="v in Verses" :key="v.key">
                    <span class="text-lg mr-2">{{v.number}}</span>
                    <span :style="{'text-decoration': selectedWords[v.key]?.[i] ? 'underline' : ''}" @click="selectWord(v.key, i)" v-for="(word, i) in v.content" :key="i" v-html="word + ' '"/>
                </p>
            </loader>
        </base-card>
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

    public loading = false;

    public selectedWords: {
        [verseKey: string]: {
            [index: number]: boolean;
        };
    } = {};

    public chapter: Chapter | null = null;
    private verses: Verse[] | null = null;

    public get Verses() {
        return this.verses?.map(v => {
            return {
                number: v.number,
                key: v.key,
                content: v.content.split(" "),
            };
        }) ?? [];
    }

    async mounted() {
        await this.load();
    }

    private async load() {
        this.loading = true;
        const {bookId, chapterId} = this.$route.params as {[key: string]: string};
        const translation = await this.service.getCurrentTranslation();

        if (translation && bookId && chapterId) {
            this.chapter = await this.service.getChapter(translation.id, bookId, chapterId);
            this.verses = await this.service.getVerses(translation.id, bookId, chapterId);
        }
        this.loading = false;
    }

    public selectWord(verseId: string, wordIndex: number) {
        this.selectedWords[verseId] ??= [];
        this.selectedWords[verseId][wordIndex] = !this.selectedWords[verseId][wordIndex];
    }
}
</script>
