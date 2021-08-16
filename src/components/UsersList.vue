<template>
    <base-card>
        <template #header>
            <div class="flex gap-4 justify-between items-center">
                <h3 class="font-bold">{{ $t("admin.users") }}</h3>
                <div class="flex gap-2 items-center">
                    <search-input v-model="userQuery" @search="searchUser" :placeholder="`${$t('common.search')} ${$t('admin.email').toLocaleLowerCase()}`" />
                    <base-button
                        :class="{ disabled: disableButton }"
                        @click="refreshUsers"
                        :loading="loading['refresh']"
                        :content="false"
                        icon="refresh"
                        theme="primary"
                    >
                        {{ $t("common.update") }}
                    </base-button>
                </div>
            </div>
        </template>
        <div class="overflow-x-auto">
            <loader :loading="loading['search']" position="local">
                <table class="min-w-full" v-if="Users.length">
                    <thead>
                        <tr>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium opacity-50 uppercase tracking-wider">{{ $t("common.name") }}</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium opacity-50 uppercase tracking-wider">Email</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium opacity-50 uppercase tracking-wider">{{ $t("common.role") }}</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium opacity-50 uppercase tracking-wider">Last Login</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium opacity-50 uppercase tracking-wider">Id</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium opacity-50 uppercase tracking-wider"><span class="sr-only">{{$t('common.edit')}}</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="u in Users" :key="u.id">
                            <td class="flex gap-4 items-center px-4 py-3 whitespace-nowrap">
                                <img
                                    :src="
                                        u.image ?? '/img/portrait-placeholder.png'
                                    "
                                    class="w-8 h-8 object-cover rounded-full"
                                />
                                <span>{{ u.displayName }}</span>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">{{ u.email }}</td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <span v-if="u.roles[0]" :class="[u.roles[0] == 'administrator' ? 'bg-green-500/20 text-green-600 dark:bg-green-200/20 dark:text-green-200' : 'bg-yellow-500/20 text-yellow-600 dark:bg-yellow-200/20 dark:text-yellow-300', 'rounded-full text-xs tracking-wide py-1 px-2']">
                                    {{ u.roles[0] }}
                                </span>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                {{ new Date(u.lastLogin).toLocaleString() }}
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">{{ u.id }}</td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <edit-user v-if="u.id != User?.id" :user="u" @save="saveRoles(u)" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-else class="w-full text-center text-gray-500">No users to show</p>
            </loader>
        </div>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Modal } from "@/components";
import { SearchInput } from "@/components/inputs";
import EditUser from "@/components/admin/EditUser.vue";
import { useStore } from "@/store";
import { UsersActionTypes } from "@/store/modules/users/action-types";
import { UsersMutationTypes } from "@/store/modules/users/mutation-types";
import { notify } from "@/services/notify";
import api from "@/services/api";

@Options({
    name: "users-list",
    components: {
        Modal,
        SearchInput,
        EditUser,
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
    public users?: User[];
    public currentUser?: User;
    public disableButton = false;
    public loading: {
        [key: string]: boolean;
    } = {};

    public userQuery = "";

    public async mounted() {
        // await this.store.dispatch(UsersActionTypes.GET_USERS);
        await this.store.dispatch(UsersActionTypes.GET_ROLES);
    }

    public async searchUser() {
        this.loading["search"] = true;
        if (this.userQuery) {
            this.store.commit(UsersMutationTypes.SET_USERS, await api.admin.getUsers(this.userQuery));
        }
        this.loading["search"] = false;
    }

    public async refreshUsers() {
        this.loading["refresh"] = true;
        this.disableButton = true;
        await this.searchUser();

        notify("success", this.$t("notification.fetchedusers"), "check");
        this.loading["refresh"] = false;
        this.disableButton = false;
    }

    public get Users() {
        return this.users ?? [];
    }

    public get User(): User | undefined {
        return this.currentUser;
    }

    public get roles() {
        return this.store.state.users.roles;
    }

    public async saveRoles(user: User) {
        this.loading["save"] = true;
        await this.store.dispatch(UsersActionTypes.SET_ROLES, user);
        notify("success", this.$t("notification.saved"), "check");
        this.loading["save"] = false;
    }
}
</script>
