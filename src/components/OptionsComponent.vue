<template>
    <div id="options" v-if="user">
        <div class="options__footer">
            <i class="fa fa-cog options__footer__icon"></i>
            <base-button theme="secondary">{{
                $t("common.logout")
            }}</base-button>
        </div>
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

    public get user() {
        return this.store.state.currentUser;
    }
}
</script>

<style lang="scss">
.options {
    --st-half-spacing: calc(var(--st-spacing) * 0.5);
    color: var(--st-text-color);

    &__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &__icon {
            font-size: 1.2rem;
        }
    }

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

.profile-picture {
    --st-pfp-size: 30px;
    width: var(--st-pfp-size);
    height: var(--st-pfp-size);
    border-radius: 100%;
    cursor: pointer;
}
</style>