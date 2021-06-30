<template>
    <base-modal
        :show="!policyAccepted"
    >
        <div class="flex flex-col gap-4 items-center text-center">
            <h1 class="text-xl font-bold">{{$t('policies.privacyPolicy')}}</h1>
            <p class="max-w-sm">{{$t('policies.acceptPrivacyPolicy')}}</p>
            <a href="https://songtreasures.org/privacy-policy/" class="hover:underline text-blue-600">{{$t('common.readHere')}}</a>
            <base-button
                :loading="loading"
                :disabled="disabled"
                @click="acceptPrivacyPolicy"
                icon="check"
                theme="secondary"
            >{{$t('policies.agree')}}</base-button>
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

    public async acceptPrivacyPolicy() {
        this.loading = true;
        await session.acceptPrivacyPolicy();
        if (this.store.getters.user)
            this.store.getters.user.privacyPolicy = true;
        this.loading = false;
        this.disabled = true;
    }
}
</script>
