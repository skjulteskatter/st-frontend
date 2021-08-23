<template>
    <button
        class="flex items-center gap-4 p-2 text-xs text-left relative rounded-md bg-white hover:bg-black/5 dark:bg-secondary dark:hover:bg-white/10 focus:outline-none focus:ring focus:ring-primary ring-offset-2"
        :class="{
            disabled: !collection?.available,
        }"
        @click="selectCollection()"
    >
        <img
            loading="lazy"
            :src="image"
            :alt="name"
            class="max-h-10 rounded border"
        />
        <span class="text-xs font-semibold tracking-wide w-full flex justify-between items-center">
            {{ name }}
        </span>
    </button>
</template>

<script lang="ts">
import { Collection } from "@/classes";
import { useStore } from "@/store";
import { Options, Vue } from "vue-class-component";

@Options({
    props: {
        collection: {
            type: Collection,
        },
    },
    name: "collection-card",
})
export default class CollectionCard extends Vue {
    private store = useStore();
    public collection?: Collection;

    public selectCollection() {
        if (!this.collection?.available) return;
        this.$router.push({
            name: "song-list",
            params: {
                collection: this.collection.key,
            },
        });
    }

    public get name() {
        return this.collection?.getName();
    }

    public get image() {
        return this.collection?.image + "?w=200";
    }

    public get selected() {
        return this.store.getters.collection ?? {};
    }
}
</script>
