<template>
    <div class="settings-page">
        <div class="settings-page__header">
            <h1 class="settings-page__title">{{ $t("common.settings") }}</h1>
            <base-button theme="error" icon="logout" @click="logout">
                {{ $t("common.logout") }}
            </base-button>
        </div>
        <settings-card></settings-card>
        <base-button @click="updatePassword = !updatePassword">Set new password</base-button>
        <div v-if="updatePassword">
            <form @submit="resetPassword">
                <base-input type="password" v-if="passwordUser" v-model="oldPassword" label="Old password"/>
                <base-input type="password" v-model="newPassword" label="New password"/>
                <base-input :style="newPassword != repeatPassword ? 'color: red' : ''" type="password" v-model="repeatPassword" label="Repeat password"/>
                <button formaction="submit">Submit</button>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { SettingsCard, BaseButton } from "@/components";
import { useStore } from "vuex";
import { sessionKey } from "@/store";
import { BaseInput } from "@/components/inputs";
import auth from "@/services/auth";

@Options({
    components: {
        SettingsCard,
        BaseButton,
        BaseInput
    },
    name: "settings-view"
})
export default class SettingsView extends Vue {
    private store = useStore(sessionKey);

    public updatePassword = false;

    public newPassword = "";
    public repeatPassword = "";
    public oldPassword = "";

    public logout() {
        this.store.dispatch("logout").then(() => {
            window.location.replace("/login");
        });
    }

    public resetPassword() {
        console.log(this.newPassword, this.repeatPassword)

        if (this.newPassword == this.repeatPassword) {
            auth.resetPassword(this.oldPassword, this.newPassword);

            console.log("reset password");
        }
    }

    public get passwordUser() {
        return auth.user?.providerData.find(p => p?.providerId == "password");
    }
}
</script>

<style lang="scss" >
@import "../style/mixins";

.settings-page {
    padding: calc(var(--st-spacing) * 2);

    @include breakpoint("medium") {
        padding: var(--st-spacing);
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