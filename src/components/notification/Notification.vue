<template>
    <transition name="note">
        <div 
            class="p-4 rounded bg-white shadow-md max-w-sm relative flex gap-4 border border-l-4"
            :class="{ 'border-green-700': type == 'success', 'border-red-700': type == 'error', 'border-primary': type == 'primary' }" 
            v-if="show || persist"
        >
            <icon v-if="icon" :name="icon" size="18" />
            <div class="flex-grow text-xs">
                <strong class="block">{{ title }} </strong>
                <span v-if="body">{{ body }}</span>
            </div>
            <Icon
                name="error"
                class="float-right"
                size="18"
                @click="remove()"
            />
        </div>
    </transition>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { notifications } from "@/services/notifications";

@Options({
    name: "notification",
    props: {
        id: {
            type: String,
        },
        type: {
            type: String,
        },
        title: {
            type: [String, Number],
        },
        body: {
            type: String,
        },
        icon: {
            type: String,
        },
        persist: {
            type: Boolean,
        },
    },
})
export default class Notification extends Vue {
    public id = "";
    public type?: string;
    public icon?: string;
    public title?: string | number;
    public body?: string;
    
    public persist = false;

    public show = true;

    public mounted() {
        setTimeout(() => (this.show = false), 5000);
    }

    public get typeClass() {
        if (!this.type) return "";
        return `notification--${this.type}`;
    }

    public async remove() {
        await notifications.remove(this.id);
        this.show = false;
    }
}
</script>

<style lang="scss">
.notification {
    animation: slideInFromBottom 0.2s;

    &--success {
        border-color: var(--st-color-success);
    }

    &--error {
        border-color: var(--st-color-error);
    }

    &--warning {
        border-color: var(--st-warning-color);
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
