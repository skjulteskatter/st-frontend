<template>
    <transition name="note">
        <div class="notification" :class="`${typeClass}`" v-if="show">
            <!-- <icon v-if="icon" :name="icon" size="18" /> -->
            <small>{{ title }}</small>
            <Icon
                name="error"
                class="notification__close"
                size="18"
                @click="show = false"
            />
        </div>
    </transition>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Icon } from "@/components/icon";

@Options({
    name: "notification",
    components: {
        Icon,
    },
    props: {
        type: {
            type: String,
        },
        title: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
        },
    },
})
export default class Notification extends Vue {
    public type?: string;
    public icon?: string;
    public title?: string;

    public show = true;

    public mounted() {
        setTimeout(() => (this.show = false), 5000);
    }

    public get typeClass() {
        if (!this.type) return "";
        return `notification--${this.type}`;
    }
}
</script>

<style lang="scss">
.notification {
    padding: var(--st-spacing);
    background-color: var(--st-color-background-light);
    border-radius: var(--st-border-radius);
    border-left: 5px solid var(--st-color-primary);
    box-shadow: 0px 10px 20px rgba(black, 0.2);
    color: var(--st-color-text);

    animation: slideInFromBottom 0.2s;
    position: relative;

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--st-spacing);

    &--success {
        border-color: var(--st-color-success);
    }

    &--error {
        border-color: var(--st-color-error);
    }

    &--warning {
        border-color: var(--st-warning-color);
    }

    &__close {
        float: right;
    }
}

.note-enter-active,
.note-leave-active {
    transition: all 0.5s;
}

.note-enter-from,
.note-leave-to {
    opacity: 0;
    transform: translateY(-1rem);
}
</style>