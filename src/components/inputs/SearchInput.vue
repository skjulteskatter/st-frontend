<template>
    <div class="search-input">
        <input
            type="text"
            class="search-input__input"
            :placeholder="$t('common.search')"
            :value="modelValue"
            @input="(event) => $emit('update:modelValue', event.target.value)"
            @keydown.enter="$emit('search')"
        />
        <base-button
            theme="secondary"
            class="search-input__button"
            icon="search"
            @click="$emit('search')"
        >
            {{ $t("common.search") }}
        </base-button>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseButton } from "@/components";

@Options({
    components: {
        BaseButton,
    },
    props: {
        modelValue: {
            type: String,
        },
    },
    emits: ["search", "update:modelValue"],
})
export default class SearchInput extends Vue {
    public modelValue = "";
}
</script>

<style lang="scss">
.search-input {
    display: flex;
    height: 35px;

    &__button {
        border-left: none !important;
        border-radius: 0px var(--st-border-radius) var(--st-border-radius) 0px !important;
    }

    &__input {
        border-radius: var(--st-border-radius) 0px 0px var(--st-border-radius) !important;
        height: auto;
    }
}
</style>