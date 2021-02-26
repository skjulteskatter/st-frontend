<template>
    <div class="dashboard" v-if="user">
        <h1 class="dashboard__title">
            {{ $t("common.welcome") }}, {{ user.displayName.split(" ")[0] }}.
        </h1>
        <base-card class="user-info" border>
            <div class="user-info__wrapper gap-y">
                <div class="fields">
                    <div class="user-info__field" v-if="user.roles.length">
                        <span
                            class="tag"
                            v-for="role in user.roles"
                            :key="'tag-' + role"
                            >{{ role }}</span
                        >
                    </div>
                    <div class="user-info__field">
                        <h2 class="user-info__name">{{ user.displayName }}</h2>
                        <p class="user-info__email">{{ user.email }}</p>
                    </div>
                </div>
                <div class="loader" v-if="loading"></div>
            </div>
        </base-card>
        <div class="dashboard__subscriptions">
            <h3 class="dashboard__subscriptions__title">
                <span>
                    {{ $t("common.your") }}
                    {{ $t("common.subscriptions").toLowerCase() }}
                </span>
                <Icon name="book" />
            </h3>
            <div class="dashboard__subscriptions__cards">
                <collection-card
                    v-for="sub in subscribedCollections"
                    :key="sub"
                    :collection="sub"
                ></collection-card>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { sessionKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { BaseCard, BaseButton, CollectionCard } from "@/components";
import { Icon } from "@/components/icon";

@Options({
    components: {
        BaseCard,
        BaseButton,
        CollectionCard,
        Icon,
    },
})
export default class Dashboard extends Vue {
    public store = useStore(sessionKey);
    public token = localStorage.getItem("id_token");
    public loading = false;

    public get subscriptions(): Subscription[] {
        return this.store.state.currentUser?.subscriptions ?? [];
    }

    public get subscribedCollections() {
        return this.store.getters.collections;
    }

    public get user(): User | undefined {
        return this.store.state.currentUser;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }
}
</script>

<style lang="scss">
@import "../style/mixins";

.dashboard {
    padding: calc(var(--st-spacing) * 2);
    display: flex;
    flex-direction: column;
    gap: var(--st-spacing);

    @include breakpoint("medium") {
        padding: var(--st-spacing);
    }

    &__title {
        margin: 0;
    }

    &__subscriptions {
        &__title {
            display: flex;
            align-items: center;
            gap: calc(var(--st-spacing) / 2);
            margin: 0 0 calc(var(--st-spacing) / 2) 0;
        }

        &__cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            grid-gap: var(--st-spacing);
        }
    }
}

.user-info {
    margin-bottom: var(--st-spacing);

    &__wrapper {
        display: flex;
        flex-direction: column;
    }

    label {
        opacity: 0.6;
        font-size: 0.8em;
    }

    * {
        margin: 0;
    }

    &__name {
        margin-bottom: 0.2em;
    }

    &__field {
        &:not(:last-child) {
            margin-bottom: var(--st-spacing);
        }
    }
}
</style>