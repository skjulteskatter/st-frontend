<template>
    <span v-for="tag in Song.tags" :key="tag.id" class="px-2 rounded-full text-sm text-gray-400 border-gray-400 border">
        <router-link
            :to="{
                name: 'tag',
                params: {
                    id: tag.id,
                },
            }"
        >
            {{tag.getName(languageKey)}}
        </router-link>
    </span>
    <base-dropdown>
        <template #button>
            <icon name="plus" class="cursor-pointer text-gray-400"/>
        </template>
        <input v-model="tagFilter" type="text" placeholder="Tag name"/><icon name="plus" class="cursor-pointer" @click="createTag" />
        <ul>
            <li v-for="tag in Tags" :key="tag.id" class="cursor-pointer" @click="addToTag(tag.id)">{{tag.getName(languageKey)}}</li>
        </ul>
    </base-dropdown>
</template>
<script lang="ts">
import { Song } from "@/classes";
import { Tag } from "@/classes/tag";
import { tags } from "@/services/api";
import { appSession } from "@/services/session";
import { useStore } from "@/store";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "song-tags",
    props: {
        song: {
            type: Object,
        },
    },
})
export default class SongTags extends Vue {
    private store = useStore();
    private song?: Song;

    public tagFilter = "";

    public async createTag() {
        if (this.tagFilter == "") {
            return;
        }
        const newTag = await tags.create(this.tagFilter, "#BD9B60", this.Song.id);

        appSession.tags.push(new Tag(newTag, true));
        this.Song.tagIds.push(newTag.id);
    }

    public async addToTag(id: string) {
        const tag = this.Tags.find(t => t.id == id);

        if (tag) {
            await tags.addToTag(tag.id, this.Song.id);
            this.Song.tagIds.push(tag.id);
        }
    }

    public get Tags() {
        const tags = appSession.tags.filter(t => t.userDefined);
        return tags.filter(t => !this.Song.tagIds.includes(t.id) && (!this.tagFilter || t.getName(this.languageKey).toLowerCase().includes(this.tagFilter.toLowerCase())));
    }

    public get Song() {
        return this.song as Song;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }
}
</script>
