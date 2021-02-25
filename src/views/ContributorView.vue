<template>
    <div v-if="contributor" class="contributor">
        <base-card class="contributor__biography" secondary>
            <div class="contributor__biography__header">
                <p class="contributor__biography__header__title">
                    {{ $t("song.contributor") }}
                </p>
                <h1 class="contributor__biography__header__name">
                    {{ contributor.name }}
                </h1>
            </div>
            <div v-html="contributor.getBiography(languageKey)"></div>
        </base-card>

        <div class="contributor__songs">
            <div v-for="c in collections" :key="c.id">
                <h1>{{c.getName(languageKey)}}</h1>
                <div class="contributor__songs">
                    <song-list-card
                        :title="$t('song.author')"
                        :songs="authorSongs.filter(s => s.collection.id == c.id)"
                    ></song-list-card>
                    <song-list-card
                        :title="$t('song.composer')"
                        :songs="composerSongs.filter(s => s.collection.id == c.id)"
                    ></song-list-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { sessionKey, songKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { BaseCard } from "@/components";
import { SongListCard } from "@/components/songs";
import { Collection, Song } from "@/classes";

@Options({
    components: {
        BaseCard,
        SongListCard,
    },
})
export default class ContributorView extends Vue {
    private store = useStore(songKey);
    private sessionStore = useStore(sessionKey);
    public languageKey = useStore(sessionKey).getters.languageKey;

    public async mounted() {
        // if (!this.store.getters.collection) {
        //     await this.store.dispatch(
        //         "selectCollection",
        //         this.$route.params.collection
        //     );
        // }
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

    public get songs(): SongInterface[] {
        return this.contributorItem?.songs ?? [];
    }

    public get authorSongs(): Song[] {
        return this.songs.filter((s) =>
            s.authorIds?.find((a) => a == this.contributor?.id)
        ).map(s => new Song(s));
    }

    public get composerSongs(): Song[] {
        return this.songs.filter((s) =>
            s.composerIds?.find((c) => c == this.contributor?.id)
        ).map(s => new Song(s));
    }

    public get collections(): Collection[] {
        return (this.sessionStore.getters.collections as Collection[] | undefined)?.filter(c => this.authorSongs.filter(s => s.collection?.id == c.id).length || this.composerSongs.filter(s => s.collection?.id == c.id).length) ?? [];
    }
}
</script>

<style lang="scss">
.contributor {
    padding: calc(var(--st-spacing) * 2);

    &__biography {
        &__header {
            &__title {
                color: var(--st-primary-color);
                margin: 0;
            }

            &__name {
                margin: 0;
            }
        }
    }

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