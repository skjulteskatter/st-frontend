<template>
    <base-card class="song-list__item-card clickable" border>
        <div class="song-list__item-card__header gap-x">
            <b class="song-list__item-card__header__number">{{
                song.number
            }}</b>
            <span class="song-list__item-card__header__title">{{
                song.name[languageKey]
            }}</span>
        </div>
        <div class="song-list__item-card__body">
            <small v-for="author in song.authors" :key="author.id">{{
                author.name
            }}</small>
        </div>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import BaseCard from "@/components/BaseCard.vue";
import { Song } from "@/classes";
import { useStore } from "vuex";
import { sessionKey } from "@/store";

@Options({
    components: {
        BaseCard,
    },
    props: {
        song: {
            type: Song,
        },
    },
})
export default class SongListItemCard extends Vue {
    public song: Song = {} as Song;

    public get languageKey() {
        return useStore(sessionKey).getters.languageKey ?? "en";
    }
}
</script>

<style lang="scss">
.song-list__item-card {
    &__header {
        display: flex;
        font-size: 1.1rem;
    }
}
</style>