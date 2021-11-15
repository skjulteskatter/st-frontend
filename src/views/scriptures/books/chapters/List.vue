<template>
    <div class="flex justify-center">
        <base-list :items="Chapters" :clickCallback="(i) => i.view()" :nameSelector="(i) => i.number"/>
        <!-- <button 
            v-for="i in Chapters" 
            :key="i.id"
            @click="i.view()"
            class="tracking-wide text-sm cursor-pointer shadow px-2 py-1 rounded-md hover:ring-2 hover:ring-gray-400 bg-white dark:bg-secondary flex-grow"
        >
            {{i.number}}
        </button> -->
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
    },
});
</script>
