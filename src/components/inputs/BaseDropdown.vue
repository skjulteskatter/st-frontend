<template>
    <Popover class="relative">
        <PopoverButton class="cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:ring-offset-secondary">
            <div class="bg-white p-2 rounded-md border border-black/20 flex items-center gap-2 dark:bg-secondary dark:border-white/20" v-if="label">
                <span>{{ label }}</span>
                <ChevronDownIcon class="w-4 h-4" />
            </div>
            <slot name="button" v-else></slot>
        </PopoverButton>
        <!-- <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="-translate-y-2 scale-95 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="-translate-y-2 opacity-0"
        > -->
            <PopoverPanel>
                <BaseCard :class="`z-10 absolute mt-2 ${origin == 'left' ? 'left-0 right-auto' : 'right-0 left-auto'}`">
                    <template #header v-if="$slots.header">
                        <slot name="header" />
                    </template>
                    <slot name="default"></slot>
                    <template #footer v-if="$slots.footer">
                        <slot name="footer" />
                    </template>
                </BaseCard>
            </PopoverPanel>
        <!-- </transition> -->
    </Popover>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/solid";

export default defineComponent({
    name: "base-dropdown",
    components: {
        Popover,
        PopoverButton,
        PopoverPanel,
        ChevronDownIcon,
    },
    props: {
        label: {
            type: String,
        },
        origin: {
            type: String,
            default: "left",
        },
        show: {
            type: Boolean,
        },
    },
    data: () => ({
        visible: false,
    }),
    computed: {
        Show() {
            return this.show || this.visible;
        },
    },
    mounted() {
        document.addEventListener("click", this.close);
    },
    beforeUnmount() {
        document.removeEventListener("click", this.close);
    },
    methods: {
        close(e: Event) {
            if (!this.$el.contains(e.target)) {
                this.visible = false;
            }
        },
        openDropdown() {
            this.visible = !this.visible;
        },
    },
});
</script>
