<template>
  <div class="view-song">
    <h1>Book</h1>
    <songbooks :collections="collections"></songbooks>

    <h1>Number</h1>
    <song-list :items="testSongs"></song-list>

    <lyrics-viewer :lyrics="lyrics"></lyrics-viewer>
  </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { useStore } from "vuex";
import { sessionKey } from "@/store";
import Card from '@/components/Card.vue'
import SongList from '@/components/SongList.vue'
import Songbooks from '@/components/Songbooks.vue'
import LyricsViewer from '@/components/LyricsViewer.vue'

@Options({
    components: {
        Card,
        SongList,
        Songbooks,
        LyricsViewer
    },
    created(){
      for(let i = 0; i < 400; i++){
        this.testSongs[i] = i+1
      }
    },
    computed: {
        collections(){
            return useStore(sessionKey).state.songService?.collections;
        }
    },
    data(){
      return {
        testSongs: new Array(100)
      }
    }
})
export default class ViewSong extends Vue {
    private lyrics: Lyrics = {} as Lyrics;

    // public get SongService() {
    //     return this.songService;
    // }

    public get Lyrics() {
        return this.lyrics;
    }
}
</script>

<style lang="scss" scoped></style>
