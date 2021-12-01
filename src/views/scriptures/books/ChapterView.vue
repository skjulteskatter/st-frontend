<template>
    <div class="flex justify-center">
        <Loader :loading="loading">
            <BaseCard class="max-w-md" v-if="chapter">
                <template #header>
                    {{chapter.number}}
                </template>
                <p class="mb-2" v-for="v in Verses" :key="v.key">
                    <span class="text-lg mr-2">{{v.number}}</span>
                    <span :style="{'text-decoration': selectedWords[v.key]?.[i] ? 'underline' : ''}" @click="selectWord(v.key, i)" v-for="(word, i) in v.content" :key="i" v-html="word + ' '"/>
                </p>
            </BaseCard>
        </Loader>
    </div>
</template>
<script lang="ts">
import Chapter from "@/classes/scriptures/chapter";
import Verse from "@/classes/scriptures/verse";
import scriptures from "@/services/modules/scriptures";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
    name: "chapter-view",
    data() {
        return {
            loading: false,
            chapter: null as Chapter | null,
            verses: null as Verse[] | null,
            selectedWords: {} as {
                [verseKey: string]: {
                    [index: number]: boolean;
                };
            },
        };
    },
    async mounted(){
        await this.load();
    },
    computed: {
        Verses() {
            return ((this as unknown as {verses?: Verse[]}).verses)?.map(v => {
                return {
                    number: v.number,
                    key: v.key,
                    content: v.content.split(" "),
                };
            }) ?? [];
        },
    },
    methods: {
        async load() {
            this.loading = true;
            const {bookId, chapterId} = this.$route.params as {[key: string]: string};
            const translation = await scriptures.getCurrentTranslation();

            if (translation && bookId && chapterId) {
                const book = await scriptures.getBook(translation.id, bookId);

                this.chapter = await scriptures.getChapter(book.id, chapterId);
                this.verses = await scriptures.getVerses(book.id, chapterId);

                if (this.chapter.id !== scriptures.CurrentChapter?.id) {
                    await scriptures.setChapter(this.chapter.number);
                }
            }
            this.loading = false;
        },
        selectWord(verseId: string, wordIndex: number) {
            this.selectedWords[verseId] ??= [];
            this.selectedWords[verseId][wordIndex] = !this.selectedWords[verseId][wordIndex];
        },
    },
});
</script>
