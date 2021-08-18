<template>
	<article class="bg-white p-8" v-if="song && collection && verses">
		<back-button class="back-button" />
		<header class="mb-8 py-4 border-b border-gray-300 flex justify-between items-end">
			<div>
				<p class="text-primary">{{ collection.getName(languageKey) }}</p>
				<h1 class="text-2xl flex gap-4">
					<span class="text-gray-500">{{ song.getNumber(collection.id) }}</span>
					<span class="font-bold">{{ song.getName(languageKey) }}</span>
				</h1>
			</div>
			<div class="text-gray-500 leading-none">
				<small class="flex gap-1 whitespace-nowrap" v-if="song.hasLyrics && song.Authors.length">
					<span>{{ (song.yearWritten ? $t("song.writtenInBy").replace('$year', song.yearWritten.toString()) : $t("song.writtenBy")).replace('$authors', '') }}</span>
					<span v-for="author in song.Authors" :key="author.id">{{ author.name }}</span>
				</small>
				<small class="flex gap-1 whitespace-nowrap" v-if="song.Composers.length">
					<span>{{ (song.yearComposed ? $t("song.composedInBy").replace('$year', song.yearComposed.toString()) : $t("song.composedBy")).replace('$composers', '') }}</span>
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
                <small
                    class="flex gap-2"
                    v-if="melodyOrigin"
                >
                    {{ melodyOrigin }}
                </small>
			</div>
		</header>
		<main v-if="Object.keys(verses).length <= 4" class="flex justify-center">
			<section class="flex flex-col gap-4">
				<div class="mb-4" v-for="verse of verses" :key="verse.name">
					<b>{{ verse.name }}</b>
					<p v-for="line in verse.content" :key="verse.name + line">{{ line }}</p>
				</div>
			</section>
		</main>
		<main class="lyrics" v-else>
			<div class="mb-4" v-for="verse of verses" :key="verse.name">
				<b>{{ verse.name }}</b>
				<p v-for="line in verse.content" :key="verse.name + line">{{ line }}</p>
			</div>
		</main>
		<footer class="mt-8 flex">
			<img id="st-logo-print" src="/img/logo/dark.svg" alt="SongTreasures logo" class="max-h-12">
			<a class="ml-auto mt-auto" href="https://songtreasures.org">songtreasures.org</a>
		</footer>
	</article>
</template>

<script lang="ts">
import { Collection } from "@/classes";
import { useStore } from "@/store";
import { Vue } from "vue-class-component";

export default class PrintView extends Vue {
	public store = useStore();
	public printed = false;

	public mounted() {
		const imageElement = document.getElementById("st-logo-print") as HTMLImageElement;

		if(this.song){
			document.title = this.formattedTitle;
		}

		imageElement.onload = () => {
			if (!this.printed)
				window.print();
			this.printed = true;
		};
	}

	public get formattedTitle() {
		if(this.collection && this.song) {
			const collection = this.collection.key;
			const number = this.song.getNumber(this.collection.id);
			const name = this.song.getName(this.languageKey);

			return `${collection}${number} - ${name}`;
		}
		return "";
	}

	public get languageKey() {
		return this.store.getters.languageKey;
	}

	public get collection(): Collection | undefined {
		return this.store.getters.collection;
	}

	public get song() {
        return this.collection?.songs.find(s => s.id == this.store.state.songs.songId);
    }

	public get lyrics() {
		return this.store.getters.lyrics;
	}

	public get verses() {
		return this.lyrics?.content as object;
	}

    public getLocaleString(dictionary: { [key: string]: string }) {
        if (!dictionary) return "";
        return (
            dictionary[this.languageKey] ??
            dictionary.en ??
            dictionary[Object.keys(dictionary)[0]]
        );
    }

    public get identicalCopyright() {
        return this.song?.copyright.text?.id == this.song?.copyright.melody?.id;
    }

    public get melodyOrigin() {
        return (
            this.song?.melodyOrigin?.description?.[this.languageKey] ??
            this.song?.melodyOrigin?.description?.no ??
            undefined
        );
    }
}
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
}
</style>
