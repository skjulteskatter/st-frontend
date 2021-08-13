<template>
    <div class="flex gap-2 flex-wrap">
        <span v-for="tag in Song.tags" :key="tag.id" class="px-2 rounded-full text-sm text-gray-500 border-gray-500 border flex gap-1 items-center">
            <router-link
                :to="{
                    name: 'tag',
                    params: {
                        id: tag.id,
                    },
                }"
            >
                {{ tag.getName() }}
            </router-link>
            <button aria-label="Remove category" v-if="tag.userDefined" @click="removeFromTag(tag.id)" class="cursor-pointer hover:text-red-800">
                <XIcon class="w-4 h-4" />
            </button>
        </span>
        <base-dropdown class="flex-grow">
            <template #button>
                <button aria-label="Add category" class="cursor-pointer text-gray-500 text-sm flex items-center gap-2">
                    <PlusIcon class="w-4 h-4" />
                    {{ $t('song.addCategory') }}
                </button>
            </template>
            <form @submit.prevent="createTag" class="flex gap-2 max-w-md w-full">
                <base-input v-model="tagFilter" type="text" :placeholder="$t('song.category')" class="w-full"/>
                <base-button type="submit" theme="primary" :content="false">
                    <template #icon>
                        <PlusIcon class="w-4 h-4" />
                    </template>
                </base-button>
            </form>
            <div v-if="Tags.length" class="mt-2">
                <small class="opacity-50 text-xs leading-none mb-1 uppercase tracking-wider">{{ $t('common.your') }} {{ $t('song.categories').toLocaleLowerCase() }}</small>
                <ul class="flex flex-wrap gap-1">
                    <li 
                        class="px-2 rounded-full text-sm text-gray-500 border-gray-500 border flex gap-1 items-center cursor-pointer" 
                        v-for="tag in Tags" 
                        :key="tag.id" 
                        @click="addToTag(tag.id)">{{tag.getName()}}</li>
                </ul>
            </div>
        </base-dropdown>
    </div>
</template>
<script lang="ts">
import { Song } from "@/classes";
import { Tag } from "@/classes/tag";
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

    public tagFilter = "";

    public async createTag() {
        if (this.tagFilter == "" || this.Tags.find(t => t.name == this.tagFilter)) {
            return;
        }
        const newTag = await tags.create(this.tagFilter, "#BD9B60", this.Song.id);

        appSession.tags.push(new Tag(newTag, true));
        this.Song.tagIds.push(newTag.id);

        this.tagFilter = "";
    }

    public async addToTag(id: string) {
        const tag = this.Tags.find(t => t.id == id);

        if (tag) {
            await tags.addToTag(tag.id, this.Song.id);

            this.Song.tagIds.push(tag.id);
        }
    }

    public async removeFromTag(id: string) {
        const tag = this.Song.tags.find(t => t.id == id);

        if (tag) {
            await tags.removeFromTag(tag.id, this.Song.id);
            this.Song.tagIds = this.Song.tagIds.filter(t => t != tag.id);
        }
    }

    public get Tags() {
        const tags = appSession.tags.filter(t => t.userDefined);
        return tags.filter(t => !this.Song.tagIds.includes(t.id) && (!this.tagFilter || t.getName().toLowerCase().includes(this.tagFilter.toLowerCase())));
    }

    public get Song() {
        return this.song as Song;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }
}
</script>
