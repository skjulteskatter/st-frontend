<template>
    <search-input v-model="query" @search="searchAll"></search-input>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import SearchInput from "./SearchInput.vue";

@Options({
    name: "full-search-input",
    components: {
        SearchInput,
    },
})
export default class FullSearchInput extends Vue {
    public query = "";

    public searchAll() {
        this.$router.push({
            name: "search",
            query: { q: this.query },
        });
        this.query = "";
    }
}
</script>

<style lang="scss" scoped>
</style>