<template>
    <div
        class="relative rounded overflow-hidden cursor-pointer border hover:border-gray-400"
        :class="{
            disabled: !collection.available,
        }"
        @click="selectCollection(collection)"
    >
        <img
            :src="image"
            :alt="collection.getName(languageKey)"
        />
        <p class="p-2 bg-white">
            {{ collection.getName(languageKey) }}
        </p>
    </div>
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
    public collection: Collection = {} as Collection;

    public selectCollection(collection: Collection) {
        if (!this.collection.available) return;
        this.$router.push({
            name: "song-list",
            params: {
                collection: collection.key,
            },
        });
    }

    public get image() {
        return this.collection.image + "?w=200";
    }

    public get selected() {
        return this.store.getters.collection ?? {};
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }
}
</script>
