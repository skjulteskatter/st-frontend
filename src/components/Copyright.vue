<template>
    <div :class="{ 'hidden': hide }" class="w-full mb-4 text-center">
        <small class="opacity-50">Copyright {{new Date().getFullYear()}} © {{ $t('copyright_title')}}. All Rights Reserved</small>
    </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { defineComponent } from "vue";

export default defineComponent({
    name: "copyright-component",
    data: () => ({
        store: useStore(),
    }),
    computed: {
        hide() {
            return this.store.getters.collection?.loading;
        },
    },
});
</script>
