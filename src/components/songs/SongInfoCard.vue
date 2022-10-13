<script setup lang="ts">
import { InformationCircleIcon, ArrowSmRightIcon } from "@heroicons/vue/solid";
import { computed, ref } from "vue";
import { Collection, Song } from "@/classes";
import { appSession } from "@/services/session";
import { EyeIcon } from "@heroicons/vue/outline";
import ContributorInfo from "./ContributorInfo.vue";

interface Props {
    language: string;
    song: Song;
    collection: Collection;
    viewCount?: number;
    isAdmin?: boolean;
}

const props = defineProps<Props>();
const title = computed(() => props.song.name.default);
const melodyOrigin = computed(() => {
    const desc = props.song.melodyOrigin?.description ?? {};
    return desc[appSession.Language] ?? desc.no;
});
const identicalCopyright = computed(() => {
    return props.song.copyrights[0]?.copyrightId === props.song.copyrights[1]?.copyrightId;
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
<template>
    <BaseCard
        v-cloak
    >
        <template #header v-if="collection || isAdmin">
            <span class="flex justify-between items-center">
                <router-link
                    :to="`/songs/${collection.key}`"
                    class="text-sm text-primary hover:underline"
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
                        :src="song.image"
                    />
                </div>
                <div class="text-gray-500 text-base flex flex-col gap-1 dark:text-gray-400" :class="{'hidden': !imageLoaded }">
                    <small
                        class="flex gap-2"
                        v-if="song.Authors.length"
                    >
                        <span>{{ (song.yearWritten ? $t("song_writtenInBy").replace('$year', song.yearWritten.toString()) : $t("song_writtenBy")).replace('$authors', '') }}</span>
                        <ContributorInfo :contributors="song.Authors" />
                        <span v-if="song.yearPublished">({{song.yearPublished}})</span>
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
                        <span v-if="song.originCountry">{{ song.originCountry }}</span>
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
<style scoped>
[v-cloak] {
    display: none;
}
</style>
