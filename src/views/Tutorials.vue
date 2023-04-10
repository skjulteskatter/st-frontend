<template>
    <section>
        <!-- TODO: Header should be the same for SongList and this (?) -->
        <header class="flex gap-4 items-center mb-4">
            <h1 class="font-bold text-xl md:text-2xl">{{ $t("types_tutorial") }}</h1>
            <!-- <span class="bg-green-500/20 text-green-700 px-2 py-1 rounded-md uppercase tracking-wide text-xs">free</span> -->
        </header>
        <!-- <select
            v-model="instrumentId"
        >
            <option 
                v-for="instrument in instruments" 
                :key="instrument.id"
                :value="instrument.id"
            >
                {{$t("instrument_" + instrument.identifier)}}
            </option>
        </select> -->
        <div v-for="collection in collections" :key="collection.id" class="mb-8">
            <BaseButton
                class="mb-4"
                theme="neutral"
                @click="$router.push({name: 'song-list', params: {collection: collection.key}})"
            >
                {{collection.name.default}}
            </BaseButton>
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <!-- TODO: sort by collections -->
                <SongFileCard 
                    v-for="song in collectionSongs(collection)" 
                    :key="song.id"
                    :song="song"
                    :collection="collection" 
                    :files="songFiles(song)"
                    :defaultInstrumentId="instrumentId"
                    :language="language"
                    @selectVideo="selectVideo" 
                />
            </div>
        </div>
        <BaseModal :show="showVideo" @close="closeVideo()">
            <video v-if="videoUrl" :src="videoUrl" autoplay controls controlsList="nodownload">
                Video is not supported
            </video>
        </BaseModal>
    </section>
</template>

<script lang="ts">
import { Collection, MediaFile, Song } from "@/classes";
import { BaseModal } from "@/components";
import { SongFileCard } from "@/components/media";
import { appSession } from "@/services/session";
import { defineComponent } from "vue";
import { MediaType } from "songtreasures-api";

export default defineComponent({
    name: "collection-tutorials",
    components: {
        SongFileCard,
        BaseModal,
    },
    setup() {
        const supportedTypes: MediaType[] = ["video", "audio"];
        const supportedCategories = ["tutorial", "karaoke"];
        const files = appSession.files.filter(f => supportedTypes.includes(f.type) && supportedCategories.includes(f.category));
        const songs = appSession.songs.filter(s => files.some(f => f.songId === s.id));
        const collections = appSession.collections.filter(c => files.some(f => f.getSong()?.collectionIds.includes(c.id)));

        const instruments = appSession.instruments;

        return {
            instruments,
            files,
            songs,
            collections,
            language: appSession.Language,
        };
    },
    data() {
        return {
            videoUrl: "",
            showVideo: false,
            instrumentId: appSession.instruments[0].id,
        };
    },
    methods: {
        selectVideo(url: string) {
            this.videoUrl = url;
            this.showVideo = true;
        },
        closeVideo() {
            this.videoUrl = "";
            this.showVideo = false;
        },
        songFiles(song: Song): MediaFile[] {
            return this.files.filter(f => f.songId === song.id);
        },
        collectionSongs(collection: Collection): Song[] {
            const items = this.songs.filter(s => s.collectionIds.includes(collection.id));
            return items.sort((a, b) => a.getNumber(collection.id) - b.getNumber(collection.id));
        },
    },
});
</script>
