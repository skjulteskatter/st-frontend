<template>
    <div class="settings-page">
        <div class="settings-page__header">
            <h1 class="settings-page__title">{{ $t("common.settings") }}</h1>
            <base-button theme="error" icon="logout" @click="logout">
                {{ $t("common.logout") }}
            </base-button>
        </div>
        <settings-card></settings-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { SettingsCard, BaseButton } from "@/components";
import { useStore } from "vuex";
import { sessionKey } from "@/store";

@Options({
    components: {
        SettingsCard,
        BaseButton,
    },
})
export default class SettingsView extends Vue {
    private store = useStore(sessionKey);

    public logout() {
        this.store.dispatch("logout").then(() => {
            window.location.replace("/login");
        });
    }
}
</script>

<style lang="scss" >
@import "../style/mixins";

.settings-page {
    padding: calc(var(--st-spacing) * 2);

    @include breakpoint("medium") {
        padding: var(--st-spacing);
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__title {
        margin-top: 0;
    }
}
</style>