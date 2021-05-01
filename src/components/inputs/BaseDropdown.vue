<template>
    <div class="dropdown">
        <div class="dropdown__button" @click="openDropdown">
            <button class="dropdown__button__button" v-if="label">
                <span>{{ label }}</span>
                <Icon name="arrowDown" size="18" />
            </button>
            <slot name="button" v-else></slot>
            <icon :name="icon" size="18" v-if="icon" class="dropdown__icon" />
        </div>
        <base-card v-if="show" class="dropdown__content" border>
            <slot name="default"></slot>
        </base-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseCard } from "@/components";
import { Icon } from "@/components/icon";

@Options({
    name: "base-dropdown",
    components: {
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
    public show = false;

    public close(e: Event) {
        if (!this.$el.contains(e.target)) {
            this.show = false;
        }
    }
    
    public mounted () {
        document.addEventListener("click", this.close);
    }

    public beforeDestroy () {
        document.removeEventListener("click", this.close);
    }

    public openDropdown() {
        this.show = !this.show;
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
            background: var(--st-color-background-light);
            color: var(--st-color-text);
            border: 1px solid var(--st-color-border);
            padding: var(--st-half-spacing);

            display: flex;
            align-items: center;
            gap: var(--st-half-spacing);
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
