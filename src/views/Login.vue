<template>
    <div class="container">
        <card id="login-card" border>
            <div class="login">
                <h1 class="login__title">Please log in</h1>
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
        <div class="social">
            <button class="social-button" @click="login('google')"><img alt="GOOGLE ICON" src="/img/google.png"/></button>
        </div>
    </div>
</template>

<script lang="ts">
import { sessionKey } from '@/store';
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';
import Card from '@/components/Card.vue'
import fb from 'firebase/app';
import 'firebase/auth';

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
        await this.store.dispatch('socialLogin', {provider, stayLoggedIn: this.stayLoggedIn});
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

.container {
    width: 100vw;
    height: 100vh;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

#login-card {
    max-width: 500px;
    width: 100%;
}

.social {
    padding: var(--spacing);

    &-button {
        width: 60px;
        height: 60px;
        background: white;
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
    flex-direction: column;
    gap: var(--spacing);

    &__title {
        margin: 0;
    }

    &__form {
        display: flex;
        flex-direction: column;
        gap: var(--spacing);

        &__submit {
            font-size: inherit;
            padding: var(--spacing);
        }

        input {
            padding: var(--spacing);
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