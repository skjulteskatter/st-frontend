<template>
	<article id="presentation-lyrics">
		<div id="verses">
			<div
				class="relative verse"
				v-for="(verse, i) in Verses"
				:key="i + '_' + verse"
				:class="{ 'ml-8': verse.type == 'chorus' }"
			>
				<span class="absolute verse-name" v-if="verse.type != 'chorus'">
					{{ verse.name }}
				</span>
				<p
					class="line"
					:class="{ 'opacity-50 mt-8 text-[0.5em]': line.trim()[0] == '(' }"
					v-for="(line, i) in verse.content"
					:key="i + '_' + line"
				>
					{{ line }}
				</p>
			</div>
		</div>
	</article>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
	name: "presentation-lyrics",
	props: {
		verses: {
			type: Array,
			required: true,
		},
	},
})
export default class PresentationLyrics extends Vue {
	public verses?: Verse[];

	private container: HTMLElement | null = {} as HTMLElement;
	private element: HTMLElement | null = {} as HTMLElement;

	private fontSize = 0;
	private lineHeight = 0;
	private margin = {
		top: 0,
		left: 0,
	};

	public mounted() {
		this.container = document.getElementById("presentation-lyrics");
		this.element = document.getElementById("verses");

		// Calculate everything on mount
		this.calculateFontSize();
		this.calculateLineHeight();
		this.calculateWhitespace();

		this.setProperties();
	}

	private setProperties() {
		if(!this.container || !this.element) return;

		this.container.style.fontSize = `${this.fontSize}px`;
		this.container.style.lineHeight = `${this.lineHeight}`;
		this.element.style.marginTop = `${this.margin.top}px`;
		this.element.style.marginLeft = `${this.margin.left}px`;
	}

	// Individual calculations
	private calculateFontSize() {
		if(!this.container) return;

		const rect = this.container.getBoundingClientRect();
		const size = Math.min(rect.width / this.verseLines.length / 8, 24) + 32;
		this.fontSize = size;
	}

	private calculateLineHeight() {
		this.lineHeight = Math.min(3 / this.verseLines.length, 0.5) + 0.8;
	}

	private calculateWhitespace() {
		if(!this.container) return;

		const rect = this.container.getBoundingClientRect();
		this.margin.left = rect.width / (this.longestLine?.length / 7);
		this.margin.top = rect.height / (this.verseLines?.length * 1.5);
	}

	// Getters
	public get Verses() {
		return this.verses ?? [];
	}

	public get verseLines() {
		return this.Verses.reduce((prev, cur) => [...prev, ...cur.content], [] as string[]);
	}

	public get longestLine() {
		return this.verseLines.sort((a,b) => b.length - a.length)[0];
	}
}
</script>

<style>
#presentation-lyrics {
	flex-grow: 1;
	background: #121212;
	overflow-y: hidden;
}

.verse:not(:last-child) {
    margin-bottom: 1em;
}

.line {
    text-indent: -1em;
    margin-left: 1em;
}

.verse-name {
    left: -1.5em;
}

::-webkit-scrollbar {
    display: none;
}
</style>
