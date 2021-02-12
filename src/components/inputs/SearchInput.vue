<template>
    <div class="search-input">
        <input type="text" class="search-input__input" />
        <base-button theme="secondary" class="search-input__button">{{
            $t("common.search")
        }}</base-button>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseButton } from "@/components";

@Options({
    components: {
        BaseButton,
    },
})
export default class SearchInput extends Vue {}
</script>

<style lang="scss">
.search-input {
    &__button {
        border-left: none !important;
        border-radius: 0px var(--st-border-radius) var(--st-border-radius) 0px !important;
    }
    &__input {
        border-radius: var(--st-border-radius) 0px 0px var(--st-border-radius) !important;
    }
}
</style>