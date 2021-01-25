<template>
    <div id="users">
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
                            <modal label="Edit" class="edit-user" v-if="u.id != currentUser.id">
                                <div class="loading" v-if="loading"></div>
                                <h2 style="margin-top: 0">{{u.displayName}}</h2>
                                <div class="edit-user__form">
                                    <div class="edit-user__form__field">
                                        <label class="edit-user__form__field__label">Roles</label>
                                        <label class="edit-user__form__role" v-for="role in roles" :key="role">
                                            <input type="checkbox" :checked="u.roles.find(r => r.name == role)" @change="toggleRole(u, role)">
                                            {{ role }}
                                        </label>
                                    </div>
                                </div>
                                <button @click="saveRoles(u)" class="edit-user__save">Save</button>
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
    </div>
</template>
<script lang="ts">
import { usersKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import Card from '@/components/Card.vue'
import Modal from '@/components/Modal.vue'


@Options({
    components: {
        Card,
        Modal,
    },
    props: {
        users: {
            type: Array,
            default: () => [],
        },
        currentUser: {
            type: Object,
            default: {},
        }
    }
})
export default class UsersList extends Vue {
    public users: User[] = [];
    private usersStore = useStore(usersKey);
    public disableButton = false;
    

    public async mounted() {
        await this.usersStore.dispatch('getUsers');
        await this.usersStore.dispatch('getRoles');
    }

    public async refreshUsers() {
        this.disableButton = true;
        await this.usersStore.dispatch('getUsers');
        this.disableButton = false;
    }
}
</script>
<style lang="scss">
.header {
    display: flex;
    align-items: center;
    gap: var(--spacing);
    margin: 0;
}

.edit-user {
    &__save {
        margin-right: calc(var(--spacing)/2);
    }

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
                background: var(--secondary-background-color);
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