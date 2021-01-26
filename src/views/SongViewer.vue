<template>
    <div>
        <lyrics-settings v-if="extended"></lyrics-settings>
        <!-- <song-settings v-else></song-settings> -->
    </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { LyricsSettings } from '@/components';

@Options({
    components: {
        LyricsSettings
    }
})
export default class SongViewer extends Vue {
    public extended = true;
}
</script>