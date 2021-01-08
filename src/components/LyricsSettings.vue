<template>
    <div class="lyrics-settings"></div>
</template>

<script>
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { songKey } from "@/store";

@Options({
    props: {

    },
    computed: {
        lyrics() {
            return useStore(songKey).getters.lyrics;
        }
    }
})
export default class LyricsSettings extends Vue {
    
}
</script>

<style lang="scss" scoped>

</style>