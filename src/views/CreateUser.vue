<template>
    <div class="w-screen h-screen flex flex-col justify-center items-center gap-6 p-8">
        <img src="/img/logo/icon.svg" alt="SongTreasures logo" class="max-h-16">
        <h2 class="text-2xl md:text-3xl font-bold">Create account</h2>
        <base-card class="max-w-md w-full p-4">
            <div class="flex flex-col gap-4">
                <h3 v-if="error" class="bg-red-100 text-red-700 rounded p-2">{{error}}</h3>
                <form @submit.prevent="submitForm" class="flex flex-col gap-4">
                    <base-input label="Display name" v-model="form.displayName" autocomplete="name" type="text" />
                    <base-input label="Email" v-model="form.email" autocomplete="email" type="email" />
                    <base-input label="Password" v-model="form.password" autocomplete="new-password" type="password" />
                    <base-input label="Repeat password" v-model="form.repeatPassword" autocomplete="new-password" type="password" :style="form.repeatPassword != form.password ? 'color: red' : ''" />
                    <base-button :loading="creatingAccount" theme="secondary" type="submit">
                        Sign Up
                    </base-button>
                </form>
            </div>
        </base-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseButton } from "@/components";
import { BaseInput } from "@/components/inputs";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";

@Options({
    components: {
        BaseButton,
        BaseInput,
    },
    name: "create-user",
})
export default class Login extends Vue {
    public form = {
        displayName: "",
        email: "",
        password: "",
        repeatPassword: "",
    };
    public stayLoggedIn = false;
    private store = useStore();
    public creatingAccount = false;

    public get error() {
        return this.store.state.session.error;
    }

    public async submitForm() {
        if (
            this.form.password == this.form.repeatPassword &&
            this.form.password != "" &&
            this.form.displayName != ""
        ) {
            this.creatingAccount = true;
            await this.store.dispatch(SessionActionTypes.SESSION_CREATE_USER, {
                email: this.form.email,
                password: this.form.password,
                displayName: this.form.displayName,
            });
        }
    }
}
</script>
