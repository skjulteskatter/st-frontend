<template>
    <base-card class="song-list__item-card clickable" border>
        <div class="song-list__item-card__wrapper gap-x" v-if="song">
            <b class="song-list__item-card__number">{{ song.number }}</b>
            <div class="song-list__item-card__body">
                <span class="song-list__item-card__title">{{
                    song.getName(languageKey)
                }}</span>
                <div class="song-list__item-card__contributors">
                    <div class="song-list__item-card__contributor">
                        <small>{{ $t("song.author") }}: </small>
                        <small
                            v-for="author in song.authors"
                            :key="author.id"
                            >{{ author.name }}</small
                        >
                    </div>
                    <div
                        class="song-list__item-card__ontributor"
                        v-if="song.composers.length"
                    >
                        <small>{{ $t("song.composer") }}: </small>
                        <small
                            v-for="composer in song.composers"
                            :key="composer.id"
                            >{{ composer.name }}</small
                        >
                    </div>
                    <small>{{context}}</small>
                </div>
            </div>
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
            type: Object,
        },
        context: {
            type: String,
        }
    },
})
export default class SongListItemCard extends Vue {
    public song?: Song;
    public context = '';

    public get languageKey() {
        return useStore(sessionKey).getters.languageKey ?? "en";
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
}
</style>