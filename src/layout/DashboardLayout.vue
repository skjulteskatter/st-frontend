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
                </div>
            </main>
            <!-- <feedback-form></feedback-form> -->
        </div>
        <audio-player></audio-player>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseButton } from "@/components";

import { useStore } from "vuex";
import { useStore as store } from "@/store/typed"; 
import { songKey } from "../store";
import themes from "@/classes/themes";
import TheNavbar from "@/components/TheNavbar.vue";
import { AudioPlayer } from "@/components/media";
import { FeedbackForm } from "@/components/feedback";

@Options({
    components: {
        TheNavbar,
        AudioPlayer,
        FeedbackForm,
        BaseButton,
    },
    name: "dashboard-layout",
})
export default class DashboardLayout extends Vue {
    public store = store();
    public songStore = useStore(songKey);

    async mounted() {
        document.documentElement.style.setProperty(
            "--st-color-primary",
            themes.default,
        );
        themes.load();
        if (!this.user) {
            this.$router.push({ name: "login" });
        }
    }

    public get user() {
        return this.store.getters.user;
    }
    // public get isAdmin() {
    //     return this.store.getters..isAdmin;
    // }
}
</script>
<style lang="scss">
@import "../style/mixins";

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
