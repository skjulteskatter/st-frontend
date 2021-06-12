<template>
    <button class="flex items-center cursor-pointer w-min focus:outline-none focus:ring focus:ring-primary rounded" @click="back">
        <icon name="arrowLeft" size="20" />
        <span>{{ previous ? $t("common.back") : $t("common.home") }}</span>
    </button>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
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
