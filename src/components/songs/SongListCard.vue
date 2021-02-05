<template>
    <base-card class="theme-card" border v-if="title && songs.length > 0">
        <b class="theme-card__title">{{ title }}</b>
        <b class="theme-card__count" v-if="count">{{ songs.length }}</b>
        <ul class="theme-card__list">
            <li
                v-for="song in songs"
                :key="song.id"
                @click="selectSong(song)"
                class="theme-card__list__item gap-x"
                :class="{
                    selectable: !disabled.includes(song),
                    disabled: disabled.includes(song),
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
    },
})
export default class SongListCard extends Vue {
    private userStore = useStore(sessionKey);
    public songs: Song[] = [];
    public title = "";
    public count?: boolean;

    public get languageKey() {
        return this.userStore.getters.languageKey ?? "en";
    }

    public selectSong(song: Song) {
        if (!this.disabled.includes(song)) {
            this.$router.push({ name: "song", params: { number: song.number } });
        }
    }

    public get disabled() {
        return this.songs.filter(s => !s.name[this.languageKey]);
    }

    public name(name: {[key: string]: string}) {
        return name[this.languageKey] ?? name.en ?? name[Object.keys(name)[0]];
    }
}
</script>

<style lang="scss">
.theme-card {
    margin-bottom: var(--st-spacing);
    break-inside: avoid;

    &__count {
        float: right;
        opacity: 0.5;
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
            cursor: pointer;

            &.selectable {
                &:hover {
                    color: var(--st-primary-color);

                    .theme-card__list__item__title {
                        text-decoration: underline;
                    }
                }
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