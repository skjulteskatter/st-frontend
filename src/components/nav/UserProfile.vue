<template>
    <div class="user-profile" v-if="user">
        <img :src="image" class="user-profile__image" />
        <div class="user-profile__info">
            <b class="user-profile__name">
                {{ user.displayName }}
            </b>
            <small class="user-profile__email">{{ user.email }}</small>
        </div>
        <Icon
            name="settings"
            size="24"
            @click="$router.push({ name: 'settings' })"
            class="user-profile__settings"
        />
    </div>
</template>

<script lang="ts">
import { sessionKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { Icon } from "@/components/icon";

@Options({
    components: {
        Icon,
    },
})
export default class UserProfile extends Vue {
    public store = useStore(sessionKey);

    public get user() {
        return this.store.state.currentUser;
    }

    public get image(): string {
        return this.store.getters.image;
    }
}
</script>

<style lang="scss" scoped>
.user-profile {
    display: flex;
    align-items: center;
    gap: var(--st-spacing);
    width: 100%;

    padding: var(--st-spacing);
    background-color: var(--st-color-background-medium);

    font-size: 0.9em;

    &__info {
        flex-grow: 1;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    &__name {
        display: block;
    }

    &__email {
        opacity: 0.5;
    }

    &__image {
        border-radius: 100%;
        max-width: var(--size);
        max-height: var(--size);
        width: 100%;
        height: 100%;
        object-fit: cover;
        flex-shrink: 0;
    }

    &__settings {
        cursor: pointer;
        flex-shrink: 0;
    }
}
</style>