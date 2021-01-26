<template>
    <div class="songbooks">
        <div class="loader" v-if="loading"></div>
        <card
            v-for="songbook in collections"
            :key="songbook.key"
            class="songbooks__book hover"
            :class="{selected: selected.id == songbook.id, disabled: !available.find(c => c.id == songbook.id)}"
            :image="songbook.image"
            @click="selectCollection(songbook)"
            border
        >
            <h3 class="songbooks__book__title">{{ songbook.name.no }}</h3>
        </card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from 'vuex';
import { sessionKey, songKey } from '@/store';
import Card from '@/components/Card.vue';

@Options({
    components: {
        Card,
    }
})
export default class Songbooks extends Vue {
    private songStore = useStore(songKey);

    public get loading() {
        return !this.songStore.state.initialized;
    }

    public selectCollection(collection: Collection) {
        if (!this.available.find(c => c.id == collection.id)) return;
        this.songStore.commit('selectCollection', collection);
        this.$router.push({
            name: 'song-list',
            params: {
                'collection': collection.key,
            }
        });
    }
    
    public get collections() {
        return useStore(songKey).getters.collections ?? [];
    }

    public get selected() {
        return useStore(songKey).getters.collection ?? {};
    }

    public get available(): Collection[] {
        return useStore(sessionKey).getters.collections ?? [];
    }
}
</script>

<style lang="scss" scoped>
.songbooks {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing);

    @media screen and (max-width: 720px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 420px) {
        grid-template-columns: 1fr;
    }

    &__book {
        cursor: pointer;

        &__title {
            margin: 0;
        }

        &.selected {
            border: 2px solid var(--primary-color);
        }

        &.disabled {
            color: var(--border-color);
            cursor: not-allowed;
        }
    }
}
</style>