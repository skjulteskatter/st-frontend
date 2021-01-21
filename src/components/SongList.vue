<template>
    <div class="song-list">
        <div class="loader" v-if="loading"></div>
        <div class="song-list__header" v-if="!loading">
            <h1>Select number</h1>
            <div style="display: flex; gap: var(--spacing)">
                <input type="text" class="song-list__search" placeholder="Search..." v-model="searchQuery">
            </div>
        </div>
        <div v-if="!advancedSearch && !loading" class="song-list__wrapper">
            <span class="song-list__item hover" :class="{selected: selected.number == item.number, disabled: disabled.find(s => s.number == item.number)}" v-for="item in songs" :key="item.id" @click="selectSong(item)">
                {{ item.number }}
            </span>
        </div>
        <div v-else>
            <div class="search__container">
                <card style="cursor: pointer" class="hover" v-for="lyrics in filteredLyrics.slice(0, 12)" :key="lyrics.number" @click="selectSong(songs.find(s => s.number == lyrics.number))" border>
                    <h2>{{lyrics.number}}</h2>
                    <h3>{{lyrics.title}}</h3>
                </card>
            </div>
        </div>
        <h1 class="warning" v-if="!filteredLyrics.length">No results</h1>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';
import { sessionKey, songKey } from '@/store';
import { Song } from '@/classes';
import Card from '@/components/Card.vue'

@Options({
    components: {
        Card
    },
})
export default class SongList extends Vue {
    private userStore = useStore(sessionKey);
    private songStore = useStore(songKey);
    public searchQuery = '';
    public store = useStore(songKey);
    public collection?: Collection = useStore(songKey).state.collection;
    public loading = false;

    public async mounted() {
        if (this.allLyrics.length == 0) {
            this.loading = true;
            await this.store.dispatch('getAllLyrics', this.userStore.state.currentUser.settings?.languageKey ?? "no");
            this.loading = false;
        }
    }

    public get advancedSearch() {
        return this.searchQuery !== '';
    }

    public get allLyrics() {
        return this.store.state.allLyrics;
    }

    public get filteredLyrics() {
        return this.allLyrics.filter(l => l.number.toString() == this.searchQuery || l.rawContent.includes(this.searchQuery.replace(/[^0-9a-zA-Z]/g, '').toLowerCase()));
    }

    public get languageKey () {
        return useStore(sessionKey).getters.languageKey;
    }

    public get selected() {
        return this.store.getters.song ?? {};
    }

    public async selectSong(song: Song) {
        if (this.disabled.find(s => s.number == song.number)) return;
        this.songStore.commit('selectSong', song);
        this.loading = true;
        await this.songStore.dispatch('getLyrics', this.userStore.getters.currentUser?.settings?.languageKey ?? "en");
        this.$router.push(`${song.collection.key}/${song.number}`);
        this.loading = false;
    }
    
    public get songs() {
        const songs = useStore(songKey).getters.songs as Song[];
        return songs ?? [];
    }

    public get disabled() {
        return this.songs.filter(s => !s.name[this.languageKey]);
    }
}
</script>

<style lang="scss" scoped>
.warning {
    opacity: .4;
}

.search__container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing);
}

.song-list {
    animation: slideInFromBottom .3s ease;

    &__wrapper {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        gap: calc(var(--spacing) * 0.5);
    }

    .song-list__header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__search {
        display: block;
    }

    &__item {
        max-width: 52px;
        min-height: 40px;
        width: 100%;
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);

        cursor: pointer;

        display: flex;
        justify-content: center;
        align-items: center;
        
        &.selected {
            border: 2px solid var(--primary-color);
        }

        &.disabled {
            color: red;
        }
    }
}
</style>
