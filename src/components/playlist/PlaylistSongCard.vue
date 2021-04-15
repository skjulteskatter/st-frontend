<template>
    <base-card class="playlist-song-card">
        <div class="playlist-song-card__wrapper">
            <div class="playlist-song-card__info">
                <router-link
                    class="playlist-song-card__title"
                    :to="{
                        name: 'song',
                        params: {
                            collection: collection?.key,
                            number: entry.item.number,
                        },
                    }"
                >
                    <span>
                        {{ getEntryName(entry) }}
                    </span>
                </router-link>
                <small class="playlist-song-card__collection">
                    {{ collection?.getName(languageKey) }}
                    {{ entry.item.number }}
                </small>
            </div>
            <small
                class="playlist-song-card__remove"
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
import { ApiPlaylist, ApiPlaylistEntry, ApiSong } from "dmb-api";
import { BaseCard, BaseButton } from "@/components";
import { Song } from "@/classes";

@Options({
    name: "playlist-song-card",
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
            playlistId: this.playlist.id,
            entryId: this.entry.id,
        });
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get collection() {
        return this.store.state.collections.find(
            (c) => c.id === this.entry.item.collection?.id
        );
    }

    public getEntryName(entry: ApiPlaylistEntry) {
        if (entry.type == "song") {
            return new Song(entry.item as ApiSong).getName(this.languageKey);
        } else {
            return entry.item.name as string;
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../style/mixins";

.playlist-song-card {
    margin-bottom: var(--st-spacing);

    &__wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;

        @include breakpoint("small") {
            flex-direction: column;
            align-items: flex-start;

            .playlist-song-card__info {
                margin-bottom: 0.5em;
            }

            .playlist-song-card__remove {
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