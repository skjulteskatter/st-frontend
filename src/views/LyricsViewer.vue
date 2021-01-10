<template>
    <div id="wrapper">
        <div class="lyrics">
            <div class="lyrics__credits">
                <h1 class="lyrics__number">{{ song ? song.number : "0"}}</h1>
                <div>
                    <h3 class="lyrics__title">{{ song ? song.name[user.settings.languageKey ?? "en"].title : "TITLE"}}</h3>
                    <p class="lyrics__credits__author" v-if="song ? song.authors.length > 0 : false">Author: {{song.authors[0].name}}</p>
                    <p class="lyrics__credits__composer" v-if="song ? song.composers.length > 0 : false">Composer: {{song.composers[0].name}}</p>
                    <p class="lyrics__credits__composer" v-else>Composer: {{ song ? song.melodyOrigin.name[user.settings.languageKey] : 'UNKNOWN' }}</p>
                </div>
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
    --double-spacing: calc(var(--spacing) * 2);

    font-size: 1.5em;

    &__credits {
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 50px;
        margin-top: 25px;
        padding-bottom: .5em;
        display: flex;
        align-items: center;
        gap: var(--double-spacing);

        &__composer, &__author {
            margin: 0;
            font-size: .7em;
            opacity: .6;
        }
    }

    &__title {
        margin: 0;
    }

    &__number {
        opacity: .6;
        margin: 0;
    }

    &__verse {
        margin-bottom: var(--double-spacing);
        position: relative;
        font-size: 1.4em;

        &-chorus {
            font-style: italic;
            border-left: 5px solid var(--border-color);
            padding-left: var(--spacing);
        }

        &__number {
            position: absolute;
            top: 0;
            left: -1.5em;
            font-weight: bold;
        }

        &__line {
            margin: .5em 0;
        }
    }

}
</style>