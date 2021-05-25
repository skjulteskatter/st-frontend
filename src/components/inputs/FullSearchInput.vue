<template>
    <search-input v-model="query" @search="searchAll"></search-input>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { Options, Vue } from "vue-class-component";
import SearchInput from "./SearchInput.vue";

@Options({
    name: "full-search-input",
    components: {
        SearchInput,
    },
})
export default class FullSearchInput extends Vue {
    private store = useStore();
    public query = "";

    public searchAll() {
        this.store.commit(SongsMutationTypes.SEARCH, this.query);
        this.store.commit(SongsMutationTypes.SEARCH_RESULT, []);

        this.$router.push({
            name: "search",
        });
        this.query = "";
    }
}
</script>

<style lang="scss" scoped>
</style>
