<template>
    <transition name="note">
        <div class="notification" :class="`${typeClass}`" v-if="show">
            <b>{{ title }}</b>
            <icon v-if="icon" :name="icon" size="20" />
        </div>
    </transition>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Icon } from "@/components/icon";

@Options({
    components: {
        Icon,
    },
    props: {
        type: {
            type: String,
        },
        title: {
            type: String,
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
    background-color: var(--st-primary-color);
    border-radius: var(--st-border-radius);
    box-shadow: 0px 10px 20px rgba(black, 0.2);

    animation: slideInFromBottom 0.2s;

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--st-spacing);

    &--success {
        background-color: var(--st-success-color);
    }

    &--error {
        background-color: var(--st-error-color);
    }

    &--warning {
        background-color: var(--st-warning-color);
    }
}

.note-enter-active,
.note-leave-active {
    transition: all 0.5s;
}

.note-enter-from,
.note-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>