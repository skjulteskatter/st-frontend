<template>
    <transition-root
        class="flex justify-center items-center fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-30"
        as="div"
        :show="show"
        @click="closeIfOutside"
        enter="transition-opacity"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity"
        leave-from="opacity-100"
        leave-to="opacity-0"
    >
        <transition-child
            as="div"
            class="max-w-xl"
            enter="transition transform"
            enter-from="translate-y-4"
            enter-to="translate-y-0"
            leave="transition transform"
            leave-from="translate-y-0"
            leave-to="translate-y-4"
        >
            <base-card
                @mouseover="mouseOverCard = true"
                @mouseleave="mouseOverCard = false"
            >
                <slot></slot>
            </base-card>
        </transition-child>
    </transition-root>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { 
    TransitionRoot, 
    TransitionChild,
} from "@headlessui/vue";

@Options({
    components: {
        TransitionRoot,
        TransitionChild,
    },
    props: {
        show: {
            type: Boolean,
        },
    },
    emits: [
        "close",
    ],
    name: "modal",
})
export default class Modal extends Vue {
    public mouseOverCard = false;
    public show?: boolean;

    public closeIfOutside() {
        if (!this.mouseOverCard) this.closeModal();
    }

    public closeModal() {
        this.$emit("close");
    }
}
</script>
