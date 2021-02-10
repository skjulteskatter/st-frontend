<template>
    <div id="admin-panel">
        <div v-if="isAdmin">
            <h1 class="admin-panel__title">Admin</h1>
            <hr />
            <div class="admin-collections">
                <div v-for="collection in collections" :key="collection.id">
                    {{collection.key}}
                    <button v-if="!disabled.includes(collection.id)" @click="clearCollection(collection.id)">CLEAR CACHE</button>
                </div>
            </div>

            <users-list :users="users" :currentUser="currentUser"></users-list>
        </div>
        <div v-else>
            <h1>You don't have access to view this page</h1>
        </div>
    </div>
</template>

<script lang="ts">
import { sessionKey, usersKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import UsersList from "@/components/UsersList.vue";
import api from "@/services/api";

@Options({
    components: {
        UsersList,
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
    &__title {
        margin: 0;
    }
}
</style>