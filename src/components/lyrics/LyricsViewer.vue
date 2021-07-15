<template>
    <div
        class="w-full whitespace-pre-line mb-4"
        v-for="(verse, i) in text"
        :key="lyrics?.languageKey + verse.name + verse.content[0] + i"
        @mouseover="hoverVerses[verse.name] = true"
        @mouseleave="hoverVerses[verse.name] = false"
    >
        <b class="text-sm">{{ verse.name }}</b>
        <div class="flex gap-8 items-center">
            <p class="leading-7 w-max">{{ verse.content.join("\n") }}</p>
            <button 
                class="px-2 py-1 text-sm bg-black bg-opacity-10 hover:bg-opacity-20 rounded"
                v-if="hoverVerses[verse.name]"
                @click="shareText(verse.content.join('\n'))"
            >
                <icon name="share" size="12" class="mr-1" />
                {{ $t('common.share') }}
            </button>
        </div>
    </div>
    <base-modal
        :show="copied"
        @close="closeCopied"
    >
        <div class="flex flex-col items-center gap-4">
            <icon name="check" size="32" class="rounded-full text-green-700 p-1 border border-green-700" />
            <p class="">{{ $t('song.copiedToClipboard') }}!</p>
            <base-button theme="primary" @click="closeCopied">{{ $t('common.close') }}</base-button>
        </div>
    </base-modal>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseModal } from "@/components";
import { useStore } from "@/store";
import { Song } from "@/classes";

@Options({
    name: "lyrics-viewer",
    props: {
        song: {
            type: Object,
        },
    },
    components: {
        BaseModal,
    },
})
export default class LyricsViewer extends Vue {
    public store = useStore();
    public song?: Song;
    public copied = false;
    public hoverVerses: {
        [verse: string]: boolean;
    } = {};

    public shareText(text: string) {
        this.copy(this.formattedText(text));
        this.copied = true;
    }

    public formattedText(text: string) {
        return `
            ${this.song?.getName(this.languageKey)}
            ${this.collection?.getName(this.languageKey)} ${this.song?.getNumber(this.song.collectionIds[0])}
            
            "${text}"
            
            ${this.$t("copyright.title")}`;
    }

    public copy(text: string) {
        navigator.clipboard.writeText(text);
    }

    public closeCopied() {
        this.copied = false;
    }

    public get text() {
        const verses: { name: string; content: string[] }[] = [];

        const types: {
            [key: string]: string;
        } = {
            "[Chorus]": "chorus",
            "[Bridge]": "bridge",
        };

        if (this.lyrics) {
            for (const key of Object.keys(this.lyrics.content)) {
                const verse: Verse = {
                    name: (this.lyrics.content as JsonContent)[key].name,
                    content: (this.lyrics.content as JsonContent)[key].content,
                    type:
                        types[(this.lyrics.content as JsonContent)[key].name] ??
                        "verse",
                };

                if (verse.type == "chorus") {
                    verse.name = this.$t("song.chorus");
                } else if (verse.type == "bridge") {
                    verse.name = this.$t("song.bridge");
                }

                verses.push(verse);
            }
        }

        return verses;
    }

    public get lyrics() {
        return this.store.getters.lyrics;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get collection() {
        return this.store.getters.collection;
    }
}
</script>
