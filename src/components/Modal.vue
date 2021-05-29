<template>
    <div class="modal">
        <base-button
            @click="() => {openModal(); callback()}"
            class="modal__open-button"
            :theme="theme"
            :icon="icon"
            v-if="type == 'button'"
            >{{ label }}</base-button
        >
        <b @click="openModal" class="modal__open-button" v-if="type == 'span'">
            {{ label }}
        </b>
        <div class="modal__popup" v-if="modalIsOpen" @click="closeIfOutside">
            <div class="wrapper">
                <base-card
                    class="modal__popup__card"
                    @mouseover="mouseOverCard = true"
                    @mouseleave="mouseOverCard = false"
                >
                    <slot></slot>
                </base-card>
            </div>
        </div>
    </div>
    <!-- <base-button @click="() => { openModal(); callback(); }" :theme="theme" :icon="icon">{{label}}</base-button>
    <Dialog :open="modalIsOpen" class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen">
            <DialogOverlay class="fixed inset-0 bg-black opacity-20" />
            <base-card class="max-w-sm mx-auto">
                <slot></slot>
            </base-card>
        </div>
    </Dialog> -->
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Dialog, DialogOverlay } from "@headlessui/vue";

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
        Dialog,
        DialogOverlay,
    },
    name: "modal",
})
export default class Modal extends Vue {
    public modalIsOpen = false;
    public mouseOverCard = false;
    public type = "button";
    public label = "";
    public icon = "";
    public theme = "";
    public callback: Function = () => undefined;

    public closeIfOutside() {
        if (!this.mouseOverCard) this.closeModal();
    }

    public openModal() {
        this.modalIsOpen = true;
    }

    public closeModal() {
        this.modalIsOpen = false;
    }
}
</script>

<style lang="scss" scoped>
.wrapper {
    max-width: 900px;
    background-color: transparent;
}

.modal {
    &__popup {
        width: 100vw;
        height: 100vh;
        z-index: 99999;

        position: fixed;
        top: 0;
        left: 0;

        background: rgba(black, 0.5);
        animation: fadeIn 0.2s ease;

        display: flex;
        justify-content: center;
        align-items: center;

        &__card {
            &__close-button {
                margin-top: var(--st-spacing);
                display: inline-block;
            }
        }
    }
}
</style>
