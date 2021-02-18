<template>
    <div id="lyrics-wrapper">
        <div class="lyrics">
            <div class="lyrics__credits gap-x" v-if="song">
                <h1 class="lyrics__number" v-if="song.number">
                    {{ song.number }}
                </h1>
                <div>
                    <h3 class="lyrics__title" v-if="title">{{ title }}</h3>
                    <p
                        class="lyrics__credits__author"
                        v-if="song.authors.length > 0"
                    >
                        {{ $t("song.author") }}:
                        <span v-for="author in song.authors" :key="author.id">
                            {{ author.name }}
                        </span>
                    </p>
                    <p
                        class="lyrics__credits__composer"
                        v-if="song.composers.length > 0"
                    >
                        {{ $t("song.composer") }}:
                        <span
                            v-for="composer in song.composers"
                            :key="composer.id"
                        >
                            {{ composer.name }}
                        </span>
                    </p>
                    <p class="lyrics__credits__composer" v-if="melodyOrigin">
                        {{ $t("song.melody") }}: {{ melodyOrigin }}
                    </p>
                    <p class="lyrics__credits__composer">
                        {{ song.yearWritten }}
                    </p>
                </div>
            </div>
            <div id="text-wrapper">
                <div
                    class="lyrics__verse"
                    :class="{ 'lyrics__verse-chorus': verse.type == 'chorus' }"
                    v-for="(verse, i) in lyrics"
                    :key="i + '_' + verse"
                >
                    <span
                        class="lyrics__verse__number"
                        v-if="verse.type != 'chorus'"
                        >{{ verse.name }}</span
                    >
                    <p
                        class="lyrics__verse__line"
                        :class="{ fade: line.trim()[0] == '(' }"
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

@Options({})
export default class LyricsViewer extends Vue {
    public store = useStore(songKey);

    public mounted() {
        themes.load();
        const lyricsItem = localStorage.getItem("lyrics");
        if (lyricsItem) {
            this.store.commit("verses", JSON.parse(lyricsItem));
        }
        const songItem = localStorage.getItem("song");
        if (songItem) {
            this.store.commit("setSong", JSON.parse(songItem));
        }
        window.addEventListener("storage", (event) => {
            if (event.key == "song") {
                const item = localStorage.getItem("song");
                if (item) {
                    this.store.commit("setSong", JSON.parse(item));
                }
            }
            if (event.key == "lyrics") {
                const item = localStorage.getItem("lyrics");
                if (item) {
                    this.store.commit("verses", JSON.parse(item));
                }
            }
            if (event.key == "theme") {
                const item = localStorage.getItem("theme");
                if (item) {
                    themes.load();
                }
            }
        });

        window.addEventListener("keydown", (event) => {
            if (event.key == "ArrowRight") {
                this.next();
            }
            if (event.key == "ArrowLeft") {
                this.previous();
            }
        });
    }

    private next() {
        localStorage.setItem("lyrics_next", Math.random().toString());
    }

    private previous() {
        localStorage.setItem("lyrics_previous", Math.random().toString());
    }

    public get song() {
        return this.store.state.song;
    }

    public get title() {
        return this.song?.name[this.languageKey] ?? this.song?.name.no ?? "";
    }

    public get lyrics() {
        return useStore(songKey).state.verses;
    }

    public get melodyOrigin() {
        const melodyOrigin = this.store.getters.song?.melodyOrigin;

        return melodyOrigin
            ? melodyOrigin.name[this.languageKey] ?? melodyOrigin.name.no
            : undefined;
    }

    public get languageKey(): string {
        return useStore(sessionKey).getters.languageKey;
    }
}
</script>

<style lang="scss">
#text-wrapper {
    margin-left: 10em;
}

.lyrics {
    --double-spacing: calc(var(--st-spacing) * 2);

    font-size: 2.2em;

    &__credits {
        width: 100%;
        border-bottom: 1px solid var(--st-border-color);
        padding-left: 2em;
        margin-bottom: 50px;
        margin-top: 25px;
        padding-bottom: 0.5em;
        display: flex;
        align-items: center;
        gap: var(--double-spacing);

        &__composer,
        &__author {
            margin: 0;
            font-size: 0.7em;
            opacity: 0.6;
        }
    }

    &__title {
        margin: 0;
    }

    &__number {
        opacity: 0.6;
        margin: 0;
    }

    &__verse {
        margin-bottom: 1.5em;
        position: relative;
        line-height: 1em;
        font-size: 1.5em;

        &-chorus {
            font-style: italic;
            border-left: 5px solid var(--st-border-color);
            padding-left: var(--st-spacing);
        }

        &__number {
            position: absolute;
            top: 0;
            left: -1.5em;
            font-weight: bold;
        }

        &__line {
            margin: 0.5em 0;

            &.fade {
                opacity: 0.5;
                font-size: 0.8em;
            }
        }
    }
}
</style>