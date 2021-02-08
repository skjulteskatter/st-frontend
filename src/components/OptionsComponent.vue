<template>
    <div id="options">
        <base-dropdown icon="fa-user-circle" class="menu-button">
            <div class="options__content gap-y">
                <span class="options__content__item">
                    <span class="fa fa-cog"></span>
                    <span>{{ $t("common.settings") }}</span>
                </span>
                <span class="options__content__item">
                    <base-button
                        class="options__content__item__button"
                        theme="secondary"
                        :action="logout"
                    >
                        <span class="fa fa-sign-out-alt"></span>
                        <span>{{ $t("common.logout") }}</span>
                    </base-button>
                </span>
            </div>
        </base-dropdown>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { sessionKey } from "@/store";

import BaseButton from "@/components/BaseButton.vue";
import { BaseDropdown } from "@/components/inputs";

@Options({
    components: {
        BaseButton,
        BaseDropdown,
    },
})
export default class OptionsComponent extends Vue {
    private store = useStore(sessionKey);

    logout() {
        this.store.dispatch("logout").then(() => {
            window.location.replace("/login");
        });
    }
}
</script>

<style lang="scss">
.options {
    --st-half-spacing: calc(var(--st-spacing) * 0.5);

    &__content {
        display: flex;
        flex-direction: column;

        &__item {
            display: flex;
            gap: var(--st-half-spacing);

            &__button {
                width: 100%;
            }
        }
    }
}
.menu-button {
    margin-left: var(--st-spacing);
}
</style>