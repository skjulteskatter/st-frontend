<template>
    <div v-if="tag != undefined" class="p-4 md:p-8">
        <back-button />
        <header class="mb-4 flex items-center gap-4">
            <h1 class="font-bold text-2xl md:text-3xl">{{ $t('common.tags') }}</h1>
            <p class="text-gray-500 rounded-full border border-gray-500 px-2 w-max">{{ tag.getName(languageKey) }}</p>
        </header>
        <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
            <song-list-item-card
                v-for="song in songs"
                :key="song.id"
                :song="song"
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
