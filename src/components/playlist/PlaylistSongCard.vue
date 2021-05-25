<template>
    <base-card class="playlist-song-card clickable">
        <div class="playlist-song-card__wrapper">
            <router-link
                class="playlist-song-card__link"
                :to="{
                    name: 'song',
                    params: {
                        collection: collection?.key,
                        number: song?.number,
                    },
                }"
            >
                <div class="playlist-song-card__info">
                    <span>
                        {{ entryName }}
                    </span>
                    <small class="playlist-song-card__collection">
                        {{ collection?.getName(languageKey) }}
                        {{ song?.number }}
                    </small>
                </div>
            </router-link>
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
import { ApiPlaylist, ApiPlaylistEntry } from "dmb-api";
import { BaseCard } from "@/components";
import { Song } from "@/classes";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { NotificationActionTypes } from "@/store/modules/notifications/action-types";

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
    },
})
export default class PlaylistSongCard extends Vue {
    private store = useStore();
    public entry: ApiPlaylistEntry = {} as ApiPlaylistEntry;
    public playlist: ApiPlaylist = {} as ApiPlaylist;

    public async removeFromPlaylist() {
        const title = this.$t("playlist.removed");
        const content = this.$t("playlist.removedsong");

        await this.store.dispatch(SessionActionTypes.PLAYLIST_REMOVE_ENTRY, {
            playlistId: this.playlist.id,
            entryId: this.entry.id,
        });

        this.store.dispatch(NotificationActionTypes.ADD_NOTIFICATION, {
            type: "success",
            icon: "trash",
            title,
            content,
        });
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get song() {
        return this.store.state.songs.songs.find(s => s.id == this.entry.songId);
    }

    public get collection() {
        return this.store.state.session.collections.find(c => this.song?.collectionIds.includes(c.id));
    }

    public get entryName() {
        return this.song ? new Song(this.song).getName(this.languageKey) : "";
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

        &:hover {
            text-decoration: underline;
        }
    }

    &__collection {
        display: block;
        font-weight: 300;
        // opacity: 0.5;
        margin-top: 0.2em;
    }

    &__link {
        text-decoration: none;
        color: var(--st-color-text-dark);
        flex-grow: 1;

        &:hover {
            color: var(--st-color-primary);
        }
    }
}
</style>
