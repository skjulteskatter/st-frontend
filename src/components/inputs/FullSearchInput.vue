<template>
    <SearchInput v-model="query" @search="searchAll" :disabled="$route.name == 'search'" />
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import SearchInput from "./SearchInput.vue";

export default defineComponent({
    name: "full-search-input",
    components: {
        SearchInput,
    },
    data: () => ({
        query: "",
    }),
    methods: {
        searchAll() {
            this.$router.push({
                name: "search",
            });
            this.query = "";
        },
    },
});
</script>
