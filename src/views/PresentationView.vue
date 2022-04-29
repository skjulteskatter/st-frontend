<template>
    <div id="presentation-view" :class="['flex h-full', theme == 'dark' ? 'text-white bg-[#101010]' : 'text-[#101010] bg-white']">
        <aside v-if="showSidebar" :class="['max-w-xs w-full flex items-center justify-center p-8', { 'hidden': muted }, theme == 'dark' ? 'bg-black' : 'bg-gray-100']">
            <img class="w-full drop-shadow-sm" :src="`/img/collections/wotl/${logoLanguageKey}.png`" v-if="Collection?.key == 'HV'" />
            <h2 class="text-5xl font-light whitespace-nowrap tracking-wider opacity-50 -rotate-90" v-else>{{ Collection?.getName() }}</h2>
        </aside>
        <div class="text-3xl h-full flex-grow flex flex-col">
            <div :class="[{ 'hidden': muted }, theme == 'dark' ? 'border-white/50' : 'border-black/50']" class="flex items-end gap-6 px-10 py-6 border-b" v-if="song">
                <span class="font-light text-2xl" v-if="!showSidebar">{{ song.Collections.find(c => c.id == song?.collectionIds[0])?.key }}</span>
                <h1 class="text-8xl" v-if="song.number">{{ song.number }}</h1>
                <div class="ml-auto text-3xl tracking-wide flex flex-col items-end">
                    <div class="flex gap-4">
                        <p v-if="song.Authors.length > 0">
                            {{ (song.yearWritten ? $t("song_writtenInBy").replace('$year', song.yearWritten.toString()) : $t("song_writtenBy")).replace('$authors', '') }}
                            <span v-for="author in song.Authors" :key="author.id">
                                {{ author.name }}
                            </span>
                        </p>
                        <span v-if="song.Authors.length">&middot;</span>
                        <p v-if="song.Composers.length > 0">
                            {{ (song.yearComposed ? $t("song_composedInBy").replace('$year', song.yearComposed.toString()) : $t("song_composedBy")).replace('$composers', '') }}
                            <span v-for="composer in song.Composers" :key="composer.id">
                                {{ composer.name }}
                            </span>
                        </p>
                        <p v-else-if="!song.Composers.length && !melodyOrigin">{{$t("song_unknownComposer")}}</p>
                        <p v-if="melodyOrigin">{{ melodyOrigin }}</p>
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
                            <!-- <span v-if="song.copyright.text && song.copyright.melody">&middot;</span>
                            <p v-if="song.copyright.melody">
                                {{ $t("song_melody") }} ©
                                {{ getLocaleString(song.copyright.melody.name) }}
                            </p> -->
                        </div>
                    </div>
                </div>
            </div>
            <PresentationLyrics 
                v-if="verses"
                :verses="verses"
                :songId="song?.id"
                :class="{ 'hidden': muted }"
                :longestLine="longestLine"
                :verseLines="verseLines"
            />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { Lyrics, Song } from "@/classes";
import { viewer } from "@/classes/presentation/viewer";
import { appSession } from "@/services/session";
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
        viewer: viewer,
        lyrics: null as Lyrics | null,
        song: null as Song | null,
        verses: null as LyricsVerse[] | null,
        theme: "dark" as "dark" | "light",
        muted: false,
        showSidebar: true,
        verseCount: 0,
    }),
    computed: {
        logoLanguageKey() {
            if(!this.lyrics?.languageKey) return "en";

            const languages = ["dk", "en", "es", "fi", "fr", "nl", "no", "pl", "ro", "ru", "un"];
            return languages.includes(this.lyrics.languageKey) ? this.lyrics.languageKey : "en";
        },
        Verses() {
            return this.verses ?? [];
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
            return this.Verses.reduce((prev, cur) => [...prev, ...cur.content], [] as string[]);
        },
		longestLine(): string {
			const lines = this.verseLines;
			return lines.sort((a, b) => b.length - a.length)[0];
		},
    },
    async mounted() {
        await appSession.init();
        viewer.init();
        this.lyrics = viewer.Lyrics;
        this.verseCount = Object.keys(this.lyrics?.content ?? {}).filter(i => i.startsWith("verse")).length;
        this.song = viewer.Song ?? null;
        this.verses = viewer.Verses;
        this.showSidebar = viewer.Settings?.showSideBar === true;

        viewer.registerCallback("lyrics", () => {
            this.lyrics = viewer.Lyrics;
            this.verseCount = Object.keys(this.lyrics?.content ?? {}).filter(i => i.startsWith("verse")).length;
            this.song = viewer.Song ?? null;
        });

        viewer.registerCallback("settings", () => {
            this.verses = viewer.Verses;
            this.muted = viewer.Settings?.muted === true;
            this.theme = viewer.Settings?.theme ?? "dark";
            this.showSidebar = viewer.Settings?.showSideBar === true;
        });

        addEventListener("keydown", this.onKeyDown);
    },
    unmounted() {
        removeEventListener("keydown", this.onKeyDown); // Prevent memory leaks
    },
    methods: {
        onKeyDown(e: KeyboardEvent): void {
            if (e.key == "ArrowRight") {
                e.preventDefault(); // prevent cursor from appearing in view
                viewer.next();
                this.verses = viewer.Verses;
                this.muted = viewer.Settings?.muted === true;
            }
            if (e.key == "ArrowLeft") {
                e.preventDefault(); // prevent cursor from appearing in view
                viewer.previous();
                this.verses = viewer.Verses;
                this.muted = viewer.Settings?.muted === true;
            }

            if (e.ctrlKey && e.key === "m") {
                viewer.mute();
            }
        },
        getLocaleString(dictionary: { [key: string]: string }) {
            if (!dictionary) return "";
            return (
                dictionary[this.store.getters.languageKey] ??
                dictionary.en ??
                dictionary[Object.keys(dictionary)[0]]
            );
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
