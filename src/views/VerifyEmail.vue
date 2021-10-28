<template>
    <div class="w-full h-full flex flex-col justify-center items-center">
        <base-card>
            <h1 class="text-2xl font-bold">
                A verification link has been sent to your email.
            </h1>
            <template #footer>
                <div class="flex flex-col gap-2">
                    <base-button class="flex-grow" theme="tertiary" @click="sendVerificationEmail" :disabled="sentEmail || verificationEmailSent">Resend email</base-button>
                    <base-button class="flex-grow" theme="secondary" @click="$router.push({name: 'login'})">
                        <template #icon>
                            <CheckIcon class="w-4 h-4" />
                        </template>
                        Login
                    </base-button>
                </div>
            </template>
        </base-card>
    </div>
</template>

<script lang="ts">
import auth from "@/services/auth";
import { Options, Vue } from "vue-class-component";

import { BaseButton } from "@/components";
import { CheckIcon } from "@heroicons/vue/solid";

@Options({
    name: "verify-email",
    components: {
        BaseButton,
        CheckIcon,
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
