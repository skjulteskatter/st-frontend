<template>
    <div>
        <div class="user-info">
            <h1>This is your user</h1>
            <h3>{{ user.displayName }}</h3>
            <h4>{{ user.email }}</h4>
        </div>
        <h2>This is the token you can use to access the API</h2>
        <p style="font-align: left">{{ token }}</p>
    </div>
</template>

<script lang="ts">
import { sessionKey } from '@/store';
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';

@Options({
})
export default class Login extends Vue {
    user: User = useStore(sessionKey).getters?.currentUser || {};

    token = localStorage.getItem("id_token");
}
</script>