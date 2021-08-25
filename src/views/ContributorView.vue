<template>
    <loader :loading="loading">
        <div v-if="contributor">
            <back-button class="mb-4" />
            <div class="grid gap-4 md:grid-cols-4">
                <div class="col-span-1">
                    <img
                        :src="portrait"
                        id="contributor-biography-image"
                        class="rounded-lg filter grayscale"
                    />
                </div>
                <base-card class="md:col-span-3">
                    <div class="contributor__biography">
                        <div class="contributor__biography__header mb-6">
                            <base-button
                                v-if="isEditor"
                                @click="goToEditPage()"
                                theme="tertiary"
                                class="mb-4 hidden lg:flex"
                            >
                                <template #icon>
                                    <PencilAltIcon class="w-4 h-4" />
                                </template>
                                {{ $t('common.edit') }}
                            </base-button>
                            <p class="text-primary">
                                {{ $t("song.contributor") }}
                            </p>
                            <h1 class="font-bold text-2xl">
                                {{ contributor.name }}
                            </h1>
                            <small
                                class="text-gray-500 italic"
                                v-if="contributor.subtitle"
                            >
                                {{ contributor.subtitle }}
                            </small>
                        </div>
                        <div
                            v-html="contributor.getBiography(languageKey)"
                            class="text-sm"
                        ></div>
                    </div>
                </base-card>
            </div>

            <div class="mt-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div v-for="c in collections" :key="c.id">
                    <h2 class="font-bold mb-2">{{ c.getName(languageKey) }}</h2>
                    <div class="contributor__songs__wrapper">
                        <song-list-card
                            :collection="c"
                            :title="$t('song.author')"
                            :songs="
                                authorSongs.filter((s) =>
                                    s.collectionIds.some(col => col == c.id)
                                )
                            "
                        ></song-list-card>
                        <song-list-card
                            :collection="c"
                            :title="$t('song.composer')"
                            :songs="
                                composerSongs.filter((s) =>
                                    s.collectionIds.some(col => col == c.id)
                                )
                            "
                        ></song-list-card>
                    </div>
                </div>
            </div>
        </div>
    </loader>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BackButton } from "@/components";
import { SongListCard } from "@/components/songs";
import { Collection, Contributor, Song } from "@/classes";
import { useStore } from "@/store";
import { SongsActionTypes } from "@/store/modules/songs/action-types";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { appSession } from "@/services/session";
import { PencilAltIcon } from "@heroicons/vue/solid";

@Options({
    components: {
        SongListCard,
        BackButton,
        PencilAltIcon,
    },
    name: "contributor-view",
})
export default class ContributorView extends Vue {
    private store = useStore();
    public loading = false;

    public songs: Song[] = [];

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public async beforeMount() {
        this.loading = true;

        await this.store.dispatch(
            SongsActionTypes.SELECT_CONTRIBUTOR,
            this.$route.params.contributor as string,
        );

        this.songs = appSession.songs.filter(s => s.participants.some(c => c.contributorId == this.contributor?.id));

        if (this.contributor?.image) {
            const image = new Image();
            image.src = this.contributor.image;

            image.onload = () => {
                const el = document.getElementById(
                    "contributor-biography-image",
                ) as HTMLImageElement;

                el.src = image.src;
            };
        }

        this.loading = false;

        setTimeout(() => {
            if (
                this.contributor &&
                this.contributor.id == this.$route.params.contributor
            ) {
                this.store.dispatch(
                    SessionActionTypes.LOG_CONTRIBUTOR_ITEM,
                    this.contributor,
                );
            }
        }, 5000);
    }

    public get contributorItem() {
        return this.store.state.songs.contributorItem;
    }

    public get contributor() {
        const item = this.contributorItem?.item;
        return item ? new Contributor(item) : undefined;
    }

    public get portrait() {
        const isString = typeof this.contributor?.image === "string";
        return isString ? this.contributor?.image : "/img/portrait-placeholder.png";
    }

    public get authorSongs(): Song[] {
        return this.songs
            .filter((s) =>
                s.participants.find(
                    (p) =>
                        p.contributorId == this.contributor?.id &&
                        p.type == "author",
                ),
            )
            .map((s) => new Song(s));
    }

    public get composerSongs(): Song[] {
        return this.songs
            .filter((s) =>
                s.participants.find(
                    (p) =>
                        p.contributorId == this.contributor?.id &&
                        p.type == "composer",
                ),
            );
    }

    public get collections(): Collection[] {
        return this.store.getters.collections.filter(c => this.songs.some(s => s.collectionIds.some(col => col == c.id)));
    }

    public get isEditor() {
        return this.store.getters.user?.roles.some(r => ["administrator", "editor"].includes(r)) == true;
    }

    public goToEditPage() {
        window.open(`https://songtreasures.sanity.studio/desk/contributor;${this.contributor?.id}`);
    }
}
</script>

<style lang="scss">
@import "../style/mixins";

.contributor {
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
