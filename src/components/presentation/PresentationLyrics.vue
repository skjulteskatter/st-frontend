<template>
	<article id="presentation-lyrics">
		<div id="verses" ref="versesElement">
			<div
				class="relative verse"
				v-for="(verse, i) in verses"
				:key="i"
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
import { defineComponent, PropType } from "vue";
import { debouncer } from "@/classes/debouncer";

export default defineComponent({
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
			type: Array as PropType<Verse[]>,
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
		setProperties() {
			if(!this.container || !this.element) return;

			this.container.style.fontSize = `${this.fontSize}px`;
			this.container.style.lineHeight = `${this.lineHeight}`;
			this.element.style.marginTop = `${this.margin.top}px`;
			this.element.style.marginLeft = `${this.margin.left}px`;
		},
		calculateFontSize() {
			if(!this.container) return;

			const rect = this.container.getBoundingClientRect();
			const size = Math.min(rect.width / this.verseLines.length / 8, 24) + 32;
			this.fontSize = size;
		},
		calculateLineHeight() {
			this.lineHeight = Math.min(3 / this.verseLines.length, 0.5) + 1;
		},
		calculateWhitespace() {
			if(!this.container) return;

			const rect = this.container.getBoundingClientRect();
			this.margin.left = rect.width / (this.longestLine?.length / 8);
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
			return lines.sort((a,b) => b.length - a.length)[0];
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
