<template>
    <div v-if="initialized && song">
        <base-button v-if="extended && !transposed" @click="extend"
            >Advanced</base-button
        >
        <base-button @click="transpose">Transpose</base-button>
        <lyrics-settings
            v-if="show && isExtended && !transposed"
            :description="description"
            :languageKey="languageKey"
            :lyrics="lyrics"
            :song="song"
            :title="title"
        ></lyrics-settings>

        <transposed-lyrics-viewer
            v-if="show && transposed"
            :description="description"
            :languageKey="languageKey"
            :lyrics="lyrics"
            :song="song"
            :title="title"
        ></transposed-lyrics-viewer>

        <song-details
            v-if="show && !isExtended && !transposed"
            :description="description"
            :languageKey="languageKey"
            :lyrics="lyrics"
            :song="song"
            :title="title"
        ></song-details>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import {
    LyricsSettings,
    SongDetails,
    TransposedLyricsViewer,
} from "@/components";
import { useStore } from "vuex";
import { sessionKey, songKey } from "@/store";
import { Lyrics, Song } from "@/classes";
import BaseButton from "@/components/BaseButton.vue";

@Options({
    components: {
        LyricsSettings,
        SongDetails,
        TransposedLyricsViewer,
        BaseButton,
    },
})
export default class SongViewer extends Vue {
    public store = useStore(sessionKey);
    public songStore = useStore(songKey);
    public transposed = false;
    public show = true;

    public async mounted() {
        if (!this.songStore.getters.collection) {
            await this.songStore.dispatch('selectCollection', this.$route.params.collection);
        }
        await this.songStore.dispatch('selectSong', this.$route.params.number);
    }

    public get extended() {
        return this.store.getters.extended;
    }

    public async transpose() {
        this.show = false;
        this.store.commit("extend", false);
        await this.songStore.dispatch("transpose", 0);
        this.transposed = true;
        this.show = true;
    }

    public get isExtended() {
        return this.store.state.extend;
    }

    public extend() {
        this.show = false;
        this.store.commit("extend");
        this.show = true;
    }

    public get title() {
        return (
            this.song?.name[this.languageKey] ??
            this.song?.name.en ??
            this.song?.name.no ??
            ""
        );
    }

    public get description() {
        return (
            this.song?.description[this.languageKey] ??
            this.song?.description.en ??
            this.song?.description.no ??
            ""
        );
    }

    public get lyrics(): Lyrics | undefined {
        return this.songStore.getters.lyrics;
    }

    public get song(): Song | undefined {
        return this.songStore.getters.song;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get initialized() {
        return this.store.state.initialized;
    }
}
</script>