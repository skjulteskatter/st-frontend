<template>
    <div id="options">
        <base-button :action="logout" theme="secondary">{{
            $t("common.logout")
        }}</base-button>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import firebase from "@/services/firebase";
import BaseButton from "@/components/BaseButton.vue";

@Options({
    components: {
        BaseButton,
    },
})
export default class OptionsComponent extends Vue {
    logout() {
        firebase.signOut();
        window.location.replace("/login");
    }
}
</script>

<style lang="scss" scoped>
</style>