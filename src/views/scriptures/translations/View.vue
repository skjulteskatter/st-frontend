<template>
    <div v-if="translation">
        {{translation.title}}
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
    public books: Book[] | null = null;

    async mounted() {
        await this.load();
    }

    private async load() {
        const id = this.$route.params.id;
        if (id && typeof(id) === "string") {
            this.translation = await this.service.getTranslation(id);
        }
    }
}
</script>
