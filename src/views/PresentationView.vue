<template>
    <div
        class="text-3xl h-full"
        :class="[theme == 'dark' ? 'text-white bg-black' : 'text-black bg-white']"
    >
        <div :class="[{ 'hidden': muted }, theme == 'dark' ? 'border-white/50' : 'border-black/50']" class="flex items-end gap-6 px-10 py-6 border-b" v-if="song">
            <h1 class="font-bold text-4xl" v-if="song.number">
                {{ song.Collections.find(c => c.id == song?.collectionIds[0])?.key }}
                {{ song.number }}
            </h1>
            <!-- <h3 class="font-light text-4xl">{{ song.getName() }}</h3> -->
            <div class="ml-auto text-lg tracking-wide flex flex-col items-end">
                <div class="flex gap-4">
                    <p
                        v-if="song.Authors.length > 0"
                    >
                        {{ (song.yearWritten ? $t("song.writtenInBy").replace('$year', song.yearWritten.toString()) : $t("song.writtenBy")).replace('$authors', '') }}
                        <span v-for="author in song.Authors" :key="author.id">
                            {{ author.name }}
                        </span>
                    </p>
                    <span v-if="song.Authors.length && song.Composers.length">&#8226;</span>
                    <p
                        v-if="song.Composers.length > 0"
                    >
                        {{ (song.yearComposed ? $t("song.composedInBy").replace('$year', song.yearComposed.toString()) : $t("song.composedBy")).replace('$composers', '') }}
                        <span
                            v-for="composer in song.Composers"
                            :key="composer.id"
                        >
                            {{ composer.name }}
                        </span>
                    </p>
                    <span v-if="(song.Authors.length || song.Composers.length) && melodyOrigin">&#8226;</span>
                    <p v-if="melodyOrigin">
                        {{ $t("song.melody") }}: {{ melodyOrigin }}
                    </p>
                </div>
                <div class="flex gap-4">
                    <span>{{ song.originalKey }}</span>
                    <span v-if="song.copyright.text || song.copyright.melody">&#8226;</span>
                    <span>{{ song.verses }}</span>
                    <span v-if="song.copyright.text || song.copyright.melody">&#8226;</span>
                    <p
                        class="text-base tracking-wide"
                        v-if="
                            song.copyright.melody &&
                            song.copyright.text &&
                            identicalCopyright
                        "
                    >
                        © {{ getLocaleString(song.copyright.melody.name) }}
                    </p>
                    <div v-else class="flex gap-4">
                        <p
                            v-if="song.copyright.text"
                        >
                            {{ $t("song.text") }} ©
                            {{ getLocaleString(song.copyright.text.name) }}
                        </p>
                        <span v-if="song.copyright.text && song.copyright.melody">&#8226;</span>
                        <p
                            v-if="song.copyright.melody"
                        >
                            {{ $t("song.melody") }} ©
                            {{ getLocaleString(song.copyright.melody.name) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div :class="{'hidden': muted}" class="mt-16 verses" v-if="verses">
            <div
                class="relative verse"
                :class="{ 'italic': verse.type == 'chorus' }"
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
    public verseCount = 0;

    public async mounted() {
        await appSession.init();
        viewer.init();
        this.lyrics = viewer.Lyrics;
        this.verseCount = Object.keys(this.lyrics?.content ?? {}).filter(i => i.startsWith("verse")).length;
        this.song = viewer.Song ?? null;
        this.verses = viewer.Verses;

        viewer.registerCallback("lyrics", () => {
            this.lyrics = viewer.Lyrics;
            this.verseCount = Object.keys(this.lyrics?.content ?? {}).filter(i => i.startsWith("verse")).length;
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
    margin-left: clamp(1rem, 10vw + 1rem, 20vw);
    font-size: clamp(1rem, 3vw + 1rem, 3.5rem);
}
.verse {
    margin-bottom: clamp(2rem, 5vw, 32rem);
}
.line {
    line-height: clamp(1rem, 3vh + 2vw + .5rem, 3.8rem);
}
.verse-name {
    left: calc(clamp(3rem, 6vw, 20rem) * -1);
}
::-webkit-scrollbar {
    display: none;
}
</style>
