<template>
    <BaseModal
        :show="!policyAccepted"
    >
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
                icon="check"
                theme="secondary"
            >{{$t('policies_agree')}}</BaseButton>
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

    public async acceptPrivacyPolicy() {
        this.loading = true;
        await session.acceptPrivacyPolicy();
        if (this.store.getters.user)
            this.store.getters.user.privacyPolicy = true;
        this.loading = false;
        this.disabled = true;
    }

    public openWindow() {
        window.open("https://songtreasures.org/privacy-policy/");
    }
}
</script>
