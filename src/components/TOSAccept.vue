<template>
    <base-modal
        :show="!termsAccepted && cart.length > 0"
    >
        <div class="flex flex-col gap-4 items-center text-center">
            <h1 class="text-xl font-bold">{{$t('policies.termsOfService')}}</h1>
            <p class="max-w-sm">{{$t('policies.acceptTOS')}}</p>
            <a href="/terms-of-service" class="hover:underline text-blue-600">{{$t('common.readHere')}}</a>
            <base-button
                :loading="loading"
                :disabled="disabled"
                @click="acceptTermsOfService"
                icon="check"
                theme="secondary"
            >{{$t('policies.agreeTOS')}}</base-button>
        </div>
    </base-modal>
</template>
<script lang="ts">
import { session } from "@/services/api";
import { useStore } from "@/store";
import { Options, Vue } from "vue-class-component";
import { BaseModal } from ".";

@Options({
    components: {
        BaseModal,
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
}
</script>
