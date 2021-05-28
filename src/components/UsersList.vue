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
                    <th>{{ $t("common.name") }}</th>
                    <th>Email</th>
                    <th>{{ $t("common.role") }}</th>
                    <th>Last Login</th>
                    <th>Id</th>
                    <th></th>
                </thead>
                <tbody>
                    <tr v-for="u in users" :key="u.id">
                        <td class="user-name">
                            <img
                                :src="
                                    u.image ?? '/img/portrait-placeholder.png'
                                "
                                class="user-image"
                            />
                            <span>{{ u.displayName }}</span>
                        </td>
                        <td>{{ u.email }}</td>
                        <td>{{ u.roles[0] ? u.roles[0] : "NOT SET" }}</td>
                        <td>
                            {{ new Date(u.lastLogin).toLocaleString() }}
                        </td>
                        <td>{{ u.id }}</td>
                        <td>
                            <modal
                                :label="$t('common.edit')"
                                class="edit-user"
                                theme="tertiary"
                                v-if="u.id != getCurrentUser.id"
                            >
                                <div class="loading" v-if="loading"></div>
                                <div class="edit-user__user">
                                    <img
                                        :src="
                                            u.image ??
                                            '/img/portrait-placeholder.png'
                                        "
                                        class="edit-user__user-image"
                                    />
                                    <span class="edit-user__user-name">
                                        <h3>
                                            {{ u.displayName }}
                                        </h3>
                                        <small>{{ u.email }}</small>
                                    </span>
                                </div>
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
                    </tr>
                </tbody>
            </table>
        </base-card>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseCard, Modal } from "@/components";
import { useStore } from "@/store";
import { UsersActionTypes } from "@/store/modules/users/action-types";
import { UsersMutationTypes } from "@/store/modules/users/mutation-types";
import { notify } from "@/services/notify";

@Options({
    name: "users-list",
    components: {
        BaseCard,
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

        notify("success", this.$t("notification.fetchedusers"), "check");
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
        notify("success", this.$t("notification.saved"), "check");
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
    &__user {
        display: flex;
        align-items: center;
        gap: var(--st-spacing);
        margin-bottom: var(--st-spacing);

        &-image {
            border-radius: 30rem;
            height: 3rem;
            width: 3rem;
            object-fit: cover;
        }

        &-name {
            display: flex;
            flex-direction: column;

            h3 {
                margin: 0;
            }
        }
    }

    &__save {
        margin-right: calc(var(--st-spacing) / 2);
    }

    &__form {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: var(--st-spacing);
        min-width: 300px;
        margin-bottom: var(--st-spacing);

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

        .user-name {
            display: flex;
            align-items: center;
            gap: calc(var(--st-spacing) / 2);
        }

        .user-image {
            height: 2rem;
            width: 2rem;
            border-radius: 30rem;
            object-fit: cover;
            background-color: var(--st-color-background-dark);
        }

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
