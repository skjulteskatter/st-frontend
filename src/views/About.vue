<template>
    <div class="about">
        <h1>this is ur user</h1>
        <h3>{{ user.displayName }}</h3>
        <br/>
        <h1>This is ur token</h1>
        <p style="font-align: left">{{ token }}</p>
    </div>
</template>

<script lang="ts">
import { key } from '@/store';
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';

@Options({
})
export default class Login extends Vue {
    user: User = useStore(key).getters?.currentUser || {};

    token = localStorage.getItem("id_token");

    mounted() {
        if (!this.user?.displayName) {
            this.$router.replace('/')
        }
    }
}
</script>