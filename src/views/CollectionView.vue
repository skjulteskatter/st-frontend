<template>
    <div>
        <router-view />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    name: "collection-view",
})
export default class Store extends Vue {}
</script>
