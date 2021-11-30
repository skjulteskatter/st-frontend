<template>
    <section class="px-4 py-8 lg:py-16 flex flex-col items-center gap-4 bg-white">
        <div class="w-full max-w-xl flex flex-col items-center lg:items-start">
            <img
                src="/img/logo/dark.svg"
                alt="SongTreasures logo"
                class="max-h-16"
                height="64"
            />
            <BackButton class="mt-8 mr-auto" to="/login" />
            <h2 class="font-bold text-2xl lg:text-4xl mt-16 mb-4">Register with email</h2>
            <form @submit.prevent="submitForm" class="flex flex-col gap-4 w-full">
                <h3 v-if="error" class="bg-red-100 text-red-700 rounded p-2">{{error}}</h3>
                <BaseInput label="Name" v-model="form.displayName" autocomplete="name" type="text" />
                <BaseInput label="Email" v-model="form.email" autocomplete="email" type="email" />
                <BaseInput label="Password" v-model="form.password" autocomplete="new-password" type="password" />
                <BaseInput label="Repeat password" v-model="form.repeatPassword" autocomplete="new-password" type="password" :style="form.repeatPassword != form.password ? 'color: red' : ''" />
                <BaseButton :loading="creatingAccount" theme="secondary" type="submit">
                    Sign up
                </BaseButton>
            </form>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { BaseButton } from "@/components";
import { BaseInput } from "@/components/inputs";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";

export default defineComponent({
    name: "create-user-view",
    components: {
        BaseButton,
        BaseInput,
    },
    data: () => ({
        store: useStore(),
        form: {
            displayName: "",
            email: "",
            password: "",
            repeatPassword: "",
        },
        stayLoggedIn: false,
        creatingAccount: false,
    }),
    computed: {
        error() {
            return this.store.state.session.error;
        },
    },
    methods: {
        async submitForm() {
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
                this.creatingAccount = false;
            }
        },
    },
});
</script>
