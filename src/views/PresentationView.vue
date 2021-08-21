<template>
    <div class="text-white bg-black text-3xl h-full" :class="{'hidden': muted}">
        <div class="flex gap-4 px-10 py-4 border-b border-black/20 dark:border-white/20" v-if="song">
            <h1 class="font-bold" v-if="song.number">
                {{ song.number }}
            </h1>
            <div>
                <h3 class="mb-2">{{ song.getName() }}</h3>
                <p
                    class="text-base tracking-wide opacity-50"
                    v-if="song.Authors.length > 0"
                >
                    {{ $t("song.author") }}:
                    <span v-for="author in song.Authors" :key="author.id">
                        {{ author.name }}
                    </span>
                </p>
                <p
                    class="text-base tracking-wide opacity-50"
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
                <p class="text-base tracking-wide opacity-50" v-if="melodyOrigin">
                    {{ $t("song.melody") }}: {{ melodyOrigin }}
                </p>
                <p class="text-base tracking-wide opacity-50">
                    {{ song.yearWritten }}
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
        <div class="ml-80 mt-10" v-if="verses">
            <div
                class="relative mb-16 text-5xl"
                :class="{ 'italic border-l-4 border-white/10 dark:border-black/10 pl-4': verse.type == 'chorus' }"
                v-for="(verse, i) in verses"
                :key="i + '_' + verse"
            >
                <span
                    class="absolute -left-20 font-semibold"
                    v-if="verse.type != 'chorus'"
                    >{{ verse.name }}</span
                >
                <p
                    class="my-4 tracking-wide"
                    :class="{ 'opacity-30 mt-8 text-4xl': line.trim()[0] == '(' }"
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
