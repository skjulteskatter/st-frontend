<template>
    <div v-if="scripture">
        <header>
            <h1 class="text-xl mb-4 font-bold">{{scripture.title.default}}</h1>
            <div class="flex gap-2 items-center mb-2 underline">
                <SelectTranslation
                    v-if="loaded"
                    :filterOnLanguages="filterOnLanguages" 
                    :languages="languages"
                    :translation="translation"
                    :translations="translations"
                    @setTranslation="setTranslation"
                />
                <ChevronRightIcon class="w-4 h-4" v-if="book" />
                <button @click="selectBook()" v-if="book" :title="$t('common_book')">
                    {{book.title}}
                </button>
                <ChevronRightIcon class="w-4 h-4" v-if="chapter" />
                <button @click="selectChapter()" v-if="chapter" :title="$t('common_chapter')">
                    {{chapter.number}}
                </button>
            </div>
        </header>
        <template v-if="translation">
            <router-view />
        </template>
    </div>
</template>
<script lang="ts">
import { Book, Chapter, Translation } from "@/classes/scriptures";
import scriptures from "@/services/modules/scriptures";
import { appSession } from "@/services/session";
import { SelectTranslation } from "@/components/scriptures";
import { defineComponent } from "vue";
import { ChevronRightIcon } from "@heroicons/vue/outline";
import { Collection } from "@/classes";
import { ILocale, Language } from "songtreasures";

export default defineComponent({
    name: "scripture-view",
    components: {
        SelectTranslation,
        ChevronRightIcon,
    },
    data() {
        return {
            scripture: null as Collection | null,
            translation: null as Translation | null,
            translations: null as Translation[] | null,
            languages: null as Language[]| null,
            filterOnLanguages: null as ILocale<boolean> | null,
            loaded: false,
            book: null as Book | null,
            chapter: null as Chapter | null,
        };
    },
    async mounted() {
        await this.load();
    },
    methods: {
        async load() {
            const {scriptureId, bookId, chapterId} = this.$route.params as {[key: string]: string | undefined};
            if (scriptureId) {
                this.scripture = await scriptures.get(scriptureId);
                await scriptures.setScripture(this.scripture.id);
                this.translation = await scriptures.getCurrentTranslation();

                this.translations = await scriptures.getTranslations(this.scripture.id);

                this.languages = appSession.languages.filter(l => this.translations?.some(t => t.language === l.key));
                this.filterOnLanguages = this.languages.reduce((a, b) => {
                    a[b.key] = appSession.user.settings.languageKey === b.key;
                    return a;
                }, {} as ILocale<boolean>);

                if (bookId && this.translation) {
                    this.book = await scriptures.getBook(this.translation.id, bookId);
                }
                if (chapterId && this.book) {
                    this.chapter = await scriptures.getChapter(this.book.id, chapterId);
                }

                this.loaded = true;
            }

            scriptures.onBookSelected = (book) => {
                this.book = book;
            };
            scriptures.onChapterSelected = (chapter) => {
                this.chapter = chapter;
            };
        },
        async setTranslation(translation: Translation) {
            this.scripture?.view();
            this.translation = null;
            await scriptures.setTranslation(translation.id);
            translation.view();
            this.translation = translation;
        },
        selectBook() {
            this.book = null;
            this.chapter = null;
            scriptures.CurrentScripture?.view();
        },
        selectChapter() {
            this.chapter = null;
            scriptures.CurrentBook?.view();
        },
    },
});
</script>
