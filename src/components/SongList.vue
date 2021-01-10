<template>
    <div class="song-list">
        <span class="song-list__item hover" :class="selected.number == item.number ? 'selected' : ''" v-for="item in items" :key="item.id" @click="callback(item)">
            {{ item.number }}
        </span>
    </div>
</template>

<script>
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
        }
    }
})
export default class SongList extends Vue {
    
}
</script>

<style lang="scss" scoped>
.song-list {
    display: flex;
    flex-wrap: wrap;
    gap: calc(var(--spacing) * 0.5);
    animation: slideInFromBottom .3s ease;

    &__item {
        max-width: 50px;
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
