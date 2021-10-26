<template>
    <button class="flex gap-2 items-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 w-min focus:outline-none focus:ring-2 focus:ring-primary rounded-md py-1 px-2" @click="navigate">
        <ArrowLeftIcon class="w-4 h-4" />
        <span>{{ previous ? $t("common_back") : $t("common_home") }}</span>
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
    props: {
        to: String,
    },
})
export default class BackButton extends Vue {
    public previous: string | null = null;
    public to?: string;

    public mounted() {
        this.previous = this.$router.options.history.state.back as string ?? null;
    }

    public navigate() {
        if(this.to) this.$router.push(this.to);

        else if (!this.previous) {
            this.$router.push({name: "main"});
        } else {
            this.$router.back();
        }
    }
}
</script>
