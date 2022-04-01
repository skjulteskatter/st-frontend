<template>
    <BaseCard class="break-inside-avoid" v-if="title && songs.length > 0">
        <template #header>
            <div class="flex justify-between">
                <b
                    :class="{ 'hover:bg-black/10 bg-black/5 rounded px-2 cursor-pointer dark:bg-white/10 dark:hover:bg-white/20': action != undefined }"
                    @click="action"
                >
                    {{ title }}
                </b>
                <b class="text-gray-500" v-if="count">{{ songs.length }}</b>
            </div>
        </template>
        <ul class="text-xs">
            <li
                v-for="song in songs"
                :key="song.id"
                :class="{
                    'opacity-40': !song.available,
                }"
            >
                <button 
                    @click="viewSong(song)" 
                    class="w-full text-left flex hover:text-primary hover:underline cursor-pointer dark:opacity-90"
                    :class="{'text-yellow-700': !song.enabled}"
                >
                    <b class="w-6 flex-shrink-0 mr-2 text-right">
                        {{ song.getNumber(collection.id) }}
                    </b>
                    <span>
                        {{ song.title }}
                    </span>
                    <!-- <div class="flex-grow flex items-baseline ml-2">
                        <StarIcon class="w-3 h-3 text-primary ml-1" v-if="song.newMelody" />
                        <span class="ml-auto opacity-50 flex items-center gap-1" v-if="isAdmin">
                            {{ song.Views }}
                            <EyeIcon class="w-3 h-3 opacity-50" />
                        </span>
                    </div> -->
                </button>
            </li>
        </ul>
    </BaseCard>
</template>
<script lang="ts" setup>
// import { StarIcon, EyeIcon } from "@heroicons/vue/outline";
import router from "@/router";
import { Collection, Song } from "hiddentreasures-js";

const props = defineProps<{
    songs: Song[];
    collection: Collection;
    title: string;
    count: boolean;
    action?: () => void;
}>();

const viewSong = (song: Song) => {
    router.push({
        name: "song",
        params: {
            collection: props.collection.key,
            number: song.getNumber(props.collection.id),
        },
    });
};
</script>
