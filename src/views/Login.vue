<template>
    <!-- <div id="firebase-auth-container"></div> -->
    <div class="p-4 h-screen w-screen flex flex-col justify-center items-center gap-8" v-if="initialized && !user">
        <div class="flex flex-col justify-center gap-4">
            <img
                src="/img/logo/icon.svg"
                alt="SongTreasures logo"
                class="max-h-16"
            />
            <div class="flex flex-col items-center gap-3">
                <h2 class="text-2xl font-bold md:text-3xl">Sign in to your account</h2>
                <p class="m-0 text-sm">Or <span @click="createUserModal = true" class="hover:underline">register an account</span></p>
            </div>
        </div>
        <base-card id="login-card" class="p-4 max-w-md w-full">
            <div class="flex flex-col gap-6">
                <p v-if="noAccount" class="text-sm text-red-700 bg-red-100 rounded p-2">No account found with that email</p>
                <form @submit.prevent="submitForm" class="flex flex-col gap-4">
                    <base-input
                        label="Email"
                        type="email"
                        v-model="form.email"
                        required
                        :disabled="providers.length > 0"
                    />
                    <base-input
                        label="Password"
                        type="password"
                        v-model="form.password"
                        required
                    />
                    <label class="flex gap-3 items-center">
                        <input type="checkbox" v-model="stayLoggedIn" class="rounded border border-gray-300 focus:ring-primary text-primary" />
                        <span>Remember me</span>
                    </label>
                    <base-button
                        theme="secondary"
                        type="submit"
                        formaction="submit"
                    >
                        Sign in
                    </base-button>
                </form>
                <span class="flex justify-between items-center gap-4">
                    <hr class="border-t border-gray-200 flex-grow">
                    <small class="text-gray-500">Or continue with</small>
                    <hr class="border-t border-gray-200 flex-grow">
                </span>
                <div class="flex flex-col">
                    <div class="flex gap-3 justify-center">
                        <button
                            v-if="!providers.length || providers.includes('google.com')"
                            class="flex-grow p-2 border border-gray-300 rounded hover:border-gray-400 h-10 w-16 flex justify-center items-center"
                            @click="login('google')"
                        >
                            <img alt="GOOGLE ICON" class="h-full" src="/img/google.png" />
                        </button>
                        <button
                            v-if="!providers.length || providers.includes('apple.com')"
                            class="flex-grow p-2 border border-gray-300 rounded hover:border-gray-400 h-10 w-16 flex justify-center items-center"
                            @click="login('apple')"
                        >
                            <img alt="APPLE ICON" class="h-full" src="/img/apple.svg" />
                        </button>
                        <!-- <button
                            class="social__button"
                            @click="login('microsoft')"
                            disabled
                        >
                            <img alt="MICROSOFT" src="/img/microsoft.png" />
                        </button>
                        <button
                            class="social__button"
                            @click="login('twitter')"
                            disabled
                        >
                            <img alt="TWITTER ICON" src="/img/twitter.svg" />
                        </button> -->
                    </div>
                </div>
            </div>
        </base-card>
        <base-modal :show="createUserModal" @close="createUserModal = false">
            <h1 class="text-xl font-bold md:text-2xl mb-2">Register</h1>
            <div class="mb-2">
                <small><router-link class="text-primary hover:underline" to="/create">Create account</router-link></small>
            </div>
                <span class="flex justify-between items-center gap-4">
                    <hr class="border-t border-gray-200 flex-grow">
                    <small class="text-gray-500">Or create with</small>
                    <hr class="border-t border-gray-200 flex-grow">
                </span>
            <div class="flex flex-col mt-5">
                <div class="flex gap-3 justify-center">
                    <button
                        v-if="!providers.length || providers.includes('google.com')"
                        class="flex-grow p-2 border border-gray-300 rounded hover:border-gray-400 h-10 w-16 flex justify-center items-center"
                        @click="login('google')"
                    >
                        <img alt="Google" class="h-full" src="/img/google.png" />
                    </button>
                    <button
                        v-if="!providers.length || providers.includes('apple.com')"
                        class="flex-grow p-2 border border-gray-300 rounded hover:border-gray-400 h-10 w-16 flex justify-center items-center"
                        @click="login('apple')"
                    >
                        <img alt="Apple" class="h-full" src="/img/apple.svg" />
                    </button>
                </div>
            </div>
        </base-modal>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseInput } from "@/components/inputs";
import auth from "@/services/auth";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { BaseModal } from "@/components";

@Options({
    components: {
        BaseInput,
        BaseModal,
    },
    name: "login",
})
export default class Login extends Vue {
    public form = {
        email: "",
        password: "",
    };
    public noAccount = false;
    public stayLoggedIn = false;
    private store = useStore();
    public providers: string[] = [];

    public createUserModal = false;

    public mounted() {
        if (this.user) {
            this.$router.push({ name: "main" });
        }
    }

    public async submitForm() {
        if (this.form.email && !this.form.password) {
            this.noAccount = false;
            this.providers = await auth.getProviders(this.form.email);
            if (!this.providers?.length) {
                this.noAccount = true;
            }
        } else {
            await this.store.dispatch(SessionActionTypes.SESSION_LOGIN_EMAIL_PASSWORD, {
                email: this.form.email,
                password: this.form.password,
                stayLoggedIn: this.stayLoggedIn,
            });
        }
    }

    public createUser() {
        this.$router.push({ name: "create-user" });
    }

    public get user() {
        return this.store.getters.user;
    }

    public async login(provider: string) {
        await this.store.dispatch(SessionActionTypes.SESSION_LOGIN_SOCIAL, provider);
    }

    public get initialized() {
        return this.store.getters.initialized;
    }
}
</script>
