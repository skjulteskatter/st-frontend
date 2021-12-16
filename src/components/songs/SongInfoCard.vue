<template>
    <BaseCard
        v-if="song"
        v-cloak
    >
        <template #header v-if="collection || isAdmin">
            <span class="flex justify-between items-center">
                <router-link
                    :to="`/songs/${collection.key}`"
                    class="text-sm text-primary hover:underline"
                    v-if="collection"
                >
                    {{ collection.getName(language) }}
                </router-link>
                <router-link v-if="isAdmin" :to="{ name: 'song-stats', params: { id: song.id } }" class="ml-auto px-2 py-1 rounded-md flex gap-1 items-center text-xs hover:bg-black/5 dark:hover:bg-white/10">
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
                    <span v-if="viewCount != null && isAdmin" class="ml-auto flex items-center gap-1 font-normal text-gray-400">
                        {{ viewCount }}
                        <EyeIcon class="w-5 h-5" />
                    </span>
                </h2>
                <div 
                    class="flex flex-col"
                    v-if="song.image && song.type == 'track'"
                >
                    <img
                        id="song-details-image"
                        class="flex gap-2 rounded"
                        height="100"
                    />
                </div>
                <div class="text-gray-500 text-base flex flex-col gap-1 dark:text-gray-400" :class="{'hidden': !imageLoaded }">
                    <small
                        class="flex gap-2"
                        v-if="song.Authors.length"
                    >
                        <span>{{ (song.yearWritten ? $t("song_writtenInBy").replace('$year', song.yearWritten.toString()) : $t("song_writtenBy")).replace('$authors', '') }}</span>
                        <ContributorInfo :contributors="song.Authors" />
                    </small>
                    <small
                        v-if="song.Composers.length"
                        class="flex gap-2"
                    >
                        <span>{{ (song.yearComposed ? $t("song_composedInBy").replace('$year', song.yearComposed.toString()) : $t("song_composedBy")).replace('$composers', '') }}</span>
                        <ContributorInfo :contributors="song.Composers" />
                    </small>
                    <small 
                        v-if="!song.Composers.length && !melodyOrigin"
                        class="flex gap-2"
                    >
                        <span>{{$t("song_unknownComposer")}}</span>
                    </small>
                    <small
                        class="flex gap-2"
                        v-if="melodyOrigin"
                    >
                        {{ melodyOrigin }}
                    </small>
                    <small
                        class="flex gap-2"
                        v-if="
                            song.copyright.melody &&
                            song.copyright.text &&
                            identicalCopyright
                        "
                    >
                        © {{ song.copyright.melody.getName(language) }}
                    </small>
                    <div v-else>
                        <small
                            class="flex gap-2"
                            v-if="song.copyright.text"
                        >
                            {{ $t("song_text") }} ©:
                            {{ song.copyright.text.getName(language) }}
                        </small>
                        <small
                            class="flex gap-2"
                            v-if="song.copyright.melody"
                        >
                            {{ $t("song_melody") }} ©:
                            {{ song.copyright.melody.getName(language) }}
                        </small>
                    </div>
                    <small class="flex gap-2">
                        <span v-if="song.originCountry">{{ $t(song.originCountry) }}</span>
                        <span v-if="song.originCountry">&middot;</span>
                        <span v-if="song.originalKey">{{ song.originalKey }}</span>
                        <span v-if="song.originalKey">&middot;</span>
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
    </BaseCard>
</template>
<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { Collection, Song } from "@/classes";
import { useStore } from "@/store";
import { InformationCircleIcon, ArrowSmRightIcon } from "@heroicons/vue/solid";
import { EyeIcon } from "@heroicons/vue/outline";
import ContributorInfo from "./ContributorInfo.vue";

export default defineComponent({
    name: "song-info-card",
    components: {
        ContributorInfo,
        InformationCircleIcon,
        ArrowSmRightIcon,
        EyeIcon,
    },
    props: {
        language: {
            type: String,
            required: true,
        },
        song: {
            type: Object as PropType<Song>,
            required: true,
        },
        collection: {
            type: Object as PropType<Collection>,
            required: true,
        },
        viewCount: {
            type: Number,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        store: useStore(),
        imageLoaded: false,
        showDescription: false,
    }),
    computed: {
        title() {
            return this.song?.getName(this.language);
        },
        melodyOrigin() {
            return (
                this.song?.melodyOrigin?.description?.[this.language] ??
                this.song?.melodyOrigin?.description?.no ??
                undefined
            );
        },
        identicalCopyright() {
            return this.song?.copyright.text?.id == this.song?.copyright.melody?.id;
        },
    },
    mounted() {
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
    },
});
</script>

<style scoped>
[v-cloak] {
    display: none;
}
</style>
