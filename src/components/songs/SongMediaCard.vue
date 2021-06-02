<template>
    <base-card
        v-if="song && (song.audioFiles.length || song.videoFiles.length || song.sheetMusic.length)"
        header
    >
        <template #header>
            <div class="flex items-center gap-4">
                <h4 class="font-bold">
                    {{ $t("song.media") }}
                </h4>
                <tooltip text="Her finner du sangens tilhørende filer" />
            </div>
        </template>
        <div class="flex flex-col gap-4">
            <div
                v-if="song.sheetMusic.length"
            >
                <p class="text-sm mb-2">
                    {{ $t("song.sheetmusic") }}
                </p>
                <media-list-item :files="song.sheetMusic" :callback="selectSheetMusic" icon="book" />
            </div>
            <div
                v-if="song.audioFiles.length"
            >
                <p class="text-sm mb-2">
                    Audio
                </p>
                <media-list-item :files="song.audioFiles" :callback="selectAudio" icon="music" />
            </div>
            <div
                v-if="song.videoFiles.length"
            >
                <p class="text-sm mb-2">
                    Video
                </p>
                <modal
                    v-for="video in song.videoFiles"
                    theme="tertiary"
                    :key="video"
                    :label="$t(`types.${video.category}`) + (video.languageKey ? ` (${video.languageKey})` : '')"
                >
                    <video
                        :src="video.directUrl"
                        width="500"
                        type="video/mp4"
                        controls
                        autoplay
                    >
                        Sorry, your browser doesn't support embedded videos.
                    </video>
                </modal>
            </div>
        </div>
    </base-card>
</template>

<script lang="ts">
import { Modal } from "@/components";
import { MediaListItem } from "@/components/media";
import { Song } from "@/classes";
import { Options, Vue } from "vue-class-component";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { MediaFile } from "dmb-api";
import { useStore } from "@/store";

@Options({
    components: {
        Modal,
        MediaListItem,
    },
    props: {
        song: {
            type: Object,
        },
    },
    name: "song-media-card",
})
export default class SongMediaCard extends Vue {
    public song?: Song;
    public store = useStore();

    public selectSheetMusic(sheet: MediaFile) {
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

    public selectAudio(audio: MediaFile) {
        const track: AudioTrack = {
            file: audio,
            song: this.song,
            collection: this.store.getters.collection,
        };
        this.store.commit(SongsMutationTypes.SET_AUDIO, track);
    }
}
</script>
