<template>
    <div class="lyrics">
        <h1 class="lyrics__number">{{ song ? song.number : "0"}}</h1>
        <h2 class="lyrics__title">{{ song ? song.name[user.settings.languageKey ?? "en"].title : "TITLE"}}</h2>
        <div
            class="lyrics__verse"
            v-for="verse in lyrics"
            :key="verse.name"
        >
            <span class="lyrics__verse__number">{{ verse.name }}</span>
            <p
                class="lyrics__verse__line"
                v-for="line in verse.content"
                :key="line.id"
            >
                {{ line }}
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import { sessionKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";

@Options({
})
export default class LyricsViewer extends Vue {
    public $song?: SongInterface = undefined;
    public $content: Verse[] = [];

    public get song() {
        const song = localStorage.getItem("song");
        return song ? JSON.parse(song) : undefined;
    }

    public get lyrics() {
        return this.$content;
    }

    public get user() {
        return useStore(sessionKey).state.currentUser;
    }
}
</script>

<style lang="scss" scoped>
.lyrics {
    &__verse {
        margin-bottom: 2em;
    }

    &__number {
        font-weight: bold;
    }

    &__line {
        margin: 0.5em;
    }
}
</style>