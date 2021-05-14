<template>
    <div class="wrapper">
        <base-card id="create-user-card" border>
            <div class="create-user">
                <h2 class="create-user__title">Create account</h2>
                <form @submit.prevent="submitForm" class="create-user__form gap-y">
                    <div class="create-user__form__email">
                        <!-- <label for="email">Display Name</label>
                        <input
                            type="text"
                            id="name"
                            autocomplete="name"
                            v-model="form.displayName"
                        /> -->
                        <base-input label="Display name" v-model="form.displayName" autocomplete="name" type="text" />
                    </div>
                    <div class="create-user__form__email">
                        <!-- <label for="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            autocomplete="email"
                            v-model="form.email"
                        /> -->
                        <base-input label="Email" v-model="form.email" autocomplete="email" type="email" />
                    </div>
                    <div class="create-user__form__password">
                        <!-- <label for="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            autocomplete="new-password"
                            v-model="form.password"
                        /> -->
                        <base-input label="Password" v-model="form.password" autocomplete="new-password" type="password" />
                    </div>
                    <div class="create-user__form__password">
                        <!-- <label for="password">Repeat password</label>
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
                        /> -->
                        <base-input label="Repeat password" v-model="form.repeatPassword" autocomplete="new-password" type="password" :style="form.repeatPassword != form.password ? 'color: red' : ''" />
                    </div>
                    <base-button theme="primary" icon="check" type="submit" class="create-user__form__submit">
                        Sign Up
                    </base-button>
                </form>
            </div>
        </base-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseCard, BaseButton } from "@/components";
import { BaseInput } from "@/components/inputs";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";

@Options({
    components: {
        BaseCard,
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

#create-user-card {
    max-width: 500px;
    width: 100%;
    background: var(--st-color-background-light);
}

.create-user {
    display: flex;
    align-items: center;
    flex-direction: column;

    &__title {
        margin-top: 0;
    }

    &__form {
        width: 100%;
        display: flex;
        flex-direction: column;

        &__submit {
            font-size: inherit;
            margin-top: var(--st-spacing);
        }

        input {
            background: var(--st-color-background-medium);
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
