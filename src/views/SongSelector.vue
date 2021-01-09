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
            <lyrics-settings :lyrics="lyrics"></lyrics-settings>
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
    },
    computed: {
        collections() {
            return useStore(songKey).getters.collections;
        },
        collectionSelected() {
            return useStore(songKey).getters.collection != undefined && this.collectionSelect;
        },
        lyrics() {
            return useStore(songKey).getters.lyrics;
        },
        songs() {
            return useStore(songKey).getters.songs;
        },
        song() {
            return useStore(songKey).getters.song;
        },
        songSelected() {
            return useStore(songKey).getters.song != undefined && this.songSelect;
        }
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
}
</script>

<style lang="scss" scoped></style>
