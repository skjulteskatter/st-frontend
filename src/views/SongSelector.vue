<template>
    <div class="view-song">
        <!-- <stepper :steps="steps" :callback="deselect"></stepper> -->

        <router-view />
    </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { useStore } from "vuex";
import { songKey, sessionKey } from "@/store";
import Card from '@/components/Card.vue'
import SongList from '@/components/SongList.vue'
import Songbooks from '@/components/Songbooks.vue'
import Stepper from '@/components/Stepper.vue'
import LyricsSettings from '@/components/LyricsSettings.vue';
import SongDetails from '@/components/SongDetails.vue';

@Options({
    components: {
        Card,
        SongList,
        Songbooks,
        Stepper,
        LyricsSettings,
        SongDetails,
    }
})
export default class SongSelector extends Vue {
    private songStore = useStore(songKey);
    private userStore = useStore(sessionKey);
    public steps: Step[] = [];

    public deselect(type: string) {
        if (type == "collection") {
            this.songStore.commit('selectSong', undefined);
            this.steps = [];
        } else if (type == "song") {
            this.steps = [this.steps[0]];
        }
    }

    public get selectedCollection() {
        return useStore(songKey).getters.collection;
    }
    public get selectedSong() {
        return useStore(songKey).getters.song
    }
    public get language() {
        return useStore(sessionKey).getters.currentUser?.settings?.languageKey;
    }
}
</script>

<style lang="scss" scoped>
.view-song {
    padding-top: var(--spacing);
}
</style>
