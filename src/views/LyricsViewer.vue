<template>
    <div id="wrapper">
        <div class="lyrics">
            <div class="lyrics__credits">
                <h1 class="lyrics__number">{{ song ? song.number : "0"}}</h1>
                <h2 class="lyrics__title">{{ song ? song.name[user.settings.languageKey ?? "en"].title : "TITLE"}}</h2>
                <p v-if="song.composers.length">Composer: {{song.composers[0]}}</p>
                <p v-else>Composer: {{ song.melodyOrigin }}</p>
            </div>
            <div
                class="lyrics__verse"
                :class="{'lyrics__verse-chorus': verse.type == 'chorus'}"
                v-for="(verse, i) in lyrics"
                :key="i + '_' + verse"
            >
                <span class="lyrics__verse__number" v-if="verse.type != 'chorus'">{{ verse.name }}</span>
                <p
                    class="lyrics__verse__line"
                    v-for="(line, i) in verse.content"
                    :key="i + '_' + line"
                >
                    {{ line }}
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { sessionKey, songKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";

@Options({
})
export default class LyricsViewer extends Vue {
    public store = useStore(songKey);

    public mounted() {
        const lyricsItem = localStorage.getItem("lyrics");
        if (lyricsItem) {
            this.store.commit('verses', JSON.parse(lyricsItem));
        }
        const songItem = localStorage.getItem("song");
        if (songItem) {
            this.store.commit('selectSong', JSON.parse(songItem));
        }
        window.addEventListener('storage', event => {
            if (event.key == "song") {
                const item = localStorage.getItem("song");
                if (item) {
                    this.store.commit('selectSong', JSON.parse(item));
                }
            }
            if (event.key == "lyrics") {
                const item = localStorage.getItem("lyrics");
                if (item) {
                    this.store.commit('verses', JSON.parse(item));
                }
            }
        })
    }

    public get song() {
        return useStore(songKey).state.song;
    }

    public get lyrics() {
        return useStore(songKey).state.verses;
    }

    public get user() {
        return useStore(sessionKey).state.currentUser;
    }
}
</script>

<style lang="scss" scoped>
.lyrics {
    --double-spacing: calc(var(--spacing)*2);

    font-size: 1.5em;

    &__credits {
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 50px;
        padding-bottom: .5em;
    }

    &__title {
        margin: 0;
        display: inline-block;

    }

    &__number {
        opacity: .5;
        margin-bottom: 0;
        margin-right: var(--double-spacing);
        display: inline-block;
    }

    &__verse {
        margin-bottom: var(--double-spacing);
        position: relative;

        &-chorus {
            font-style: italic;
            border-left: 5px solid var(--border-color);
            padding-left: var(--spacing);
        }

        &__number {
            position: absolute;
            top: 0;
            left: calc(var(--double-spacing) * -1);
            font-weight: bold;
        }

        &__line {
            margin: .5em 0;
        }
    }

}
</style>