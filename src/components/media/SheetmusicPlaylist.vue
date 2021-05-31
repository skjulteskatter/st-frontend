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

    public sheetMusic(sheet: MediaFile) {
        // this.$router.push({name: "songs-sheet-music"});
        // osmd.load(this.songStore.state.sheetMusic);
        const options: SheetMusicOptions = {
            show: true,
            url: sheet?.directUrl,
            originalKey: this.song?.originalKey ?? "C",
            transposition: this.transposition,
            type: sheet?.type,
        };

        this.store.commit(SongsMutationTypes.SET_SHEETMUSIC_OPTIONS, options);

        // localStorage.setItem("song_item", JSON.stringify(this.song));
        // localStorage.setItem("sheetmusic_options", JSON.stringify(options));

        // window.open("/sheetmusic", "Sheet Music", "resizeable,scrollbars");
    }

    public get transposition() {
        return this.store.state.songs.transposition;
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
