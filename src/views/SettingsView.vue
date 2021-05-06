<template>
    <div class="settings-page">
        <div class="settings-page__header">
            <h1 class="settings-page__title">{{ $t("common.settings") }}</h1>
            <base-button
                theme="error"
                icon="logout"
                @click="logout"
                class="settings-page__logout"
            >
                {{ $t("common.logout") }}
            </base-button>
        </div>
        <div class="settings-page__body">
            <settings-card />
            <user-card />
        </div>

        <base-button @click="updatePassword = !updatePassword"
            >Set new password</base-button
        >
        <div v-if="updatePassword">
            <form @submit="resetPassword">
                <base-input
                    type="password"
                    v-if="passwordUser"
                    v-model="oldPassword"
                    label="Old password"
                />
                <base-input
                    type="password"
                    v-model="newPassword"
                    label="New password"
                />
                <base-input
                    :style="newPassword != repeatPassword ? 'color: red' : ''"
                    type="password"
                    v-model="repeatPassword"
                    label="Repeat password"
                />
                <button formaction="submit">Submit</button>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { SettingsCard } from "@/components";
import { UserCard } from "@/components/settings";
import { BaseInput } from "@/components/inputs";
import auth from "@/services/auth";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";

@Options({
    components: {
        SettingsCard,
        BaseInput,
        UserCard,
    },
    name: "settings-view",
})
export default class SettingsView extends Vue {
    private store = useStore();

    public updatePassword = false;

    public newPassword = "";
    public repeatPassword = "";
    public oldPassword = "";

    public logout() {
        this.store.dispatch(SessionActionTypes.SESSION_CLEAR).then(() => {
            window.location.replace("/login");
        });
    }

    public resetPassword() {
        if (this.newPassword == this.repeatPassword) {
            auth.resetPassword(this.oldPassword, this.newPassword);
        }
    }

    public get passwordUser() {
        return auth.user?.providerData.find((p) => p?.providerId == "password");
    }
}
</script>

<style lang="scss" >
@import "../style/mixins";

.settings-page {
    padding: calc(var(--st-spacing) * 2);
    max-width: 1920px;

    @include breakpoint("medium") {
        padding: var(--st-spacing);
    }

    &__logout {
        @include breakpoint("small") {
            .button__content {
                display: none;
            }
        }
    }

    &__body {
        display: grid;
        grid-template-areas: "settings settings settings settings user";
        grid-gap: var(--st-spacing);

        @include breakpoint("small") {
            grid-template-areas:
                "user"
                "settings";
        }
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__title {
        margin-top: 0;
    }
}
</style>
