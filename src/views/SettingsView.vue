<template>
    <div class="settings-page">
        <h1 class="settings-page__title">{{ $t("common.settings") }}</h1>
        <settings-card></settings-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { SettingsCard } from "@/components";

@Options({
    components: {
        SettingsCard,
    },
})
export default class SettingsView extends Vue {}
</script>

<style lang="scss" >
.settings-page {
    padding: calc(var(--st-spacing) * 2);

    &__title {
        margin-top: 0;
    }
}
</style>