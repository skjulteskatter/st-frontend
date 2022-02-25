<template>
    <BaseCard v-if="user">
        <div class="h-full flex gap-4 items-center justify-start md:flex-col md:justify-center">
            <img class="w-16 h-16 md:h-32 md:w-32 rounded-full object-cover" :src="image" alt="user portrait" />
            <div class="md:text-center">
                <h2 class="font-bold text-lg">{{ user.displayName }}</h2>
                <p class="text-gray-500 dark:text-gray-400">{{ user.email }}</p>
            </div>
            <div class="hidden md:flex gap-2">
                <span class="p-1 uppercase rounded border border-gray-500 text-gray-500 text-xs dark:text-gray-400 dark:border-gray-400" v-for="role in user.roles" :key="user?.id + role">
                    {{ role }}
                </span>
            </div>
        </div>
    </BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useStore } from "@/store";
import { appSession } from "@/services/session";

export default defineComponent({
    name: "user-card",
    data: () => ({
        store: useStore(),
    }),
    computed: {
        image() {
            return this.user?.image ?? "/img/portrait-placeholder.png";
        },
        user() {
            return appSession.user;
        },
    },
});
</script>
