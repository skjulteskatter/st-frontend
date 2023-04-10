<template>
    <div class="w-full h-full flex flex-col justify-center items-center">
        <BaseCard>
            <h1 class="text-2xl font-bold">
                A verification link has been sent to your email.
            </h1>
            <template #footer>
                <div class="flex flex-col gap-2">
                    <BaseButton class="flex-grow" theme="tertiary" @click="sendVerificationEmail" :disabled="sentEmail || verificationEmailSent">Resend email</BaseButton>
                    <BaseButton class="flex-grow" theme="secondary" @click="$router.push({name: 'login-view'})">
                        <template #icon>
                            <CheckIcon class="w-4 h-4" />
                        </template>
                        Login
                    </BaseButton>
                </div>
            </template>
        </BaseCard>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import auth from "@/services/auth";
import { BaseButton } from "@/components";
import { CheckIcon } from "@heroicons/vue/solid";

export default defineComponent({
    name: "verify-email",
    components: {
        BaseButton,
        CheckIcon,
    },
    data: () => ({
        verificationEmailSent: false,
        sentEmail: false,
    }),
    mounted() {
        this.verificationEmailSent = auth.verificationEmailSent;

        if (auth.emailVerified) {
            this.$router.push({ name: "main" });
        }
    },
    methods: {
        async sendVerificationEmail() {
            this.sentEmail = true;
            await auth.sendLinkToEmail();
        },
    },
});
</script>
