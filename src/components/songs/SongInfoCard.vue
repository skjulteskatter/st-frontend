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
                <router-link :to="{ name: 'song-stats', params: { id: song.id } }" class="px-2 py-1 rounded-md flex gap-1 items-center text-xs hover:bg-black/5 dark:hover:bg-white/10">
                    {{ $t('song.seeStatistics') }}
                    <ArrowSmRightIcon class="w-4 h-4" />
                </router-link>
            </span>
        </template>
        <h2 class="flex text-xl font-bold mb-2">
            <span class="text-gray-400 mr-4">
                {{ song.number }}
            </span>
            <span class="mr-4">
                {{ title }}
            </span>
            <span v-if="viewCount != null" class="opacity-50 font-normal">
                ({{ viewCount }})
            </span>
        </h2>
        <div class="flex items-start gap-2">
            <img
                id="song-details-image"
                class="rounded"
                v-if="song.image"
                height="100"
            />
            <span
                v-if="song.verses && imageLoaded"
                class="p-1 rounded border border-gray-500 text-gray-500 text-xs song-details-transition dark:text-gray-400 dark:border-gray-400"
            >
                {{ song.verses }}
                {{ song.verses > 1 ? $t("song.verses").toLocaleLowerCase() : $t("song.verse").toLocaleLowerCase() }}
            </span>
            <div class="text-gray-500 text-base flex flex-col gap-1 dark:text-gray-400" v-if="imageLoaded">
                <small 
                    class="flex gap-2" 
                    v-if="song.hasLyrics && song.Authors.length"
                >
                    <span>{{ (song.yearWritten ? $t("song.writtenInBy").replace('$year', song.yearWritten.toString()) : $t("song.writtenBy")).replace('$authors', '') }}</span>
                    <span v-for="i in song.Authors" :key="i.id" class="px-1 rounded bg-gray-200 border hover:border-gray-400 dark:bg-white dark:bg-opacity-20 dark:text-white dark:border-gray-500 dark:hover:border-gray-400">
                        <router-link
                            :to="{
                                name: 'contributor',
                                params: {
                                    contributor: i.id,
                                },
                            }"
                        >
                            {{ i.name }}
                        </router-link>
                    </span>
                </small>
                <small
                    v-if="song.Composers.length > 0"
                    class="flex gap-2"
                >
                    <span>{{ (song.yearComposed ? $t("song.composedInBy").replace('$year', song.yearComposed.toString()) : $t("song.composedBy")).replace('$composers', '') }}</span>
                    <span
                        v-for="i in song.Composers"
                        :key="i.id"
                        :label="i.name"
                        class="px-1 rounded bg-gray-200 border hover:border-gray-400 dark:bg-white dark:bg-opacity-20 dark:text-white dark:border-gray-500 dark:hover:border-gray-400"
                    >
                        <router-link
                            :to="{
                                name: 'contributor',
                                params: {
                                    contributor: i.id,
                                },
                            }"
                        >
                            {{ i.name }}
                        </router-link>
                    </span>
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
                        {{ $t("song.text") }} ©:
                        {{ getLocaleString(song.copyright.text.name) }}
                    </small>
                    <small
                        class="flex gap-2"
                        v-if="song.copyright.melody"
                    >
                        {{ $t("song.melody") }} ©:
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
                    <span v-if="song.originCountry">{{ song.originCountry }}</span>
                    <span v-if="song.originalKey">({{ song.originalKey }})</span>
                </small>
            </div>
        </div>
        <div v-if="description" class="flex flex-col gap-4 mt-4 pt-4 relative border-t border-black/10 dark:border-white/10">
            <div
                class="text-sm"
                :class="{ 'h-12 overflow-hidden': !showDescription }"
                v-html="description"
            ></div>
            <span 
                class="absolute bg-gradient-to-t from-white to-transparent dark:from-secondary bottom-0 w-full h-full" 
                v-if="!showDescription"
            >
                <button aria-label="Show song details" @click="showDescription = !showDescription" class="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <ArrowDownIcon class="w-5 h-5" />
                </button>
            </span>
        </div>
    </base-card>
</template>
<script lang="ts">
import { Collection, Song } from "@/classes";
import { Options, Vue } from "vue-class-component";
import { Modal } from "@/components";
import { useStore } from "@/store";
import { ArrowDownIcon, ArrowSmRightIcon } from "@heroicons/vue/solid";

@Options({
    components: {
        Modal,
        ArrowDownIcon,
        ArrowSmRightIcon,
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

    public get description() {
        return this.song?.getTranslatedProperty(
            this.song.details,
            this.Language
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

<style lang="scss">
@keyframes slideInFromLeft {
    0% {
        transform: translateX(-50px);
        opacity: 0;
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

[v-cloak] {
    display: none;
}

.song-details-transition {
    animation: 0.5s ease-out 0s 1 slideInFromLeft;
}

.song-details__metadata {
    &__info {
        animation: 0.5s ease-out 0s 1 slideInFromLeft;
    }
}
</style>
