<template>
    <div class="p-4 md:p-8">
        <BackButton class="mb-4" />
        <header>
            <h1 class="font-bold text-2xl md:text-3xl mb-4">{{ $t('common_tags') }}</h1>
        </header>
        <div class="flex gap-2 flex-wrap mb-4" v-if="Tags.length">
            <span
                class="tracking-wide px-3 py-1 rounded-full bg-black/10 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-black/20 dark:hover:bg-white/20"
                v-for="tag in Tags" 
                :key="tag.id"
            >
                <router-link
                    :to="{name: 'tag', params: {id: tag.id}}"
                >
                    {{tag.name}}
                </router-link>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { appSession } from "@/services/session";
import { Tag } from "@/classes";

export default defineComponent({
    name: "tag-list",
    data: () => ({
        tags: [] as Tag[],
    }),
    computed: {
        Tags() {
            return this.tags;
        },
    },
    async beforeMount() {
        this.tags = appSession.tags;
    },
});
</script>
