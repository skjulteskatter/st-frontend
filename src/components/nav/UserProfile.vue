<template>
    <div class="text-sm flex items-center gap-4 w-full p-4 border-t border-gray-300" v-if="user">
        <img :src="image" class="rounded-full max-h-12 object-cover flex-shrink-0" />
        <div class="flex-grow overflow-hidden overflow-ellipsis whitespace-nowrap">
            <b class="block">
                {{ user.displayName }}
            </b>
            <small class="text-gray-500">{{ user.email }}</small>
        </div>
        <Icon
            name="settings"
            size="24"
            @click="$router.push({ name: 'settings' })"
            class="flex-shrink-0 cursor-pointer"
        />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "@/store";
import auth from "@/services/auth";

@Options({
    name: "user-profile",
})
export default class UserProfile extends Vue {
    public store = useStore();

    public get user() {
        return this.store.getters.user;
    }

    public get image(): string {
        return auth.image || "/img/portrait-placeholder.png";
    }
}
</script>
