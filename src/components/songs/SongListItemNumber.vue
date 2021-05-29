<template>
    <base-card class="song-list__item-number clickable" border>
        {{ song.number }}
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Song } from "@/classes";

@Options({
    name: "song-list-item-number",
    props: {
        song: {
            type: Song,
        },
    },
})
export default class SongListItemNumber extends Vue {
    public song: Song = {} as Song;
}
</script>

<style lang="scss" scoped>
.song-list__item-number {
    text-align: center;
}
</style>
