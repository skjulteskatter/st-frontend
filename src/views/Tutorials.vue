<template>
    <section>
        <!-- TODO: Header should be the same for SongList and this (?) -->
        <h1 class="font-bold text-xl md:text-2xl mb-4">{{ $t("types_tutorial") }}</h1>
        <div v-for="collection in collections" :key="collection.id" class="mb-4">
            <BaseButton
                class="mb-4"
                @click="$router.push({name: 'song-list', params: {collection: collection.key}})"
            >
                {{collection.name.default}}
            </BaseButton>
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <!-- TODO: sort by collections -->
                <FileCard v-for="file in videos(collection)" :collection="collection" :key="file.id" :file="file" @selectVideo="selectVideo" />
            </div>
        </div>
        <BaseModal :show="showVideo" @close="closeVideo()">
            <video v-if="videoUrl" :src="videoUrl" autoplay controls>
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
import { MediaType } from "songtreasures";

export default defineComponent({
    name: "collection-tutorials",
    components: {
        FileCard,
        BaseModal,
    },
    setup() {
        const supportedTypes: MediaType[] = ["video"];
        const supportedCategories = ["tutorial"];
        const files = appSession.files.filter(f => supportedTypes.includes(f.type) && supportedCategories.includes(f.category));
        const collections = appSession.collections.filter(c => files.some(f => f.getSong().collectionIds.includes(c.id)));

        return {
            files,
            collections,
        };
    },
    data() {
        return {
            videoUrl: "",
            showVideo: false,
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
        videos(collection: Collection): MediaFile[] {
            const items = this.files.filter(v => appSession.songs.some(s => s.collectionIds.includes(collection.id) && v.songId === s.id));
            return items.sort((a, b) => a.getSong().getNumber(collection.id) - b.getSong().getNumber(collection.id));
        },
    },
});
</script>
