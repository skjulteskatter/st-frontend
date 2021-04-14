<template>
    <div class="playlist-view" v-if="playlist">
        <back-button />
        <header class="playlist-view__header">
            <span>
                <h1 class="playlist-view__title">{{ playlist.name }}</h1>
                <span class="playlist-view__count">
                    {{ playlist.entries.length }}
                    {{ $t("common.songs").toLowerCase() }}
                </span>
            </span>
            <base-button icon="trash" theme="error" @click="deletePlaylist">
                {{ $t("playlist.delete") }}
            </base-button>
        </header>
        <h2 v-if="!playlist.entries.length" class="playlist-view__nosongs">
            {{ $t("playlist.nosongs") }}
        </h2>
        <div class="playlist-view__songs" v-else>
            <base-card
                v-for="entry in playlist.entries"
                :key="entry.id"
                class="playlist-view__songs__entry"
            >
                <router-link
                    :to="{
                        name: 'song',
                        params: {
                            collection: entry.item.collectionId,
                            number: entry.item.number,
                        },
                    }"
                    class="playlist-view__songs__entry__title"
                >
                    <strong>
                        {{ entry.item.name[languageKey] }}
                    </strong>
                </router-link>
            </base-card>
        </div>
    </div>
</template>

<script lang="ts">
import { sessionKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { BackButton, BaseButton, BaseCard } from "@/components";

@Options({
    name: "playlist-view",
    components: {
        BackButton,
        BaseButton,
        BaseCard,
    },
})
export default class PlaylistView extends Vue {
    private store = useStore(sessionKey);

    public deletePlaylist() {
        this.store.dispatch("deletePlaylist", this.playlist?.id);
        this.$router.push("/playlists");
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get playlist() {
        return this.store.state.playlists.find(
            (p) => p.id == this.$route.params.id
        );
    }
}
</script>

<style lang="scss" scoped>
.playlist-view {
    &__title {
        margin: 0 0 0.2em 0;
    }

    &__songs {
        &__entry {
            margin-bottom: var(--st-spacing);

            &__title {
                text-decoration: none;
                color: var(--st-color-text-dark);

                &:hover {
                    color: var(--st-color-primary);
                }
            }
        }
    }

    &__count {
        opacity: 0.6;
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--st-spacing);
    }

    &__nosongs {
        opacity: 0.5;
    }
}
</style>
