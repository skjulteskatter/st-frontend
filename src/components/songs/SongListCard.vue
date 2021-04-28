<template>
    <base-card class="theme-card" v-if="title && songs.length > 0">
        <div class="theme-card__header">
            <b
                class="theme-card__title"
                :class="{ selectable: action != undefined }"
                @click="action"
                :style="action ? 'cursor:pointer' : ''"
                >{{ title }}</b
            >
            <b class="theme-card__count" v-if="count">{{ songs.length }}</b>
        </div>
        <ul class="theme-card__list">
            <li
                v-for="song in songs"
                :key="song.id"
                @click="selectSong(song)"
                class="theme-card__list__item gap-x"
                :class="{
                    'wrong-language': anotherLanguage.includes(song),
                }"
            >
                <div class="theme-card__list__item__number">
                    <b>{{ song.number }}</b>
                </div>
                <div class="theme-card__list__item__title">
                    <span>{{ song.getName(languageKey) }}</span>
                </div>
            </li>
        </ul>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import BaseCard from "@/components/BaseCard.vue";
import { Song } from "@/classes";
import { useStore } from "@/store";

@Options({
    components: {
        BaseCard,
    },
    props: {
        title: {
            type: String,
        },
        songs: {
            type: undefined,
        },
        count: {
            type: Boolean,
            default: true,
        },
        action: {
            type: Function,
        },
    },
    name: "song-list-card",
})
export default class SongListCard extends Vue {
    private store = useStore();
    public songs: Song[] = [];
    public title = "";
    public count?: boolean;
    public action?: Function;

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public selectSong(song: Song) {
        if (song.collection) {
            this.$router.push({
                name: "song",
                params: {
                    number: song.number,
                    collection: song.collection.key,
                },
            });
        } else {
            this.$router.push({
                name: "song",
                params: { number: song.number },
            });
        }
    }

    public get anotherLanguage() {
        return this.songs.filter(
            (s) => s.type == "lyrics" && !s.name[this.languageKey]
        );
    }
}
</script>

<style lang="scss">
.theme-card {
    break-inside: avoid;

    @supports not (gap: 1rem) {
        margin-bottom: var(--st-spacing);
    }

    &__header {
        display: flex;
        justify-content: space-between;
    }

    &__count {
        opacity: 0.5;
    }

    &__title {
        display: flex;
        margin-bottom: 0.2rem;
        text-decoration: none;

        &.selectable {
            cursor: pointer;

            &:hover {
                color: var(--st-color-primary);

                .theme-card__list__item__title {
                    text-decoration: underline;
                }
            }
        }
    }

    &__list {
        margin: var(--st-spacing) 0 0 0;
        padding: 0;
        font-size: 0.8rem;
        color: var(--st-text-color);

        &__item {
            display: flex;
            margin-bottom: 0.2rem;
            text-decoration: none;
            cursor: pointer;

            &:hover {
                color: var(--st-color-primary);

                .theme-card__list__item__title {
                    text-decoration: underline;
                }
            }

            &.wrong-language {
                color: red;
                opacity: 0.8;
            }

            &__number {
                width: 3ch;
                text-align: right;
            }

            &__title {
                word-wrap: normal;
            }
        }
    }
}
</style>
