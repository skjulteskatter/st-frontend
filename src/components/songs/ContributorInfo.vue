<template>
    <router-link 
        v-for="i in contributors" 
        :key="i.id"
        :to="{
            name: 'contributor',
            params: {
                contributor: i.id,
            },
        }"
        class="px-2 rounded-md bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
    >
        {{ i.name }}
    </router-link>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ApiContributor } from "songtreasures-api";

export default defineComponent({
    name: "contributor-info",
    props: {
        contributors: {
            type: Array as PropType<ApiContributor[]>,
            required: true,
        },
    },
});
</script>
