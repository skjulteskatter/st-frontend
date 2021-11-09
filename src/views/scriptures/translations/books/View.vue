<template>
    <div v-if="book">
        <router-view/>
    </div>
</template>
<script lang="ts">
import Book from "@/classes/scriptures/book";
import scriptures from "@/services/modules/scriptures";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "book-view",
})
export default class BookView extends Vue {
    private service = scriptures;

    public book: Book | null = null;

    async mounted() {
        await this.load();
    }

    private async load() {
        const { translationId, bookId } = this.$route.params as {[key: string]: string};

        if (translationId && bookId) {
            this.book = await this.service.getBook(translationId, bookId);
        }
    }
}
</script>
