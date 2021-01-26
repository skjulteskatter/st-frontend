<template>
    <div>
        <lyrics-settings v-if="extended"></lyrics-settings>
        <song-settings v-else></song-settings>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { LyricsSettings, SongSettings } from '@/components';
import { useStore } from "vuex";
import { sessionKey } from "@/store";

@Options({
    components: {
        LyricsSettings,
        SongSettings,
    }
})
export default class SongViewer extends Vue {
    public store = useStore(sessionKey);



    public get extended() {
        return this.store.getters.extended;
    }
}
</script>