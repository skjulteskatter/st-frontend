<template>
    <div>
        <button v-if="extended" @click="extend">Advanced</button>
        <lyrics-settings v-if="isExtended"></lyrics-settings>
        <song-details v-else></song-details>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { LyricsSettings, SongDetails } from '@/components';
import { useStore } from "vuex";
import { sessionKey } from "@/store";

@Options({
    components: {
        LyricsSettings,
        SongDetails,
    }
})
export default class SongViewer extends Vue {
    public store = useStore(sessionKey);

    public get extended() {
        return this.store.getters.extended;
    }

    public get isExtended() {
        return this.store.state.extend;
    }

    public extend() {
        this.store.commit('extend');
    }
}
</script>