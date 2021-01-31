<template>
    <div class="wrapper">
        <base-card id="login-card" v-if="authInitialized && !loggedIn" border>
            <div class="login gap-y">
                <h1 class="login__title">Please log in</h1>
                <div class="social">
                    <button
                        class="social-button clickable"
                        @click="login('google')"
                    >
                        <img alt="GOOGLE ICON" src="/img/google.png" />
                    </button>
                    <button
                        class="social-button hover clickable"
                        @click="login('microsoft')"
                    >
                        <img alt="MICROSOFT" src="/img/microsoft.png" />
                    </button>
                    <!-- <button class="social-button hover" @click="login('twitter')"><img alt="TWITTER ICON" src="/img/twitter.svg"/></button> -->
                </div>
                <form @submit.prevent="submitForm" class="login__form gap-y">
                    <div class="login__form__email">
                        <label for="email">Email</label>
                        <input type="email" id="email" v-model="form.email" />
                    </div>
                    <div class="login__form__password">
                        <label for="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            v-model="form.password"
                        />
                    </div>
                    <div class="login__form__stay">
                        <label>
                            <input type="checkbox" v-model="stayLoggedIn" />
                            <span>Remember me</span>
                        </label>
                    </div>
                    <button type="submit" class="login__form__submit">
                        Log in
                    </button>
                </form>
            </div>
        </base-card>
    </div>
</template>

<script lang="ts">
import { sessionKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import BaseCard from "@/components/BaseCard.vue";

@Options({
    components: {
        BaseCard,
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

    public async login(provider: string) {
        await this.store.dispatch("socialLogin", provider);
    }

    public get authInitialized() {
        return this.store.state.authInitialized;
    }

    public get loggedIn() {
        return this.store.state.loggedIn;
    }
}
</script>

<style lang="scss">
.wrapper {
    width: 100vw;
    height: 100vh;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background: var(--st-background-color);
}

#login-card {
    max-width: 500px;
    width: 100%;

    background: var(--st-secondary-background-color);
}

.social {
    &-button {
        width: 50px;
        height: 50px;
        background: var(--st-background-color);
        padding: 0.5em;
        border-radius: 100%;
        outline: 0;
        border: 1px solid var(--st-border-color);

        & img {
            width: 100%;
        }
    }
}

.login {
    display: flex;
    align-items: center;
    flex-direction: column;
    // gap: var(--st-spacing);

    &__title {
        margin: 0;
    }

    &__form {
        width: 100%;
        display: flex;
        flex-direction: column;
        // gap: var(--st-spacing);

        &__submit {
            font-size: inherit;
            padding: var(--st-spacing);
        }

        input {
            padding: var(--st-spacing);
            background: var(--st-background-color);
            border: 1px solid var(--st-border-color);
            border-radius: var(--st-border-radius);
        }

        // &__stay {
        //     input {

        //     }
        // }

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