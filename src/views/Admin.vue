<template>
    <div v-if="isAdmin">
        <div class="mb-4 flex gap-4">
            <h1 class="font-bold text-xl lg:text-2xl">Admin</h1>
            <CopyToClipboard v-if="token" :content="token" label="API token" title="Copy API token" />
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
import { defineComponent } from "@vue/runtime-core";
import { UsersList } from "@/components/admin";
import { CopyToClipboard } from "@/components/inputs";
import auth from "@/services/auth";
import { useStore } from "@/store";
import { User } from "@/classes";

export default defineComponent({
    name: "admin",
    components: {
        UsersList,
        CopyToClipboard,
    },
    data: () => ({
        store: useStore(),
        token: "" as string | undefined,
    }),
    computed: {
        users(): User[] {
            const maxUsers = 50;
            const users = this.store.state.users.users;

            if (users.length > maxUsers)
                return users.splice(maxUsers, users.length);

            return users ?? [];
        },
        currentUser() {
            return this.store.getters.user;
        },
        isAdmin(): boolean {
            return this.store.getters.isAdmin;
        },
    },
    async mounted() {
        this.token = await auth.getToken();
    },
});
</script>
