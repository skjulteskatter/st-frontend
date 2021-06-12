<template>
    <div class="p-4 md:p-8">
        <back-button class="md:hidden mb-4" />
        <div class="flex justify-between items-center mb-4">
            <h1 class="font-bold text-xl lg:text-2xl">{{ $t("common.settings") }}</h1>
            <base-button
                theme="error"
                icon="logout"
                @click="logout"
                class="settings-page__logout"
            >
                {{ $t("common.logout") }}
            </base-button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <settings-card />
            <user-card />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { SettingsCard, BackButton } from "@/components";
import { UserCard } from "@/components/settings";
import { BaseInput } from "@/components/inputs";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";

@Options({
    components: {
        SettingsCard,
        BaseInput,
        UserCard,
        BackButton,
    },
    name: "settings-view",
})
export default class SettingsView extends Vue {
    private store = useStore();

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
