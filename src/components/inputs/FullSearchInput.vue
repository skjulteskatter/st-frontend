<template>
    <SearchInput v-model="query" @search="searchAll" :disabled="$route.name == 'search'" />
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import SearchInput from "./SearchInput.vue";

export default defineComponent({
    name: "full-search-input",
    components: {
        SearchInput,
    },
    data: () => ({
        store: useStore(),
        query: "",
    }),
    methods: {
        searchAll() {
            this.store.commit(SongsMutationTypes.SEARCH, this.query);
            this.store.commit(SongsMutationTypes.SEARCH_RESULT, undefined);

            this.$router.push({
                name: "search",
            });
            this.query = "";
        },
    },
});
</script>
