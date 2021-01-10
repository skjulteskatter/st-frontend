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
                                <modal label="Edit" class="edit-user">
                                    <h2 style="margin-top: 0">{{u.displayName}}</h2>
                                    <div class="edit-user__form">
                                        <div class="edit-user__form__field">
                                            <label class="edit-user__form__field__label">Roles</label>
                                            <label class="edit-user__form__role" v-for="role in roles" :key="role">
                                                <input type="checkbox" :checked="u.roles.find(r => r.name == role)">
                                                {{ role }}
                                            </label>
                                        </div>
                                    </div>
                                </modal>
                            </td>
                            <td>{{u.displayName}}</td>
                            <td>{{u.email}}</td>
                            <td>{{u.roles[0] ? u.roles[0].name : 'NOT SET'}}</td>
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
import Modal from '@/components/Modal.vue'

@Options({
    components: {
        Card,
        Modal
    }
})
export default class Subscriptions extends Vue {
    public usersStore = useStore(usersKey);
    public disableButton = false;

    get users(): User[] {
        return useStore(usersKey).state.users;
    }

    public get isAdmin(): boolean {
        const admin = useStore(sessionKey).getters.isAdmin;
        if (admin && this.users.length == 0 && this.roles.length == 0) {
            this.usersStore.dispatch('getUsers');
            this.usersStore.dispatch('getRoles');
        }
        return admin;
    }

    public get roles() {
        return useStore(usersKey).state.roles;
    }

    public async refreshUsers() {
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
    &__form {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing);
        min-width: 300px;

        &__field {
            width: 100%;
            display: flex;
            flex-direction: column;

            &__label {
                margin-bottom: .25em;
                opacity: .6;
            }
        }
    }
}

.users__table {
    text-align: left;
    overflow-x: auto;

    table {
        width: 100%;
        border-collapse: collapse;

        th {
            padding: .5em;
        }
        
        tr {
            &:nth-child(odd) {
                background: #eaeaea;
            }
        }

        td {
            padding: .5em;

            & > {
                margin: 0;
            }
        }
    }
    


}

</style>