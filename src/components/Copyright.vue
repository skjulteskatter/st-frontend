<template>
    <div :class="{ 'hidden': hide }" class="w-full mb-4 text-center">
        <small class="opacity-50">Copyright {{new Date().getFullYear()}} © {{ $t('copyright_title')}}. All Rights Reserved</small>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
    name: "copyright-component",
    computed: {
        hide() {
            return false;
        },
    },
});
</script>
