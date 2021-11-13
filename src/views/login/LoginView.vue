<template>
    <!-- <div class="h-screen w-screen grid lg:grid-cols-2" v-if="initialized && !user"> -->
        <section class="px-4 py-8 lg:py-16 flex flex-col items-center gap-4 bg-white">
            <div class="w-full max-w-xl flex flex-col items-center lg:items-start">
                <img
                    src="/img/logo/dark.svg"
                    alt="SongTreasures logo"
                    class="max-h-16"
                    height="64"
                />
                <TabGroup>
                    <TabList class="rounded-full bg-gray-200 p-1 mt-16 lg:mt-32">
                        <Tab v-slot="{ selected }" as="template">
                            <button :class="[selected ? 'bg-white shadow-md' : 'bg-transparent', 'rounded-full px-3 py-1 text-sm text-secondary']">Sign in</button>
                        </Tab>
                        <Tab v-slot="{ selected }" as="template">
                            <button :class="[selected ? 'bg-white shadow-md' : 'bg-transparent', 'rounded-full px-3 py-1 text-sm text-secondary']">Register</button>
                        </Tab>
                    </TabList>
                    <TabPanels as="template">
                        <TabPanel class="w-full flex flex-col items-center lg:items-start">
                            <p v-if="noAccount" class="text-sm text-red-700 bg-red-100 rounded p-2">No account found with that email</p>
                            <p v-if="wrongPassword" class="text-sm text-red-700 bg-red-100 rounded p-2">Wrong Password</p>
                            <h1 class="font-bold text-2xl lg:text-4xl mt-16 mb-4">Sign in</h1>
                            <div v-if="!providers.length || providers.filter(i => i != 'password').length" class="grid gap-3 w-full lg:grid-cols-3">
                                <button
                                    @click="login('google')"
                                    v-if="!providers.length || providers.includes('google.com')"
                                    title="Sign in with Google"
                                    :class="{'opacity-75 cursor-wait button--loading': loading.providergoogle}"
                                    class="p-6 cursor-pointer border border-gray-300 rounded-md hover:border-secondary h-20 flex gap-4 items-center justify-center"
                                >
                                    <img
                                        alt="GOOGLE"
                                        src="/img/google.svg"
                                        width="80"
                                        class="h-full login-image"
                                    />
                                    <span>Google</span>
                                </button>
                                <button
                                    @click="login('apple')"
                                    v-if="!providers.length || providers.includes('apple.com')"
                                    title="Sign in with Apple"
                                    class="p-6 cursor-pointer border border-gray-300 rounded-md hover:border-secondary h-20 flex gap-4 items-center justify-center"
                                >
                                    <img
                                        alt="APPLE"
                                        src="/img/apple.svg"
                                        width="80"
                                        class="h-full login-image"
                                    />
                                    <span>Apple</span>
                                </button>
                                <button
                                    @click="showEmail = !showEmail"
                                    title="Sign in with email"
                                    class="p-6 cursor-pointer border rounded-md h-20 flex gap-4 items-center justify-center"
                                    :class="[showEmail ? 'border-secondary': 'border-gray-300 hover:border-secondary']"
                                >
                                    <MailIcon class="mx-4 w-8 h-8 text-secondary" />
                                    <span>Mail</span>
                                </button>
                            </div>
                            <transition
                                enter-active-class="transition duration-200 ease-out"
                                enter-from-class="opacity-0 scale-95 -translate-y-4"
                                enter-to-class="opacity-100 scale-100 translate-y-0"
                            >
                                <form v-if="showEmail" @submit.prevent="submitForm" class="flex flex-col gap-4 mt-16 w-full">
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
                                    <a class="text-sm cursor-pointer hover:underline" @click="forgotPassword = true">Forgot password?</a>
                                </form>
                            </transition>
                        </TabPanel>
                        <TabPanel class="w-full flex flex-col items-center lg:items-start">
                            <h1 class="font-bold text-2xl lg:text-4xl mt-16 mb-4">Register account</h1>
                            <div class="grid gap-3 lg:grid-cols-2 w-full">
                                <button
                                    @click="login('google')"
                                    v-if="!providers.length || providers.includes('google.com')"
                                    title="Register with Google"
                                    class="p-6 cursor-pointer border border-gray-300 rounded-md hover:border-secondary h-20 flex gap-4 items-center justify-center"
                                >
                                    <img
                                        alt="GOOGLE"
                                        src="/img/google.svg" 
                                        width="80"
                                        class="h-full login-image"
                                    />
                                    <span>Google</span>
                                </button>
                                <button
                                    @click="login('apple')"
                                    v-if="!providers.length || providers.includes('apple.com')"
                                    title="Register with Apple"
                                    class="p-6 cursor-pointer border border-gray-300 rounded-md hover:border-secondary h-20 flex gap-4 items-center justify-center"
                                >
                                    <img
                                        alt="APPLE"
                                        src="/img/apple.svg" 
                                        width="80"
                                        class="h-full login-image"
                                    />
                                    <span>Apple</span>
                                </button>
                            </div>
                            <router-link class="opacity-50 text-sm hover:underline my-8" to="/create">Or register with email</router-link>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </div>
        </section>
        <base-modal :show="forgotPassword" @close="forgotPassword = false">
            <template #title>
                <h1 class="text-xl font-bold">Forgot password</h1>
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
    <!-- </div> -->
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseInput } from "@/components/inputs";
import auth from "@/services/auth";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { BaseModal } from "@/components";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import { MailIcon } from "@heroicons/vue/outline";

@Options({
    components: {
        BaseInput,
        BaseModal,
        TabGroup,
        TabList,
        TabPanels,
        TabPanel,
        Tab,
        MailIcon,
    },
    name: "login-view",
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
        this.loading.login = true;
        this.loading["provider" + provider] = true;
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