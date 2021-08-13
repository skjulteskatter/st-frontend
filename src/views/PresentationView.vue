<template>
    <div id="lyrics-wrapper">
        <div class="lyrics">
            <div class="lyrics__credits gap-x" v-if="song">
                <h1 class="lyrics__number" v-if="song.number">
                    {{ song.number }}
                </h1>
                <div>
                    <h3 class="lyrics__title">{{ song.getName() }}</h3>
                    <p
                        class="lyrics__credits__author"
                        v-if="song.Authors.length > 0"
                    >
                        {{ $t("song.author") }}:
                        <span v-for="author in song.Authors" :key="author.id">
                            {{ author.name }}
                        </span>
                    </p>
                    <p
                        class="lyrics__credits__composer"
                        v-if="song.Composers.length > 0"
                    >
                        {{ $t("song.composer") }}:
                        <span
                            v-for="composer in song.Composers"
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
                    v-for="(verse, i) in verses"
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
import { Lyrics, Song } from "@/classes";
import { viewer } from "@/classes/presentation/viewer";
import { appSession } from "@/services/session";
import { useStore } from "@/store";
import { Vue } from "vue-class-component";

export default class PresentationView extends Vue {
    private store = useStore();
    public lyrics: Lyrics | null = null;
    public song: Song | null = null;

    public get verses() {
        return Object.values(this.lyrics?.verses ?? {});
    }

    public async mounted() {
        await appSession.init();
        viewer.init();
        this.lyrics = viewer.Lyrics;
        this.song = viewer.Song ?? null;

        viewer.registerCallback("lyrics", () => {
            this.lyrics = viewer.Lyrics;
            this.song = viewer.Song ?? null;
        });
    }

    public get melodyOrigin() {
        const melodyOrigin = this.song?.melodyOrigin;

        return melodyOrigin?.description[this.store.getters.languageKey] ?? melodyOrigin?.description.no;
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
        border-bottom: 1px solid var(--st-color-border);
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
            margin: 0.5em 0;

            &.fade {
                opacity: 0.5;
                font-size: 0.8em;
            }
        }
    }
}
</style>
