<template>
    <!-- <div id="firebase-auth-container"></div> -->
    <div class="wrapper">
        <base-card id="login-card" v-if="initialized && !user">
            <div class="login gap-y">
                <img
                    src="/img/SongTreasures_logo.svg"
                    alt="SongTreasures logo"
                    class="logo"
                />
                <h2 class="login__title">Sign in</h2>
                <form @submit.prevent="submitForm" class="login__form gap-y">
                    <base-input
                        label="Email"
                        type="email"
                        v-model="form.email"
                        required
                    />
                    <base-input
                        label="Password"
                        type="password"
                        v-model="form.password"
                        required
                    />
                    <div class="login__form__stay">
                        <label>
                            <input type="checkbox" v-model="stayLoggedIn" />
                            <span>Remember me</span>
                        </label>
                    </div>
                    <base-button type="submit" class="login__form__submit">
                        Sign in
                    </base-button>
                </form>
                <div class="social">
                    <span class="social__label">Or with</span>
                    <div class="social__buttons">
                        <button
                            class="social__button clickable"
                            @click="login('google')"
                        >
                            <img alt="GOOGLE ICON" src="/img/google.png" />
                        </button>
                        <button
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
                        </button>
                    </div>
                </div>
                <router-link :to="{name:'create-user'}">Create account</router-link>
            </div>
        </base-card>
    </div>
</template>

<script lang="ts">
import { sessionKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { BaseCard, BaseButton } from "@/components";
import { BaseInput } from "@/components/inputs";

@Options({
    components: {
        BaseCard,
        BaseButton,
        BaseInput,
    },
})
export default class Login extends Vue {
    public form = {
        email: "",
        password: "",
    };
    public stayLoggedIn = false;
    private store = useStore(sessionKey);

    public submitForm() {
        this.store.dispatch("loginWithEmailPassword", {
            email: this.form.email,
            password: this.form.password,
            stayLoggedIn: this.stayLoggedIn,
        });
    }

    public createUser() {
        this.$router.push({ name: "create-user" });
    }

    public get user() {
        return this.store.state.currentUser;
    }

    public async login(provider: string) {
        await this.store.dispatch("socialLogin", provider);
    }

    public get initialized() {
        return this.store.state.initialized;
    }
}
</script>

<style lang="scss">
@import "../style/mixins";

.wrapper {
    width: 100vw;
    height: 100vh;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background: var(--st-color-background-dark);
}

#login-card {
    max-width: 500px;
    width: 100%;

    background: var(--st-color-background-light);

    @include breakpoint("small") {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .card__content {
        padding: 2rem;
    }
}

.social {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--st-spacing);
    width: 100%;

    &__label {
        opacity: 0.5;
        color: var(--st-color-text);
    }

    &__buttons {
        & > *:not(:last-child) {
            margin-right: 1.5rem;
        }
    }

    &__button {
        --size: 40px;
        width: var(--size);
        height: var(--size);
        background: transparent;
        padding: 0;
        border-radius: 100%;

        &[disabled] {
            opacity: 0.5;
            filter: grayscale(1);
            cursor: not-allowed;
        }

        img {
            width: 100%;
        }
    }
}

.login {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: var(--st-spacing);

    .logo {
        max-height: 4em;
    }

    &__form {
        width: 100%;
        display: flex;
        flex-direction: column;

        input {
            padding: calc(var(--st-spacing) / 2);
            background: var(--st-color-background-medium);
            border: 1px solid var(--st-color-border);
            border-radius: var(--st-border-radius);
        }

        &__submit {
            margin-top: var(--st-spacing);
        }

        &__email,
        &__password {
            width: 100%;

            input {
                width: 100%;
            }

            label {
                display: block;
                margin-bottom: 0.2em;
            }
        }
    }
}
</style>