<template>
    <div id="users">
        <div class="header gap-x">
            <h1>Users</h1>
            <base-button
                :class="{ disabled: disableButton }"
                :action="refreshUsers"
                :loading="loading"
                loadingLabel="Fetching users"
                theme="secondary"
                label="Refresh"
            ></base-button>
        </div>
        <base-card class="users__table" border>
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
                            <modal
                                label="Edit"
                                class="edit-user"
                                v-if="u.id != currentUser.id"
                            >
                                <div class="loading" v-if="loading"></div>
                                <h2 style="margin-top: 0">
                                    {{ u.displayName }}
                                </h2>
                                <div class="edit-user__form">
                                    <div class="edit-user__form__field">
                                        <label
                                            class="edit-user__form__field__label"
                                            >Roles</label
                                        >
                                        <label
                                            class="edit-user__form__role"
                                            v-for="role in roles"
                                            :key="role"
                                        >
                                            <input
                                                type="checkbox"
                                                :checked="
                                                    u.roles.find(
                                                        (r) => r.name == role
                                                    )
                                                "
                                                @change="toggleRole(u, role)"
                                            />
                                            {{ role }}
                                        </label>
                                    </div>
                                </div>
                                <base-button
                                    :action="() => saveRoles(u)"
                                    :label="$t('common.save')"
                                    class="edit-user__save"
                                ></base-button>
                            </modal>
                        </td>
                        <td>{{ u.displayName }}</td>
                        <td>{{ u.email }}</td>
                        <td>{{ u.roles[0] ? u.roles[0].name : "NOT SET" }}</td>
                        <td>{{ u.id }}</td>
                    </tr>
                </tbody>
            </table>
        </base-card>
    </div>
</template>
<script lang="ts">
import { usersKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import Modal from "@/components/Modal.vue";

@Options({
    components: {
        BaseCard,
        BaseButton,
        Modal,
    },
    props: {
        users: {
            type: Array,
        },
        currentUser: {
            type: Object,
        },
    },
})
export default class UsersList extends Vue {
    public users: User[] = [];
    private usersStore = useStore(usersKey);
    public disableButton = false;
    public loading = false;

    public async mounted() {
        await this.usersStore.dispatch("getUsers");
        await this.usersStore.dispatch("getRoles");
    }

    public async refreshUsers() {
        this.loading = true;
        this.disableButton = true;
        await this.usersStore.dispatch("getUsers");
        this.loading = false;
        this.disableButton = false;
    }

    public get currentUser(): User {
        return this.currentUser;
    }

    public get roles() {
        return this.usersStore.state.roles;
    }

    public toggleRole(user: User, role: string) {
        this.usersStore.commit("toggleRole", { user, role });
    }

    public async saveRoles(user: User) {
        this.loading = true;
        await this.usersStore.dispatch("setRoles", user);
        this.loading = false;
    }
}
</script>
<style lang="scss">
.header {
    display: flex;
    align-items: center;
    // gap: var(--st-spacing);
    margin: 0;
}

.edit-user {
    &__save {
        margin-right: calc(var(--st-spacing) / 2);
    }

    &__form {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: var(--st-spacing);
        min-width: 300px;

        &__field {
            width: 100%;
            display: flex;
            flex-direction: column;

            &__label {
                margin-bottom: 0.25em;
                opacity: 0.6;
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
            padding: 0.5em;
        }

        tr {
            &:nth-child(odd) {
                background: var(--st-secondary-background-color);
            }
        }

        td {
            padding: 0.5em;

            & > {
                margin: 0;
            }
        }
    }
}
</style>