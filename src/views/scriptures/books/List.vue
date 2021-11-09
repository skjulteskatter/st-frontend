<template>
    <div>
        <loader :loading="!books" />
        <div class="mb-2" v-for="book in Books" :key="book.id">
            <base-button @click="setBook(book)">{{book.title}}</base-button>
        </div>
    </div>
</template>
<script lang="ts">
import Book from "@/classes/scriptures/book";
import scriptures from "@/services/modules/scriptures";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "book-list",
})
export default class BookList extends Vue {
    private service = scriptures;

    private books: Book[] | null = null;

    public get Books() {
        return this.books ?? [];
    }

    async mounted() {
        await this.load();
    }

    private async load() {
        const { scriptureId } = this.$route.params as {[key: string]: string | undefined};
        const translation = await this.service.getCurrentTranslation();
        if (scriptureId && translation) {
            this.books = await this.service.getBooks(translation.id);
        }
    }

    public async setBook(book: Book) {
        await this.service.setBook(book.number);
        book.view();
    }
}
</script>
