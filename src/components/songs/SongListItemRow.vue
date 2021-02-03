<template>
    <base-card class="song-list__item-row clickable" border>
        <div class="song-list__item-row__wrapper gap-x">
            <b class="song-list__item-row__number">{{ song.number }}</b>
            <div>
                <span class="song-list__item-row__title">{{
                    song.name[languageKey]
                }}</span>
                <div class="song-list__item-row__contributors">
                    <div class="song-list__item-row__contributors__authors">
                        <small>{{ $t("song.author") }}: </small>
                        <small v-for="author in song.authors" :key="author.id">
                            {{ author.name }}
                        </small>
                    </div>
                    <div
                        class="song-list__item-row__contributors__composers"
                        v-if="song.composers.length"
                    >
                        <small>{{ $t("song.composer") }}: </small>
                        <small
                            v-for="composer in song.composers"
                            :key="composer.id"
                        >
                            {{ composer.name }}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { sessionKey } from "@/store";
import { Song } from "@/classes";
import BaseCard from "@/components/BaseCard.vue";

@Options({
    props: {
        song: {
            type: Song,
        },
    },
    components: {
        BaseCard,
    },
})
export default class SongListItemRow extends Vue {
    public song: Song = {} as Song;

    public get languageKey() {
        return useStore(sessionKey).getters.languageKey ?? "en";
    }
}
</script>

<style lang="scss">
.song-list__item-row {
    width: 100%;

    &__wrapper {
        display: flex;
        align-items: center;
        // gap: var(--st-spacing);
    }

    &__contributors {
        opacity: 0.7;
    }

    &__number {
        opacity: 0.7;
        font-size: 1.5em;
    }
}
</style>