<template>
    <div id="options">
        <base-button :action="logout" theme="secondary">{{
            $t("common.logout")
        }}</base-button>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import BaseButton from "@/components/BaseButton.vue";
import { useStore } from "vuex";
import { sessionKey } from "@/store";

@Options({
    components: {
        BaseButton,
    },
})
export default class OptionsComponent extends Vue {
    private store = useStore(sessionKey);

    logout() {
        this.store.dispatch('logout').then(() => {
            window.location.replace("/login");
        });
    }
}
</script>

<style lang="scss" scoped>
</style>