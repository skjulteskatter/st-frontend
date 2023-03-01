<template>
    <section>
        <!-- TODO: Header should be the same for SongList and this (?) -->
        <div class="mb-4 flex flex-wrap gap-4 items-start md:items-center">
            <h1 class="font-bold text-2xl md:text-3xl">Files</h1>
            <BaseButton theme="neutral" @click="$router.push({name: 'song-list', params: $route.params})">{{$t('common_songs')}}</BaseButton>
        </div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FileCard v-for="file in videos" :key="file.id" :file="file" @selectVideo="selectVideo" />
            <FileCard v-for="file in audio" :key="file.id" :file="file" />
        </div>
        <BaseModal :show="showVideo" @close="closeVideo()">
            <video :src="videoUrl" autoplay controls controlsList="nodownload">
                Video is not supported
            </video>
        </BaseModal>
    </section>
</template>

<script lang="ts">
import { Collection, MediaFile } from "@/classes";
import { BaseModal } from "@/components";
import { FileCard } from "@/components/media";
import { appSession } from "@/services/session";
import { defineComponent } from "@vue/runtime-core";
import { MediaType } from "songtreasures-api";

export default defineComponent({
    name: "collection-files",
    components: {
        FileCard,
        BaseModal,
    },
    data() {
        const collectionKey = this.$route.params.collection as string;
        const collection = appSession.getCollection(collectionKey) as Collection;
        const songs = collection.songs;
        const supportedTypes: MediaType[] = ["video", "audio"];
        const files = appSession.files.filter(f => supportedTypes.includes(f.type) && songs.some(s => s.id === f.songId));

        return {
            files,
            collection,
            videoUrl: "",
            showVideo: false,
        };
    },
    computed: {
        videos(): MediaFile[] {
            return this.files.filter(f => f.type === "video") as MediaFile[];
        },
        audio(): MediaFile[] {
            return this.files.filter(f => f.type === "audio") as MediaFile[];
        },
    },
    methods: {
        selectVideo(url: string) {
            this.videoUrl = url;
            this.showVideo = true;
        },
        closeVideo() {
            this.showVideo = false;
            this.videoUrl = "";
        },
    },
});
</script>
