<template>
    <button
        class="relative rounded overflow-hidden cursor-pointer border hover:border-gray-400 focus:outline-none focus:ring focus:ring-primary ring-offset-2"
        :class="{
            disabled: !collection?.available,
        }"
        @click="selectCollection()"
    >
        <img
            :src="image"
            :alt="name"
        />
        <p class="p-2 bg-white">
            {{ name }}
        </p>
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
        return this.collection?.getName(this.languageKey);
    }

    public get image() {
        return this.collection?.image + "?w=200";
    }

    public get selected() {
        return this.store.getters.collection ?? {};
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }
}
</script>
