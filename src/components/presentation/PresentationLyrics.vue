<template>
	<article id="presentation-lyrics">
		<div id="verses" ref="versesElement">
			<p v-if="verses.length === 1 && (verseLineLength - 1) > verses[0].content.length" class="line opacity-0">.</p>
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

			if (this.expanded) {
				const scale = this.verseLineLength % 10 * 0.02;
				this.element.style.transform = "scale(" + (1 + scale) + ",1)";
			}
		},
		calculateLineHeight() {
			const rect = this.container?.getBoundingClientRect();
			if (!rect) {
				return;
			}
			this.lineHeight = Math.min(1.5, (rect.height - this.margin.top) / (this.fontSize * this.verseLineLength));
		},
		render() {
			const rect = this.container?.getBoundingClientRect();
			if (!rect) return;

			const rectHeight = rect.height * 0.95;
			const rectWidth = rect.width * 0.95;

			// this.expanded = this.verseLineLength > 10 && this.longestLineLength < 40;

			const widthSize = (rectWidth) / (this.longestLineLength / 1.8);
			const heightSize = (rectHeight - 100) / (this.verseLineLength * 1.3);

			// eslint-disable-next-line no-console
			console.log("WidthSize: " + widthSize);
			// eslint-disable-next-line no-console
			console.log("HeightSize: " + heightSize);

			this.fontSize = Math.min(Math.min(widthSize, heightSize), 70);

			this.margin.left = Math.min(rectWidth * 0.2, (rectWidth - (this.fontSize / 2.2 * this.longestLineLength)) / 2 * 1.05);
			// if (this.expanded) {
			// 	this.margin.left = this.margin.left * 3
			// }
			this.margin.top = (rectHeight / (this.verseLineLength * 2)) * 1.05;

			this.calculateLineHeight();

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
