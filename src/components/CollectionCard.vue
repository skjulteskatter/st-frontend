<template>
    <div
        class="collection-card"
        :class="{
            disabled: !collection.available,
        }"
        @click="selectCollection(collection)"
    >
        <img
            class="collection-card__image"
            :src="`${image}?w=300`"
            :alt="collection.getName(languageKey)"
        />
        <h4 class="collection-card__title">
            {{ collection.getName(languageKey) }}
        </h4>
    </div>
</template>

<script lang="ts">
import { Collection } from "@/classes";
import { sessionKey, songKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";

@Options({
    props: {
        collection: {
            type: Collection,
        },
    },
})
export default class CollectionCard extends Vue {
    private songStore = useStore(songKey);
    private sessionStore = useStore(sessionKey);
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
        return this.collection.image ?? "/img/placeholder.png";
    }

    public get selected() {
        return this.songStore.getters.collection ?? {};
    }

    public get languageKey() {
        return this.sessionStore.getters.languageKey;
    }
}
</script>

<style lang="scss">
.collection-card {
    position: relative;
    cursor: pointer;

    &:hover {
        .collection-card__title {
            transform: translateY(-0.5rem);
        }
    }

    &__image {
        border-radius: var(--st-border-radius);
        border: 3px solid var(--st-color-border);
        max-width: 400px;
        width: 100%;
    }

    &__title {
        margin: 0;
        color: white;
        text-shadow: 0 0 0.3em rgba(black, 0.3);
        position: absolute;
        top: var(--st-spacing);
        left: var(--st-spacing);
        transition: transform 200ms;
    }

    &.disabled {
        color: var(--st-color-border);
        cursor: not-allowed;
    }
}
</style>