<template>
    <div>
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
                <div class="flex flex-col h-full">
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
                    <div class="rounded-lg p-4 text-sm opacity-50 flex flex-col">
                        <!-- <router-link
                            to="/credit"
                            class="tracking-wide leading-normal hover:underline"
                        >
                            {{ $t('credits_songCredit') }}
                        </router-link> -->
                        <a
                            target="_blank"
                            href="https://docs.google.com/forms/d/e/1FAIpQLSd9Sqcxox4B4UbSm2WPCD_jERcX0fiQ_d6Nw13sq8T0eXr36w/viewform"
                            class="tracking-wide leading-normal hover:underline"
                        >
                            {{ $t('common_contribute') }}
                        </a>
                    </div>
                </div>
            </div>
            <div class="md:col-span-3">
                <settings-card :category="category" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { SettingsCard } from "@/components";
import { BaseInput } from "@/components/inputs";
import { LogoutIcon, UserIcon, CogIcon, TagIcon, MicrophoneIcon } from "@heroicons/vue/solid";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";

@Options({
    components: {
        SettingsCard,
        BaseInput,
        LogoutIcon,
        UserIcon,
        CogIcon,
        TagIcon,
        MicrophoneIcon,
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
