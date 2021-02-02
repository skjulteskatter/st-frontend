<template>
    <base-card class="contributor-card" border>
        <b>{{ contributor.name }}</b>
        <ul class="contributor-card__list">
            <li v-for="song in songs" :key="song.id">
                <router-link
                    :to="{ name: 'song', params: { number: song.number } }"
                    >{{ song.name[languageKey] }}</router-link
                >
            </li>
        </ul>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Contributor from "@/classes/contributor";
import BaseCard from "@/components/BaseCard.vue";
import { useStore } from "vuex";
import { sessionKey, songKey } from "@/store";
import { Song } from "@/classes";

@Options({
    components: {
        BaseCard,
    },
    props: {
        contributor: {
            type: Contributor,
        },
        type: {
            type: String,
            validator(value: string) {
                return ["author", "composer"].includes(value);
            },
        },
    },
})
export default class CobtributorCard extends Vue {
    public contributor: Contributor = {} as Contributor;
    public type = "";
    public filters: {
        [key: string]: (song: Song, contributor: Contributor) => boolean;
    } = {
        author(song: Song, contributor: Contributor) {
            return song.authors.includes(contributor);
        },
        composer(song: Song, contributor: Contributor) {
            return song.composers.includes(contributor);
        },
    };

    public get songs() {
        return useStore(songKey).getters.collection.songs.filter((song: Song) =>
            this.filters[this.type]?.(song, this.contributor)
        );
    }

    public get languageKey() {
        return useStore(sessionKey).getters.languageKey ?? "en";
    }
}
</script>

<style lang="scss">
.contributor-card {
    margin-bottom: var(--st-spacing);
    &__list {
        margin: var(--st-spacing) 0 0 0;
        padding: 0;
        font-size: 0.8rem;

        li,
        li > * {
            display: block;
            color: var(--st-text-color);
            margin-bottom: 0.2rem;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }
}
</style>