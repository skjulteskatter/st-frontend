<template>
    <back-button class="mb-4" />
    <div class="flex justify-between items-center mb-4">
        <h1 class="font-bold text-xl lg:text-2xl">{{ $t("common.settings") }}</h1>
        <base-button
            theme="error"
            @click="logout"
            class="settings-page__logout"
        >
            <template #icon>
                <LogoutIcon class="w-4 h-4" />
            </template>
            {{ $t("common.logout") }}
        </base-button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-4 md:grid-rows-1 gap-4">
        <div>
            <user-card />
            <base-card class="mt-4" v-if="collections.length">
                <div class="flex mb-2">
                    <h3 class="text-lg font-bold">{{`${$t('common.my')} ${$t('common.collections').toLowerCase()}`}}</h3>
                </div>
                <hr class="mb-2" />
                
                <div class="mb-2" v-for="col in collections" :key="col.id">{{col.getName()}}</div>
                <base-button 
                    @click="portal"
                    :loading="loading"
                    class="ml-auto cursor-pointer"
                    :class="{'opacity-40': loading}"
                >
                    {{ $t("common.manage") }}
                    {{ $t("common.subscriptions").toLowerCase() }}
                </base-button>
            <!-- <owned-collections /> -->
            </base-card>
        </div>
        <div class="md:col-span-3">
            <settings-card />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { SettingsCard, BackButton } from "@/components";
import { UserCard } from "@/components/settings";
import { BaseInput } from "@/components/inputs";
import { OwnedCollections } from "@/components/dashboard";
import { LogoutIcon } from "@heroicons/vue/solid";
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
    },
    name: "settings-view",
})
export default class SettingsView extends Vue {
    private store = useStore();
    public loading = false;

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
