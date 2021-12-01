<template>
    <div v-if="scripture">
        <div>
            <h1 class="text-xl">{{scripture.title.default}}</h1>
            <div class="flex gap-2">
                <SelectTranslation
                    v-if="loaded"
                    :filterOnLanguages="filterOnLanguages" 
                    :languages="languages"
                    :translation="translation"
                    :translations="translations"
                    @setTranslation="setTranslation"
                />
                <BaseButton 
                    class="mb-2"
                    v-if="book"
                    @click="selectBook()"
                >{{book.title}}</BaseButton>
                <BaseButton 
                    class="mb-2"
                    v-if="chapter"
                    @click="selectChapter()"
                >{{chapter.number}}</BaseButton>
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
            const id = this.$route.params.scriptureId as string | undefined;
            if (id) {
                this.scripture = await scriptures.get(id);
                await scriptures.setScripture(this.scripture.id);
                this.translation = await scriptures.getCurrentTranslation();

                this.translations = await scriptures.getTranslations(this.scripture.id);

                this.languages = appSession.languages.filter(l => this.translations?.some(t => t.language === l.key));
                this.filterOnLanguages = this.languages.reduce((a, b) => {
                    a[b.key] = appSession.user.settings.languageKey === b.key;
                    return a;
                }, {} as ILocale<boolean>);
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
