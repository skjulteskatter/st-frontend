<template>
    <TransitionRoot
        :show="show"
        enter="transition-opacity duration-200"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
    >
        <div
            class="p-2 rounded-md bg-white shadow-md max-w-sm relative flex gap-2 border border-black/20 dark:border-white/10 dark:bg-secondary"
            v-if="show"
            @click="callback ? callback() : undefined"
        >
            <Icon v-if="icon" :name="icon" size="18" :class="{ 'text-green-700': type == 'success', 'text-red-700': type == 'error', 'text-primary': type == 'primary' }" />
            <div class="flex-grow text-xs">
                <strong class="block">{{ title }} </strong>
                <span v-if="body" style="">{{ body }}</span>
            </div>
            <button @click="remove()" class="float-right">
                <XIcon class="w-4 h-4" />
            </button>
        </div>
    </TransitionRoot>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { notifications } from "@/services/notifications";
import { TransitionRoot } from "@headlessui/vue";
import { XIcon } from "@heroicons/vue/solid";

export default defineComponent({
    name: "notification-item",
    props: {
        id: {
            type: String,
            default: "",
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
        callback: {
            type: Function,
        },
        timeout: {
            type: Number,
            default: 5000,
        },
    },
    components: {
        TransitionRoot,
        XIcon,
    },
    data: () => ({
        show: true,
    }),
    mounted() {
        if (!this.persist) {
            setTimeout(() => (this.show = false), this.timeout ?? 5000);
        }
    },
    computed: {
        typeClass() {
            if (!this.type) return "";
            return `notification--${this.type}`;
        },
    },
    methods: {
        async remove() {
            await notifications.remove(this.id);
            this.show = false;
        },
    },
});
</script>
