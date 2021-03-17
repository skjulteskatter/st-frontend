<template>
    <div v-if="contributor" class="contributor">
        <back-button />
        <div class="contributor__biography">
            <div class="contributor__biography__header">
                <p class="contributor__biography__header__title">
                    {{ $t("song.contributor") }}
                </p>
                <h1 class="contributor__biography__header__name">
                    {{ contributor.name }}
                </h1>
            </div>
            <div v-html="contributor.getBiography(languageKey)"></div>
        </div>

        <div class="contributor__songs">
            <div v-for="c in collections" :key="c.id">
                <h2>{{ c.getName(languageKey) }}</h2>
                <div class="contributor__songs">
                    <song-list-card
                        :title="$t('song.author')"
                        :songs="
                            authorSongs.filter((s) =>
                                s.collection ? s.collection.id == c.id : false
                            )
                        "
                    ></song-list-card>
                    <song-list-card
                        :title="$t('song.composer')"
                        :songs="
                            composerSongs.filter((s) =>
                                s.collection ? s.collection.id == c.id : false
                            )
                        "
                    ></song-list-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { sessionKey, songKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { BaseCard, BackButton } from "@/components";
import { SongListCard } from "@/components/songs";
import { Collection, Song } from "@/classes";
import { ApiSong } from "dmb-api";

@Options({
    components: {
        BaseCard,
        SongListCard,
        BackButton,
    },
})
export default class ContributorView extends Vue {
    private store = useStore(songKey);
    private sessionStore = useStore(sessionKey);
    public languageKey = useStore(sessionKey).getters.languageKey;

    public async mounted() {
        // if (!this.store.getters.collection) {
        //     await this.store.dispatch(
        //         "selectCollection",
        //         this.$route.params.collection
        //     );
        // }
        await this.store.dispatch(
            "selectContributor",
            this.$route.params.contributor
        );
    }

    public get contributorItem() {
        return this.store.state.contributorItem;
    }

    public get contributor() {
        return this.contributorItem?.item;
    }

    public get songs(): ApiSong[] {
        return this.contributorItem?.songs ?? [];
    }

    public get authorSongs(): Song[] {
        return this.songs
            .filter((s) => s.participants.find((p) => p.contributorId == this.contributor?.id && p.type == "author"))
            .map((s) => new Song(s));
    }

    public get composerSongs(): Song[] {
        return this.songs
            .filter((s) => s.participants.find((p) => p.contributorId == this.contributor?.id && p.type == "composer"))
            .map((s) => new Song(s));
    }

    public get collections(): Collection[] {
        return (
            (this.sessionStore.getters.collections as
                | Collection[]
                | undefined)?.filter(
                (c) =>
                    this.authorSongs.filter((s) => s.collection?.id == c.id)
                        .length ||
                    this.composerSongs.filter((s) => s.collection?.id == c.id)
                        .length
            ) ?? []
        );
    }
}
</script>

<style lang="scss">
@import "../style/mixins";

.contributor {
    padding: calc(var(--st-spacing) * 2);

    @include breakpoint("medium") {
        padding: var(--st-spacing);
    }

    &__biography {
        &__header {
            &__title {
                color: var(--st-color-primary);
                margin: 0;
            }

            &__name {
                margin: 0;
            }
        }
    }

    &__songs {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: var(--st-spacing);
    }
}
</style>