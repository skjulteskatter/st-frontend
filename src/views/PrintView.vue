<template>
	<article class="bg-white p-8">
		<BackButton class="back-button" />
		<header class="mb-8 py-4 border-b border-gray-300 flex justify-between items-end" v-if="collection && song">
			<div>
				<p class="text-primary">{{ collection.getName(languageKey) }}</p>
				<h1 class="text-2xl flex gap-4">
					<span class="text-gray-500">{{ song.getNumber(collection.id) }}</span>
					<span class="font-bold">{{ song.getName(languageKey) }}</span>
				</h1>
			</div>
			<div class="text-gray-500 leading-none">
				<small class="flex gap-1 whitespace-nowrap" v-if="song.hasLyrics && song.Authors.length">
					<span>{{ (song.yearWritten ? $t("song_writtenInBy").replace('$year', song.yearWritten.toString()) : $t("song_writtenBy")).replace('$authors', '') }}</span>
					<span v-for="author in song.Authors" :key="author.id">{{ author.name }}</span>
				</small>
				<small class="flex gap-1 whitespace-nowrap" v-if="song.Composers.length">
					<span>{{ (song.yearComposed ? $t("song_composedInBy").replace('$year', song.yearComposed.toString()) : $t("song_composedBy")).replace('$composers', '') }}</span>
					<span v-for="composer in song.Composers" :key="composer.id">{{ composer.name }}</span>
				</small>
                <small
                    class="flex gap-2"
                    v-if="
                        song.copyright.melody &&
                        song.copyright.text &&
                        identicalCopyright
                    "
                >
                    © {{ getLocaleString(song.copyright.melody.name) }}
                </small>
                <div v-else class="mt-2 mb-2">
                    <small
                        class="flex gap-2"
                        v-if="song.copyright.text"
                    >
                        {{ $t("song_text") }} ©:
                        {{ getLocaleString(song.copyright.text.name) }}
                    </small>
                    <small
                        class="flex gap-2"
                        v-if="song.copyright.melody"
                    >
                        {{ $t("song_melody") }} ©:
                        {{ getLocaleString(song.copyright.melody.name) }}
                    </small>
                </div>
                <small
                    class="flex gap-2"
                    v-if="melodyOrigin"
                >
                    {{ melodyOrigin }}
                </small>
			</div>
		</header>
		<main v-if="isShortSong && !useChords" class="flex justify-center">
			<section class="flex flex-col gap-4">
				<div class="mb-4" v-for="verse of verses" :key="verse.name">
					<b>{{ verse.name }}</b>
					<p v-for="line in verse.content" :key="verse.name + line">{{ line }}</p>
				</div>
			</section>
		</main>

		<main class="lyrics" v-else-if="!useChords">
			<div class="mb-4" v-for="verse of verses" :key="verse.name">
				<b>{{ verse.name }}</b>
				<p v-for="line in verse.content" :key="verse.name + line">{{ line }}</p>
			</div>
		</main>

		<main v-else>
			<div class="table ml-auto mr-auto">
				<blockquote v-for="(v, i) in lyrics?.versesWithChords" :verse="v" :key="i" class="bg-white border-black/30 rounded-lg py-5 text-sm">
					<div>
						<b>{{v.name}}</b>
						<div class="content">
							<table class="songline" v-for="(line, i) in v.content" :key="i">
								<tr class="chords">
									<td v-for="(chord, i) in line.chords" :key="i">
										<b>{{chord}}&nbsp;</b>
									</td>
								</tr>
								<tr class="lyrics">
									<td v-for="(chord, i) in line.parts" :key="i" :class="{'indent': chord.startsWith(' ')}">{{chord.trimStart()}}</td>
								</tr>
							</table>
						</div>
					</div>
				</blockquote>
			</div>
			<div class="table">
				<blockquote v-for="(image, i) in chordImages" :key="image + i" class="inline-block">
					<b v-html="image" class="inline-block"></b>
				</blockquote>
			</div>
		</main>


		<footer class="mt-8 flex">
			<img id="st-logo-print" src="/img/logo/dark.svg" alt="SongTreasures logo" class="max-h-12" height="48">
			<a class="ml-auto mt-auto" href="https://songtreasures.org">songtreasures.org</a>
		</footer>
	</article>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Collection } from "@/classes";
