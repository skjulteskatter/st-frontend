<template>
    <div class="success">
        <div class="success__content">
            <h1 class="success__title">Thank you for your purchase!</h1>
            <p class="success__text">Your product should be available soon.</p>
            <router-link class="success__link" to="/">Go to dashboard</router-link>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";

export default class Success extends Vue {
    public mounted() {
        // setTimeout(() => this.$router.push({name: 'main'}), 5000);
    }
}
</script>

<style lang="scss">
.success {
    height: 100vh;
    text-align: center;

    display: flex;
    justify-content: center;
    align-items: center;

    &__link {
        color: var(--st-primary-color);
    }
}
</style>