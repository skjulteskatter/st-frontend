<template>
    <div class="container">
        <div class="row">
            <button class="social-button" @click="login()"><img alt="GOOGLE ICON" src="/img/google.png"/></button>
        </div>
    </div>
</template>

<script lang="ts">
import { sessionKey } from '@/store';
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';

@Options({
})
export default class Login extends Vue {
    form = {
        email: "",
        password: ""
    }
    store = useStore(sessionKey)

    async login () {
        await this.store.dispatch('socialLogin', true);
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

<style scoped>

.social-button {
    width: 75px;
    background: white;
    padding: 10px;
    border-radius: 100%;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
    outline: 0;
    border: 0;
}
.social-button:active {
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.1);
}
.social-button img {
    width: 100%;
}

</style>