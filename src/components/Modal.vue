<template>
    <div class="modal">
        <base-button
            :action="openModal"
            class="modal__open-button"
            :theme="theme"
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
                    <base-button
                        :action="closeModal"
                        class="modal__popup__card__close-button"
                        theme="secondary"
                        >{{ $t("common.close") }}</base-button
                    >
                </base-card>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";

@Options({
    props: {
        label: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            validator: (value: string) =>
                ["button", "span"].indexOf(value) != -1,
        },
        theme: {
            type: String,
        },
    },
    components: {
        BaseCard,
        BaseButton,
    },
})
export default class Modal extends Vue {
    public modalIsOpen = false;
    public mouseOverCard = false;
    public type = "button";
    public label = "";
    public theme = "primary";

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
}

.modal {
    &__open-button {
        width: 100%;
        cursor: pointer;
    }

    &__popup {
        width: 100vw;
        height: 100vh;
        z-index: 9999;

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