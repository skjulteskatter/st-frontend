<template>
    <base-card class="song-list__item-card clickable">
        <div class="song-list__item-card__wrapper gap-x" v-if="song">
            <small v-for="c in collections" :key="c.id">{{c.getName(languageKey)}}</small>
            <b class="song-list__item-card__number">{{ song.number }}</b>
            <div class="song-list__item-card__body">
                <b class="song-list__item-card__title">{{
                    getName(song.name)
                }}</b>
                <small class="song-list__item-card__info">
                    <span class="tag">{{ song.yearWritten }}</span>
                    <!-- <span>{{ song.originalKey }}</span> -->
                </small>
                <div class="song-list__item-card__contributors">
                    <div class="song-list__item-card__contributor">
                        <div
                            v-for="(con, i) in song.contributors"
                            :key="i"
                            >
                            <small>{{ con }}</small>
                            <br/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import BaseCard from "@/components/BaseCard.vue";
import { useStore } from "@/store";
import { IndexedSong } from "dmb-api";

@Options({
    components: {
        BaseCard,
    },
    props: {
        song: {
            type: Object,
        },
    },
    name: "song-list-item-card",
})
export default class SongListItemCard extends Vue {
    private store = useStore();
    public song?: IndexedSong;

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public getName(s: LocaleString) {
        return s[this.languageKey] ?? s.en ?? Object.values(s)[0];
    }

    public get collections() {
        return this.store.getters.collections.filter(c => this.song?.collectionIds.includes(c.id));
    }
}
</script>

<style lang="scss">
.song-list__item-card {
    &__wrapper {
        display: flex;
    }

    &__number {
        opacity: 0.5;
    }

    &__contributors {
        opacity: 0.5;
    }

    &__info {
        display: block;
        margin: 0.5rem 0;
    }

    .context {
        margin: 0.5em 0 0 0;
        opacity: 0.6;
    }
}
</style>
