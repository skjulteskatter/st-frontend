<template>
    <div class="contact-form">
        <div class="contact-form__field">
            <label for="name" class="contact-form__field__label">Name</label>
            <input type="text" id="name" class="contact-form__input" v-model="form.name" required>
        </div>
        <div class="contact-form__field">
            <label for="email" class="contact-form__field__label">E-mail</label>
            <input type="email" id="email" class="contact-form__input" v-model="form.email" required>
        </div>
        <div class="contact-form__field">
            <label for="message" class="contact-form__field__label">Message</label>
            <textarea rows="5" id="message" class="contact-form__input" v-model="form.message"></textarea>
        </div>
        <div class="contact-form__field">
            <button class="contact-form__button" @click="sendForm">Send</button>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class ContactForm extends Vue {
    public form = {
        name: '',
        email: '',
        message: ''
    };

    public sendForm(){
        console.log(this.form);
    }
}
</script>

<style lang="scss">
.contact-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing);

    &__button {
        font-size: 1em;
        padding: var(--spacing);
    }

    &__field {
        display: flex;
        flex-direction: column;

        &__label {
            margin-bottom: .3em;
        }
    }
}
</style>