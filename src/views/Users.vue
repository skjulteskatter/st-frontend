<template>
    <div>
        <div v-if="isAdmin">
            <h1>Users</h1>
            <button :disabled="disableButton" @click="refreshUsers()">Refresh</button>
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
        </div>
        <div v-else>
            <h1>You don't have access to view this page</h1>
        </div>
    </div>
</template>

<script lang="ts">
import { sessionKey, usersKey } from "@/store";
import { Vue } from "vue-class-component";
import { useStore } from "vuex";

export default class Subscriptions extends Vue {
    public usersStore = useStore(usersKey);
    public users: User[] = useStore(usersKey).state.users;
    public isAdmin = useStore(sessionKey).getters.isAdmin;
    public disableButton = false;

    async beforeMount() {
        if (this.isAdmin && this.users.length === 0) {
            await this.usersStore.dispatch('getUsers');
        }
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

<style scoped>

div table {
    text-align: left;
}

</style>