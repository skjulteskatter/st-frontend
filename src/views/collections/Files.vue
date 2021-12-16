<template>
    <div class="song-list song-list__items">
        <!-- TODO: Header should be the same for SongList and this (?) -->
        <h1>Videos</h1>
        <FileCard v-for="file in videos" :key="file.id" :file="file" @selectVideo="selectVideo" />
        <BaseModal :show="showVideo" @close="showVideo = false">
            <video :src="videoUrl" autoplay controls>
                Video is not supported
            </video>
        </BaseModal>
    </div>
</template>
<script lang="ts">
import { Collection, MediaFile } from "@/classes";
import { BaseModal } from "@/components";
import { FileCard } from "@/components/media";
import { appSession } from "@/services/session";
import { defineComponent } from "@vue/runtime-core";
import { MediaType } from "songtreasures";

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
            return this.files.filter(f => f.type === "video");
        },
        audio(): MediaFile[] {
            return this.files.filter(f => f.type === "audio");
        },
    },
    methods: {
        selectVideo(url: string) {
            this.videoUrl = url;
            this.showVideo = true;
        },
    },
});
</script>
