<template>
    <div class="p-4 h-screen w-screen flex flex-col justify-center items-center gap-8" v-if="initialized && !user">
        <div class="flex flex-col justify-center gap-4">
            <img
                src="/img/logo/icon.svg"
                alt="SongTreasures logo"
                class="max-h-16"
            />
            <div class="flex flex-col items-center gap-3">
                <h2 class="text-2xl font-bold md:text-3xl">Sign in to your account</h2>
                <p class="m-0 text-sm">Or <span @click="createUserModal = true" class="text-primary cursor-pointer hover:underline">register an account</span></p>
            </div>
        </div>
        <base-card id="login-card" class="p-4 max-w-md w-full">
            <div class="flex flex-col gap-6">
                <p v-if="noAccount" class="text-sm text-red-700 bg-red-100 rounded p-2">No account found with that email</p>
                <p v-if="wrongPassword" class="text-sm text-red-700 bg-red-100 rounded p-2">Wrong Password</p>
                <div class="flex flex-col" v-if="!providers.length || providers.filter(i => i != 'password').length">
                    <div class="flex gap-3 justify-center">
                        <img
                            v-if="!providers.length || providers.includes('google.com')"
                            alt="GOOGLE"
                            src="/img/google.svg" 
                            class="p-4 login-image cursor-pointer border border-gray-300 rounded hover:border-gray-400 h-20 w-20"
                            @click="login('google')"
                        />
                        <img
                            v-if="!providers.length || providers.includes('apple.com')"
                            alt="APPLE"
                            src="/img/apple.svg" 
                            class="p-4 login-image cursor-pointer border border-gray-300 rounded hover:border-gray-400 h-20 w-20"
                            @click="login('apple')"
                        />
                    </div>
                </div>
                <span class="flex justify-between items-center gap-4" v-if="!providers.length || providers.filter(i => i != 'password').length">
                    <hr class="border-t border-gray-200 flex-grow">
                    <small @click="showEmail = !showEmail" class="text-gray-500 cursor-pointer hover:underline">Or log in with email.<icon :name="showEmail ? 'arrowUp' : 'arrowDown'" /></small>
                    
                    <hr class="border-t border-gray-200 flex-grow">
                </span>
                <form v-if="showEmail" @submit.prevent="submitForm" class="flex flex-col gap-4">
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
                        :required="providers.includes('password')"
                        v-if="providers.includes('password') || providers.length == 0"
                        v-model="form.password"
                    />
                    <label class="flex gap-3 items-center">
                        <input type="checkbox" v-model="stayLoggedIn" class="rounded border border-gray-300 focus:ring-primary text-primary" />
                        <span>Remember me</span>
                    </label>
                    <base-button
                        theme="secondary"
                        type="submit"
                        formaction="submit"
                        :loading="loading.login"
                    >
                        Sign in
                    </base-button>
                    <a class="cursor-pointer hover:underline" @click="forgotPassword = true">Forgot password?</a>
                </form>
            </div>
        </base-card>
        <base-modal :show="forgotPassword" @close="forgotPassword = false">
            <template #title>
                <h1 class="text-xl font-bold md:text-2xl">Forgot password</h1>
            </template>
            <div class="flex flex-col items-center gap-4">
                <form @submit.prevent="sendForgotEmail()" class="flex flex-col gap-4">
                    <base-input
                        type="email"
                        label="Email"
                        v-model="form.email"
                        required
                        @keydown.enter="sendForgotEmail()"
                    />
                    <base-button 
                        theme="secondary" 
                        type="submit"
                        formaction="submit"
                        :disabled="forgotPasswordSent"
                    >Send</base-button>
                </form>
                <div v-if="forgotPasswordSent">Email sent</div>
            </div>
        </base-modal>
        <base-modal :show="createUserModal" @close="createUserModal = false">
            <template #title>
                <h1 class="text-xl font-bold md:text-2xl">Register account</h1>
            </template>
            <div class="flex flex-col items-center gap-4">
                <small>Register with</small>
                <div class="flex flex-col">
                    <div class="flex gap-3 justify-center">
                        <button
                            v-if="!providers.length || providers.includes('google.com')"
                            class="flex-grow p-2 border border-gray-300 rounded hover:border-gray-400 h-10 w-16 flex justify-center items-center"
                            @click="login('google')"
                        >
                            <img alt="Google" class="h-full" src="/img/google.svg" />
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
                <router-link class="text-gray-400 text-xs hover:underline" to="/create">Or register with email</router-link>
            </div>
        </base-modal>
    </div>
    <loader v-else :loading="true"></loader>
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
    public wrongPassword = false;
    public stayLoggedIn = false;
    public showEmail = false;
    private store = useStore();
    public providers: string[] = [];

    public loading: {
        [key: string]: boolean | undefined;
    } = {};

    public createUserModal = false;
    public forgotPassword = false;
    public forgotPasswordSent = false;

    public mounted() {
        if (this.user) {
            this.$router.push({ name: "main" });
        }
    }

    public async submitForm() {
        this.loading.login = true;
        if (this.form.email && !this.form.password) {
            this.noAccount = false;
            this.providers = await auth.getProviders(this.form.email);
            if (!this.providers?.length) {
                this.noAccount = true;
            }
        } else {
            try {
                await this.store.dispatch(SessionActionTypes.SESSION_LOGIN_EMAIL_PASSWORD, {
                    email: this.form.email,
                    password: this.form.password,
                    stayLoggedIn: this.stayLoggedIn,
                });
            }
            catch {
                this.wrongPassword = true;
            }
        }
        this.loading.login = false;
    }

    public async sendForgotEmail() {
        if (!this.forgotPasswordSent && this.form.email) {
            this.forgotPasswordSent = true;
            await auth.forgotPassword(this.form.email);
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
<style lang="scss">

.login-image {
    object-fit: contain;
}
</style>
