<template>
    <div class="flex justify-center">
        <BaseList :items="Chapters" :clickCallback="view" :nameSelector="(i) => i.number"/>
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
            const { bookId } = this.$route.params as {[key: string]: string | undefined};
            const translation = await scriptures.getCurrentTranslation();

            if (translation && bookId) {
                this.chapters = await scriptures.getChapters(translation.id, bookId);
            }
        },
        async view(chapter: Chapter) {
            await scriptures.setChapter(chapter.number);
            chapter.view();
        },
    },
});
</script>
