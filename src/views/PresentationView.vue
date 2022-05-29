<template>
    <div id="presentation-view" :class="['flex h-full', theme == 'dark' ? 'text-white bg-[#101010]' : 'text-[#101010] bg-white']">
        <aside v-if="showSidebar" :class="['max-w-xs w-full flex items-center justify-center p-8', { 'hidden': muted }, theme == 'dark' ? 'bg-black' : 'bg-gray-100']">
            <img class="w-full drop-shadow-sm" :src="`/img/collections/wotl/${logoLanguageKey}.png`" v-if="Collection?.key == 'HV'" />
            <h2 class="text-5xl font-light whitespace-nowrap tracking-wider opacity-50 -rotate-90" v-else>{{ Collection?.getName() }}</h2>
        </aside>
        <div class="text-3xl h-full flex-grow flex flex-col">
            <div :class="[{ 'hidden': muted }, theme == 'dark' ? 'border-white/50' : 'border-black/50']" class="flex items-end gap-6 px-10 pt-6 pb-3 border-b" v-if="song">
                <span class="font-light text-2xl" v-if="!showSidebar">{{ song.Collections.find(c => c.id == song?.collectionIds[0])?.key }}</span>
                <h1 class="text-8xl" v-if="song.number">{{ song.number }}</h1>
                <div class="ml-auto text-3xl tracking-wide flex flex-col items-end">
                    <div class="flex gap-4">
                        <p v-if="authors.length > 0">
                            {{ (song.yearWritten ? $t("song_writtenInBy").replace('$year', song.yearWritten.toString()) : $t("song_writtenBy")).replace('$authors', '') }}
                            <span v-for="author in authors" :key="author.id">
                                {{ author.name }}
                            </span>
                        </p>
                        <span v-if="authors.length">&middot;</span>
                        <p v-if="composers.length > 0">
                            {{ (song.yearComposed ? $t("song_composedInBy").replace('$year', song.yearComposed.toString()) : $t("song_composedBy")).replace('$composers', '') }}
                            <span v-for="composer in composers" :key="composer.id">
                                {{ composer.name }}
                            </span>
                        </p>
                        <p v-else-if="melodyOrigin">{{ melodyOrigin }}</p>
                        <p v-else>{{$t("song_unknownComposer")}}</p>
                    </div>
                    <div class="flex gap-4">
                        <span v-if="song.originCountry">{{$t(song.originCountry)}}</span>
                        <span v-if="song.originCountry">&middot;</span>
                        <span>{{ song.originalKey }}</span>
                        <span v-if="song.copyright.text || song.copyright.melody">&middot;</span>
                        <span>{{ song.verses }}</span>
                        <span v-if="song.copyright.text || song.copyright.melody">&middot;</span>
                        <div 
                            class="flex gap-4"
                            v-if="
                                song.copyright.melody &&
                                song.copyright.text &&
                                identicalCopyright
                            ">
                            <p>© {{ getLocaleString(song.copyright.melody.name) }}</p>
                        </div>
                        <div v-else class="flex gap-4">
                            <p v-if="song.copyright.text">
                                {{ $t("song_text") }} ©
                                {{ getLocaleString(song.copyright.text.name) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <PresentationLyrics 
                v-if="verses"
                ref="presentation"
                :verses="verses"
                :songId="song?.id"
                :class="{ 'hidden': muted }"
                :longestLine="longestLine ?? ''"
                :longestLineLength="longestLineLength"
                :verseLines="verseLines"
                :verseLineLength="verseLineLength"
            />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Contributor, Lyrics, Song } from "@/classes";
import { presentation } from "@/classes/presentation";
import { useStore } from "@/store";
import { PresentationLyrics } from "@/components/presentation";
import { LyricsVerse } from "@/classes/lyrics";

export default defineComponent({
    name: "presentation-view",
    components: {
        PresentationLyrics,
    },
    data: () => ({
        store: useStore(),
        viewer: presentation,
        lyrics: null as Lyrics | null,
        song: null as Song | null,
        contributors: null as Contributor[] | null,
        verses: null as LyricsVerse[] | null,
        theme: "dark" as "dark" | "light",
        muted: false,
        showSidebar: true,
        verseCount: 0,
        longestLine: null as string | null,
        verseLineLength: 0,
        longestLineLength: 0,
    }),
    computed: {
        logoLanguageKey() {
            if(!this.lyrics?.languageKey) return "en";

            const languages = ["dk", "en", "es", "fi", "fr", "nl", "no", "pl", "ro", "ru", "un"];
            return languages.includes(this.lyrics.languageKey) ? this.lyrics.languageKey : "en";
        },
        Collection() {
            return this.song?.Collections.find(c => c.id == this.song?.collectionIds[0]);
        },
        Language() {
            return this.store.getters.languageKey;
        },
        melodyOrigin() {
            return (
                this.song?.melodyOrigin?.description?.[this.Language] ??
                this.song?.melodyOrigin?.description?.no ??
                undefined
            );
        },
        identicalCopyright() {
            return this.song?.copyright.text?.id == this.song?.copyright.melody?.id;
        },
        verseLines() {
            return this.verses?.reduce((prev, cur) => {
                prev.push(...cur.content);
                prev.push("");
                return prev;
            }, [] as string[]).slice(0, -1) ?? [];
        },
        authors() {
            return this.contributors?.filter(i => this.song?.participants.some(p => p.type === "author" && p.contributorId === i.id)) ?? [];
        },
        composers() {
            return this.contributors?.filter(i => this.song?.participants.some(p => p.type === "composer" && p.contributorId === i.id)) ?? [];
        },
    },
    async mounted() {
        presentation.initialize("viewer");
        this.refreshLyrics();
        this.contributors = presentation.Contributors;
        this.verses = presentation.Verses;
        this.song = presentation.Song;

        this.showSidebar = presentation.Settings?.showSideBar === true;

        presentation.registerCallback("lyrics", () => {
            this.refreshLyrics();
        });

        presentation.registerCallback("song", () => {
            this.song = presentation.Song;
        });

        presentation.registerCallback("contributors", () => {
            this.contributors = presentation.Contributors;
        });

        presentation.registerCallback("settings", () => {
            this.refreshLyrics();
            this.verses = presentation.Verses;
            this.muted = presentation.Settings?.muted === true;
            this.theme = presentation.Settings?.theme ?? "dark";
            this.showSidebar = presentation.Settings?.showSideBar === true;
        });
    },
    methods: {
        getLocaleString(dictionary: { [key: string]: string }) {
            if (!dictionary) return "";
            return (
                dictionary[this.store.getters.languageKey] ??
                dictionary.en ??
                dictionary[Object.keys(dictionary)[0]]
            );
        },
        refreshLyrics() {
            this.lyrics = presentation.Lyrics;
            this.verseCount = Object.keys(this.lyrics?.content ?? {}).filter(i => i.startsWith("verse")).length;
            this.verseLineLength = 0;
            
            const verses = Object.entries(this.lyrics?.content ?? {}).map(e => e[1] as LyricsVerse);

            const calculateLength = (line: string) => {
                let lineLength = 0;
                for (let i = 0; i < line.length; i++) {
                    const letter = line[i];
                    if ("ijIltfr".includes(letter)) {
                        lineLength += 0.7;
                    } else {
                        lineLength += 1;
                    }
                }
                return lineLength;
            };

            this.longestLine = verses.reduce((prev, cur) => {
                if (cur.type === "chorus") {
                    prev.push(...cur.content.map(i => "  " + i));
                } else {
                    prev.push(...cur.content);
                }
                prev.push("");
                return prev;
            }, [] as string[]).slice(0, -1).filter(l => !(l.startsWith("(") && l.endsWith(")")))
                .sort((a, b) => calculateLength(b) - calculateLength(a))[0];

            this.longestLineLength = calculateLength(this.longestLine);

            let i = 0;
            const size = presentation.Settings?.size;
            if (size) {
                while (i < verses.length) {
                    const verseRange = presentation.GetVerses(presentation.GetVerseRange(i, size));

                    const verseLines = verseRange.reduce((prev, cur) => {
                        prev.push(...cur.content.filter(l => !l.trim().startsWith("(")));
                        prev.push("");
                        return prev;
                    }, [] as string[]).slice(0, -1);

                    if (!this.verseLineLength || verseLines.length > this.verseLineLength) {
                        this.verseLineLength = verseLines.length + 1;
                    }

                    i += size;
                }
            }
        },
    },
});
</script>

<style>
#presentation-view {
  height: 100vh;
  width: 100vw;
}
</style>
