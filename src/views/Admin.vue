<template>
    <div v-if="isAdmin">
        <div class="mb-4 flex gap-4">
            <h1 class="font-bold text-xl lg:text-2xl">Admin</h1>
            <CopyToClipboard :content="token" label="API token" title="Copy API token" />
        </div>
        <div class="flex flex-col gap-4">
            <UsersList :users="users" :currentUser="currentUser" />
        </div>
    </div>
    <div v-else>
        <h1>{{ $t("admin_noAccess") }}</h1>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { UsersList } from "@/components/admin";
import { CopyToClipboard } from "@/components/inputs";
import auth from "@/services/auth";
import { useStore } from "@/store";
import { User } from "@/classes";

@Options({
    components: {
        UsersList,
        CopyToClipboard,
    },
    name: "admin",
})
export default class Subscriptions extends Vue {
    public store = useStore();
    public token? = "";

    public async mounted() {
        this.token = await auth.getToken();
    }

    get users(): User[] {
        const maxUsers = 50;
        const users = this.store.state.users.users;

        if (users.length > maxUsers)
            return users.splice(maxUsers, users.length);

        return users ?? [];
    }

    public get currentUser() {
        return this.store.getters.user;
    }

    public get isAdmin(): boolean {
        return this.store.getters.isAdmin;
    }
}
</script>
