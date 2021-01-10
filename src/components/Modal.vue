<template>
    <div class="modal">
        <button @click="openModal" class="modal__open-button">{{ label }}</button>
        <div class="modal__popup" v-if="modalIsOpen">
            <card class="modal__popup__card">
                <slot></slot>
                <button @click="closeModal" class="modal__popup__card__close-button">Ok</button>
            </card>
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

    public openModal(){
        this.modalIsOpen = true;
    }

    public closeModal(){
        this.modalIsOpen = false;
    }
}
</script>

<style lang="scss" scoped>

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

        display: flex;
        justify-content: center;
        align-items: center;

        &__card {
            &__close-button {
                margin-top: var(--spacing);
                font-size: 1em;
            }
        }
    }
}

</style>