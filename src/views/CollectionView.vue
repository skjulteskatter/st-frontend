<template>
    <div class="p-4 md:p-8">
        <loader :loading="loading">
            <router-view />
        </loader>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { useStore } from "@/store";

@Options({
    name: "collection-view",
})
export default class Store extends Vue {
    private store = useStore();
    public loading = false;
}
</script>
