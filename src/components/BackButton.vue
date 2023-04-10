<template>
    <button class="flex gap-2 items-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 w-min focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md py-1 px-2" @click="navigate">
        <ArrowLeftIcon class="w-4 h-4" />
        <span>{{ previous ? $t("common_back") : $t("common_home") }}</span>
    </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ArrowLeftIcon } from "@heroicons/vue/solid";

export default defineComponent({
    name: "back-button",
    components: {
        ArrowLeftIcon,
    },
    props: {
        to: String,
    },
    data: () => ({
        previous: null as string | null,
    }),
    mounted() {
        this.previous = this.$router.options.history.state.back as string ?? null;
    },
    methods: {
        navigate() {
            if(this.to) this.$router.push(this.to);
            else if (!this.previous) {
                this.$router.push({name: "main"});
            } else {
                this.$router.back();
            }
        },
    },
});
</script>
