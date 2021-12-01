<template>
    <div class="flex justify-center">
        <Loader :loading="loading">
            <BaseList 
                :items="Chapters" 
                :clickCallback="view" 
                :nameSelector="(i) => i.number"
                :previewSelector="(i) => i.preview"
            />
        </Loader>
    </div>
</template>
<script lang="ts">
import Chapter from "@/classes/scriptures/chapter";
import scriptures from "@/services/modules/scriptures";
import { defineComponent } from "@vue/runtime-core";
import BaseList from "@/components/BaseList.vue";

export default defineComponent({
    name: "chapter-list",
    components: {
        BaseList,
    },
    data() {
        return {
            chapters: null as Chapter[] | null,
            loading: false,
        };
    },
    computed: {
        Chapters(): Chapter[] {
            return this.chapters ?? [];
        },
    },
    async mounted() {
        await this.load();
    },
    methods: {
        async load() {
            this.loading = true;
            await scriptures.setChapter(undefined);
            const { bookId } = this.$route.params as {[key: string]: string | undefined};
            const translation = await scriptures.getCurrentTranslation();

            if (translation && bookId) {
                const book = await scriptures.getBook(translation.id, bookId);
                this.chapters = await scriptures.getChapters(book.id);
            }
            this.loading = false;
        },
        async view(chapter: Chapter) {
            await scriptures.setChapter(chapter.number);
            chapter.view();
        },
    },
});
</script>
