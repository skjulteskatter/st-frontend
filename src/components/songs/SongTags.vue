<template>
    <div class="flex gap-2 flex-wrap">
        <span v-for="tag in songTags" :key="tag.id" class="px-3 py-1 rounded-full tracking-wide text-xs bg-black/10 text-gray-600 dark:text-gray-400 dark:bg-white/10 flex gap-1 items-center hover:bg-black/20 dark:hover:bg-white/20">
            <router-link
                :to="{
                    name: 'tag',
                    params: {
                        id: tag.id,
                    },
                }"
            >
                {{ tag.name }}
            </router-link>
            <button aria-label="Remove category" @click="removeFromTag(tag.id)" class="cursor-pointer hover:text-red-800">
                <XIcon class="w-4 h-4" />
            </button>
        </span>
        <BaseDropdown class="flex-grow">
            <template #button>
                <button aria-label="Add category" class="py-1 text-gray-500 text-xs flex items-center gap-2">
                    <PlusIcon class="w-4 h-4" />
                    {{ $t('song_addTag') }}
                </button>
            </template>
            <form @submit.prevent="createTag" class="flex gap-2 max-w-md w-full">
                <BaseInput v-model="tagFilter" type="text" :placeholder="$t('tag')" class="w-full"/>
                <BaseButton type="submit" theme="primary">
                    <template #icon>
                        <PlusIcon class="w-4 h-4" />
                    </template>
                </BaseButton>
            </form>
            <template #footer>
                <div v-if="tags.length">
                    <ul class="flex flex-wrap gap-1">
                        <li 
                            class="px-3 py-1 rounded-full tracking-wide text-xs bg-black/10 text-gray-600 dark:text-gray-400 dark:bg-white/10 flex gap-1 items-center hover:bg-black/20 dark:hover:bg-white/20 cursor-pointer" 
                            v-for="tag in tags" 
                            :key="tag.id" 
                            @click="addToTag(tag.id)"
                        >{{tag.name}}</li>
                    </ul>
                </div>
            </template>
        </BaseDropdown>
    </div>
</template>
<script lang="ts">
import { Song, Tag } from "@/classes";
import { tags } from "@/services/api";
import { appSession } from "@/services/session";
import { useStore } from "@/store";
import { Options, Vue } from "vue-class-component";
import { XIcon, PlusIcon } from "@heroicons/vue/solid";

@Options({
    name: "song-tags",
    props: {
        song: {
            type: Object,
        },
    },
    components: {
        XIcon,
        PlusIcon,
    },
})
export default class SongTags extends Vue {
    private store = useStore();
    private song?: Song;

    public tags: Tag[] = [];
    public songTags: Tag[] = [];

    public mounted() {
        this.loadTags();
    }

    private loadTags() {
        this.tags = appSession.tags.filter(t => !t.songIds.includes(this.Song.id) && (!this.tagFilter || t.name.toLowerCase().includes(this.tagFilter.toLowerCase())));
        this.songTags = this.Song.Tags;
    }

    public tagFilter = "";

    public async createTag() {
        if (this.tagFilter == "" || this.tags.find(t => t.name == this.tagFilter)) {
            return;
        }
        const newTag = await tags.create(this.tagFilter, "#BD9B60", this.Song.id);

        appSession.tags.push(new Tag(newTag));

        this.tagFilter = "";
    }

    public async addToTag(id: string) {
        const tag = this.tags.find(t => t.id === id);

        if (tag) {
            await tag.addSongsToTag([this.Song.id]);
            this.loadTags();
        }
    }

    public async removeFromTag(id: string) {
        const tag = this.Song.Tags.find(t => t.id === id);

        if (tag) {
            await tag.removeSongsFromTag([this.Song.id]);
            this.loadTags();
        }
    }

    public get Song() {
        return this.song as Song;
    }
}
</script>
