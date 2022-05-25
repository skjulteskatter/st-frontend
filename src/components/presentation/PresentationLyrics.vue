<template>
	<article id="presentation-lyrics">
		<div id="verses" ref="versesElement">
			<div
				class="relative verse"
				v-for="(verse, i) in verses"
				:key="i"
				:class="{ 'pl-12 border-l-4 border-gray-500': verse.type == 'chorus' }"
			>
				<span class="absolute verse-name" v-if="verse.type != 'chorus'">{{ verse.name }}</span>
				<p
					class="line"
					:class="{ 'opacity-50 text-[0.5em]': line.trim().startsWith('(') && line.trim().endsWith(')') }"
					v-for="(line, i) in verse.content"
					:key="i + '_' + line"
				>{{ line }}</p>
			</div>
		</div>
		<!-- <button style="position: absolute" @click="render">RENDER</button> -->
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
			expanded: false,
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
		longestLine: {
			type: String,
			required: true,
		},
		longestLineLength: {
			type: Number,
			required: true,
		},
		verseLineLength: {
			type: Number,
			required: true,
		},
		verseLines: {
			type: Array as PropType<string[]>,
			required: true,
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
			this.element.style.transform = this.expanded ? "scale(1.15,1)" : "";
		},
		calculateFontSize() {
			if (!this.container) return;

			
		},
		calculateLineHeight() {
			this.lineHeight = Math.min(4 / this.verseLineLength, 0.5) + 1;
		},
		calculateWhitespace() {
			if (!this.container) return;

			const rect = this.container.getBoundingClientRect();
			const linefactor = (300 - this.longestLineLength) / 300;
			this.margin.left = 10 + ((rect.width / (this.longestLineLength / 8)) / (this.verseLineLength > 10 ? 1 : 1.5)) * linefactor;
			this.margin.top = rect.height / (this.verseLineLength * 3);
		},
		render() {
			const rect = this.container?.getBoundingClientRect();
			if (!rect) return;

			const widthSize = (rect.width) / (this.longestLineLength / 1.65);
			const heightSize = (rect.height - 100) / (this.verseLineLength * 1.3);

			console.log("WidthSize: " + widthSize);
			console.log("HeightSize: " + heightSize);

			this.fontSize = Math.min(Math.min(widthSize, heightSize), 70);
			this.margin.left = 20 + (rect.width / (this.longestLine.length / 4));
			this.margin.top = 10 + (rect.height / (this.verseLineLength * 3));

			this.expanded = this.verseLineLength > 10;
			if (this.expanded) {
				this.margin.left = this.margin.left * 2;
			}

			this.calculateLineHeight();
			// this.calculateFontSize();

			this.setProperties();
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
