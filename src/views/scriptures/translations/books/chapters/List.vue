<template>
    <div class="flex gap-2 flex-wrap">
        <button 
            v-for="i in Chapters" 
            :key="i.id"
            @click="i.view()"
            class="tracking-wide text-sm cursor-pointer shadow px-2 py-1 rounded-md hover:ring-2 hover:ring-gray-400 bg-white dark:bg-secondary flex-grow"
        >
            {{i.number}}
        </button>
    </div>
</template>
<script lang="ts">
import Chapter from "@/classes/scriptures/chapter";
import scriptures from "@/services/modules/scriptures";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "chapter-list",
})
export default class ChapterList extends Vue {
    private service = scriptures;

    private chapters: Chapter[] | null = null;

    public get Chapters() {
        return this.chapters ?? [];
    }

    async mounted() {
        await this.load();
    }

    private async load() {
        const { scriptureId, translationId, bookId } = this.$route.params as {[key: string]: string | undefined};

        if (scriptureId && translationId && bookId) {
            this.chapters = await this.service.getChapters(translationId, bookId);
        }
    }
}
</script>
