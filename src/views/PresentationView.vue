<template>
    <div id="presentation-view" :class="['flex h-full', theme == 'dark' ? 'text-white bg-black' : 'text-black bg-white']">
        <aside v-if="showSideBar" :class="['max-w-xs w-full flex items-center justify-center p-8', { 'hidden': muted }, theme == 'dark' ? '' : 'bg-gray-100']">
            <img class="w-full drop-shadow-sm" :src="`/img/collections/wotl/${logoLanguageKey}.png`" v-if="Collection?.key == 'HV'" />
            <h2 class="text-5xl font-light whitespace-nowrap tracking-wider opacity-50 -rotate-90" v-else>{{ Collection?.getName() }}</h2>
        </aside>
        <div class="text-3xl h-full flex-grow flex flex-col">
            <div :class="[{ 'hidden': muted }, theme == 'dark' ? 'border-white/50' : 'border-black/50']" class="flex items-end gap-6 px-10 py-6 border-b" v-if="song">
                <span class="font-light text-2xl" v-if="!showSideBar">{{ song.Collections.find(c => c.id == song?.collectionIds[0])?.key }}</span>
                <h1 class="text-6xl" v-if="song.number">{{ song.number }}</h1>
                <div class="ml-auto text-lg tracking-wide flex flex-col items-end">
                    <div class="flex gap-4">
                        <p
                            v-if="song.Authors.length > 0"
                        >
                            {{ (song.yearWritten ? $t("song_writtenInBy").replace('$year', song.yearWritten.toString()) : $t("song_writtenBy")).replace('$authors', '') }}
                            <span v-for="author in song.Authors" :key="author.id">
                                {{ author.name }}
                            </span>
                        </p>
                        <span v-if="song.Authors.length">&middot;</span>
                        <p
                            v-if="song.Composers.length > 0"
                        >
                            {{ (song.yearComposed ? $t("song_composedInBy").replace('$year', song.yearComposed.toString()) : $t("song_composedBy")).replace('$composers', '') }}
                            <span
                                v-for="composer in song.Composers"
                                :key="composer.id"
                            >
                                {{ composer.name }}
                            </span>
                        </p>
                        <p
                            v-else
                        >
                            {{$t("song_unknownComposer")}}
                        </p>
                        <span v-if="(song.Authors.length || song.Composers.length) && melodyOrigin">&middot;</span>
                        <p v-if="melodyOrigin">
                            {{ $t("song_melody") }}: {{ melodyOrigin }}
                        </p>
                    </div>
                    <div class="flex gap-4">
                        <span v-if="song.originCountry">{{$t(song.originCountry)}}</span>
                        <span v-if="song.originCountry">&middot;</span>
                        <span>{{ song.originalKey }}</span>
                        <span v-if="song.copyright.text || song.copyright.melody">&middot;</span>
                        <span>{{ song.verses }}</span>
                        <span v-if="song.copyright.text || song.copyright.melody">&middot;</span>
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
                                {{ $t("song_text") }} ©
                                {{ getLocaleString(song.copyright.text.name) }}
                            </p>
                            <span v-if="song.copyright.text && song.copyright.melody">&middot;</span>
                            <p
                                v-if="song.copyright.melody"
                            >
                                {{ $t("song_melody") }} ©
                                {{ getLocaleString(song.copyright.melody.name) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <PresentationLyrics :verses="Verses" :class="{ 'hidden': muted }" />
        </div>
    </div>
</template>
<script lang="ts">
import { Lyrics, Song } from "@/classes";
import { viewer } from "@/classes/presentation/viewer";
import { appSession } from "@/services/session";
import { useStore } from "@/store";
import { Options, Vue } from "vue-class-component";
import { PresentationLyrics } from "@/components/presentation";

@Options({
    name: "presentation-view",
    components: {
        PresentationLyrics,
    },
})
export default class PresentationView extends Vue {
    public viewer = viewer;
    private store = useStore();
    public lyrics: Lyrics | null = null;
    public song: Song | null = null;
    public verses: Verse[] | null = null;
    public muted = false;
    public theme: "dark" | "light" = "dark";
    public showSideBar = true;
    public verseCount = 0;

    public get logoLanguageKey() {
        if(!this.lyrics?.languageKey) return "en";

        const languages = ["dk", "en", "es", "fi", "fr", "nl", "no", "pl", "ro", "ru", "un"];
        return languages.includes(this.lyrics.languageKey) ? this.lyrics.languageKey : "en";
    }

    public get Verses() {
        return this.verses ?? [];
    }

    public get Collection() {
        return this.song?.Collections.find(c => c.id == this.song?.collectionIds[0]);
    }

    public async mounted() {
        await appSession.init();
        viewer.init();
        this.lyrics = viewer.Lyrics;
        this.verseCount = Object.keys(this.lyrics?.content ?? {}).filter(i => i.startsWith("verse")).length;
        this.song = viewer.Song ?? null;
        this.verses = viewer.Verses;
        this.showSideBar = viewer.Settings?.showSideBar === true;

        viewer.registerCallback("lyrics", () => {
            this.lyrics = viewer.Lyrics;
            this.verseCount = Object.keys(this.lyrics?.content ?? {}).filter(i => i.startsWith("verse")).length;
            this.song = viewer.Song ?? null;
        });

        viewer.registerCallback("settings", () => {
            this.verses = viewer.Verses;
            this.muted = viewer.Settings?.muted === true;
            this.theme = viewer.Settings?.theme ?? "dark";
            this.showSideBar = viewer.Settings?.showSideBar === true;
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

    public unmounted() {
        // Prevent memory leaks
        removeEventListener("keydown", (e) => {
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
