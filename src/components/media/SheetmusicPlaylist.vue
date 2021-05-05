<template>
    <div class="sheetmusic-playlist">
        <div
            class="sheetmusic-playlist__file"
            v-for="sheet in sheetmusic"
            :key="sheet.id"
            @click="sheetMusic(sheet)"
        >
            <small class="sheetmusic-playlist__file__name">
                {{$t(`types.${sheet.category}`)}}
                <!-- <span style="opacity: 0.5">{{ $t(`types.${sheet.category}`).toLowerCase() }}</span> -->
            </small>
        </div>
    </div>
</template>

<script lang="ts">
import { Collection, Song } from "@/classes";
import { useStore } from "@/store";
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
    public sheetmusic: MediaFile[] = [];

    public sheetMusic(sheet: MediaFile) {
        // this.$router.push({name: "songs-sheet-music"});
        // osmd.load(this.songStore.state.sheetMusic);
        const options: SheetMusicOptions = {
            show: true,
            url: sheet?.directUrl,
            originalKey: this.song?.originalKey,
            transposition: this.transposition,
            type: sheet?.type,
        };

        localStorage.setItem("song_item", JSON.stringify(this.song));
        localStorage.setItem("sheetmusic_options", JSON.stringify(options));

        window.open("/sheetmusic", "Sheet Music", "resizeable,scrollbars");
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

<style lang="scss">
.sheetmusic-playlist {
    &__file {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        width: auto;
        border: 1px solid var(--st-color-border);
        border-radius: var(--st-border-radius);

        &__category {
            padding: calc(var(--st-spacing) * 0.5);
            opacity: 0.5;
            border-left: 1px solid var(--st-color-border);
        }

        &__name {
            padding: calc(var(--st-spacing) * 0.5);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        &:hover {
            border-color: var(--st-color-primary);

            .sheetmusic-playlist__file__name {
                color: var(--st-color-primary);
            }
        }

        &:not(:last-child) {
            margin-bottom: calc(var(--st-spacing) / 2);
        }
    }
}
</style>
