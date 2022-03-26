<template>
    <BaseModal :show="!user.privacyPolicyAccepted && user.registered">
        <template #icon>
            <InformationCircleIcon class="w-6 h-6 opacity-50" />
        </template>
        <template #title>
            <h1 class="text-xl font-bold mb-2">{{$t('policies_privacyPolicy')}}</h1>
        </template>
        <template #description>
            <p class="max-w-sm text-sm opacity-50">{{$t('policies_acceptPrivacyPolicy')}}</p>
        </template>
        <div class="flex flex-col gap-4 items-center text-center">
            <a href="#" @click="openWindow()" class="hover:underline text-blue-600">{{$t('common_readHere')}}</a>
            <BaseButton
                :loading="loading"
                :disabled="disabled"
                @click="acceptPrivacyPolicy"
                theme="secondary"
            >
                <template #icon>
                    <CheckIcon class="w-4 h-4" />
                </template>
                {{$t('policies_agree')}}
            </BaseButton>
        </div>
    </BaseModal>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { session } from "@/services/api";
import { BaseModal } from ".";
import { InformationCircleIcon } from "@heroicons/vue/outline";
import { CheckIcon } from "@heroicons/vue/solid";
import { appSession } from "@/services/session";
import { reactive } from "vue";

export default defineComponent({
    name: "privacy-policy-accept",
    components: {
        BaseModal,
        InformationCircleIcon,
        CheckIcon,
    },
    data: () => ({
        loading: false,
        disabled: false,
    }),
    computed: {
        user() {
            return reactive(appSession.user);
        },
    },
    methods: {
        async acceptPrivacyPolicy() {
            this.loading = true;
            await session.acceptPrivacyPolicy();
            this.user.privacyPolicyAccepted = true;
            this.loading = false;
            this.disabled = true;
        },
        openWindow() {
            window.open("https://songtreasures.org/privacy-policy/");
        },
    },
});
</script>
