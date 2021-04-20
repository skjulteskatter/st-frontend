<template>
    <div class="admin-panel" v-if="isAdmin">
        <div class="admin-panel__header">
            <h1 class="admin-panel__title">Admin</h1>
        </div>
        <div class="admin-panel__body">
            <base-card class="admin-panel__collections">
                <base-card
                    v-for="collection in collections"
                    :key="collection.id"
                    class="admin-panel__collections__item gap-y"
                    border
                    secondary
                >
                    <b>{{ collection.key }}</b>
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
            </base-card>
            <users-list :users="users" :currentUser="currentUser"></users-list>

            <base-card class="api-token">
                <div class="api-token__header gap-x">
                    <h3 class="api-token__title">API token</h3>
                    <base-button
                        class="api-token__button"
                        theme="primary"
                        @click="showToken = !showToken"
                    >
                        Toggle API token
                    </base-button>
                </div>
                <p v-if="showToken" class="api-token__token">
                    {{ token }}
                </p>
            </base-card>
        </div>
    </div>
    <div v-else>
        <h1>{{ $t("admin.noaccess") }}</h1>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { UsersList, BaseButton, BaseCard } from "@/components";
import api from "@/services/api";
import auth from "@/services/auth";
import { useStore } from "@/store";
import { NotificationActionTypes } from "@/store/modules/notifications/action-types";

@Options({
    components: {
        UsersList,
        BaseButton,
        BaseCard,
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
        return this.store.state.users.users ?? [];
    }

    public get currentUser() {
        return this.store.getters.user;
    }

    public get collections() {
        return this.store.getters.collections;
    }

    public get isAdmin(): boolean {
        return this.store.getters.isAdmin;
    }

    public async clearCollection(collection: string) {
        this.loadingClearCache.push(collection);
        // Notification
        this.store.dispatch(NotificationActionTypes.ADD_NOTIFICATION, {
            type: "error",
            title: await api.admin.clearCache(collection),
            icon: "trash",
        });
        this.loadingClearCache = this.loadingClearCache.filter(
            (c) => c != collection,
        );
    }

    public async syncFiles() {
        this.loadingSync = true;
        this.store.dispatch(NotificationActionTypes.ADD_NOTIFICATION, {
            type: "error",
            title: this.$t("notification.syncingfiles"),
            icon: "trash",
        });
        try {
            this.store.dispatch(NotificationActionTypes.ADD_NOTIFICATION, {
                type: "success",
                title: (await api.admin.sync()).result,
                icon: "refresh",
            });
        } finally {
            this.loadingSync = false;
        }
    }
}
</script>

<style lang="scss">
@import "../style/mixins";

.api-token {
    &__token {
        word-wrap: break-word;
        font-size: 0.7em;
        max-width: 100%;
    }

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    &__title {
        margin: 0;
    }
}
.admin-panel {
    padding: calc(var(--st-spacing) * 2);

    @include breakpoint("medium") {
        padding: var(--st-spacing);
    }

    &__header {
        margin-bottom: var(--st-spacing);
    }

    &__body {
        display: flex;
        flex-direction: column;
        gap: var(--st-spacing);
    }

    &__collections {
        .card__content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            grid-gap: var(--st-spacing);
        }

        &__item {
            .card__content {
                display: flex;
                flex-direction: column;
            }
        }
    }
    &__title {
        margin: 0;
    }
}
</style>
