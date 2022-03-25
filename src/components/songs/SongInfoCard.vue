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
                <router-link v-if="isAdmin" :to="{ name: 'song-stats', params: { id: song.id } }" class="ml-auto px-2 py-1 rounded-md flex gap-1 items-center text-xs hover:bg-black/5 dark:hover:bg-white/10">
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
                    v-if="song.image && song.type == 'track'"
                >
                    <img
                        id="song-details-image"
                        class="flex gap-2 rounded"
                        height="100"
                        :src="song.image"
                    />
                </div>
                <div class="text-gray-500 text-base flex flex-col gap-1 dark:text-gray-400" :class="{'hidden': !imageLoaded }">
                    <small
                        class="flex gap-2"
                        v-if="authors.length"
                    >
                        <span>{{ (song.yearWritten ? $t("song_writtenInBy").replace('$year', song.yearWritten.toString()) : $t("song_writtenBy")).replace('$authors', '') }}</span>
                        <ContributorInfo :contributors="authors" />
                    </small>
                    <small
                        v-if="composers.length"
                        class="flex gap-2"
                    >
                        <span>{{ (song.yearComposed ? $t("song_composedInBy").replace('$year', song.yearComposed.toString()) : $t("song_composedBy")).replace('$composers', '') }}</span>
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
                        <span v-if="song.originalKey">{{ song.originalKey }}</span>
                        <span v-if="song.originalKey">&middot;</span>
                        <!-- <span v-if="song.verses">{{ song.verses }}</span> -->
                    </small>
                </div>
            </div>
        </div>
        <div v-if="song.description" class="flex flex-col gap-4 relative">
            <div
                class="mt-8 text-sm song-description"
                :class="{ 'hidden': !showDescription }"
                v-html="song.description"
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
import { Collection, Song } from "@/classes";
import { EyeIcon } from "@heroicons/vue/outline";
import ContributorInfo from "./ContributorInfo.vue";
import contributorService from "@/services/contributorService";
import copyrightService from "@/services/items/copyrightService";

interface Props {
    language: string;
    song: Song;
    collection: Collection;
    viewCount?: number;
    isAdmin?: boolean;
}


const props = defineProps<Props>();
const title = computed(() => props.song.title);
const melodyOrigin = computed(() => {
    return props.song.origins.find(o => o.type === "melody")?.description ?? null;
});
const contributors = await contributorService.retrieve({
    itemIds: props.song.participants.map(i => i.contributorId),
});
const authors = computed(() => {
    return contributors.filter(c => props.song.participants.some(p => p.type === "author" && p.contributorId === c.id));
});
const composers = computed(() => {
    return contributors.filter(c => props.song.participants.some(p => p.type === "composer" && p.contributorId === c.id));
});
const copyrights = await copyrightService.list();
const copyright = computed(() => {
    const songCopyrights = {
        text: props.song.copyrights.find(c => c.type === "text") ?? null,
        melody: props.song.copyrights.find(c => c.type === "melody") ?? null,
    };
    return {
        text: copyrights.find(c => c.id === songCopyrights.text?.referenceId) ?? null,
        melody: copyrights.find(c => c.id === songCopyrights.melody?.referenceId) ?? null,
    };
});
const identicalCopyright = computed(() => {
    return copyright.value.melody && copyright.value.text && (copyright.value.melody.id && copyright.value.text.id);
});

const number = computed(() => {
    if ((props.collection as unknown as {useNumbers: boolean}).useNumbers ?? false) {
        return props.song.collections.find(c => c.collectionId === props.collection.id)?.number ?? 0;
    }
    return null;
});

let showDescription = ref(false);
let imageLoaded = false;
if (props.song.image) {
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
