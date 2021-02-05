<template>
    <div v-if="contributor">
        <h1>{{ contributor.name }}</h1>
        <div v-html="contributor.getBiography(languageKey)"></div>
    </div>
</template>

<script lang="ts">
import { Contributor } from "@/classes";
import { sessionKey, songKey } from "@/store";
import { Vue } from "vue-class-component";
import { useStore } from "vuex";


export default class ContributorView extends Vue {
    private store = useStore(songKey);

    public async mounted() {
        if (!this.store.getters.collection) {
            await this.store.dispatch('selectCollection', this.$route.params.collection);
        }
        await this.store.dispatch('selectContributor', this.$route.params.contributor);
    }

    public get contributor(): Contributor | undefined {
        return this.store.getters.contributor;
    }

    public get languageKey() {
        return useStore(sessionKey).getters.languageKey;
    }
}
</script>