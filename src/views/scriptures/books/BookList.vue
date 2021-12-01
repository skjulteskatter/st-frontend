<template>
    <div class="flex justify-center">
        <Loader :loading="!books" />
        <BaseList :items="Books" :nameSelector="(i) => i.title" :clickCallback="view"/>
    </div>
</template>
<script lang="ts">
import Book from "@/classes/scriptures/book";
import BaseList from "@/components/BaseList.vue";
import scriptures from "@/services/modules/scriptures";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
    name: "book-list",
    components: {
        BaseList,
    },
    data() {
        return {
            books: null as Book[] | null,
        };
    },
    computed: {
        Books(): Book[] {
            return this.books ?? [];
        },
    },
    async mounted() {
        await this.load();
    },
    methods: {
        async load() {
            await scriptures.setBook(undefined);
            const { scriptureId } = this.$route.params as {[key: string]: string | undefined};
            const translation = await scriptures.getCurrentTranslation();
            if (scriptureId && translation) {
                this.books = await scriptures.getBooks(translation.id);
            }
        },
        async view(book: Book) {
            await scriptures.setBook(book.number);
            book.view();
        },
    },
});
</script>
