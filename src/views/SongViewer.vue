<template>
    <div>
        <button v-if="extended && !transposed" @click="extend">Advanced</button>
        <button @click="transpose">Transpose</button>
        <lyrics-settings v-if="show && isExtended && !transposed"
            :authors="authors" 
            :composers="composers" 
            :description="description"
            :languageKey="languageKey"
            :lyrics="lyrics"
            :song="song"
            :title="title"
        ></lyrics-settings>

        <transposed-lyrics-viewer v-if="show && transposed"
            :authors="authors" 
            :composers="composers" 
            :description="description"
            :languageKey="languageKey"
            :lyrics="lyrics"
            :song="song"
            :title="title"
        ></transposed-lyrics-viewer>

        <song-details v-if="show && !isExtended && !transposed"
            :authors="authors" 
            :composers="composers" 
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
import { LyricsSettings, SongDetails, TransposedLyricsViewer } from '@/components';
import { useStore } from "vuex";
import { sessionKey, songKey } from "@/store";
import { Lyrics, Song } from "@/classes";

@Options({
    components: {
        LyricsSettings,
        SongDetails,
        TransposedLyricsViewer,
    }
})
export default class SongViewer extends Vue {
    public store = useStore(sessionKey);
    public songStore = useStore(songKey);
    public transposed = false;
    public show = true;

    public async mounted() {
        if (!this.lyrics) {
            await this.songStore.dispatch('load', {
                collectionKey: this.$route.params.collection, 
                number: this.$route.params.number,
                languageKey: this.languageKey,
            });
        }
    }

    public get extended() {
        return this.store.getters.extended;
    }

    public async transpose() {
        this.show = false;
        this.store.commit('extend', false);
        await this.songStore.dispatch('getTransposedLyrics', {languageCode: this.languageKey, transposition: 0});
        this.transposed = true;
        this.show = true;
    }

    public get isExtended() {
        return this.store.state.extend;
    }

    public extend() {
        this.show = false;
        this.store.commit('extend');
        this.show = true;
    }    
    
    public get composers() {
        return this.song?.composers ?? [];
    }
    
    public get authors() {
        return this.song?.authors ?? [];
    }
    
    public get title() {
        return this.song?.name[this.languageKey] ?? this.song?.name.en ?? this.song?.name.no ?? '';
    }

    public get description() {
        return this.song?.description[this.languageKey] ?? this.song?.description.en ?? this.song?.description.no ?? '';
    }

    public get lyrics(): Lyrics {
        return this.songStore.getters.lyrics;
    }

    public get song(): Song | undefined {
        return this.songStore.state.song;
    }
    
    public get languageKey() {
        return this.store.getters.languageKey;
    }
}
</script>