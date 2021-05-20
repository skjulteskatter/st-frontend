<template>
    <base-card class="recent-collections">
        <h3 class="recent-collections__title">
            {{ $t("activity.recentlyOpened") }}
        </h3>
        <div class="recent-collections__collections">
            <collection-card
                class="recent-collections__collection"
                v-for="c in recentCollections"
                :key="c.id"
                :collection="c"
            />
        </div>
    </base-card>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { Options, Vue } from "vue-class-component";
import { BaseCard, CollectionCard } from "@/components";

@Options({
    name: "recent-collections",
    components: {
        BaseCard,
        CollectionCard,
    },
})
export default class RecentCollections extends Vue {
    private store = useStore();

    public get collections() {
        return this.store.state.session.collections;
    }

    public get activities() {
        return this.store.getters.activities;
    }

    public get recentCollections() {
        return this.collections.filter((c) =>
            this.activities
                .filter((a) => a.collectionIds.length)
                .map((a) => a.collectionIds)
                .some(cols => cols.includes(c.id)),
        );
    }
}
</script>

<style lang="scss" scoped>
.recent-collections {
    &__fallback {
        background-color: var(--st-color-background-dark);
        border-radius: var(--st-border-radius);
        padding: var(--st-spacing);
        margin: 0;
        text-align: center;
    }

    &__title {
        display: block;
        margin-top: 0;
    }

    &__collections {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: calc(var(--st-spacing) / 2);
    }
}
</style>
