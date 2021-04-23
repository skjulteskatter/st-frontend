<template>
    <base-card class="user-card" v-if="user">
        <img class="user-card__image" :src="user.image" alt="user portrait" />
        <div class="user-card__details">
            <h2 class="user-card__name">{{ user.displayName }}</h2>
            <p class="user-card__email">{{ user.email }}</p>
        </div>
        <div class="user-card__roles">
            <span class="tag" v-for="role in user.roles" :key="user?.id + role">
                {{ role }}
            </span>
        </div>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseCard } from "@/components";
import { useStore } from "@/store";

@Options({
    components: {
        BaseCard,
    },
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
    grid-area: user;

    .card__content {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--st-spacing);

        @include breakpoint("small") {
            flex-direction: row;
            justify-content: flex-start;
        }
    }

    &__image {
        --size: 10rem;
        width: var(--size);
        height: var(--size);
        margin: 0;
        object-fit: cover;
        border-radius: 30rem;

        @include breakpoint("small") {
            --size: 5rem;
        }
    }

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

    &__name {
        margin: 0;
    }

    &__email {
        margin: 0;
    }
}
</style>
