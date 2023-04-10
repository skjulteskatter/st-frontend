<template>
    <div v-if="tag != undefined" class="p-4 md:p-8">
        <BackButton class="mb-4" />
        <header class="mb-4 flex flex-col md:flex-row md:items-center gap-4">
            <h1 class="font-bold text-2xl md:text-3xl">{{ $t('common_tags') }}</h1>
            <span class="flex-grow flex gap-4 items-center justify-between">
                <p class="text-gray-500 bg-black/10 dark:bg-white/10 dark:text-gray-400 rounded-full px-3 py-1 text-sm tracking-wide">{{ tag.name }}</p>
                <router-link :to="{ name: 'tags' }" class="px-3 py-1 text-gray-500 dark:text-gray-400 rounded-md flex gap-2 items-center hover:bg-black/10 dark:hover:bg-white/10">
                    <TagIcon class="w-4 h-4" />
                    <span>{{ $t('playlist_seeall') }} {{ $t('common_tags').toLocaleLowerCase() }}</span>
                </router-link>
            </span>
        </header>
        <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
            <SongListItemCard
                v-for="song in songs"
                :key="song.id"
                :song="song"
                @click="$router.push({
                    name: 'song',
                    params: {
                        collection: song.Collections[0].key,
                        number: song.number
                    }
                })"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Song, Tag } from "@/classes";
import { appSession } from "@/services/session";
import { useStore } from "@/store";
import { SongListItemCard } from "@/components/songs";
import { TagIcon } from "@heroicons/vue/solid";

export default defineComponent({
    name: "tag-view",
    components: {
        SongListItemCard,
        TagIcon,
    },
    data: () => ({
        store: useStore(),
        tag: undefined as Tag | undefined,
        songs: [] as Song[],
    }),
    computed: {
        languageKey() {
            return this.store.getters.languageKey;
        },
    },
    async beforeMount() {
        this.tag = appSession.tags.find(t => t.id == this.$route.params.id);
        this.songs = appSession.songs.filter(i => this.tag?.songIds.includes(i.id));
    },
});
</script>
