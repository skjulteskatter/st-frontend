<template>
    <base-card class="playlist-entry-card">
        <router-link
            class="playlist-entry-card__title"
            :to="{
                name: 'song',
                params: {
                    collection: entry.item.collectionId,
                    number: entry.item.number,
                },
            }"
        >
            {{ entry.item.name[languageKey] }}
        </router-link>
        <small class="playlist-entry-card__collection">
            {{ collection }}
        </small>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { sessionKey } from "@/store";
import { ApiPlaylistEntry } from "dmb-api";
import { BaseCard } from "@/components";

@Options({
    name: "playlist-entry-card",
    props: {
        entry: {
            type: Object,
            required: true,
        },
    },
    components: {
        BaseCard,
    },
})
export default class PlaylistEntryCard extends Vue {
    private store = useStore(sessionKey);
    public entry: ApiPlaylistEntry = {} as ApiPlaylistEntry;

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get collection() {
        const collection = this.store.state.collections.find(
            (c) => (c.id = this.entry.item.id)
        );
        return collection?.name[this.languageKey];
    }
}
</script>

<style lang="scss" scoped>
.playlist-entry-card {
    margin-bottom: var(--st-spacing);

    &__collection {
        display: block;
        opacity: 0.5;
        margin-top: 0.2em;
    }

    &__title {
        text-decoration: none;
        color: var(--st-color-text-dark);

        &:hover {
            color: var(--st-color-primary);
        }
    }
}
</style>