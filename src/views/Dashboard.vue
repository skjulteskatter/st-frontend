<template>
    <div id="dashboard">
        <h1>Dashboard</h1>
        <card class="user-info" border>
            <div class="user-info__field">
                <label>Name</label>
                <h3>{{ user.displayName }}</h3>
            </div>
            <div class="user-info__field">
                <label>E-mail</label>
                <h3>{{ user.email }}</h3>
            </div>
        </card>
        
        <div class="api-token">
            <h2 style="display: inline-block; margin-right: var(--spacing)">API token</h2>
            <button @click="showApiToken = true" class="api-token__button">Show API token</button>
            <card v-if="showApiToken" style="font-size: .8em" border>{{ token }}</card>
        </div>
    </div>
</template>

<script lang="ts">
import { sessionKey } from '@/store';
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';
import Card from '@/components/Card.vue'

@Options({
    components: {
        Card,
    },
    data(){
        return {
            showApiToken: false
        }
    }
})
export default class Login extends Vue {
    user: User = useStore(sessionKey).getters?.currentUser || {};

    token = localStorage.getItem("id_token");
}
</script>

<style lang="scss" scoped>
.user-info {
    margin-bottom: var(--spacing);

    h3 {
        margin: 0;
    }

    &__field {
        &:not(:last-child) {
            margin-bottom: var(--spacing);
        }

        & > label {
            opacity: .7;
        }
    }
}
</style>