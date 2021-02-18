<template>
    <base-card
        class="collection-card clickable"
        :class="{
            disabled: !available.find((c) => c.id == collection.id),
        }"
        :image="collection.image"
        @click="selectCollection(collection)"
        border
    >
        <p class="collection-card__title">
            {{ collection.getName(languageKey) }}
        </p>
    </base-card>
</template>

<script lang="ts">
import { Collection } from "@/classes";
import { sessionKey, songKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { BaseCard } from "@/components";

@Options({
    components: {
        BaseCard,
    },
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
        if (!this.available.find((c) => c.id == collection.id)) return;
        this.$router.push({
            name: "song-list",
            params: {
                collection: collection.key,
            },
        });
    }

    public get selected() {
        return this.songStore.getters.collection ?? {};
    }

    public get available(): Collection[] {
        return this.sessionStore.getters.collections ?? [];
    }

    public get languageKey() {
        return this.sessionStore.getters.languageKey;
    }
}
</script>

<style lang="scss">
.collection-card {
    cursor: pointer;

    &__title {
        margin: 0;
    }

    &.selected {
        border: 2px solid var(--st-primary-color);
    }

    &.disabled {
        color: var(--st-border-color);
        cursor: not-allowed;
    }
}
</style>