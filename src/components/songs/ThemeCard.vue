<template>
    <base-card class="theme-card" border v-if="theme && songs.length > 0">
        <b class="theme-card__title">{{ name }}</b>
        <b style="float:right">{{ songs.length }}</b>
        <ul class="theme-card__list">
            <li
                v-for="song in songs"
                :key="song.id"
                @click="selectSong(song.number)"
                class="theme-card__list__item gap-x"
            >
                <b>{{ song.number }}</b>
                <span>{{ song.name[languageKey] }}</span>
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
        themeItem: {
            type: Object,
        },
        allSongs: {
            type: Array
        }
    },
})
export default class ThemeCard extends Vue {
    public themeItem?: ThemeCollectionItem;
    public allSongs: Song[] = [];
    private userStore = useStore(sessionKey);

    public get languageKey() {
        return this.userStore.getters.languageKey ?? "en";
    }

    public get songs() {
        return this.allSongs.filter((s: Song) => this.themeItem?.songIds.includes(s.id));
    }

    public selectSong(number: number) {
        this.$router.push({ name: "song", params: { number } });
    }

    public get theme() {
        return this.themeItem?.theme;
    }

    public get name() {
        return this.theme?.name[this.languageKey];
    }
}
</script>

<style lang="scss">
.theme-card {
    margin-bottom: var(--st-spacing);
    break-inside: avoid;

    &__list {
        margin: var(--st-spacing) 0 0 0;
        padding: 0;
        font-size: 0.8rem;
        color: var(--st-text-color);
        opacity: 0.8;

        &__item {
            display: block;
            margin-bottom: 0.2rem;
            text-decoration: none;
            cursor: pointer;

            &:hover {
                text-decoration: underline;
            }
        }
    }
}
</style>