<template>
    <div v-if="contributor">
        <h1>{{ contributor.name }}</h1>
        <div v-html="contributor.getBiography(languageKey)"></div>
        <div>
            <h1>AUTHOR</h1>
            <p v-for="song in authorSongs" :key="song.id">{{song.getName(languageKey)}}</p>
        </div>
        <div>
            <h1>COMPOSER</h1>
            <p v-for="song in composerSongs" :key="song.id">{{song.getName(languageKey)}}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { Collection, Song } from "@/classes";
import { sessionKey, songKey } from "@/store";
import { Vue } from "vue-class-component";
import { useStore } from "vuex";


export default class ContributorView extends Vue {
    private store = useStore(songKey);
    public languageKey = useStore(sessionKey).getters.languageKey;

    public async mounted() {
        if (!this.store.getters.collection) {
            await this.store.dispatch('selectCollection', this.$route.params.collection);
        }
        await this.store.dispatch('selectContributor', this.$route.params.contributor);
    }

    public get contributorItem() {
        return this.store.state.contributorItem;
    }

    public get contributor() {
        return this.contributorItem?.contributor;
    }

    public get songs(): Song[] {
        return (this.store.getters.collection as Collection | undefined)?.songs.filter(s => this.contributorItem?.songIds.includes(s.id)) ?? [];
    }

    public get authorSongs(): Song[] {
        return this.songs.filter(s => s.authors.find(a => a.id == this.contributor?.id));
    }

    public get composerSongs(): Song[] {
        return this.songs.filter(s => s.composers.find(c => c.id == this.contributor?.id));
    }
}
</script>