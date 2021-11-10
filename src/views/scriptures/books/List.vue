<template>
    <div>
        <loader :loading="!books" />
        <div class="flex gap-2 flex-wrap">
            <div class="mb-2" v-for="book in Books" :key="book.id">
                <button 
                    @click="setBook(book)"
                    class="text-sm cursor-pointer shadow px-2 py-1 rounded-md hover:ring-2 hover:ring-gray-400 bg-white dark:bg-secondary flex-grow"
                >
                    {{book.title}}
                </button>
            </div>
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
