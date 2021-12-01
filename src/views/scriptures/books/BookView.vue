<template>
    <div v-if="book">
        <!-- <BookCard :book="book" />
        <div class="mb-2" /> -->
        <ChapterList />
    </div>
</template>
<script lang="ts">
import Book from "@/classes/scriptures/book";
// import { BookCard } from "@/components/scriptures";
import scriptures from "@/services/modules/scriptures";
import { defineComponent } from "@vue/runtime-core";
import ChapterList from "./ChapterList.vue";

export default defineComponent({
    name: "book-view",
    components: {
        // BookCard,
        ChapterList,
    },
    data() {
        return {
            book: null as Book | null,
        };
    },
    async mounted() {
        await this.load();
    },
    methods: {
        async load() {
            this.book = await scriptures.getCurrentBook();
            if (!this.book) {
                const { bookId } = this.$route.params as {[key: string]: string};
                const translation = await scriptures.getCurrentTranslation();

                if (translation && bookId)
                    this.book = await scriptures.getBook(translation.id, bookId);

                if (this.book) {
                    await scriptures.setBook(this.book.number);
                }
            }
        },
    },
});
</script>
