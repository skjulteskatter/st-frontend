<template>
    <base-card class="playlist-entry-card">
        <div class="playlist-entry-card__wrapper">
            <div class="playlist-entry-card__info">
                <router-link
                    class="playlist-entry-card__title"
                    :to="{
                        name: 'song',
                        params: {
                            collection: collection.key,
                            number: entry.item.number,
                        },
                    }"
                >
                    <span>
                        {{ entry.item.name[languageKey] }}
                    </span>
                </router-link>
                <small class="playlist-entry-card__collection">
                    {{ collection.name[languageKey] }}
                    {{ entry.item.number }}
                </small>
            </div>
            <small
                class="playlist-entry-card__remove"
                @click="removeFromPlaylist"
            >
                {{ $t("playlist.remove") }}
            </small>
        </div>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { sessionKey } from "@/store";
import { ApiPlaylist, ApiPlaylistEntry } from "dmb-api";
import { BaseCard, BaseButton } from "@/components";

@Options({
    name: "playlist-entry-card",
    props: {
        entry: {
            type: Object,
            required: true,
        },
        playlist: {
            type: Object,
            required: true,
        },
    },
    components: {
        BaseCard,
        BaseButton,
    },
})
export default class PlaylistEntryCard extends Vue {
    private store = useStore(sessionKey);
    public entry: ApiPlaylistEntry = {} as ApiPlaylistEntry;
    public playlist: ApiPlaylist = {} as ApiPlaylist;

    public removeFromPlaylist() {
        this.store.dispatch("removeFromPlaylist", {
            playlist: this.playlist,
            song: this.entry,
        });
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get collection() {
        const collection = this.store.state.collections.find(
            (c) => (c.id = this.entry.item.id)
        );
        return collection;
    }
}
</script>

<style lang="scss" scoped>
@import "../../style/mixins";

.playlist-entry-card {
    margin-bottom: var(--st-spacing);

    &__wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;

        @include breakpoint("small") {
            flex-direction: column;
            align-items: flex-start;

            .playlist-entry-card__info {
                margin-bottom: 0.5em;
            }

            .playlist-entry-card__remove {
                align-self: flex-end;
            }
        }
    }

    &__remove {
        color: var(--st-color-error);
        cursor: pointer;
    }

    &__collection {
        display: block;
        font-weight: 100;
        // opacity: 0.5;
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