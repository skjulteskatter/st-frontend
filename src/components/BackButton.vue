<template>
    <div class="back-button" @click="back">
        <Icon name="arrowLeft" size="20" />
        <span>{{ previous ? $t("common.back") : $t("common.home") }}</span>
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
export default class BackButton extends Vue {
    public previous: string | null = null;

    public mounted() {
        this.previous = this.$router.options.history.state.back as string ?? null;
    }

    public back() {
        if (!this.previous) {
            this.$router.push({name: "main"});
        } else {
            this.$router.back();
        }
    }
}
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
