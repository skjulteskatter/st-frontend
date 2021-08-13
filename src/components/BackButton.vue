<template>
    <button class="flex gap-2 items-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 w-min focus:outline-none focus:ring focus:ring-primary rounded-md py-1 px-2" @click="back">
        <ArrowLeftIcon class="w-4 h-4" />
        <span>{{ previous ? $t("common.back") : $t("common.home") }}</span>
    </button>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { ArrowLeftIcon } from "@heroicons/vue/solid";

@Options({
    name: "back-button",
    components: {
        ArrowLeftIcon,
    },
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
