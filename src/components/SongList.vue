<template>
    <div class="song-list">

    </div>
</template>

<script>
import { Options, Vue } from 'vue-class-component'

@Options({
    props: {
        items: {
            type: Array,
            default: []
        }
    }
})
export default class SongList extends Vue {
    
}
</script>

<style lang="scss" scoped>

</style>