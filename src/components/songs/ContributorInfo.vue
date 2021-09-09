<template>
    <router-link 
        :to="{
            name: 'contributor',
            params: {
                contributor: i.id,
            },
        }"
        v-for="i in Contributors" 
        :key="i.id" 
        class="px-2 rounded-md bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
    >
        {{ i.name }}
    </router-link>
</template>
<script lang="ts">
import { ApiContributor } from "dmb-api";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "contributor-info",
    props: {
        contributors: {
            type: Array,
        },
    },
})
export default class ContributorInfo extends Vue {
    private contributors?: ApiContributor[];

    public get Contributors() {
        return this.contributors ?? [];
    }
}
</script>
