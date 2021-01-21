<template>
    <div class="modal">
        <button @click="openModal" class="modal__open-button">{{ label }}</button>
        <div class="modal__popup" v-if="modalIsOpen" @click="closeIfOutside">
            <div class="wrapper">
                <card class="modal__popup__card" @mouseover="mouseOverCard = true" @mouseleave="mouseOverCard = false">
                    <slot></slot>
                    <button @click="closeModal" class="modal__popup__card__close-button" secondary>Close</button>
                </card>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Card from '@/components/Card.vue'

@Options({
    props: {
        label: {
            type: String,
            default: ''
        }
    },
    components: {
        Card
    }
})
export default class Modal extends Vue {
    public modalIsOpen = false;
    public mouseOverCard = false;

    public closeIfOutside(){
        if (!this.mouseOverCard) this.closeModal()
    }

    public openModal(){
        this.modalIsOpen = true;
    }

    public closeModal(){
        this.modalIsOpen = false;
    }
}
</script>

<style lang="scss" scoped>

.wrapper {
    max-width: 1200px;
}

.modal {
    &__open-button {
        width: 100%;
    }

    &__popup {
        width: 100vw;
        height: 100vh;
        z-index: 9999;

        position: fixed;
        top: 0;
        left: 0;

        background: rgba(black, .5);
        animation: fadeIn .2s ease;

        display: flex;
        justify-content: center;
        align-items: center;

        &__card {
            &__close-button {
                margin-top: var(--spacing);
            }
        }
    }
}

</style>