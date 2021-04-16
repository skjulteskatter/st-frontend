<template>
    <div class="back-button" @click="$router.go(-1)">
        <Icon name="arrowLeft" size="20" />
        <span>{{ $t("common.back") }}</span>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Icon } from "@/components/icon";

@Options({
    components: {
        Icon,
    },
    name: "back-button",
})
export default class BackButton extends Vue {}
</script>

<style lang="scss" scoped>
.back-button {
    display: flex;
    align-items: center;

    width: min-content;
    margin-bottom: var(--st-spacing);
    cursor: pointer;
}
</style>
