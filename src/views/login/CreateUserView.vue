<template>
    <section class="px-4 py-8 lg:py-16 flex flex-col items-center gap-4 bg-white">
        <div class="w-full max-w-xl flex flex-col items-center lg:items-start">
            <img
                src="/img/logo/dark.svg"
                alt="SongTreasures logo"
                class="max-h-16"
                height="64"
            />
            <back-button class="mt-8 mr-auto" to="/login" />
            <h2 class="font-bold text-2xl lg:text-4xl mt-16 mb-4">Register with email</h2>
            <form @submit.prevent="submitForm" class="flex flex-col gap-4 w-full">
                <h3 v-if="error" class="bg-red-100 text-red-700 rounded p-2">{{error}}</h3>
                <base-input label="Name" v-model="form.displayName" autocomplete="name" type="text" />
                <base-input label="Email" v-model="form.email" autocomplete="email" type="email" />
                <base-input label="Password" v-model="form.password" autocomplete="new-password" type="password" />
                <base-input label="Repeat password" v-model="form.repeatPassword" autocomplete="new-password" type="password" :style="form.repeatPassword != form.password ? 'color: red' : ''" />
                <base-button :loading="creatingAccount" theme="secondary" type="submit">
                    Sign up
                </base-button>
            </form>
        </div>
    </section>
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
    name: "create-user-view",
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
