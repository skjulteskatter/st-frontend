<template>
    <transition-root
        as="template"
        :show="show"
    >
        <Dialog as="div" @close="closeModal">
            <transition-child
                as="template"
                enter="duration-200 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-100 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <DialogOverlay class="fixed inset-0 bg-black/50 z-40" />
            </transition-child>
            <transition-child
                as="template"
                enter="duration-200 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-100 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <base-card class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                    <template #header v-if="$slots.title || $slots.description || $slots.icon">
                        <div class="flex flex-col sm:flex-row gap-4">
                            <slot name="icon" />
                            <div>
                                <DialogTitle>
                                    <slot name="title" />
                                </DialogTitle>
                                <DialogDescription>
                                    <slot name="description" />
                                </DialogDescription>
                            </div>
                        </div>
                    </template>
                    <slot name="default" />
                    <template #footer v-if="$slots.footer">
                        <slot name="footer" />
                    </template>
                </base-card>
            </transition-child>
        </Dialog>
    </transition-root>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { 
    TransitionRoot, 
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
    DialogDescription,
} from "@headlessui/vue";

@Options({
    components: {
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogOverlay,
        DialogTitle,
        DialogDescription,
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
