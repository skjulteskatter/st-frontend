<template>
    <div class="view-song">
        <stepper :steps="steps" :callback="deselect"></stepper>

        <div id="book-step" v-if="!collectionSelected">
            <h1>Select book</h1>
            <songbooks :collections="collections" :callback="selectCollection"></songbooks>
        </div>

        <div id="song-step" v-if="!songSelected && collectionSelected">
            <h1>Select number</h1>
            <song-list :items="songs" :callback="selectSong"></song-list>
        </div>

        <div id="settings-step" v-if="songSelected && collectionSelected">
            <h1>Settings</h1>
            <lyrics-settings v-if="lyrics" :lyrics="lyrics"></lyrics-settings>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { useStore } from "vuex";
import { songKey, sessionKey } from "@/store";
import { Song } from '@/classes';
import Card from '@/components/Card.vue'
import SongList from '@/components/SongList.vue'
import Songbooks from '@/components/Songbooks.vue'
import Stepper from '@/components/Stepper.vue'
import LyricsSettings from '@/components/LyricsSettings.vue';

@Options({
    components: {
        Card,
        SongList,
        Songbooks,
        Stepper,
        LyricsSettings,
    }
})
export default class SongSelector extends Vue {
    private songStore = useStore(songKey);
    private userStore = useStore(sessionKey);
    public steps: Step[] = [];
    public songSelect = false;
    public collectionSelect = false;
    public loading = false;

    public selectCollection(collection: Collection) {
        this.songStore.commit('selectCollection', collection)
        this.collectionSelect = true;
        this.steps = [{name: collection.name.no, id: collection.id, type: "collection"}];
    }

    public async selectSong(song: Song) {
        this.songStore.commit('selectSong', song);
        this.songSelect = true;
        this.steps[1] = {name: song.number.toString(), id: song.number.toString(), type: "song"};
        this.loading = true;
        await this.songStore.dispatch('getLyrics', this.userStore.getters.currentUser?.settings?.languageKey ?? "en");
        this.loading = false;
    }

    public deselect(type: string) {
        if (type == "collection") {
            this.collectionSelect = false;
            this.songSelect = false;
            this.songStore.commit('selectSong', undefined);
            this.steps = [];
        } else if (type == "song") {
            this.songSelect = false;
            this.steps = [this.steps[0]];
        }
    }
    
    public get collections() {
        return useStore(songKey).getters.collections;
    }
    public get collectionSelected() {
        return useStore(songKey).getters.collection != undefined && this.collectionSelect;
    }
    public get lyrics() {
        return useStore(songKey).getters.lyrics;
    }
    public get songs() {

        const songs = useStore(songKey).getters.songs as Song[];

        return songs?.filter(s => s.name[this.language] != null) || [];
    }
    public get song() {
        return useStore(songKey).getters.song;
    }
    public get songSelected() {
        return useStore(songKey).getters.song != undefined && this.songSelect;
    }
    public get language() {
        return useStore(sessionKey).getters.currentUser?.settings?.languageKey;
    }
}
</script>

<style lang="scss" scoped></style>
