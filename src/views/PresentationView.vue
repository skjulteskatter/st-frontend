<template>
    <div
        class="text-3xl h-full"
        :class="[theme == 'dark' ? 'text-white bg-black' : 'text-black bg-white']"
    >
        <div :class="{'hidden': muted}" class="flex gap-4 px-10 py-4" v-if="song">
            <h1 class="font-bold" v-if="song.number">
                {{ song.number }}
            </h1>
            <div>
                <h3 class="mb-2">{{ song.getName() }}</h3>
                <p 
                    class="text-base tracking-wide opacity-50 flex gap-1" 
                    v-if="song.Authors.length"
                >
                    <span>{{ (song.yearWritten ? $t("song.writtenInBy").replace('$year', song.yearWritten.toString()) : $t("song.writtenBy")).replace('$authors', '') }}</span>
                    <span v-for="i in song.Authors" :key="i.id" class="rounded-md bg-black/5 dark:bg-white/10 dark:text-white">
                        {{ i.name }}
                    </span>
                </p>
                <p
                    v-if="song.Composers.length > 0"
                    class="text-base tracking-wide opacity-50 flex gap-1"
                >
                    <span>{{ (song.yearComposed ? $t("song.composedInBy").replace('$year', song.yearComposed.toString()) : $t("song.composedBy")).replace('$composers', '') }}</span>
                    <span
                        v-for="i in song.Composers"
                        :key="i.id"
                        :label="i.name"
                        class="rounded-md bg-black/5 dark:bg-white/10 dark:text-white"
                    >
                        {{ i.name }}
                    </span>
                </p>
                <p class="text-base tracking-wide opacity-50" v-if="melodyOrigin">
                    {{ $t("song.melody") }}: {{ melodyOrigin }}
                </p>
                <p class="text-base tracking-wide opacity-50" v-if="song.yearWritten">
                    {{ song.yearWritten }}
                    <span v-if="song.originCountry"> - {{ song.originCountry }}</span>
                </p>
                <small
                    class="flex gap-2 text-base tracking-wide opacity-50"
                    v-if="
                        song.copyright.melody &&
                        song.copyright.text &&
                        identicalCopyright
                    "
                >
                    © {{ getLocaleString(song.copyright.melody.name) }}
                </small>
                <div v-else class="text-base tracking-wide opacity-50">
                    <small
                        class="flex gap-2"
                        v-if="song.copyright.text"
                    >
                        {{ $t("song.text") }} ©:
                        {{ getLocaleString(song.copyright.text.name) }}
                    </small>
                    <small
                        class="flex gap-2"
                        v-if="song.copyright.melody"
                    >
                        {{ $t("song.melody") }} ©:
                        {{ getLocaleString(song.copyright.melody.name) }}
                    </small>
                </div>
            </div>
        </div>
        <div :class="{'hidden': muted}" class="mt-10 verses" v-if="verses">
            <div
                class="relative verse"
                :class="{ 'italic border-l-4 border-white/10 dark:border-black/10 pl-4': verse.type == 'chorus' }"
                v-for="(verse, i) in verses"
                :key="i + '_' + verse"
            >
                <span
                    class="absolute font-semibold verse-name"
                    v-if="verse.type != 'chorus'"
                    >{{ verse.name }}</span
                >
                <p
                    class="tracking-wide line"
                    :class="{ 'opacity-50 mt-8 text-4xl': line.trim()[0] == '(' }"
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
import { Lyrics, Song } from "@/classes";
import { viewer } from "@/classes/presentation/viewer";
import { appSession } from "@/services/session";
import { useStore } from "@/store";
import { Vue } from "vue-class-component";

export default class PresentationView extends Vue {
    public viewer = viewer;
    private store = useStore();
    public lyrics: Lyrics | null = null;
    public song: Song | null = null;
    public verses: Verse[] | null = null;
    public muted = false;
    public theme: "dark" | "light" = "dark";

    public async mounted() {
        await appSession.init();
        viewer.init();
        this.lyrics = viewer.Lyrics;
        this.song = viewer.Song ?? null;
        this.verses = viewer.Verses;

        viewer.registerCallback("lyrics", () => {
            this.lyrics = viewer.Lyrics;
            this.song = viewer.Song ?? null;
        });

        viewer.registerCallback("settings", () => {
            this.verses = viewer.Verses;
            this.muted = viewer.Settings?.muted === true;
            this.theme = viewer.Settings?.theme ?? "dark";
        });

        addEventListener("keydown", (e) => {
            if (e.key == "ArrowRight") {
                viewer.next();
                this.verses = viewer.Verses;
            }
            if (e.key == "ArrowLeft") {
                viewer.previous();
                this.verses = viewer.Verses;
            }
        });
    }

    public get melodyOrigin() {
        const melodyOrigin = this.song?.melodyOrigin;

        return melodyOrigin?.description[this.store.getters.languageKey] ?? melodyOrigin?.description.no;
    }

    public getLocaleString(dictionary: { [key: string]: string }) {
        if (!dictionary) return "";
        return (
            dictionary[this.store.getters.languageKey] ??
            dictionary.en ??
            dictionary[Object.keys(dictionary)[0]]
        );
    }

    public get identicalCopyright() {
        return this.song?.copyright.text?.id == this.song?.copyright.melody?.id;
    }
}
</script>

<style>
.verses {
    margin-left: clamp(4rem, 10vw + 2rem, 20vw);
    font-size: clamp(1rem, 3vw + 1rem, 4rem);
}
.verse {
    margin-bottom: clamp(2rem, 5vw, 32rem);
}
.line {
    margin-bottom: clamp(.5rem, 2vw, 2rem);
}
.verse-name {
    left: calc(clamp(3rem, 6vw, 20rem) * -1);
}
::-webkit-scrollbar {
    display: none;
}
</style>
