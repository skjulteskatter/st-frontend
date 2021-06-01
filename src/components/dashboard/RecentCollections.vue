<template>
    <base-card>
        <div class="flex gap-4 items-center mb-4">
            <h3 class="font-bold">
                {{ $t("activity.recentlyOpened") }}
            </h3>
            <tooltip text="Her ser du nylig åpnede samlinger" />
        </div>
        <div class="flex flex-col gap-2" v-if="recentCollections.length">
            <collection-card
                class="recent-collections__collection"
                v-for="c in recentCollections"
                :key="c.id"
                :collection="c"
            />
        </div>
        <p class="p-4 rounded bg-gray-100 text-center" v-else>{{ $t('dashboard.noactivity') }}</p>
    </base-card>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { Options, Vue } from "vue-class-component";
import { CollectionCard } from "@/components";
import { appSession } from "@/services/session";

@Options({
    name: "recent-collections",
    components: {
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
