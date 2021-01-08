<template>
    <div class="lyrics-settings"></div>
</template>

<script>
import { Options, Vue } from "vue-class-component";

@Options({
    props: {
        lyrics: {
            type: Object,
            default: {}
        }
    },
})
export default class LyricsSettings extends Vue {
    
}
</script>

<style lang="scss" scoped>

</style>