<template>
    <base-card class="contributor-card" border v-if="contributor">
        <b class="contributor-card__title">{{ contributor.name }}</b>
        <ul class="contributor-card__list">
            <li
                v-for="song in songs"
                :key="song.id"
                @click="selectSong(song)"
                class="contributor-card__list__item gap-x"
            >
                <b>{{ song.number }}</b>
                <span>{{ song.name[languageKey] }}</span>
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
        contributorItem: {
            type: Object,
        },
        type: {
            type: String,
            validator(value: string) {
                return ["author", "composer"].includes(value);
            },
        },
    },
})
export default class ContributorCard extends Vue {
    public contributorItem?: ContributorCollectionItem;
    public type = "";
    private songStore = useStore(songKey);
    private userStore = useStore(sessionKey);

    public get songs() {
        return this.songStore.getters.collection.songs.filter((s: Song) => this.contributorItem?.songIds.includes(s.id));
    }

    public get languageKey() {
        return this.userStore.getters.languageKey ?? "en";
    }

    public selectSong(song: Song) {
        this.$router.push({ name: "song", params: { number: song.number } });
    }

    public get contributor() {
        return this.contributorItem?.contributor;
    }
}
</script>

<style lang="scss">
.contributor-card {
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