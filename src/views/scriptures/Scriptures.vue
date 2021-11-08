<template>
    <router-view />
</template>
<script lang="ts">
import scriptures from "@/services/modules/scriptures";
import { Vue } from "vue-class-component";

export default class Scriptures extends Vue {
    private service = scriptures;

    async mounted() {
        await this.service.initialize();
    }
}
</script>
