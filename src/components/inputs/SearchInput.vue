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
        <Icon
            class="search-input__icon"
            name="search"
            size="18"
            @click="$emit('search')"
        />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseButton } from "@/components";
import { Icon } from "@/components/icon";

@Options({
    components: {
        BaseButton,
        Icon,
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
    position: relative;

    &__icon {
        position: absolute;
        right: calc(var(--st-spacing) / 2);
        top: calc(var(--st-spacing) / 2);
        cursor: pointer;
        opacity: 0.5;
    }

    &__button {
        border-left: none !important;
        border-radius: 0px var(--st-border-radius) var(--st-border-radius) 0px !important;

        .button__content {
            display: flex;
            align-items: center;
        }
    }

    &__input {
        border-radius: var(--st-border-radius) 0px 0px var(--st-border-radius) !important;
        height: auto;
        flex-grow: 1;
    }
}
</style>