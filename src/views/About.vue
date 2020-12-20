<template>
    <div>
        <h1>This is your User</h1>
        <h3>{{ user.displayName }}</h3>
        <h4>{{ user.email }}</h4>
        <br/>
        <h1>This is the token you can use to access the API</h1>
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
}
</script>