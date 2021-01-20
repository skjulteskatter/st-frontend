<template>
    <div id="lyrics-wrapper">
        <div class="lyrics">
            <div class="lyrics__credits">
                <h1 class="lyrics__number">{{ song ? song.number : "0"}}</h1>
                <div>
                    <h3 class="lyrics__title">{{ song ? song.name[languageKey].title : "TITLE"}}</h3>
                    <p class="lyrics__credits__author" v-if="authors.length > 0">Forfatter: <span v-for="author in authors" :key="author.id"> {{ author.name }} </span></p>
                    <p class="lyrics__credits__composer" v-if="composers.length > 0">Komponist: <span v-for="composer in composers" :key="composer.id"> {{ composer.name }} </span></p>
                    <p class="lyrics__credits__composer" v-if="melodyOrigin">Melodi: {{ melodyOrigin }}</p>
                </div>
            </div>
            <div id="text-wrapper">
                <div
                    class="lyrics__verse"
                    :class="{'lyrics__verse-chorus': verse.type == 'chorus'}"
                    v-for="(verse, i) in lyrics"
                    :key="i + '_' + verse"
                >
                    <span class="lyrics__verse__number" v-if="verse.type != 'chorus'">{{ verse.name }}</span>
                    <p
                        class="lyrics__verse__line"
                        :class="{'fade': line.trim()[0] == '('}"
                        v-for="(line, i) in verse.content"
                        :key="i + '_' + line"
                    >
                        {{ line }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { sessionKey, songKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import themes from "@/classes/themes";

@Options({
})
export default class LyricsViewer extends Vue {
    public store = useStore(songKey);

    public mounted() {
        themes.load();
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
            if(event.key == 'theme') {
                const item = localStorage.getItem('theme')
                if (item) {
                    themes.load();
                }
            }
        });
    }

    public get song() {
        return useStore(songKey).state.song;
    }

    public get lyrics() {
        return useStore(songKey).state.verses;
    }

    public get melodyOrigin() {
        const melodyOrigin = this.store.state.song?.melodyOrigin;

        return melodyOrigin ? melodyOrigin.name[this.languageKey] ?? melodyOrigin.name.no : undefined;
    }

    public get languageKey(): string {
        return useStore(sessionKey).getters.languageKey;
    }

    public get authors() {
        return this.song?.authors ?? [];
    }

    public get composers() {
        return this.song?.composers ?? [];
    }
}
</script>

<style lang="scss" scoped>

#text-wrapper {
    margin-left: 10em;
}

.lyrics {
    --double-spacing: calc(var(--spacing) * 2);

    font-size: 2.2em;

    &__credits {
        width: 100%;
        border-bottom: 1px solid var(--border-color);
        padding-left: 2em;
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
        margin-bottom: 1.5em;
        position: relative;
        line-height: 1em;
        font-size: 1.5em;

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

            &.fade {
                opacity: .5;
                font-size: .8em;
            }
        }
    }

}
</style>