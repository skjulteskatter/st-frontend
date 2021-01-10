<template>
    <div id="users">
        <div v-if="isAdmin">
            <div class="header">
                <h1>Users</h1>
                <button :disabled="disableButton" @click="refreshUsers()" secondary>Refresh</button>
            </div>
            <card class="users__table" border>
                <table>
                    <thead>
                        <th></th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Id</th>
                    </thead>
                    <tbody>
                        <tr v-for="u in users" :key="u.id">
                            <td>
                                <button @click="openUserPanel(u)" secondary>Edit</button>
                            </td>
                            <td>{{u.displayName}}</td>
                            <td>{{u.email}}</td>
                            <td>
                                <select name="role" id="role">
                                    <option :value="u.roles[0] ? u.roles[0].name : 'NOT SET'">{{u.roles[0] ? u.roles[0].name : 'NOT SET'}}</option>
                                    <option :value="role" v-for="role in roles" :key="role">{{role}}</option>
                                </select>
                            </td>
                            <td>{{u.id}}</td>
                        </tr>

                    </tbody>
                </table>
            </card>
            <card class="edit-user" v-if="showUserPanel" border>
                <h2>Edit user</h2>
                <button @click="closeUserPanel">Save</button>
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
    public showUserPanel = false;

    get users(): User[] {
        return useStore(usersKey).state.users;
    }

    public openUserPanel(){
        this.showUserPanel = true;
    }

    public closeUserPanel(){
        this.showUserPanel = false;
    }

    get isAdmin(): boolean {
        const admin = useStore(sessionKey).getters.isAdmin;
        if (admin && this.users.length == 0 && this.roles.length == 0) {
            this.usersStore.dispatch('getUsers');
            this.usersStore.dispatch('getRoles');
        }
        return admin;
    }

    get roles() {
        return useStore(usersKey).state.roles;
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

.header {
    display: flex;
    align-items: center;
    gap: var(--spacing);
    margin: 0;
}

.edit-user {
    margin-top: var(--spacing);

    h2 {
        margin-top: 0;
    }
}

.users__table {
    text-align: left;
    overflow-x: auto;

    #role {
        font-size: inherit;
        color: var(--text-color);
        background: transparent;
        border: none;
        min-width: 100px;
        width: 100%;
    }

    table {
        width: 100%;
    }
    
    td {
        padding: .5em;

        & > {
            margin: 0;
        }
    }

    tr {
        
        &:nth-child(odd) {
            background: #eaeaea;
        }
    }

}

</style>