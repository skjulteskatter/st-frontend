<template>
    <div id="users">
        <div class="header gap-x">
            <h3>{{ $t("admin.users") }}</h3>
            <base-button
                :class="{ disabled: disableButton }"
                @click="refreshUsers"
                :loading="loading"
                icon="refresh"
                theme="primary"
                >{{ $t("common.update") }}</base-button
            >
        </div>
        <base-card class="users__table">
            <table>
                <thead>
                    <th></th>
                    <th>{{ $t("common.name") }}</th>
                    <th>Email</th>
                    <th>{{ $t("common.role") }}</th>
                    <th>Last Login</th>
                    <th>Id</th>
                </thead>
                <tbody>
                    <tr v-for="u in users" :key="u.id">
                        <td>
                            <modal
                                :label="$t('common.edit')"
                                class="edit-user"
                                theme="tertiary"
                                v-if="u.id != getCurrentUser.id"
                            >
                                <div class="loading" v-if="loading"></div>
                                <h4 style="margin-top: 0">
                                    {{ u.displayName }}
                                </h4>
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
                                                        (r) => r == role
                                                    )
                                                "
                                                @change="toggleRole(u, role)"
                                            />
                                            {{ role }}
                                        </label>
                                    </div>
                                </div>
                                <base-button
                                    @click="saveRoles(u)"
                                    class="edit-user__save"
                                    :loading="loading"
                                    >{{ $t("common.save") }}</base-button
                                >
                            </modal>
                        </td>
                        <td>{{ u.displayName }}</td>
                        <td>{{ u.email }}</td>
                        <td>{{ u.roles[0] ? u.roles[0] : "NOT SET" }}</td>
                        <td>{{ u.lastLogin }}</td>
                        <td>{{ u.id }}</td>
                    </tr>
                </tbody>
            </table>
        </base-card>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseCard, BaseButton, Modal } from "@/components";
import { NotificationActionTypes } from "@/store/typed/modules/notifications/action-types";
import { useStore } from "@/store/typed";
import { UsersActionTypes } from "@/store/typed/modules/users/action-types";
import { UsersMutationTypes } from "@/store/typed/modules/users/mutation-types";

@Options({
    name: "users-list",
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
    public store = useStore();
    public users: User[] = [];
    public currentUser: User = {} as User;
    public disableButton = false;
    public loading = false;

    public async mounted() {
        await this.store.dispatch(UsersActionTypes.GET_USERS);
        await this.store.dispatch(UsersActionTypes.GET_ROLES);
    }

    public async refreshUsers() {
        this.loading = true;
        this.disableButton = true;
        await this.store.dispatch(UsersActionTypes.GET_USERS);

        this.store.dispatch(NotificationActionTypes.ADD_NOTIFICATION, {
            type: "success",
            title: this.$t("notification.fetchedusers"),
            icon: "check",
        });
        this.loading = false;
        this.disableButton = false;
    }

    public get getCurrentUser(): User {
        return this.currentUser;
    }

    public get roles() {
        return this.store.state.users.roles;
    }

    public toggleRole(user: User, role: string) {
        this.store.commit(UsersMutationTypes.USER_TOGGLE_ROLE, { user, role });
    }

    public async saveRoles(user: User) {
        this.loading = true;
        await this.store.dispatch(UsersActionTypes.SET_ROLES, user);
        this.store.dispatch(NotificationActionTypes.ADD_NOTIFICATION, {
            type: "success",
            title: this.$t("notification.saved"),
            icon: "check",
        });
        this.loading = false;
    }
}
</script>
<style lang="scss">
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
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

    .card__content {
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;

        th {
            padding: 0.3em;
        }

        tr {
            &:nth-child(odd) {
                background: var(--st-color-background);
            }
        }

        td {
            padding: 0.3em;
            font-size: 0.9em;

            & > {
                margin: 0;
            }
        }
    }
}
</style>
