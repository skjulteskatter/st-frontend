<template>
    <base-card
        v-if="song"
        v-cloak
    >
        <template #header>
            <span class="flex justify-between items-center">
                <router-link
                    :to="`/songs/${collection.key}`"
                    class="text-sm text-primary hover:underline"
                    v-if="collection"
                >
                    {{ collection.getName(Language) }}
                </router-link>
                <router-link :to="{ name: 'song-stats', params: { id: song.id } }" class="ml-auto px-2 py-1 rounded-md flex gap-1 items-center text-xs hover:bg-black/5 dark:hover:bg-white/10">
                    {{ $t('song_seeStatistics') }}
                    <ArrowSmRightIcon class="w-4 h-4" />
                </router-link>
            </span>
        </template>
        <div class="flex items-start gap-4">
            <span class="text-gray-400 text-xl font-bold">
                {{ song.number }}
            </span>
            <div class="flex-grow">
                <h2 class="flex items-start text-xl font-bold mb-2">
                    <span class="mr-4">
                        {{ title }}
                    </span>
                    <span v-if="viewCount != null" class="ml-auto flex items-center gap-1 font-normal text-gray-400">
                        {{ viewCount }}
                        <EyeIcon class="w-5 h-5" />
                    </span>
                </h2>
                <div class="text-gray-500 text-base flex flex-col gap-1 dark:text-gray-400" v-if="imageLoaded">
                    <img
                        id="song-details-image"
                        class="rounded"
                        v-if="song.image"
                        height="100"
                    />
                    <small
                        class="flex gap-2"
                        v-if="song.Authors.length"
                    >
                        <span>{{ (song.yearWritten ? $t("song_writtenInBy").replace('$year', song.yearWritten.toString()) : $t("song_writtenBy")).replace('$authors', '') }}</span>
                        <contributor-info :contributors="song.Authors" />
                    </small>
                    <small
                        v-if="song.Composers.length"
                        class="flex gap-2"
                    >
                        <span>{{ (song.yearComposed ? $t("song_composedInBy").replace('$year', song.yearComposed.toString()) : $t("song_composedBy")).replace('$composers', '') }}</span>
                        <contributor-info :contributors="song.Composers" />
                    </small>
                    <small 
                        v-else
                        class="flex gap-2"
                    >
                        <span>{{$t("song_unknownComposer")}}</span>
                    </small>
                    <small
                        class="flex gap-2"
                        v-if="
                            song.copyright.melody &&
                            song.copyright.text &&
                            identicalCopyright
                        "
                    >
                        © {{ getLocaleString(song.copyright.melody.name) }}
                    </small>
                    <div v-else>
                        <small
                            class="flex gap-2"
                            v-if="song.copyright.text"
                        >
                            {{ $t("song_text") }} ©:
                            {{ getLocaleString(song.copyright.text.name) }}
                        </small>
                        <small
                            class="flex gap-2"
                            v-if="song.copyright.melody"
                        >
                            {{ $t("song_melody") }} ©:
                            {{ getLocaleString(song.copyright.melody.name) }}
                        </small>
                    </div>
                    <small
                        class="flex gap-2"
                        v-if="melodyOrigin"
                    >
                        {{ melodyOrigin }}
                    </small>
                    <small class="flex gap-2">
                        <span v-if="song.originCountry">{{ $t(song.originCountry) }}</span>
                        <span v-if="song.originCountry">&bull;</span>
                        <span v-if="song.originalKey">{{ song.originalKey }}</span>
                        <span v-if="song.originalKey">&bull;</span>
                        <span v-if="song.verses">{{ song.verses }}</span>
                    </small>
                </div>
            </div>
        </div>
        <div v-if="song.Description" class="flex flex-col gap-4 relative">
            <div
                class="mt-8 text-sm song-description"
                :class="{ 'hidden': !showDescription }"
                v-html="song.Description"
            ></div>
            <button v-if="!showDescription" aria-label="Show song details" @click="showDescription = !showDescription" class="mt-4 text-gray-500 mx-auto hover:bg-black/5 dark:hover:bg-white/5 dark:text-gray-400 px-3 py-1 rounded-md flex gap-2 items-center">
                <InformationCircleIcon class="w-4 h-4" />
                <span class="text-sm">{{ $t('store_learnMore') }}</span>
            </button>
        </div>
    </base-card>
</template>
<script lang="ts">
import { Collection, Song } from "@/classes";
import { Options, Vue } from "vue-class-component";
import { useStore } from "@/store";
import { InformationCircleIcon, ArrowSmRightIcon } from "@heroicons/vue/solid";
import { EyeIcon } from "@heroicons/vue/outline";
import ContributorInfo from "./ContributorInfo.vue";

@Options({
    components: {
        ContributorInfo,
        InformationCircleIcon,
        ArrowSmRightIcon,
        EyeIcon,
    },
    props: {
        languageKey: {
            type: String,
        },
        song: {
            type: Object,
        },
        viewCount: {
            type: Number,
        },
    },
    name: "song-info-card",
})
export default class SongInfoCard extends Vue {
    public languageKey?: string;
    public song?: Song;
    public imageLoaded = false;
    public store = useStore();
    public showDescription = false;
    public viewCount?: number;

    public get Language() {
        return this.languageKey ?? "en";
    }

    public mounted() {
        if (this.song) {
            if (this.song.image) {

                const image = document.getElementById(
                    "song-details-image",
                ) as HTMLImageElement;

                image.style.display = "none";

                image.src = this.song.image;

                image.onload = () => {
                    image.classList.add("song-details-transition");
                    this.imageLoaded = true;
                    image.style.display = "";
                };
            } else {
                this.imageLoaded = true;
            }
        }
    }

    public get collection(): Collection | undefined {
        const id = this.store.state.songs.collectionId;
        if (!id) return undefined;
        const collection = this.store.state.songs.collections.find((c) =>
            Object.values(c.keys).includes(id),
        );
        return collection;
    }

    public get title() {
        return this.song?.getName(this.Language);
    }

    public getLocaleString(dictionary: { [key: string]: string }) {
        if (!dictionary) return "";
        return (
            dictionary[this.Language] ??
            dictionary.en ??
            dictionary[Object.keys(dictionary)[0]]
        );
    }

    public get melodyOrigin() {
        return (
            this.song?.melodyOrigin?.description?.[this.Language] ??
            this.song?.melodyOrigin?.description?.no ??
            undefined
        );
    }

    public get identicalCopyright() {
        return this.song?.copyright.text?.id == this.song?.copyright.melody?.id;
    }
}
</script>

<style scoped>
[v-cloak] {
    display: none;
}
</style>
