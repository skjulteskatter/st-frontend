<template>
    <div class="relative">
        <div class="cursor-pointer" @click="openDropdown">
            <button class="bg-white p-2 rounded-md border border-gray-300 flex items-center gap-2 dark:bg-secondary dark:border-gray-500" v-if="label">
                <span>{{ label }}</span>
                <icon
                    :name="icon"
                    size="18"
                    v-if="icon"
                />
                <ChevronDownIcon v-else class="w-4 h-4" />
            </button>
            <slot name="button" v-else></slot>
        </div>
        <transition-root 
            :show="Show"
            as="template"
            enter="transition"
            enter-from="-translate-y-2 opacity-0"
            enter-to="translate-y-0 opacity-100"
            leave="transition"
            leave-from="translate-y-0 opacity-100"
            leave-to="translate-y-2 opacity-0"
        >
            <base-card :class="`z-10 absolute top-11 ${origin == 'left' ? 'left-0 right-auto' : 'right-0 left-auto'}`">
                <slot name="default"></slot>
            </base-card>
        </transition-root>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { TransitionRoot } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/solid";

@Options({
    name: "base-dropdown",
    props: {
        label: {
            type: String,
        },
        icon: {
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
    components: {
        TransitionRoot,
        ChevronDownIcon,
    },
})
export default class BaseDropdown extends Vue {
    public label?: string;
    public icon?: string;
    public origin?: string;
    public show?: boolean;
    public visible = false;

    public get Show() {
        return this.show || this.visible;
    }

    public close(e: Event) {
        if (!this.$el.contains(e.target)) {
            this.visible = false;
        }
    }

    public mounted() {
        document.addEventListener("click", this.close);
    }

    public beforeDestroy() {
        document.removeEventListener("click", this.close);
    }

    public openDropdown() {
        this.visible = !this.visible;
    }
}
</script>
