<template>
    <div class="song-list" v-if="collection">
        <div class="loader" v-if="loading"></div>
        <div v-if="!loading">
            <div class="song-list__header" v-if="!loading">
                <h1>Select number</h1>
                <div style="display: flex; gap: var(--st-spacing)">
                    <input type="text" class="song-list__search" placeholder="Search..." v-model="searchQuery">
                </div>
            </div>
            <div v-if="!advancedSearch && !loading" class="song-list__wrapper">
                <span class="song-list__item" :class="{selected: selected.number == item.number, disabled: disabled.find(s => s.number == item.number), hover: !disabled.find(s => s.number == item.number)}" v-for="item in songs" :key="item.id" @click="selectSong(item)">
                    {{ item.number }}
                </span>
            </div>
            <div v-else>
                <div class="search__container">
                    <base-card style="cursor: pointer" class="hover" v-for="song in filteredSongs.slice(0, 90)" :key="song.id" @click="selectSong(song)" border>
                        <h2>{{song.number}}</h2>
                        <h4 v-for="author in song.authors" :key="author.id">{{author.name}}</h4>
                        <h4 v-for="composer in song.composers" :key="composer.id">{{composer.name}}</h4>
                        <h3>{{song.name[languageKey]}}</h3>
                    </base-card>
                </div>
            </div>
            <h1 class="warning" v-if="!filteredNumbers.length">No results</h1>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';
import { sessionKey, songKey } from '@/store';
import { Song } from '@/classes';
import BaseCard from '@/components/BaseCard.vue'

@Options({
    components: {
        BaseCard
    },
})
export default class SongList extends Vue {
    private userStore = useStore(sessionKey);
    private songStore = useStore(songKey);
    public searchQuery = '';
    public store = useStore(songKey);
    public loading = false;

    public async mounted() {

        if (!this.collection.id) {
            await this.store.dispatch('load', {
                collectionKey: this.$route.params.collection,
                languageKey: this.languageKey,
            });
        }

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

    public get filteredNumbers() {
        const numbers = this.songs.filter(s => s.number.toString() == this.searchQuery || s.rawContributorNames.includes(this.searchQuery.replace(/[^0-9a-zA-Z]/g, '').toLowerCase())).map(s => s.number);

        return this.allLyrics?.filter(l => numbers.includes(l.number) || l.rawContent.includes(this.searchQuery.replace(/[^0-9a-zA-Z]/g, '').toLowerCase())).map(l => l.number) ?? [];
    }

    public get filteredSongs() {
        return this.songs.filter(s => this.filteredNumbers.includes(s.number));
    }
    
    public get collection(): Collection {
        return useStore(songKey).state.collection;
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
        this.$router.push({
            name: 'song',
            params: {
                'collection': song.collection.key,
                'number': song.number,
            }
        });
        this.loading = false;
    }
    
    public get songs(): Song[] {
        return useStore(songKey).getters.songs ?? [];
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
    gap: var(--st-spacing);
}

.song-list {
    animation: slideInFromBottom .3s ease;

    &__wrapper {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        gap: calc(var(--st-spacing) * 0.5);
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
        background-color: var(--st-background-color);
        border: 1px solid var(--st-border-color);
        border-radius: var(--st-border-radius);

        cursor: pointer;

        display: flex;
        justify-content: center;
        align-items: center;
        
        &.selected {
            border: 2px solid var(--st-primary-color);
        }

        &.disabled {
            color: var(--st-border-color);
            cursor: not-allowed;
        }
    }
}
</style>
