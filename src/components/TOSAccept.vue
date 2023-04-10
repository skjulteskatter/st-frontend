<template>
    <BaseModal :show="!termsAccepted && storeService.cart.length > 0">
        <template #icon>
            <InformationCircleIcon class="w-6 h-6 opacity-50 flex-shrink-0" />
        </template>
        <template #title>
            <h1 class="text-xl font-bold mb-2">{{$t('policies_termsOfService')}}</h1>
        </template>
        <template #description>
            <p class="max-w-sm text-sm opacity-50">{{$t('policies_acceptTOS')}}</p>
        </template>
        <div class="flex flex-col gap-4 items-center text-center">
            <a href="#" @click="openWindow()" class="hover:underline text-blue-600">{{$t('common_readHere')}}</a>
            <BaseButton
                :loading="loading"
                :disabled="disabled"
                @click="acceptTermsOfService"
                theme="secondary"
            >
                <template #icon>
                    <CheckIcon class="w-4 h-4" />
                </template>
                {{$t('policies_agreeTOS')}}
            </BaseButton>
        </div>
    </BaseModal>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { session } from "@/services/api";
import { useStore } from "@/store";
import { BaseModal } from ".";
import { InformationCircleIcon } from "@heroicons/vue/outline";
import { CheckIcon } from "@heroicons/vue/solid";
import { storeService } from "@/services/modules";
import { appSession } from "@/services/session";

export default defineComponent({
    name: "tos-accept",
    components: {
        BaseModal,
        InformationCircleIcon,
        CheckIcon,
    },
    data: () => ({
        store: useStore(),
        terms: false,
        loading: false,
        disabled: false,
        storeService,
        user: appSession.user,
    }),
    computed: {
        termsAccepted() {
            return this.user.termsAndConditions === true;
        },
    },
    methods: {
        async acceptTermsOfService() {
            this.loading = true;
            await session.acceptTermsOfService();
            appSession.user.termsAndConditions = true;
            this.loading = false;
            this.disabled = true;
        },
        openWindow() {
            window.open("https://songtreasures.org/terms-of-purchase/");
        },
    },
});
</script>
