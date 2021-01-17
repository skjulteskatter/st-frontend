<template>
    <div>
        <input type="text" class="song-list__search" placeholder="Search..." v-model="searchQuery">
        <div v-if="filteredLyrics.length < 20">
            <p v-for="lyrics in filteredLyrics" :key="lyrics.number">{{lyrics.title}}</p>
        </div>
    </div>
</template>
<script lang="ts">
import { sessionKey, songKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";

@Options({
})
export default class LyricsSearch extends Vue {
    public collection?: Collection = useStore(songKey).state.collection;

    public searchQuery = '';

    public mounted() {
        useStore(songKey).dispatch('getAllLyrics', useStore(sessionKey).state.currentUser.settings?.languageKey ?? "no");
    }

    public get allLyrics() {
        return useStore(songKey).state.allLyrics;
    }

    public get filteredLyrics() {
        return this.allLyrics.filter(l => l.rawContent.includes(this.searchQuery.replace(/[^0-9a-zA-Z]/g, '').toLowerCase()));
    }
}
</script>