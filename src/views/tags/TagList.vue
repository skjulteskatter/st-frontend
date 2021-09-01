<template>
    <div class="p-4 md:p-8">
        <back-button class="mb-4" />
        <header>
            <h1 class="font-bold text-2xl md:text-3xl mb-4">{{ $t('common.tags') }}</h1>
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
import { appSession } from "@/services/session";
import { Options, Vue } from "vue-class-component";
import { Tag } from "@/classes/tag";
import { useStore } from "@/store";

@Options({
    name: "tag-list",
})
export default class TagList extends Vue {
    private store = useStore();
    private tags: Tag[] = [];

    public async beforeMount() {
        this.tags = appSession.tags;
    }

    public get Tags() {
        return this.tags;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }
}
</script>
