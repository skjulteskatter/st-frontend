<template>
    <div>
        <div v-if="isAdmin">
            <h1>Users</h1>
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
import api from "@/services/api";
import { key } from "@/store";
import { Vue } from "vue-class-component";
import { useStore } from "vuex";

export default class Subscriptions extends Vue {
    public users: User[] = [];
    public isAdmin = useStore(key).getters.isAdmin

    async mounted() {
        if (this.isAdmin) this.users = await api.admin.getAllUsers();
    }
}
</script>

<style scoped>

div table {
    text-align: left;
}

</style>