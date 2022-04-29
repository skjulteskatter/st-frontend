<template>
	<article id="presentation-lyrics">
		<div id="verses" ref="versesElement">
			<div
				class="relative verse"
				v-for="(verse, i) in verses"
				:key="i"
				:class="{ 'ml-8': verse.type == 'chorus' }"
			>
				<span class="absolute verse-name" v-if="verse.type != 'chorus'">{{ verse.name }}</span>
				<!-- <span v-else class="absolute verse-name">{{$t('Ref:')}}</span> -->
				<p
					class="line"
					:class="{ 'opacity-50 mt-8 text-[0.5em]': line.trim().startsWith('(') && line.trim().endsWith(')') }"
					v-for="(line, i) in verse.content"
					:key="i + '_' + line"
				>{{ line }}</p>
			</div>
		</div>
	</article>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { debouncer } from "@/classes/debouncer";
import { LyricsVerse } from "@/classes/lyrics";

// just set to false if you want to disable the feature, without removing code
const FIGHT_BROWSER_ZOOM = true;

export default defineComponent({
	name: "presentation-lyrics",
	data() {
		return {
			container: null as HTMLElement | null,
			element: null as HTMLElement | null,
			fontSize: 0,
			lineHeight: 0,
			margin: {
				top: 0,
				left: 0,
			},
		};
	},
	props: {
		verses: {
			type: Array as PropType<LyricsVerse[]>,
			required: true,
		},
		songId: {
			type: String,
		},
	},
	mounted() {
		this.container = this.$el;
		this.element = this.$refs.versesElement as HTMLDivElement;

		this.render();

		addEventListener("resize", debouncer.debounce(() => this.render(), 50));

		// prevent accidental zooming
		addEventListener("wheel", e => {
			e.preventDefault();
			return false;
		}, { passive: false });
	},
	// updated() {
	// 	this.render();
	// },
	watch: {
		songId() {
			setTimeout(this.render, 10);
		},
	},
	methods: {
		recalculatePixels(pixel: number): number {
			if (!FIGHT_BROWSER_ZOOM || pixel < 0.1) {
				return pixel;
			}

			// 1 means 100% zoom, if bigger, we need to reduce font size to fight the zoom
			const pixelRatio = window.devicePixelRatio;
			if (pixelRatio < 1.01) {
				return pixel;
			}

			const reducePixelRatio = pixelRatio - 1; // get increase ratio (110% - 10% increased and should be reduced)

			// multiply pixel with ratio - remove 10% from pixel. And remove 10% from the result again because it worked in tests..
			const reduce = (pixel * reducePixelRatio) * (1 - reducePixelRatio);

			return pixel - reduce;
		},
		setProperties() {
			if (!this.container || !this.element) return;

			this.container.style.fontSize = `${this.recalculatePixels(this.fontSize)}px`;
			this.container.style.lineHeight = `${this.lineHeight}`;
			this.element.style.marginTop = `${this.recalculatePixels(this.margin.top)}px`;
			this.element.style.marginLeft = `${this.recalculatePixels(this.margin.left)}px`;
		},
		calculateFontSize() {
			if (!this.container) return;

			const rect = this.container.getBoundingClientRect();

			this.fontSize = (Math.min(rect.height / this.verseLines.length / 8 * 1.4, 32)) + 32;
		},
		calculateLineHeight() {
			this.lineHeight = Math.min(3 / this.verseLines.length, 0.25) + 1.25;
		},
		calculateWhitespace() {
			if (!this.container) return;

			const rect = this.container.getBoundingClientRect();
			this.margin.left = (rect.width / (this.longestLine?.length / 8)) / (this.verseLines.length > 10 ? 1 : 1.5);
			this.margin.top = rect.height / (this.verseLines?.length * 1.5);
		},
		render() {
			this.calculateFontSize();
			this.calculateLineHeight();
			this.calculateWhitespace();

			this.setProperties();
		},
	},
	computed: {
		verseLines() {
			return this.verses.reduce((prev, cur) => [...prev, ...cur.content], [] as string[]);
		},
		longestLine(): string {
			const lines = this.verseLines;
			return lines.sort((a, b) => b.length - a.length)[0];
		},
	},
});
</script>

<style>
#presentation-lyrics {
	flex-grow: 1;
	overflow-y: hidden;
	caret-color: transparent;
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
