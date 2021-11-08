<template>
    <div v-if="translation">
        {{translation.title}}
        
        <router-view />
    </div>
</template>
<script lang="ts">
import Book from "@/classes/scriptures/book";
import Translation from "@/classes/scriptures/translation";
import scriptures from "@/services/modules/scriptures";
import { Vue } from "vue-class-component";

export default class TranslationView extends Vue {
    private service = scriptures;
    public translation: Translation | null = null;
    private books: Book[] | null = null;

    public get Books() {
        return this.books ?? [];
    }

    async mounted() {
        await this.load();
    }

    private async load() {
        const scriptureId = this.$route.params.scriptureId as string | undefined;
        const id = this.$route.params.translationId as string | undefined;
        if (scriptureId && id) {
            this.translation = await this.service.getTranslation(scriptureId, id);
            this.books = await this.service.getBooks(id);
        }
    }
}
</script>
