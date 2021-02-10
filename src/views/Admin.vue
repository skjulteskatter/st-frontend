<template>
    <div class="admin-panel">
        <div v-if="isAdmin">
            <h1 class="admin-panel__title">Admin</h1>
            <hr />
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
                        v-if="!disabled.includes(collection.id)"
                        :action="() => clearCollection(collection.id)"
                        theme="warning"
                    >
                        {{ $t("admin.clearcache") }}
                    </base-button>
                </base-card>
            </base-card>

            <users-list :users="users" :currentUser="currentUser"></users-list>
        </div>
        <div v-else>
            <h1>{{ $t("admin.noaccess") }}</h1>
        </div>
    </div>
</template>

<script lang="ts">
import { sessionKey, usersKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import UsersList from "@/components/UsersList.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseCard from "@/components/BaseCard.vue";
import api from "@/services/api";

@Options({
    components: {
        UsersList,
        BaseButton,
        BaseCard,
    },
})
export default class Subscriptions extends Vue {
    public usersStore = useStore(usersKey);
    public loading = false;

    public disabled: string[] = [];

    get users(): User[] {
        return useStore(usersKey).state.users ?? [];
    }

    public get currentUser() {
        return useStore(sessionKey).state.currentUser;
    }

    public get collections() {
        return useStore(sessionKey).state.collections;
    }

    public get isAdmin(): boolean {
        return useStore(sessionKey).getters.isAdmin;
    }

    public clearCollection(collection: string) {
        this.disabled.push(collection);
        api.admin.clearCache(collection);
    }
}
</script>

<style lang="scss">
.admin-panel {
    padding: var(--st-spacing);

    &__collections {
        .card__content {
            display: flex;
            gap: var(--st-spacing);
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