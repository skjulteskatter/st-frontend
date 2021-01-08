<template>
    <div id="users">
        <div v-if="isAdmin">
            <h1>Users</h1>
            <button :disabled="disableButton" @click="refreshUsers()">Refresh</button>
            <card class="users__table" border>
                <table>
                    <thead>
                        <th>Id</th>
                        <th>Collection</th>
                        <th>Email</th>
                    </thead>
                    <tbody>
                        <tr v-for="u in users" :key="u.id">
                            <td>{{u.id}}</td>
                            <td>{{u.displayName}}</td>
                            <td>{{u.email}}</td>
                        </tr>
                    </tbody>
                </table>
            </card>
        </div>
        <div v-else>
            <h1>You don't have access to view this page</h1>
        </div>
    </div>
</template>

<script lang="ts">
import { sessionKey, usersKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import Card from '@/components/Card.vue'

@Options({
    components: {
        Card,
    }
})
export default class Subscriptions extends Vue {
    public usersStore = useStore(usersKey);
    public disableButton = false;

    get users(): User[] {
        return useStore(usersKey).state.users;
    }

    get isAdmin(): boolean {
        const admin = useStore(sessionKey).getters.isAdmin;
        if (admin && this.users.length == 0) {
            this.usersStore.dispatch('getUsers');
        }
        return admin;
    }

    async refreshUsers() {
        this.disableButton = true;
        if (this.isAdmin) {
            await this.usersStore.dispatch('getUsers');
        }
        this.disableButton = false;
    }
}
</script>

<style lang="scss" scoped>

#users {
    td {
        padding: .5em;
    }
}

.users__table {
    margin-top: var(--spacing);
}

div table {
    text-align: left;
}

</style>