<template>
    <div v-if="book">
        <book-card :book="book"></book-card>
        <div class="mb-2" />
        <router-view/>
    </div>
</template>
<script lang="ts">
import Book from "@/classes/scriptures/book";
import { BookCard } from "@/components/scriptures";
import scriptures from "@/services/modules/scriptures";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
    name: "book-view",
    components: {
        BookCard,
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
                    scriptures.setBook(this.book.number);
                }
            }
        },
    },
});
</script>
