<template>
    <back-button class="mb-4" />
    <div class="flex justify-between items-center mb-4">
        <h1 class="font-bold text-xl lg:text-2xl">{{ $t("common_settings") }}</h1>
        <base-button
            theme="error"
            @click="logout"
            class="settings-page__logout"
        >
            <template #icon>
                <LogoutIcon class="w-4 h-4" />
            </template>
            {{ $t("common_logout") }}
        </base-button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-4 md:grid-rows-1 gap-4">
        <div>
            <div class="flex flex-col">
                <button
                    class="text-left px-4 py-3 flex gap-2 items-center rounded-md"
                    :class="{ 'bg-black/10 dark:bg-white/10': category == 'general' }"
                    @click="category = 'general'"
                >
                    <CogIcon class="w-5 h-5 opacity-50" />
                    {{ $t('settings_general') }}
                </button>
                <button
                    class="text-left px-4 py-3 flex gap-2 items-center rounded-md"
                    :class="{ 'bg-black/10 dark:bg-white/10': category == 'user' }"
                    @click="category = 'user'"
                >
                    <UserIcon class="w-5 h-5 opacity-50" />
                    {{ $t('common_user') }}
                </button>
            </div>
            <!-- <user-card /> -->
            <base-card class="mt-4" v-if="collections.length">
                <template #header>
                    <h3 class="text-lg font-bold">{{`${$t('common_my')} ${$t('common_collections').toLowerCase()}`}}</h3>
                </template>
                <div class="flex flex-col gap-2">
                    <p v-for="col in collections" :key="col.id">{{col.getName()}}</p>
                </div>
                <template #footer>
                    <base-button 
                        @click="portal"
                        :loading="loading"
                        :class="{'opacity-40': loading}"
                    >
                        <template #icon>
                            <CreditCardIcon class="w-4 h-4" />
                        </template>
                        {{ $t("common_manage") }}
                        {{ $t("common_subscriptions").toLowerCase() }}
                    </base-button>
                </template>
            <!-- <owned-collections /> -->
            </base-card>
        </div>
        <div class="md:col-span-3">
            <settings-card :category="category" />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { SettingsCard, BackButton } from "@/components";
import { UserCard } from "@/components/settings";
import { BaseInput } from "@/components/inputs";
import { OwnedCollections } from "@/components/dashboard";
import { LogoutIcon, CreditCardIcon, UserIcon, CogIcon } from "@heroicons/vue/solid";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { StripeActionTypes } from "@/store/modules/stripe/action-types";

@Options({
    components: {
        SettingsCard,
        BaseInput,
        UserCard,
        BackButton,
        OwnedCollections,
        LogoutIcon,
        CreditCardIcon,
        UserIcon,
        CogIcon,
    },
    name: "settings-view",
})
export default class SettingsView extends Vue {
    private store = useStore();
    public loading = false;
    public category: "general" | "user" = "general";

    public logout() {
        this.store.dispatch(SessionActionTypes.SESSION_CLEAR).then(() => {
            window.location.replace("/login");
        });
    }

    public get collections() {
        const colIds = this.store.getters.user?.subscriptions.reduce((a, b) => a.concat(b.collectionIds), [] as string[]) ?? [];
        // console.log(colIds);
        return this.store.getters.collections.filter(i => colIds.includes(i.id));
    }
    
    public async portal() {
        this.loading = true;
        await this.store.dispatch(StripeActionTypes.GET_PORTAL).then((result) => {
            window.location = (result as unknown) as Location;
        });
        // this.loading = false;
    }
}
</script>

<style lang="scss" >
@import "../style/mixins";

.settings-page {
    &__logout {
        @include breakpoint("small") {
            .button__content {
                display: none;
            }
        }
    }
}
</style>
