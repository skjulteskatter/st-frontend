<template>
    <div class="not-found">
        <div class="not-found__content">
            <h1 class="not-found__title">
                A verification link has been sent to your email.
            </h1>
            <button @click="sendVerificationEmail">Resend</button>
        </div>
    </div>
</template>

<script lang="ts">
import auth from "@/services/auth";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "verify-email",
})
export default class VerifyEmail extends Vue {
    public verificationEmailSent = auth.verificationEmailSent;

    public mounted() {
        if (auth.emailVerified) {
            this.$router.push({ name: "main" });
        }
    }

    public async sendVerificationEmail() {
        await auth.sendLinkToEmail();
    }
}
</script>

<style lang="scss" scoped>
.not-found {
    width: 100%;
    height: 100vh;
    text-align: center;
    padding: var(--st-spacing);

    display: flex;
    align-items: center;
    justify-content: center;

    &__link {
        color: var(--st-color-primary);
    }
}
</style>