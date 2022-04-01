<template>
    <BaseCard
        v-cloak
    >
        <template #header v-if="collection || isAdmin">
            <span class="flex justify-between items-center">
                <router-link
                    :to="`/songs/${collection.keys.no}`"
                    class="text-sm text-primary hover:underline"
                >
                    {{ collection.title }}
                </router-link>
                <router-link v-if="isAdmin" :to="{ name: 'song-stats', params: { id: view.item.id } }" class="ml-auto px-2 py-1 rounded-md flex gap-1 items-center text-xs hover:bg-black/5 dark:hover:bg-white/10">
                    {{ $t('song_seeStatistics') }}
                    <ArrowSmRightIcon class="w-4 h-4" />
                </router-link>
            </span>
        </template>
        <div class="flex items-start gap-4">
            <span class="text-gray-400 text-xl font-bold" v-if="number">
                {{ number }}
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
                    v-if="view.item.image && view.item.type == 'track'"
                >
                    <img
                        id="song-details-image"
                        class="flex gap-2 rounded"
                        height="100"
                        :src="view.item.image"
                    />
                </div>
                <div class="text-gray-500 text-base flex flex-col gap-1 dark:text-gray-400" :class="{'hidden': !imageLoaded }">
                    <small
                        class="flex gap-2"
                        v-if="authors.length"
                    >
                        <span>{{ (view.item.yearWritten ? $t("song_writtenInBy").replace('$year', view.item.yearWritten.toString()) : $t("song_writtenBy")).replace('$authors', '') }}</span>
                        <ContributorInfo :contributors="authors" />
                    </small>
                    <small
                        v-if="composers.length"
                        class="flex gap-2"
                    >
                        <span>{{ (view.item.yearComposed ? $t("song_composedInBy").replace('$year', view.item.yearComposed.toString()) : $t("song_composedBy")).replace('$composers', '') }}</span>
                        <ContributorInfo :contributors="composers" />
                    </small>
                    <!-- <small 
                        v-if="!song.Composers.length && !melodyOrigin"
                        class="flex gap-2"
                    >
                        <span>{{$t("song_unknownComposer")}}</span>
                    </small> -->
                    <small
                        class="flex gap-2"
                        v-if="melodyOrigin"
                    >
                        {{ melodyOrigin }}
                    </small>
                    <small
                        class="flex gap-2"
                        v-if="identicalCopyright"
                    >
                        © {{ copyright.melody?.name }}
                    </small>
                    <div v-else>
                        <small
                            class="flex gap-2"
                            v-if="copyright.text"
                        >
                            {{ $t("song_text") }} ©:
                            {{ copyright.text.name }}
                        </small>
                        <small
                            class="flex gap-2"
                            v-if="copyright.melody"
                        >
                            {{ $t("song_melody") }} ©:
                            {{ copyright.melody.name }}
                        </small>
                    </div>
                    <small class="flex gap-2">
                        <!-- <span v-if="song.originCountry">{{ song.originCountry }}</span> -->
                        <!-- <span v-if="song.originCountry">&middot;</span> -->
                        <span v-if="view.item.originalKey">{{ view.item.originalKey }}</span>
                        <span v-if="view.item.originalKey">&middot;</span>
                        <!-- <span v-if="song.verses">{{ song.verses }}</span> -->
                    </small>
                </div>
            </div>
        </div>
        <div v-if="view.item.description" class="flex flex-col gap-4 relative">
            <div
                class="mt-8 text-sm song-description"
                :class="{ 'hidden': !showDescription }"
                v-html="view.item.description"
            ></div>
            <button v-if="!showDescription" aria-label="Show song details" @click="showDescription = !showDescription" class="mt-4 text-gray-500 mx-auto hover:bg-black/5 dark:hover:bg-white/5 dark:text-gray-400 px-3 py-1 rounded-md flex gap-2 items-center">
                <InformationCircleIcon class="w-4 h-4" />
                <span class="text-sm">{{ $t('store_learnMore') }}</span>
            </button>
        </div>
    </BaseCard>
</template>
<script setup lang="ts">
import { InformationCircleIcon, ArrowSmRightIcon } from "@heroicons/vue/solid";
import { computed, ref } from "vue";
import { Collection } from "@/classes";
import { EyeIcon } from "@heroicons/vue/outline";
import ContributorInfo from "./ContributorInfo.vue";
import SongView from "@/classes/views/songView";

interface Props {
    language: string;
    view: SongView;
    collection: Collection;
    viewCount?: number;
    isAdmin?: boolean;
}

const props = defineProps<Props>();
const title = computed(() => props.view.item.title);
const melodyOrigin = computed(() => {
    return props.view.item.origins.find(o => o.type === "melody")?.description ?? null;
});
const authors = computed(() => {
    return props.view.contributors.filter(c => props.view.item.participants.some(p => p.type === "author" && p.contributorId === c.id));
});
const composers = computed(() => {
    return props.view.contributors.filter(c => props.view.item.participants.some(p => p.type === "composer" && p.contributorId === c.id));
});
const copyright = computed(() => {
    const songCopyrights = {
        text: props.view.item.copyrights.find(c => c.type === "text") ?? null,
        melody: props.view.item.copyrights.find(c => c.type === "melody") ?? null,
    };
    return {
        text: props.view.copyrights.find(c => c.id === songCopyrights.text?.referenceId) ?? null,
        melody: props.view.copyrights.find(c => c.id === songCopyrights.melody?.referenceId) ?? null,
    };
});
const identicalCopyright = computed(() => {
    return copyright.value.melody && copyright.value.text && (copyright.value.melody.id && copyright.value.text.id);
});

const number = computed(() => {
    if ((props.collection as unknown as {useNumbers: boolean}).useNumbers ?? false) {
        return props.view.item.collections.find(c => c.collectionId === props.collection.id)?.number ?? 0;
    }
    return null;
});

let showDescription = ref(false);
let imageLoaded = false;
if (props.view.item.image) {
    const image = document.getElementById(
        "song-details-image",
    ) as HTMLImageElement;

    image.style.display = "none";

    image.onload = () => {
        image.classList.add("song-details-transition");
        imageLoaded = true;
        image.style.display = "";
    };
} else {
    imageLoaded = true;
}
</script>
<style scoped>
[v-cloak] {
    display: none;
}
</style>
