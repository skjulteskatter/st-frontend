<template>
    <div v-if="loading" class="loader"></div>
    <div v-else-if="contributor" class="contributor">
        <back-button />
        <div class="contributor__biography">
            <img
                :src="'/img/portrait-placeholder.png'"
                id="contributor-biography-image"
                class="contributor__biography__header__portrait"
            />
            <div class="contributor__biography__header">
                <p class="contributor__biography__header__title">
                    {{ $t("song.contributor") }}
                </p>
                <h1 class="contributor__biography__header__name">
                    {{ contributor.name }}
                </h1>
                <small
                    class="contributor__biography__header__subtitle"
                    v-if="contributor.subtitle"
                >
                    {{ contributor.subtitle }}
                </small>
            </div>
            <div
                v-html="contributor.getBiography(languageKey)"
                class="contributor__biography__bio"
            ></div>
        </div>

        <div class="contributor__songs">
            <base-card v-for="c in collections" :key="c.id">
                <h2>{{ c.getName(languageKey) }}</h2>
                <div class="contributor__songs__wrapper">
                    <song-list-card
                        :title="$t('song.author')"
                        :songs="
                            authorSongs.filter((s) =>
                                s.collection ? s.collection.id == c.id : false
                            )
                        "
                        border
                    ></song-list-card>
                    <song-list-card
                        :title="$t('song.composer')"
                        :songs="
                            composerSongs.filter((s) =>
                                s.collection ? s.collection.id == c.id : false
                            )
                        "
                        border
                    ></song-list-card>
                </div>
            </base-card>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseCard, BackButton } from "@/components";
import { SongListCard } from "@/components/songs";
import { Collection, Song } from "@/classes";
import { ApiSong } from "dmb-api";
import { useStore } from "@/store";
import { SongsActionTypes } from "@/store/modules/songs/action-types";
import { SessionActionTypes } from "@/store/modules/session/action-types";

@Options({
    components: {
        BaseCard,
        SongListCard,
        BackButton,
    },
    name: "contributor-view",
})
export default class ContributorView extends Vue {
    private store = useStore();
    public loading = false;

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public async mounted() {
        this.loading = true;

        await this.store.dispatch(
            SongsActionTypes.SELECT_CONTRIBUTOR,
            this.$route.params.contributor as string
        );
        if (this.contributor?.image) {
            const image = new Image();
            image.src = this.contributor.image;

            image.onload = () => {
                const el = document.getElementById(
                    "contributor-biography-image"
                ) as HTMLImageElement;

                el.src = image.src;
            };
        }

        this.loading = false;

        setTimeout(() => {
            if (this.contributor) {
                this.store.dispatch(
                    SessionActionTypes.LOG_CONTRIBUTOR_ITEM,
                    this.contributor
                );
            }
        }, 5000);
    }

    public get contributorItem() {
        return this.store.state.songs.contributorItem;
    }

    public get contributor() {
        return this.contributorItem?.item;
    }

    public get songs(): ApiSong[] {
        return this.contributorItem?.songs ?? [];
    }

    public get authorSongs(): Song[] {
        return this.songs
            .filter((s) =>
                s.participants.find(
                    (p) =>
                        p.contributorId == this.contributor?.id &&
                        p.type == "author"
                )
            )
            .map((s) => new Song(s));
    }

    public get composerSongs(): Song[] {
        return this.songs
            .filter((s) =>
                s.participants.find(
                    (p) =>
                        p.contributorId == this.contributor?.id &&
                        p.type == "composer"
                )
            )
            .map((s) => new Song(s));
    }

    public get collections(): Collection[] {
        return (
            (this.store.getters.collections as
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
        columns: auto 325px;

        @include breakpoint("small") {
            flex-direction: column;
            align-items: initial;

            .contributor__biography__header__portrait {
                max-width: 100%;
            }
        }

        &__header {
            break-inside: avoid;

            &__title {
                color: var(--st-color-primary);
                margin: 0;
            }

            &__name {
                margin: 0;
            }

            &__subtitle {
                opacity: 0.5;
                font-style: italic;
            }

            &__portrait {
                max-width: 100%;
                border-radius: var(--st-border-radius);
                border: 3px solid var(--st-color-background-medium);
                margin-bottom: var(--st-spacing);
                animation: slideInFromBottom 250ms ease-out;
            }
        }
    }

    &__songs {
        margin-top: calc(var(--st-spacing) * 2);
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        grid-gap: var(--st-spacing);

        &__wrapper {
            display: flex;
            flex-direction: column;
            gap: var(--st-spacing);
        }
    }
}
</style>
