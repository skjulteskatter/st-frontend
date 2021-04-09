<template>
    <div class="dashboard-layout">
        <div class="dashboard-layout__wrapper" v-if="user">
            <the-navbar></the-navbar>
            <main class="dashboard-layout__body">
                <div class="dashboard-layout__body__container">
                    <router-view v-slot="{ Component }" v-if="$route.name != 'songs-sheet-music'">
                        <transition name="view" mode="out-in">
                            <component :is="Component" />
                        </transition>
                    </router-view>
                    <!-- <div :style="{display: showSheetMusic ? '' : 'none'}">
                        <div id="osmd-canvas"></div>
                        <div id="pb-controls">
                            <base-button @click="osmd.toggleControls()">Controls</base-button>
                        </div>
                    </div> -->
                    <!-- <sheet-music :style="$route.name == 'songs-sheet-music' ? '' : 'display: none !important;'"></sheet-music> -->
                </div>
            </main>
            <!-- <feedback-form></feedback-form> -->
        </div>
        <audio-player></audio-player>
    </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { useStore } from "vuex";
import { sessionKey, songKey } from "../store";
import themes from "@/classes/themes";
import TheNavbar from "@/components/TheNavbar.vue";
import { AudioPlayer } from "@/components/media";
import { FeedbackForm } from "@/components/feedback";
import { osmd } from "@/services/osmd";
import { BaseButton } from "@/components";
import SheetMusic from "@/views/SheetMusic.vue";

@Options({
    components: {
        TheNavbar,
        AudioPlayer,
        FeedbackForm,
        BaseButton,
        SheetMusic,
    },
})
export default class DashboardLayout extends Vue {
    public sessionStore = useStore(sessionKey);
    public songStore = useStore(songKey);
    public osmd = osmd;

    async mounted() {
        document.documentElement.style.setProperty(
            "--st-color-primary",
            themes.default
        );
        themes.load();
        if (this.initialized && !this.user) {
            this.$router.push({ name: "login" });
        }

        // await osmd.init(null, null);
    }

    public get user() {
        return this.sessionStore.state.currentUser;
    }
    public get isAdmin() {
        return this.sessionStore.getters.isAdmin;
    }
    public get initialized() {
        return this.sessionStore.state.initialized;
    }

    public get showSheetMusic() {
        return this.songStore.state.sheetMusic.show;
    }
}
</script>
<style lang="scss">
@import "../style/mixins";

// #osmd-canvas {
//     position: relative;
//     display: flex;
// }

// #pb-controls .control-panel {
//     position: unset;
//     z-index: 1000;
//     background-color: var(--st-color-ui-lm-medium);
//     width: 350px;
// }

// #pb-controls {
//     text-align: center;
//     position: fixed;
//     bottom: 0;
//     z-index: 50;
//     width: 100%;
// }

.dashboard-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;

    &__wrapper {
        display: flex;
        height: 100%;

        position: relative;

        @include breakpoint("small") {
            flex-direction: column;
        }
    }

    &__body {
        width: 100%;
        display: flex;
        flex-direction: column;

        &__container {
            flex-grow: 1;
            overflow-y: auto;

            @include breakpoint("small") {
                overflow-y: scroll;
            }
        }
    }
}

// Animation
.view-enter-active,
.view-leave-active {
    transition: opacity 150ms;
}

.view-enter {
    opacity: 0;
}

.view-leave-to {
    opacity: 0;
}

.view-enter-to,
.view-leave {
    opacity: 1;
}
</style>