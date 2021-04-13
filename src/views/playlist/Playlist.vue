<template>
    <div class="playlist">
        <router-view />
    </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class Playlist extends Vue {}
</script>

<style lang="scss" scoped>
@import "../../style/mixins";

.playlist {
    padding: calc(var(--st-spacing) * 2);

    @include breakpoint("medium") {
        padding: var(--st-spacing);
    }
}
</style>