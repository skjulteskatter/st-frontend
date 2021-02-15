<template>
    <div v-if="contributor" class="contributor">
        <base-card secondary>
            <h1 class="contribtor__name">{{ contributor.name }}</h1>
            <div v-html="contributor.getBiography(languageKey)"></div>
        </base-card>

        <div class="contributor__songs">
            <song-list-card
                :title="$t('song.author')"
                :songs="authorSongs"
            ></song-list-card>
            <song-list-card
                :title="$t('song.composer')"
                :songs="composerSongs"
            ></song-list-card>
        </div>
    </div>
</template>

<script lang="ts">
import { Collection, Song } from "@/classes";
import { sessionKey, songKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { BaseCard } from "@/components";
import { SongListCard } from "@/components/songs";

@Options({
    components: {
        BaseCard,
        SongListCard,
    },
})
export default class ContributorView extends Vue {
    private store = useStore(songKey);
    public languageKey = useStore(sessionKey).getters.languageKey;

    public async mounted() {
        if (!this.store.getters.collection) {
            await this.store.dispatch(
                "selectCollection",
                this.$route.params.collection
            );
        }
        await this.store.dispatch(
            "selectContributor",
            this.$route.params.contributor
        );
    }

    public get contributorItem() {
        return this.store.state.contributorItem;
    }

    public get contributor() {
        return this.contributorItem?.contributor;
    }

    public get songs(): Song[] {
        return (
            (this.store.getters.collection as
                | Collection
                | undefined)?.songs.filter((s) =>
                this.contributorItem?.songIds.includes(s.id)
            ) ?? []
        );
    }

    public get authorSongs(): Song[] {
        return this.songs.filter((s) =>
            s.authors.find((a) => a.id == this.contributor?.id)
        );
    }

    public get composerSongs(): Song[] {
        return this.songs.filter((s) =>
            s.composers.find((c) => c.id == this.contributor?.id)
        );
    }
}
</script>

<style lang="scss">
.contributor {
    padding: var(--st-spacing);

    &__songs {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: var(--st-spacing);

        @media screen and (max-width: 600px) {
            grid-template-columns: 1fr;
        }
    }
}
</style>