<template>
    <section class="contact">
        <div class="container">
            <h1>Get in touch</h1>
            <!-- <div class="form-card"> -->
                <contact-form></contact-form>
            <!-- </div> -->
        </div>
    </section>
</template>

<script>
import { Options, Vue } from "vue-class-component";
import ContactForm from '@/components/home/ContactForm.vue';

@Options({
    components: {
        ContactForm,
    }
})
export default class Contact extends Vue {
    
}
</script>

<style lang="scss">
.form-card {
    max-width: 500px;
    padding: var(--spacing);
}
</style>