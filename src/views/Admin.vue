<template>
    <div id="admin-panel">
        <div v-if="isAdmin">
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
import UsersList from '@/components/UsersList.vue';

@Options({
    components: {
        UsersList
    }
})
export default class Subscriptions extends Vue {
    public usersStore = useStore(usersKey);
    public disableButton = false;
    public loading = false;

    get users(): User[] {
        return useStore(usersKey).state.users ?? [];
    }
    
    public get currentUser(){
        return useStore(sessionKey).state.currentUser;
    }

    public get isAdmin(): boolean {
        return useStore(sessionKey).getters.isAdmin;
    }

    public get roles() {
        return useStore(usersKey).state.roles;
    }

    public toggleRole(user: User, role: string) {
        this.usersStore.commit('toggleRole', {user, role});
    }

    public async saveRoles(user: User) {
        this.loading = true;
        await this.usersStore.dispatch('setRoles', user);
        this.loading = false;
    }
}
</script>

<style lang="scss" scoped>

</style>