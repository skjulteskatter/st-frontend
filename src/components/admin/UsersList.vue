<template>
    <BaseCard>
        <template #header>
            <div class="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                <h3 class="font-bold">{{ $t("admin_users") }}</h3>
                <div class="flex gap-2 items-center">
                    <SearchInput class="flex-grow" v-model="userQuery" @search="searchUser" :placeholder="`${$t('common_search')} ${$t('admin_email').toLocaleLowerCase()}`" />
                    <BaseButton
                        :class="{ disabled: disableButton }"
                        @click="getUsersWithRoles"
                        :loading="loading['roles']"
                        theme="primary"
                    >
                        <template #icon>
                            <UserGroupIcon class="w-4 h-4" />
                        </template>
                    </BaseButton>
                    <BaseButton
                        :class="{ disabled: disableButton }"
                        @click="refreshUsers"
                        :loading="loading['refresh']"
                        theme="tertiary"
                    >
                        <template #icon>
                            <RefreshIcon class="w-4 h-4" />
                        </template>
                    </BaseButton>
                </div>
            </div>
        </template>
        <div class="overflow-x-auto">
            <Loader :loading="loading['search']" position="local">
                <table class="min-w-full" v-if="Users.length">
                    <thead>
                        <tr>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium opacity-50 uppercase tracking-wider">{{ $t("common_name") }}</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium opacity-50 uppercase tracking-wider hidden sm:table-cell">Email</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium opacity-50 uppercase tracking-wider hidden sm:table-cell">{{ $t("common_role") }}</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium opacity-50 uppercase tracking-wider hidden sm:table-cell">Last Login</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium opacity-50 uppercase tracking-wider hidden sm:table-cell">Id</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium opacity-50 uppercase tracking-wider"><span class="sr-only">{{$t('common_edit')}}</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="u in Users" :key="u.id">
                            <td class="flex gap-4 items-center px-4 py-3 whitespace-nowrap">
                                <img
                                    :src="u.image ?? '/img/portrait-placeholder.png'"
                                    class="w-8 h-8 object-cover rounded-full border border-black/20 dark:border-white/20"
                                    width="32"
                                    height="32"
                                />
                                <span>{{ u.displayName }}</span>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap hidden sm:table-cell">{{ u.email }}</td>
                            <td class="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                                <span v-for="role in u.roles" :key="role" :class="[role == 'administrator' ? 'bg-green-500/20 text-green-600 dark:bg-green-200/20 dark:text-green-200' : 'bg-yellow-500/20 text-yellow-600 dark:bg-yellow-200/20 dark:text-yellow-300', 'rounded-full text-xs tracking-wide py-1 px-2']">
                                    {{ role }}
                                </span>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                                {{ new Date(u.lastLogin).toLocaleString() }}
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap hidden sm:table-cell">{{ u.id }}</td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <EditUser v-if="u.id != User?.id" :user="u" @save="saveRoles(u)" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-else class="text-center opacity-50 p-4">No users to show</p>
            </Loader>
        </div>
    </BaseCard>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { SearchInput } from "@/components/inputs";
import EditUser from "@/components/admin/EditUser.vue";
import { useStore } from "@/store";
import { UsersActionTypes } from "@/store/modules/users/action-types";
import { UsersMutationTypes } from "@/store/modules/users/mutation-types";
import { notify } from "@/services/notify";
import api from "@/services/api";
import { User } from "@/classes";
import { RefreshIcon, UserGroupIcon } from "@heroicons/vue/solid";

export default defineComponent({
    name: "users-list",
    components: {
        SearchInput,
        EditUser,
        RefreshIcon,
        UserGroupIcon,
    },
    props: {
        users: {
            type: Array as PropType<User[]>,
        },
        currentUser: {
            type: Object as PropType<User>,
        },
    },
    data: () => ({
        store: useStore(),
        disableButton: false,
        loading: {} as {
            [key: string]: boolean;
        },
        userQuery: "",
    }),
    computed: {
        Users() {
            return this.users ?? [];
        },
        User() {
            return this.currentUser;
        },
        roles() {
            return this.store.state.users.roles;
        },
    },
    async mounted() {
        await this.store.dispatch(UsersActionTypes.GET_ROLES);
    },
    methods: {
        async searchUser() {
            this.loading["search"] = true;
            if (this.userQuery) {
                this.store.commit(UsersMutationTypes.SET_USERS, (await api.admin.getUsers(this.userQuery)).map(i => new User(i)));
            }
            this.loading["search"] = false;
        },
        async getUsersWithRoles() {
            this.loading["roles"] = true;
            const users = await api.admin.getUsersWithRoles();
            this.store.commit(UsersMutationTypes.SET_USERS, users.map(i => new User(i)));
            this.loading["roles"] = false;
        },
        async refreshUsers() {
            this.loading["refresh"] = true;
            this.disableButton = true;
            await this.searchUser();

            notify("success", this.$t("notification_fetchedusers"), "check", undefined, undefined, undefined, false);
            this.loading["refresh"] = false;
            this.disableButton = false;
        },
        async saveRoles(user: User) {
            this.loading["save"] = true;
            await this.store.dispatch(UsersActionTypes.SET_ROLES, user);
            notify("success", this.$t("notification_saved"), "check", undefined, undefined, undefined, false);
            this.loading["save"] = false;
        },
    },
});
</script>
