<template>
    <div class="song-list">
        <div class="loader" v-if="loading"></div>
        <div class="song-list__header">
            <h1>Select number</h1>
            <div style="display: flex; gap: var(--spacing)">
                <input type="text" class="song-list__search" @input="loadLyrics" placeholder="Search..." v-model="searchQuery">
            </div>
        </div>
        <div v-if="!advancedSearch" class="song-list__wrapper">
            <span class="song-list__item hover" :class="selected.number == item.number ? 'selected' : ''" v-for="item in filteredItems" :key="item.id" @click="callback(item)">
                {{ item.number }}
            </span>
        </div>
        <div v-else>
            <div class="search__container">
                <card style="cursor: pointer" class="hover" v-for="lyrics in filteredLyrics.slice(0, 12)" :key="lyrics.number" @click="callback(items.find(s => s.number == lyrics.number))" border>
                    <p>{{lyrics.number}}</p>
                    <h3>{{lyrics.title}}</h3>
                </card>
            </div>
        </div>
        <h1 class="warning" v-if="!filteredItems.length && !filteredLyrics.length">No results</h1>
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
    props: {
        items: {
            type: Array,
            default: [],
        },
        callback: {
            type: Function,
            default: (() => null),
        }
    }
})
export default class SongList extends Vue {
    public userStore = useStore(sessionKey);
    public searchQuery = '';
    public store = useStore(songKey);
    public items: Song[] = [];
    public advancedSearch = false;
    public collection?: Collection = useStore(songKey).state.collection;
    public loading = false;

    public mounted() {
        this.store.commit('setAllLyrics', null);
    }

    public async loadLyrics(){
        if (!this.advancedSearch) {
            this.advancedSearch = true;
            this.loading = true;
            await this.store.dispatch('getAllLyrics', this.userStore.state.currentUser.settings?.languageKey ?? "no");
            this.loading = false;
        }
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

    public get filteredItems() {
        return this.searchQuery ? this.items.filter(i => i.number.toString() == this.searchQuery || i.name[this.languageKey].title.toLowerCase().includes(this.searchQuery.toLowerCase())) : this.items;
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
        max-width: 53px;
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
    }
}
</style>
