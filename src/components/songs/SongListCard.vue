<template>
    <base-card class="theme-card" border v-if="title && songs.length > 0">
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
                class="theme-card__list__item gap-x selectable"
                :class="{
                    'wrong-language': anotherLanguage.includes(song),
                }"
            >
                <div class="theme-card__list__item__number">
                    <b>{{ song.number }}</b>
                </div>
                <div class="theme-card__list__item__title">
                    <span>{{ name(song.name) }}</span>
                </div>
            </li>
        </ul>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import BaseCard from "@/components/BaseCard.vue";
import { useStore } from "vuex";
import { sessionKey } from "@/store";
import { Song } from "@/classes";

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
})
export default class SongListCard extends Vue {
    private userStore = useStore(sessionKey);
    public songs: Song[] = [];
    public title = "";
    public count?: boolean;
    public action?: Function;

    public get languageKey() {
        return this.userStore.getters.languageKey ?? "en";
    }

    public selectSong(song: Song) {
        this.$router.push({
            name: "song",
            params: { number: song.number },
        });
    }

    public get anotherLanguage() {
        return this.songs.filter((s) => s.type == 'lyrics' && !s.name[this.languageKey]);
    }

    public name(name: { [key: string]: string }) {
        return name[this.languageKey] ?? name.en ?? name[Object.keys(name)[0]];
    }
}
</script>

<style lang="scss">
.theme-card {
    margin-bottom: var(--st-spacing);
    break-inside: avoid;

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
                color: var(--st-primary-color);

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
        opacity: 0.8;

        &__item {
            display: flex;
            margin-bottom: 0.2rem;
            text-decoration: none;
            cursor: unset;

            &.selectable {
                cursor: pointer;

                &:hover {
                    color: var(--st-primary-color);

                    .theme-card__list__item__title {
                        text-decoration: underline;
                    }
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