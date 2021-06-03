<template>
    <div>
        <div v-for="tag in Tags" :key="tag.id">
            <router-link
                :to="{name: 'tag', params: {id: tag.id}}"
            >
                {{tag.getName(languageKey)}}
            </router-link>
        </div>
        <div v-for="tag in CustomTags" :key="tag.id">
            {{tag.name}}
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
        return this.tags.filter(t => !t.userDefined);
    }

    public get CustomTags() {
        return this.tags.filter(t => t.userDefined);
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }
}
</script>
