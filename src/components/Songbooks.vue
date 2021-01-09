<template>
    <div class="songbooks">
        <card
            v-for="songbook in collections"
            :key="songbook.key"
            class="songbooks__book hover"
            :class="selected.id == songbook.id ? 'selected' : ''"
            :image="songbook.image"
            @click="callback(songbook)"
            border
        >
            <h3 class="songbooks__book__title">{{ songbook.name.no }}</h3>
        </card>
    </div>
</template>

<script>
import { Options, Vue } from "vue-class-component";
import { useStore } from 'vuex';
import { songKey } from '@/store';
import Card from '@/components/Card.vue';

@Options({
    components: {
        Card,
    },
    props: {
        collections: {
            type: Array,
            default: []
        },
        callback: {
            type: Function,
            default: (() => null),
        }
    },
    computed: {
        selected() {
            return useStore(songKey).getters.collection ?? {};
        }
    }
})
export default class Songbooks extends Vue {
    
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
    }
}
</style>