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

        <card style="margin-bottom: var(--spacing)">
            <div class="user-settings">
                <h2>User settings</h2>
                <div class="user-settings__color">
                    <label>
                        <span>Theme color</span>
                        <input type="color">
                    </label>
                </div>
                <div class="user-settings__language">
                    <label>
                        <span>Language</span>
                        <select name="language">
                            <option value="no">NO</option>
                        </select>
                    </label>
                </div>
            </div>
        </card>
        
        <card class="api-token">
            <h3>API token</h3>
            <button @click="showApiToken = true" class="api-token__button">Show API token</button>
            <p v-if="showApiToken" style="font-size: .8em">{{ token }}</p>
        </card>
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

.user-settings {
    display: flex;
    flex-direction: column;
    gap: var(--spacing);

    div {
        span {
            display: block;
            margin-bottom: .2em;
        }
    }

    h2 {
        margin: 0;
    }
}

.api-token {
    h3 {
        margin: 0 var(--spacing) 0 0;
        display: inline-block;
    }
}
</style>