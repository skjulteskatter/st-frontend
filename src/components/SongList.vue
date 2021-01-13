<template>
    <div class="song-list">
        <div class="song-list__header">
            <h1>Select number</h1>
            <input type="text" class="song-list__search" placeholder="Search..." v-model="searchQuery">
        </div>
        <span class="song-list__item hover" :class="selected.number == item.number ? 'selected' : ''" v-for="item in filteredItems" :key="item.id" @click="callback(item)">
            {{ item.number }}
        </span>
        <h1 class="warning" v-if="!filteredItems.length">No results</h1>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';
import { songKey } from '@/store';

@Options({
    props: {
        items: {
            type: Array,
            default: [],
        },
        callback: {
            type: Function,
            default: (() => null),
        }
    },
    computed: {
        selected() {
            return useStore(songKey).getters.song ?? {};
        },
        filteredItems(){
            return this.searchQuery ? this.items.filter((i: { number: number }) => i.number == this.searchQuery): this.items
        }
    }
})
export default class SongList extends Vue {
    public searchQuery = ''
}
</script>

<style lang="scss" scoped>
.warning {
    opacity: .4;
}

.song-list {
    display: flex;
    flex-wrap: wrap;
    gap: calc(var(--spacing) * 0.5);
    animation: slideInFromBottom .3s ease;

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
