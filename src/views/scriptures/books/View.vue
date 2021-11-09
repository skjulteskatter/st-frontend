<template>
    <div v-if="book">
        <book-card :book="book"></book-card>
        <div class="mb-2" />
        <router-view/>
    </div>
</template>
<script lang="ts">
import Book from "@/classes/scriptures/book";
import scriptures from "@/services/modules/scriptures";
import { Options, Vue } from "vue-class-component";
import { BookCard } from "@/components/scriptures";

@Options({
    name: "book-view",
    components: {
        BookCard,
    },
})
export default class BookView extends Vue {
    private service = scriptures;

    public book: Book | null = null;

    async mounted() {
        await this.load();
    }

    private async load() {
        const { bookId } = this.$route.params as {[key: string]: string};
        const translation = await this.service.getCurrentTranslation();

        if (translation && bookId) {
            this.book = await this.service.getBook(translation.id, bookId);
        }
    }
}
</script>
