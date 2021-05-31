<template>
    <div class="flex flex-col gap-2">
        <button
            class="p-2 rounded cursor-pointer border border-gray-300 hover:border-gray-500 flex items-center gap-2 focus:ring focus:ring-primary focus:outline-none"
            v-for="sheet in SheetMusic"
            :key="sheet.id"
            @click="sheetMusic(sheet)"
        >
            <icon name="book" size="14" class="text-gray-500" />
            <small>
                {{$t(`types.${sheet.category}`)}}
                <!-- <span style="opacity: 0.5">{{ $t(`types.${sheet.category}`).toLowerCase() }}</span> -->
            </small>
        </button>
    </div>
</template>

<script lang="ts">
import { Collection, Song } from "@/classes";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { MediaFile } from "dmb-api";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "sheetmusic-playlist",
    props: {
        sheetmusic: {
            type: Array,
            required: true,
        },
    },
})
export default class SheetmusicPlaylist extends Vue {
    public store = useStore();
    public sheetmusic?: MediaFile[];

    public get SheetMusic() {
        return this.sheetmusic ?? [];
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get song(): Song | undefined {
        return this.store.getters.song;
    }

    public get collection(): Collection | undefined {
        return this.store.getters.collection;
    }
}
</script>
