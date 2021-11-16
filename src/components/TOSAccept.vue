<template>
    <BaseModal
        :show="!termsAccepted && cart.length > 0"
    >
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
                icon="check"
                theme="secondary"
            >{{$t('policies_agreeTOS')}}</BaseButton>
        </div>
    </BaseModal>
</template>
<script lang="ts">
import { session } from "@/services/api";
import { useStore } from "@/store";
import { Options, Vue } from "vue-class-component";
import { BaseModal } from ".";
import { InformationCircleIcon } from "@heroicons/vue/outline";

@Options({
    components: {
        BaseModal,
        InformationCircleIcon,
    },
})
export default class PolicyAccepter extends Vue {
    public terms = false;
    public pp = false;
    public store = useStore();

    public loading = false;
    public disabled = false;

    public get termsAccepted() {
        return this.store.getters.user?.termsAndConditions === true;
    }
    
    public get policyAccepted() {
        return this.store.getters.user?.privacyPolicy === true;
    }

    public get cart() {
        return this.store.getters.cartItems;
    }

    public async acceptTermsOfService() {
        this.loading = true;
        await session.acceptTermsOfService();
        if (this.store.getters.user)
            this.store.getters.user.termsAndConditions = true;
        this.loading = false;
        this.disabled = true;
    }

    public openWindow() {
        window.open("https://songtreasures.org/terms-of-purchase/");
    }
}
</script>
