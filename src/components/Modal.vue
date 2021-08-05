<template>
    <div>
        <base-button
            @click="() => {openModal(); callback()}"
            :theme="theme"
            :icon="icon"
            v-if="type == 'button'"
            >{{ label }}</base-button
        >
        <b @click="openModal" v-if="type == 'span'">
            {{ label }}
        </b>
        <transition-root
            class="flex justify-center items-center fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-30"
            as="div"
            :show="modalIsOpen"
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
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { TransitionRoot, TransitionChild } from "@headlessui/vue";

@Options({
    props: {
        label: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
        },
        type: {
            type: String,
            default: "button",
            validator: (value: string) =>
                ["button", "span"].indexOf(value) != -1,
        },
        theme: {
            type: String,
        },
        callback: {
            type: Function,
        },
    },
    components: {
        TransitionRoot,
        TransitionChild,
    },
    name: "modal",
})
export default class Modal extends Vue {
    public modalIsOpen = false;
    public mouseOverCard = false;
    public type?: string;
    public label?: string;
    public icon?: string;
    public theme?: string;
    public callback: Function = () => undefined;

    public closeIfOutside() {
        if (!this.mouseOverCard) this.closeModal();
    }

    public openModal() {
        this.$emit("open");
        this.modalIsOpen = true;
    }

    public closeModal() {
        this.$emit("close");
        this.modalIsOpen = false;
    }
}
</script>
