<template>
    <div class="dropdown">
        <div class="dropdown__button" @click="openDropdown">
            <base-button
                class="dropdown__button__button"
                theme="secondary"
                icon="arrowDown"
                v-if="label"
            >
                <span>{{ label }}</span>
            </base-button>
            <slot name="button" v-else></slot>
            <icon :name="icon" size="18" v-if="icon" class="dropdown__icon" />
        </div>
        <base-card v-if="isOpen" class="dropdown__content">
            <slot name="default"></slot>
        </base-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseButton, BaseCard } from "@/components";
import { Icon } from "@/components/icon";

@Options({
    components: {
        BaseButton,
        BaseCard,
        Icon,
    },
    props: {
        label: {
            type: String,
        },
        icon: {
            type: String,
        },
    },
})
export default class BaseDropdown extends Vue {
    public label = "";
    public icon = "";
    public isOpen = false;

    public openDropdown() {
        this.isOpen = !this.isOpen;
    }
}
</script>

<style lang="scss">
.dropdown {
    --st-half-spacing: calc(var(--st-spacing) * 0.5);
    position: relative;
    z-index: 999;

    &__icon {
        cursor: pointer;
    }

    &__button {
        &__button {
            outline: none;
        }
        &__icon {
            display: inline;
            margin-left: var(--st-half-spacing);
        }
    }

    &__content {
        position: absolute;
        top: calc(100% + var(--st-half-spacing));
        right: 0;
        box-shadow: 0px 10px 15px rgba(black, 0.1);
    }
}
</style>