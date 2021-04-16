<template>
    <div id="lyrics-wrapper">
        <p v-for="(line, i) in lines" :key="i">{{line}}</p>
    </div>
</template>

<script lang="ts">
import { songKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import themes from "@/classes/themes";

@Options({
    name: "karaoke-viewer",
})
export default class LyricsViewer extends Vue {
    public store = useStore(songKey);

    public mounted() {
        themes.load();
        const lines = localStorage.getItem("lyrics_lines");
        if (lines) {
            this.store.commit("lines", JSON.parse(lines));
        }
        window.addEventListener("storage", event => {
            if (event.key == "lyrics_lines") {
                const item = localStorage.getItem("lyrics_lines");
                if (item) {
                    this.store.commit("lines", JSON.parse(item));
                }
            }
        });
    }

    public get lines() {
        return this.store.state.lines;
    }
}
</script>

<style lang="scss" scoped>

#text-wrapper {
    margin-left: 10em;
}

.lyrics {
    --double-spacing: calc(var(--st-spacing) * 2);

    font-size: 2.2em;

    &__credits {
        width: 100%;
        border-bottom: 1px solid var(--st-color-border);
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
            border-left: 5px solid var(--st-color-border);
            padding-left: var(--st-spacing);
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
