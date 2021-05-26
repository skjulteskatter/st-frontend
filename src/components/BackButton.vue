<template>
    <div class="flex items-center mb-4 cursor-pointer" @click="back">
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
