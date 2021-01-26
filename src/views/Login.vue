<template>
    <div class="wrapper">
        <card id="login-card" v-if="authInitialized && !loggedIn" border>
            <div class="login">
                <h1 class="login__title">Please log in</h1>
                <div class="social">
                    <button class="social-button hover" @click="login('google')"><img alt="GOOGLE ICON" src="/img/google.png"/></button>
                    <!-- <button class="social-button hover" @click="login('twitter')"><img alt="TWITTER ICON" src="/img/twitter.svg"/></button> -->
                </div>
                <form @submit.prevent="submitForm" class="login__form">
                    <div class="login__form__email">
                        <label for="email">Email</label>
                        <input type="email" id="email" v-model="form.email">
                    </div>
                    <div class="login__form__password">
                        <label for="password">Password</label>
                        <input type="password" id="password" v-model="form.password">
                    </div>
                    <div class="login__form__stay">
                        <label>
                            <input type="checkbox" v-model="stayLoggedIn">
                            <span>Remember me</span>
                        </label>
                    </div>
                    <button type="submit" class="login__form__submit">Log in</button>
                </form>
            </div>
        </card>
    </div>
</template>

<script lang="ts">
import { sessionKey } from '@/store';
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';
import Card from '@/components/Card.vue';

@Options({
    components: {
        Card
    }
})
export default class Login extends Vue {
    public form = {
        email: "",
        password: ""
    }
    public stayLoggedIn = false;
    private store = useStore(sessionKey);

    submitForm() {
        this.store.dispatch('loginWithEmailPassword', {email: this.form.email, password: this.form.password, stayLoggedIn: this.stayLoggedIn})
    }

    async login(provider: string) {
        await this.store.dispatch('socialLogin', provider);
    }

    public get authInitialized() {
        return this.store.state.authInitialized;
    }

    public get loggedIn() {
        return this.store.state.loggedIn;
    }
}

// export default {
//   data() {
//     return {
//       form: {
//         email: "",
//         password: ""
//       },
//       error: null
//     };
//   },
//   methods: {
//     submit() {
//       firebase
//         .auth()
//         .signInWithEmailAndPassword(this.form.email, this.form.password)
//         .then(data => {
//           this.$router.replace({ name: "Dashboard" });
//         })
//         .catch(err => {
//           this.error = err.message;
//         });
//     }
//   }
// };
</script>

<style lang="scss">

.wrapper {
    width: 100vw;
    height: 100vh;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background: var(--background-color);
}

#login-card {
    max-width: 500px;
    width: 100%;

    background: var(--secondary-background-color);
}

.social {
    &-button {
        width: 50px;
        height: 50px;
        background: var(--background-color);
        padding: .5em;
        border-radius: 100%;
        outline: 0;
        border: 1px solid var(--border-color);

        & img {
            width: 100%;
        }
    }
}

.login {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: var(--spacing);

    &__title {
        margin: 0;
    }

    &__form {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: var(--spacing);

        &__submit {
            font-size: inherit;
            padding: var(--spacing);
        }

        input {
            padding: var(--spacing);
            background: var(--background-color);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
        }

        // &__stay {
        //     input {

        //     }
        // }

        &__email, &__password {
            width: 100%;

            input {
                width: 100%;
            }

            label {
                display: block;
                margin-bottom: .2em;
            }
        }
    }
}

</style>