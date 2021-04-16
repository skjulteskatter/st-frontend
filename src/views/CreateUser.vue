<template>
    <div class="wrapper">
        <base-card id="login-card" border>
            <div class="login gap-y">
                <h1 class="login__title">Create account</h1>
                <form @submit.prevent="submitForm" class="login__form gap-y">
                    <div class="login__form__email">
                        <label for="email">Display Name</label>
                        <input
                            type="text"
                            id="name"
                            autocomplete="name"
                            v-model="form.displayName"
                        />
                    </div>
                    <div class="login__form__email">
                        <label for="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            autocomplete="email"
                            v-model="form.email"
                        />
                    </div>
                    <div class="login__form__password">
                        <label for="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            autocomplete="new-password"
                            v-model="form.password"
                        />
                    </div>
                    <div class="login__form__password">
                        <label for="password">Repeat password</label>
                        <input
                            :style="
                                form.repeatPassword != form.password
                                    ? 'color: red'
                                    : ''
                            "
                            type="password"
                            id="repeat-password"
                            autocomplete="new-password"
                            v-model="form.repeatPassword"
                        />
                    </div>
                    <button type="submit" class="login__form__submit">
                        Sign Up
                    </button>
                </form>
            </div>
        </base-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import BaseCard from "@/components/BaseCard.vue";
import { useStore } from "@/store/typed";
import { SessionActionTypes } from "@/store/typed/modules/session/action-types";

@Options({
    components: {
        BaseCard,
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

    public submitForm() {
        if (
            this.form.password == this.form.repeatPassword &&
            this.form.password != "" &&
            this.form.displayName != ""
        ) {
            this.store.dispatch(SessionActionTypes.SESSION_CREATE_USER, {
                email: this.form.email,
                password: this.form.password,
                displayName: this.form.displayName,
            });
        }
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

    background: var(--st-color-background-card);
}

#login-card {
    max-width: 500px;
    width: 100%;

    background: var(--st-color-background);
}

.social {
    &-button {
        width: 50px;
        height: 50px;
        background: var(--st-color-background-card);
        padding: 0.5em;
        border-radius: 100%;
        outline: 0;
        border: 1px solid var(--st-color-border);

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
            background: var(--st-color-background-card);
            border: 1px solid var(--st-color-border);
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
