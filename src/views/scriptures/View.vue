<template>
    <div v-if="scripture">
        <div>
            <h1 class="text-xl mb-4 font-bold">{{scripture.title.default}}</h1>
            <div class="flex gap-2">
                <div class="py-2 px-3 rounded border border-black/10">
                    <small class="text-sm opacity-50 block">{{$t('common_translation')}}</small>
                    <SelectTranslation
                        v-if="loaded"
                        :filterOnLanguages="filterOnLanguages" 
                        :languages="languages"
                        :translation="translation"
                        :translations="translations"
                        @setTranslation="setTranslation"
                    />
                </div>
                <button @click="selectBook()" v-if="book" class="text-left py-2 px-3 rounded border border-black/10">
                    <small class="text-sm opacity-50">{{$t('common_book')}}</small>
                    <p>{{book.title}}</p>
                </button>
                <button @click="selectChapter()" v-if="chapter" class="text-left py-2 px-3 rounded border border-black/10">
                    <small class="text-sm opacity-50">{{$t('common_chapter')}}</small>
                    <p>{{chapter.number}}</p>
                </button>
            </div>
        </div>
        <div class="scripture-content" v-if="translation">
            <router-view />
        </div>
    </div>
</template>
<script lang="ts">
import { Book, Chapter, Translation } from "@/classes/scriptures";
import Scripture from "@/classes/scriptures/scripture";
import scriptures from "@/services/modules/scriptures";
import { appSession } from "@/services/session";
import { SelectTranslation } from "@/components/scriptures";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
    name: "scripture-view",
    components: {
        SelectTranslation,
    },
    data() {
        return {
            scripture: null as Scripture | null,
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
