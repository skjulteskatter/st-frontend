<template>
    <div class="p-4 md:p-8" v-if="isAdmin">
        <div class="mb-4">
            <h1 class="font-bold text-xl lg:text-2xl">Admin</h1>
        </div>
        <div class="flex flex-col gap-4">
            <base-card>
                <div class="flex flex-wrap gap-2">
                    <base-card
                        v-for="collection in collections"
                        :key="collection.id"
                        border
                        secondary
                    >
                        <b class="block">{{ collection.key }}</b>
                        <base-button
                            :loading="loadingClearCache.includes(collection.id)"
                            @click="clearCollection(collection.id)"
                            theme="error"
                            icon="trash"
                        >
                            {{ $t("admin.clearcache") }}
                        </base-button>
                    </base-card>
                    <base-button
                        @click="clearCollection('Landax')"
                        icon="trash"
                        theme="error"
                        :loading="loadingClearCache.includes('Landax')"
                    >
                        Clear Landax
                    </base-button>
                    <base-button
                        @click="clearCollection('Index')"
                        icon="refresh"
                        theme="secondary"
                        :loading="loadingClearCache.includes('Index')"
                    >
                        Index Songs
                    </base-button>
                    <base-button
                        @click="syncFiles()"
                        icon="refresh"
                        theme="secondary"
                        :loading="loadingSync"
                    >
                        Files
                    </base-button>
                </div>
            </base-card>
            <users-list :users="users" :currentUser="currentUser"></users-list>

            <base-card>
                <div class="flex justify-between">
                    <h3 class="font-bold text-lg">API token</h3>
                    <base-button
                        theme="secondary"
                        @click="copyToken()"
                    >
                        Copy to clipboard
                    </base-button>
                </div>
                <input type="text" :value="token" id="apiToken" />
            </base-card>
        </div>
    </div>
    <div v-else>
        <h1>{{ $t("admin.noaccess") }}</h1>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { UsersList } from "@/components";
import api from "@/services/api";
import auth from "@/services/auth";
import { useStore } from "@/store";
import { appSession } from "@/services/session";
import { notify } from "@/services/notify";

@Options({
    components: {
        UsersList,
    },
    name: "admin",
})
export default class Subscriptions extends Vue {
    public store = useStore();
    public loading = false;
    public token? = "";
    public showToken = false;

    public loadingSync = false;

    public loadingClearCache: string[] = [];

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

    public get collections() {
        return appSession.collections;
    }

    public get isAdmin(): boolean {
        return this.store.getters.isAdmin;
    }

    public async clearCollection(collection: string) {
        this.loadingClearCache.push(collection);
        // Notification
        notify("error", await api.admin.clearCache(collection), "trash");
        this.loadingClearCache = this.loadingClearCache.filter(
            (c) => c != collection,
        );
    }

    public async syncFiles() {
        this.loadingSync = true;
        notify("error", this.$t("notification.syncingfiles"), "trash");
        try {
            notify("success", (await api.admin.sync()).result, "refresh");
        } finally {
            this.loadingSync = false;
        }
    }

    public copyToken() {
        const el = document.getElementById("apiToken") as HTMLTextAreaElement;

        el.select();
        el.setSelectionRange(0, 99999);

        document.execCommand("copy");
    }
}
</script>