import Lyrics, { printLyrics } from "@/classes/lyrics";
import { useStore } from "@/store";
import song from "@/classes/song";
import { collection } from "firebase/firestore";
import lyrics from "@/classes/lyrics";
import { IChord, LyricsContent } from "songtreasures-api";
import { chords } from "@/services/api";
import { application } from "@/classes/application";

export default defineComponent({
	name: "print-view",
	data: () => ({
		store: useStore(),
		printed: false,
		lyrics: null as Lyrics | null,
		chordImages: [] as string[],
		imageLoaded: false,
	}),
	computed: {
		formattedTitle() {
			if(this.collection && this.song) {
				const collection = this.collection.key;
				const number = this.song.getNumber(this.collection.id);
				const name = this.song.getName(this.languageKey);

				return `${collection}${number} - ${name}`;
			}
			return "";
		},
		languageKey() {
			return this.store.getters.languageKey;
		},
		collection(): Collection | undefined {
			return this.store.getters.collection as Collection | undefined;
		},
		song() {
			return this.collection?.songs.find(s => s.id == this.store.state.songs.songId);
		},
		verses() {
			return (this.lyrics?.content ?? {}) as LyricsContent;
		},
		identicalCopyright() {
			return this.song?.copyright.text?.id == this.song?.copyright.melody?.id;
		},
		melodyOrigin() {
			return (
				this.song?.melodyOrigin?.description?.[this.languageKey] ??
				this.song?.melodyOrigin?.description?.no ??
				undefined
			);
		},
		isShortSong() {
			return Object.keys(this.verses).length <= 4;
		},
		useChords(){
			return this.store.state.songs.view === "chords";
		},
	},
	async mounted() {

		this.lyrics = printLyrics.value;

		if(this.song){
			application.setTitle(this.formattedTitle);
		}

		const imageElement = document.getElementById("st-logo-print") as HTMLImageElement;

		imageElement.onload = () => {
			this.imageLoaded = true;
		};

		await this.getChords();

		if (this.imageLoaded && this.printed == false){
				window.print();
			this.printed = true;
		}
	},
	methods: {
		getLocaleString(dictionary: { [key: string]: string }) {
			if (!dictionary) return "";
			return (
				dictionary[this.languageKey] ??
				dictionary.en ??
				dictionary[Object.keys(dictionary)[0]]
			);
		},
		async getChords(){

			let chordNames : string[] = [];
			let promises: Promise<IChord>[] = [];

			if (!this.lyrics?.versesWithChords) return;

			for (let a = 0; a < this.lyrics?.versesWithChords.length || 0; a++) {
				const verse = this.lyrics?.versesWithChords[a];
				
				for (let b = 0; b < verse.content.length; b++) {
					const line = verse.content[b];

					for (let c = 0; c < line.chords.length; c++) {

						const chord = line.chords[c].trim();
						if (chord.length < 1) continue;
						if (chordNames.includes(chord)) continue;

						chordNames.push(chord);
						promises.push(this.getChordObject(chord));
					}
				}
			}

			this.chordImages = (await Promise.all(promises)).map(x => x.imageArray[0]);
		},
		async getChordObject(chordName: string): Promise<IChord> {
			const chord = await chords.get(chordName.replaceAll("/","over").replaceAll("#", "sharp"));
			return chord;
		},
	},
});
</script>

<style scoped>
.lyrics {
	max-height: 80vh;
	column-count: 2;
}

.lyrics > div {
	break-inside: avoid;
}

@media print {
	.back-button {
		display: none;
	}  
	@page {
        margin-top: 0;
        margin-bottom: 0;
    }
    body {
        padding-top: 72px;
        padding-bottom: 72px ;
    }
	blockquote {
		page-break-inside: avoid;
	}
}
</style>
