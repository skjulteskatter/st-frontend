<template>
    <section>
        <!-- TODO: Header should be the same for SongList and this (?) -->
        <h1 class="font-bold text-xl md:text-2xl mb-4">{{ $t("types_tutorial") }}</h1>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <!-- TODO: sort by collections -->
            <FileCard v-for="file in videos" :key="file.id" :file="file" @selectVideo="selectVideo" />
        </div>
        <BaseModal :show="showVideo" @close="closeVideo()">
            <video :src="videoUrl" autoplay controls>
                Video is not supported
            </video>
        </BaseModal>
    </section>
</template>

<script lang="ts">
import { MediaFile } from "@/classes";
import { BaseModal } from "@/components";
import { FileCard } from "@/components/media";
import { appSession } from "@/services/session";
import { defineComponent } from "@vue/runtime-core";
import { MediaType } from "songtreasures";

export default defineComponent({
    name: "collection-tutorials",
    components: {
        FileCard,
        BaseModal,
    },
    data() {
        const supportedTypes: MediaType[] = ["video"];
        const files = appSession.files.filter(f => supportedTypes.includes(f.type));

        return {
            files,
            videoUrl: "",
            showVideo: false,
        };
    },
    computed: {
        videos(): MediaFile[] {
            return this.files.filter(f => f.type === "video" && f.category === "tutorial");
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
