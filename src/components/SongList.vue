<template>
    <div class="song-list" v-if="collection">
        <div class="loader" v-if="loading"></div>
        <div v-if="!loading">
            <div class="song-list__header">
                <h1>{{ $t("common.songs") }}</h1>
                <div style="display: flex; gap: var(--st-spacing)">
                    <input
                        type="text"
                        class="song-list__search"
                        placeholder="Search..."
                        v-model="searchQuery"
                    />
                </div>
            </div>

            <div
                class="song-list__list song-list__list-rows gap-y"
                v-if="filteredSongs.length"
            >
                <song-list-item-row
                    v-for="song in filteredSongs.slice(0, 50)"
                    :key="song.id"
                    :song="song"
                    @click="selectSong(song)"
                ></song-list-item-row>
            </div>
            <div class="song-list__list song-list__list-cards"></div>
            <div class="song-list__list song-list__list-numbers"></div>

            <h1 class="warning" v-if="!filteredNumbers.length">No results</h1>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { sessionKey, songKey } from "@/store";
import { Song } from "@/classes";
import BaseCard from "@/components/BaseCard.vue";
import SongListItemRow from "@/components/SongList/SongListItemRow.vue";

@Options({
    components: {
        BaseCard,
        SongListItemRow,
    },
})
export default class SongList extends Vue {
    private userStore = useStore(sessionKey);
    private songStore = useStore(songKey);
    public searchQuery = "";
    public store = useStore(songKey);
    public loading = false;
    public songListType = "";

    public async mounted() {
        if (!this.collection.id) {
            await this.store.dispatch("load", {
                collectionKey: this.$route.params.collection,
                languageKey: this.languageKey,
            });
        }

        if (this.allLyrics.length == 0) {
            this.loading = true;
            await this.store.dispatch(
                "getAllLyrics",
                this.userStore.state.currentUser.settings?.languageKey ?? "no"
            );
            this.loading = false;
        }
    }

    public get advancedSearch() {
        return this.searchQuery !== "";
    }

    public get allLyrics() {
        return this.store.state.allLyrics;
    }

    public get filteredNumbers() {
        const numbers = this.songs
            .filter(
                (s) =>
                    s.number.toString() == this.searchQuery ||
                    s.rawContributorNames.includes(
                        this.searchQuery
                            .replace(/[^0-9a-zA-Z]/g, "")
                            .toLowerCase()
                    )
            )
            .map((s) => s.number);

        return (
            this.allLyrics
                ?.filter(
                    (l) =>
                        numbers.includes(l.number) ||
                        l.rawContent.includes(
                            this.searchQuery
                                .replace(/[^0-9a-zA-Z]/g, "")
                                .toLowerCase()
                        )
                )
                .map((l) => l.number) ?? []
        );
    }

    public get filteredSongs() {
        return this.songs.filter((s) =>
            this.filteredNumbers.includes(s.number)
        );
    }

    public get collection(): Collection {
        return this.songStore.state.collection;
    }

    public get languageKey() {
        return this.userStore.getters.languageKey;
    }

    public get selected() {
        return this.store.getters.song ?? {};
    }

    public async selectSong(song: Song) {
        console.log("test");
        if (this.disabled.find((s) => s.number == song.number)) return;
        this.songStore.commit("selectSong", song);
        this.loading = true;
        await this.songStore.dispatch(
            "getLyrics",
            this.userStore.getters.currentUser?.settings?.languageKey ?? "en"
        );
        this.$router.push({
            name: "song",
            params: {
                collection: song.collection.key,
                number: song.number,
            },
        });
        this.loading = false;
    }

    public get songs(): Song[] {
        return this.songStore.getters.songs ?? [];
    }

    public get disabled() {
        return this.songs.filter((s) => !s.name[this.languageKey]);
    }
}
</script>

<style lang="scss" scoped>
.warning {
    opacity: 0.4;
}

.search__container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: var(--st-spacing);
}

.song-list {
    --st-half-spacing: calc(var(--st-spacing) * 0.5);
    animation: slideInFromBottom 0.3s ease;

    &__list {
        display: flex;
        flex-direction: column;
        // gap: var(--st-half-spacing);
    }

    &__header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__search {
        display: block;
    }

    &__item {
        max-width: 52px;
        min-height: 40px;
        width: 100%;
        background-color: var(--st-background-color);
        border: 1px solid var(--st-border-color);
        border-radius: var(--st-border-radius);

        cursor: pointer;

        display: flex;
        justify-content: center;
        align-items: center;

        &.selected {
            border: 2px solid var(--st-primary-color);
        }

        &.disabled {
            color: var(--st-border-color);
            cursor: not-allowed;
        }
    }
}
</style>
