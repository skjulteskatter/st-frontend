<template>
    <div class="dashboard">
        <h1 class="dashboard__title">{{ $t("common.dashboard") }}</h1>
        <base-card class="user-info" border v-if="user">
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
                <div
                    class="user-info__subscriptions"
                    v-if="subscriptions.length"
                >
                    <label>{{ $t("common.subscriptions") }}</label>
                    <div class="user-info__subscriptions__cards gap-x">
                        <base-card
                            v-for="sub in subscribedCollections"
                            :key="sub"
                            border
                        >
                            <b>{{ sub.key }}</b>
                        </base-card>
                    </div>
                </div>
            </div>
        </base-card>

        <settings-card></settings-card>
    </div>
</template>

<script lang="ts">
import { sessionKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import SettingsCard from "@/components/SettingsCard.vue";

@Options({
    components: {
        BaseCard,
        BaseButton,
        SettingsCard,
    },
})
export default class Dashboard extends Vue {
    public store = useStore(sessionKey);

    public get subscriptions(): Subscription[] {
        return this.store.state.currentUser?.subscriptions ?? [];
    }

    public get subscribedCollections() {
        return this.store.getters.collections;
    }

    public get user(): User | undefined {
        return this.store.state.currentUser;
    }
}
</script>

<style lang="scss">
.dashboard {
    padding: var(--st-spacing);

    &__title {
        margin-top: 0;
    }
}

.user-info {
    margin-bottom: var(--st-spacing);

    &__subscriptions {
        &__cards {
            display: flex;
            // gap: 0.5em;
            padding-top: 0.5em;
            max-height: 100px;
        }
    }

    &__wrapper {
        display: flex;
        flex-direction: column;
        // gap: var(--st-spacing);
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