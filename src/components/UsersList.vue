<template>
    <div>
        <div class="flex gap-4 justify-between items-end mb-4">
            <h3 class="font-bold">{{ $t("admin.users") }}</h3>
            <input v-model="userQuery" type="text" @keydown.enter="searchUser" />
            <base-button
                :class="{ disabled: disableButton }"
                @click="refreshUsers"
                :loading="loading"
                icon="refresh"
                theme="primary"
                >{{ $t("common.update") }}</base-button
            >
        </div>
        <base-card class="overflow-x-auto">
            <table class="table-fixed">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="w-1/5 text-left p-2">{{ $t("common.name") }}</th>
                        <th class="w-2/5 text-left p-2">Email</th>
                        <th class="w-1/5 text-left p-2">{{ $t("common.role") }}</th>
                        <th class="w-1/5 text-left p-2">Last Login</th>
                        <th class="w-1/5 text-left p-2">Id</th>
                        <th class="w-1/5 text-left p-2"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="u in Users" :key="u.id">
                        <td class="flex gap-4 items-center">
                            <img
                                :src="
                                    u.image ?? '/img/portrait-placeholder.png'
                                "
                                class="w-8 h-8 object-cover rounded-full"
                            />
                            <span>{{ u.displayName }}</span>
                        </td>
                        <td>{{ u.email }}</td>
                        <td>
                            <span :class="[u.roles[0] ? 'border border-gray-500' : '', 'text-gray-500 rounded text-sm p-1']">
                                {{ u.roles[0] ? u.roles[0] : "NOT SET" }}
                            </span>
                        </td>
                        <td>
                            {{ new Date(u.lastLogin).toLocaleString() }}
                        </td>
                        <td>{{ u.id }}</td>
                        <td>
                            <modal
                                :label="$t('common.edit')"
                                theme="tertiary"
                                v-if="u.id != User?.id"
                                @open="getUser(u.id)"
                            >
                                <loader :loading="loading" />
                                <div class="flex flex-col gap-4">
                                    <div class="flex gap-4 items-center">
                                        <img
                                            :src="
                                                u.image ??
                                                '/img/portrait-placeholder.png'
                                            "
                                            class="rounded-full w-20 h-20 object-cover"
                                        />
                                        <span class="flex flex-col">
                                            <h3 class="font-bold">
                                                {{ u.displayName }}
                                            </h3>
                                            <small class="text-gray-500">{{ u.email }}</small>
                                        </span>
                                    </div>
                                    <div class="flex flex-col">
                                        <div class="flex flex-col">
                                            <label
                                                class="font-bold"
                                                >Roles</label
                                            >
                                            <label
                                                class="text-sm"
                                                v-for="role in roles"
                                                :key="role"
                                            >
                                                <input
                                                    type="checkbox"
                                                    class="text-primary rounded border-gray-300 focus:ring-primary"
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
                                        <br/>
                                        <div class="flex flex-col">
                                            <h3 class="font-bold">{{$t('common.collections')}}</h3>
                                            <div v-for="i in u.subscriptions" :key="i.id">
                                                <span>{{getCollection(i)?.getName()}}</span>
                                                <icon class="cursor-pointer" @click="deleteSub(u, i)" size="24" name="trash" v-if="i.id.startsWith('custom')" />
                                            </div>
                                            <base-dropdown
                                                :label="'Add'"
                                            >
                                                <div class="mb-2 text-sm" v-for="i in getUnownedCollections(u.subscriptions)" :key="i.id">
                                                    <label :key="i.id" class="cursor-pointer">
                                                        <input :key="i.id" type="checkbox" v-model="newSubs[u.id][i.id]" />
                                                        {{i.getName()}}
                                                    </label>
                                                </div>
                                                <br/>
                                                <span class="text-sm">Valid To</span>
                                                <input type="date" v-model="validTo[u.id]"/>
                                                <base-button class="mb-2" :disabled="!Object.values(newSubs[u.id]).includes(true) || !validTo[u.id]" @click="addSubscriptions(u)">Save</base-button>
                                            </base-dropdown>
                                        </div>
                                    </div>
                                    <base-button
                                        theme="secondary"
                                        @click="saveRoles(u)"
                                        :loading="loading"
                                        >{{ $t("common.save") }}</base-button
                                    >
                                </div>
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
import { Modal } from "@/components";
import { useStore } from "@/store";
import { UsersActionTypes } from "@/store/modules/users/action-types";
import { UsersMutationTypes } from "@/store/modules/users/mutation-types";
import { notify } from "@/services/notify";
import api from "@/services/api";

@Options({
    name: "users-list",
    components: {
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
    public users?: User[];
    public currentUser?: User;
    public disableButton = false;
    public loading = false;

    public newSubs: {
        [key: string]: {
            [key: string]: boolean;
        };
    } = {};

    public validTo: {
        [key: string]: string;
    } = {};

    public userQuery = "";

    public async mounted() {
        // await this.store.dispatch(UsersActionTypes.GET_USERS);
        await this.store.dispatch(UsersActionTypes.GET_ROLES);
    }

    public async searchUser() {
        
        if (this.userQuery)
            this.store.commit(UsersMutationTypes.SET_USERS, await api.admin.getUsers(this.userQuery));
    }

    public async refreshUsers() {
        this.loading = true;
        this.disableButton = true;
        await this.searchUser();

        notify("success", this.$t("notification.fetchedusers"), "check");
        this.loading = false;
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

    public toggleRole(user: User, role: string) {
        this.store.commit(UsersMutationTypes.USER_TOGGLE_ROLE, { user, role });
    }

    public getCollection(subscription: Subscription) {
        return this.store.getters.collections.find(i => subscription.collectionIds.includes(i.id));
    }

    public getUnownedCollections(subscriptions: Subscription[]) {
        return this.store.getters.collections.filter(i => !subscriptions.some(s => s.collectionIds.includes(i.id)));
    }

    public async getUser(uid: string) {
        const user = this.users?.find(i => i.id == uid);

        if (user && this.newSubs[user.id] !== {}) {
            user.subscriptions = (await api.admin.getUser(uid)).subscriptions;
            this.newSubs[user.id] = {};
        }
    }

    public async addSubscriptions(user: User) {
        const cols = [];

        for (const v of Object.entries(this.newSubs[user.id])) {
            if (v[1] === true)
                cols.push(v[0]);
        }

        if (cols.length > 0 && this.validTo[user.id]) {
            const sub = await api.admin.createSubscription(user.id, {
                collectionIds: cols,
                validTo: this.validTo[user.id],
            });

            user.subscriptions.push(sub);
            this.newSubs[user.id] = {};
            delete this.validTo[user.id];
        }
            
    }

    public async deleteSub(user: User, subscription: Subscription) {
        await api.admin.deleteSubcription(user.id, subscription.id);
        user.subscriptions = user.subscriptions.filter(i => i.id != subscription.id);
    }

    public async saveRoles(user: User) {
        this.loading = true;
        await this.store.dispatch(UsersActionTypes.SET_ROLES, user);
        notify("success", this.$t("notification.saved"), "check");
        this.loading = false;
    }
}
</script>
