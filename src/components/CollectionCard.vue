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
        <p class="collection-card__title">
            {{ collection.getName(languageKey) }}
        </p>
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
    animation: slideInFromBottom 250ms;
    background-color: var(--st-color-background-medium);
    border-radius: var(--st-border-radius);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    &__image {
        border-radius: var(--st-border-radius);
        max-width: 400px;
        width: 100%;
    }

    &__title {
        margin: 0;
        padding: calc(var(--st-spacing) / 2);
        color: var(--st-color-text-dark);
        background: var(--st-color-background-light);
        flex-grow: 1;
    }

    &.disabled {
        color: var(--st-color-border);
        cursor: not-allowed;
    }
}
</style>