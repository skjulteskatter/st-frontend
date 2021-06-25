<template>
    <div class="w-full h-full flex justify-center items-center">
        <div class="flex flex-col gap-4 p-8 rounded-md bg-white shadow-md">
            <h1 class="text-xl font-bold">
                A verification link has been sent to your email.
            </h1>
            <base-button @click="sendVerificationEmail" :disabled="sentEmail || verificationEmailSent">Resend</base-button>
            <base-button @click="$router.push({name: 'login'})">Login</base-button>
        </div>
    </div>
</template>

<script lang="ts">
import auth from "@/services/auth";
import { Options, Vue } from "vue-class-component";

import { BaseButton } from "@/components";

@Options({
    name: "verify-email",
    components: {
        BaseButton,
    },
})
export default class VerifyEmail extends Vue {
    public verificationEmailSent = false;

    public sentEmail = false;

    public mounted() {
        this.verificationEmailSent = auth.verificationEmailSent;

        if (auth.emailVerified) {
            this.$router.push({ name: "main" });
        }
    }

    public async sendVerificationEmail() {
        this.sentEmail = true;
        await auth.sendLinkToEmail();
    }
}
</script>
