<template>
    <base-card class="order-1" v-if="user">
        <div class="h-full flex gap-4 items-center justify-start md:flex-col md:justify-center">
            <img class="w-16 h-16 md:h-32 md:w-32 rounded-full object-cover" :src="user.image" alt="user portrait" />
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
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "@/store";

@Options({
    name: "user-card",
})
export default class UserCard extends Vue {
    private store = useStore();

    public get user() {
        return this.store.getters.user;
    }
}
</script>

<style lang="scss">
@import "../../style/mixins";

.user-card {

    &__roles {
        display: flex;
        justify-content: center;
        gap: var(--st-spacing);
        flex-wrap: wrap;

        @include breakpoint("small") {
            display: none;
        }
    }

    &__details {
        text-align: center;

        @include breakpoint("small") {
            text-align: initial;
        }
    }
}
</style>
