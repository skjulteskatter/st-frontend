<template>
    <div>
        <BackButton class="mb-4" />
        <router-view></router-view>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "publications-route",
});
</script>
