<template>
    <div v-if="tag != undefined" class="p-4 md:p-8">
        <back-button class="md:hidden mb-4" />
        <header class="mb-4 flex flex-col md:flex-row md:items-center gap-4">
            <h1 class="font-bold text-2xl md:text-3xl">{{ $t('common.tags') }}</h1>
            <span class="flex-grow flex gap-4 justify-between">
                <p class="text-gray-500 rounded-full border border-gray-500 px-2 w-max">{{ tag.getName(languageKey) }}</p>
                <router-link :to="{ name: 'tags' }" class="text-gray-500 flex gap-2 items-center hover:underline">
                    <icon name="tag" size="20" />
                    <span>{{ $t('playlist.seeall') }} {{ $t('common.tags').toLocaleLowerCase() }}</span>
                </router-link>
            </span>
        </header>
        <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
            <song-list-item-card
                v-for="song in songs"
                :key="song.id"
                :song="song"
                @click="$router.push({
                    name: 'song',
                    params: {
                        collection: song.collectionIds[0],
                        number: song.number
                    }
                })"
            />
        </div>
    </div>
</template>
<script lang="ts">
import { Song } from "@/classes";
import { Tag } from "@/classes/tag";
import { appSession } from "@/services/session";
import { useStore } from "@/store";
import { Options, Vue } from "vue-class-component";
import { SongListItemCard } from "@/components/songs";

@Options({
    name: "tag-view",
    components: {
        SongListItemCard ,
    },
})
export default class TagVue extends Vue {
    private store = useStore();
    public tag?: Tag = undefined;
    public songs: Song[] = [];

    public async beforeMount() {
        this.tag = appSession.tags.find(t => t.id == this.$route.params.id);

        this.songs = appSession.songs.filter(t => t.tagIds.includes(this.tag?.id ?? ""));
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }
}
</script>
