<template>
    <div class="flex justify-center">
        <loader :loading="!books" />
        <base-list :items="Books" :nameSelector="(i) => i.title" :clickCallback="(i) => setBook(i)"/>
        <!-- <div class="flex gap-2 flex-wrap">
            <div class="mb-2" v-for="book in Books" :key="book.id">
                <button 
                    @click="setBook(book)"
                    class="text-sm cursor-pointer shadow px-2 py-1 rounded-md hover:ring-2 hover:ring-gray-400 bg-white dark:bg-secondary flex-grow"
                >
                    {{book.title}}
                </button>
            </div>
        </div> -->
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
            const { scriptureId } = this.$route.params as {[key: string]: string | undefined};
            const translation = await scriptures.getCurrentTranslation();
            if (scriptureId && translation) {
                this.books = await scriptures.getBooks(translation.id);
            }
        },
        async setBook(book: Book) {
            await scriptures.setBook(book.number);
            book.view();
        },
    },
});
</script>
