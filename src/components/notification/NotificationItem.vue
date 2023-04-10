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
            class="p-2 rounded-md bg-white shadow-md max-w-sm relative flex gap-2 border dark:bg-secondary"
            :class="[type == 'success' ? 'border-green-500' : (type == 'error' ? 'border-red-500' : 'border-black/20 dark:border-white/10')]"
            v-if="show"
            @click="callback ? callback() : undefined"
        >
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
import { defineComponent } from "vue";
import { useNotifications } from "@/services/notifications";
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
            validator: (v: string) => ["success", "error", "primary"].includes(v),
        },
        title: {
            type: [String, Number],
        },
        body: {
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
    methods: {
        async remove() {
            await useNotifications().remove(this.id);
            this.show = false;
        },
    },
});
</script>
