<template>
    <div>
        <router-view/>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    name: "playlist",
})
export default class Playlist extends Vue {}
</script>
