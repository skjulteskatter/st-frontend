<template>
    <BaseModal :show="!user.registered">
        <template #icon>
            <InformationCircleIcon class="w-6 h-6 opacity-50" />
        </template>
        <template #title>
            <h1 class="text-xl font-bold mb-2">{{$t('registration_title').replace("$fullName", user.displayName)}}</h1>
        </template>
        <template #description>
            <p class="max-w-sm text-sm opacity-50">{{$t('registration_description')}}</p>
        </template>
        <div class="flex gap-4">
            <BaseButton
                @click="cancel"
            >   <template #icon>
                    <XCircleIcon class="w-4 h-4" />
                </template>
                {{$t('common_cancel')}}
            </BaseButton>
            <BaseButton
                :loading="loading"
                :disabled="disabled"
                @click="completeRegistration"
                theme="secondary"
            >
                <template #icon>
                    <CheckIcon class="w-4 h-4" />
                </template>
                {{$t('registration_complete')}}
            </BaseButton>
        </div>
    </BaseModal>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { BaseModal } from ".";
import { InformationCircleIcon } from "@heroicons/vue/outline";
import { CheckIcon, XCircleIcon } from "@heroicons/vue/solid";
import { appSession } from "@/services/session";
import { reactive } from "vue";
import auth from "@/services/auth";
import BaseButton from "./BaseButton.vue";

export default defineComponent({
    name: "complete-registration",
    components: {
    BaseModal,
    InformationCircleIcon,
    CheckIcon,
    XCircleIcon,
    BaseButton,
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
        async completeRegistration() {
            this.loading = true;
            await this.user.completeRegistration();
            this.loading = false;
            this.disabled = true;
        },
        cancel() {
            auth.logout();
        },
    },
});
</script>
