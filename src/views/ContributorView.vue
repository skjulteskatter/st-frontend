<template>
    <div>
        <Loader :loading="loading">
            <div v-if="contributor">
                <BackButton class="mb-4" />
                <div class="grid gap-4 md:grid-cols-4">
                    <div class="col-span-1">
                        <img
                            :src="portrait"
                            id="contributor-biography-image"
                            class="w-full rounded-lg grayscale border border-black/20 dark:border-white/20"
                        />
                    </div>
                    <BaseCard class="md:col-span-3">
                        <div class="break-inside-avoid mb-6">
                            <BaseButton
                                v-if="isEditor"
                                @click="goToEditPage()"
                                theme="tertiary"
                                class="mb-4 hidden lg:flex"
                            >
                                <template #icon>
                                    <PencilAltIcon class="w-4 h-4" />
                                </template>
                                {{ $t('common_edit') }}
                            </BaseButton>
                            <p class="text-primary">
                                {{ $t("song_contributor") }}
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
                        <div class="columns-sm">
                            <div
                                v-html="contributor.getBiography(languageKey)"
                                class="text-sm"
                            ></div>
                        </div>
                    </BaseCard>
                </div>
                <div class="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="c in collections" :key="c.id">
                        <h2 class="font-bold mb-2">{{ c.getName(languageKey) }}</h2>
                        <div class="flex flex-col gap-4">
                            <SongListCard
                                :collection="c"
                                :title="$t('song_author')"
                                :songs="
                                    authorSongs.filter((s) =>
                                        s.collectionIds.some(col => col == c.id)
                                    )
                                "
                            />
                            <SongListCard
                                :collection="c"
                                :title="$t('song_composer')"
                                :songs="
                                    composerSongs.filter((s) =>
                                        s.collectionIds.some(col => col == c.id)
                                    )
                                "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Loader>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { BackButton } from "@/components";
import { SongListCard } from "@/components/songs";
import { Collection, Contributor, Song } from "@/classes";
import { useStore } from "@/store";
import { SongsActionTypes } from "@/store/modules/songs/action-types";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { appSession } from "@/services/session";
import { PencilAltIcon } from "@heroicons/vue/solid";

export default defineComponent({
    name: "contributor-view",
    components: {
        SongListCard,
        BackButton,
        PencilAltIcon,
    },
    data: () => ({
        store: useStore(),
        loading: false,
        songs: [] as Song[],
    }),
    computed: {
        languageKey() {
            return this.store.getters.languageKey;
        },
        contributorItem() {
            return this.store.state.songs.contributorItem;
        },
        contributor() {
            const item = this.contributorItem?.item;
            return item ? new Contributor(item) : undefined;
        },
        portrait() {
            const isString = typeof this.contributor?.image === "string";
            return isString ? this.contributor?.image : "/img/portrait-placeholder.png";
        },
        authorSongs(): Song[] {
            return this.songs
                .filter((s) =>
                    s.participants.find(
                        (p) =>
                            p.contributorId == this.contributor?.id &&
                            p.type == "author",
                    ),
                )
                .map((s) => new Song(s));
        },
        composerSongs(): Song[] {
            return this.songs
                .filter((s) =>
                    s.participants.find(
                        (p) =>
                            p.contributorId == this.contributor?.id &&
                            p.type == "composer",
                    ),
                ) as Song[];
        },
        collections(): Collection[] {
            return appSession.collections.filter(c => this.songs.some(s => s.collectionIds.some(col => col == c.id))) as Collection[];
        },
        isEditor() {
            return this.store.getters.user?.roles.some(r => ["administrator", "editor"].includes(r)) == true;
        },
    },
    async beforeMount() {
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
    },
    methods: {
        goToEditPage() {
            window.open(`https://songtreasures.sanity.studio/desk/contributor;${this.contributor?.id}`);
        },
    },
});
</script>
