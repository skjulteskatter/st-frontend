<template>
    <base-card>
        <h3 class="font-bold mb-4">
            {{ $t("activity.recentlyOpened") }}
        </h3>
        <div class="grid grid-cols-2 gap-2" v-if="recentCollections.length">
            <collection-card
                class="recent-collections__collection"
                v-for="c in recentCollections"
                :key="c.id"
                :collection="c"
            />
        </div>
        <p class="p-4 rounded bg-gray-500 text-center" v-else>{{ $t('dashboard.noactivity') }}</p>
    </base-card>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { Options, Vue } from "vue-class-component";
import { BaseCard, CollectionCard } from "@/components";
import { appSession } from "@/services/session";

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
        return appSession.collections;
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
