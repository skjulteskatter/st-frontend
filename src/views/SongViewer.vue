<template>
    <div v-if="initialized && song">
        <div class="loader" v-if="loading"></div>
        <div v-if="!loading">
            <base-button v-if="extended && !transposed" @click="extend"
                >Advanced</base-button
            >
            <base-button @click="transpose">Transpose</base-button>
            
            <song-info-card
                :song="song"
                :languageKey="languageKey"
                :verses="lyrics ? Object.keys(lyrics.content).length : 0"
            ></song-info-card>

            <lyrics-settings
                v-if="isExtended && !transposed"
                :languageKey="languageKey"
                :lyrics="lyrics"
                :song="song"
            ></lyrics-settings>

            <transposed-lyrics-viewer
                v-if="transposed"
                :languageKey="languageKey"
                :song="song"
            ></transposed-lyrics-viewer>

            <song-details
                v-if="!isExtended && !transposed"
                :languageKey="languageKey"
                :lyrics="lyrics"
                :song="song"
            ></song-details>
        </div>
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
import { SongInfoCard } from '@/components/songs';

@Options({
    components: {
        LyricsSettings,
        SongDetails,
        TransposedLyricsViewer,
        BaseButton,
        SongInfoCard,
    },
})
export default class SongViewer extends Vue {
    public store = useStore(sessionKey);
    public songStore = useStore(songKey);
    public transposed = false;

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
        this.store.commit("extend", false);
        this.songStore.dispatch("transpose", 0);
        this.transposed = true;
    }

    public get loading() {
        return this.songStore.getters.collection?.loading;
    }

    public get isExtended() {
        return this.store.state.extend;
    }

    public extend() {
        this.store.commit("extend");
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