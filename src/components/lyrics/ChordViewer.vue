<template>
	<div class="relative" v-if="chord" @mouseleave="hideChordViewer">
		<span class="chord-title cursor-pointer" @click="showChordViewer" ref="chordSpan">{{chord}}</span>
		<span>&nbsp;</span>
		<div class="opacity-0 h-48 absolute select-none -z-20 origin-bottom bottom-full mb-2" ref="mockupChordViewer"/>
		<TransitionRoot
			:show="open"
			as="div"
			class='select-none absolute bg-white rounded-md shadow -translate-x-1/2 border-2 border-secondary dark:border-primary z-10 origin-bottom'
			:class="{ 'bottom-full mb-2': !flip, 'top-full mt-2': flip }"
			enter="transition duration-100 ease-out"
			enter-from="opacity-0"
			enter-to="opacity-100 translate-y-0"
			leave="transition duration-50 ease-in"
			leave-from="opacity-100"
			leave-to="opacity-0"
			:style="{ 'left': halfOffesetWidth + 'px' }"
			>

			<span
				class="bg-secondary w-2 h-2 rotate-45 absolute dark:bg-primary left-1/2 -translate-x-1/2 -z-10"
				:class="{'-bottom-1' : !flip, 'bottom-full -top-1' : flip}"
			></span>
			<div :class="{'px-2 py-4 bg-white rounded-lg' : isLoading}">
				<Loader :loading="isLoading" position="local">
					<div class="flex flex-col">
						<div v-html="currentImage" class="font-bold" :class="{'order-1' : !flip, 'order-3 mb-3 -translate-y-2' : flip}"></div>
						<span class="flex justify-between items-center bg-white rounded-lg order-2">
							<button aria-label="Previous" @click="changeChordIndex(-1)" class="cursor-pointer p-1 rounded hover:bg-black/5">
								<ChevronLeftIcon class="h-5 w-5 fill-secondary"/>
							</button>
							<small class="text-black font-normal whitespace-nowrap">{{currentChordIndex+1}}/{{chordObject.imageArray.length}}</small>
							<button aria-label="Next" @click="changeChordIndex(1)" class="cursor-pointer p-1 rounded hover:bg-black/5">
								<ChevronRightIcon class="h-5 w-5 fill-secondary"/>
							</button>
						</span>
						<div class='bg-red-600 opacity-0 w-full h-4 py-1 z-20 absolute'
							:class="{'bottom-full' : flip, 'top-full' : !flip }"
						></div>
					</div>
				</Loader>
			</div>
		</TransitionRoot>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { TransitionRoot } from "@headlessui/vue";
import { chords } from "@/services/api";
import { IChord } from "songtreasures-api";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/vue/solid";

export default defineComponent({
	name: "chordtooltip-component",
	props: {
		text: {
			type: String,
			required: true,
		},
		chord: {
			type: String,
			required: true,
		},
	},
	components: {
		TransitionRoot,
		ChevronRightIcon,
		ChevronLeftIcon,
	},
	data: () => ({
		open: false,
		flip: false,
		chordObject: {imageArray: [], chordName: "", instrument: ""} as IChord,
		chordId: "",
		currentChordIndex: 0,
		chordSpan: undefined as HTMLElement | undefined,
		mockupChordViewer: undefined as HTMLElement | undefined,
	}),
	computed: {
		currentImage() {
			return this.chordObject.imageArray[this.currentChordIndex];
		},
		isLoading() {
			return this.chordObject.imageArray.length <= 0;
		},
		halfOffesetWidth() : number{
			return this.chordSpan !== undefined ? this.chordSpan.offsetWidth / 2 : 0;
		},
	},
	mounted() { 
		let triesLeft = 10;
		const interval = setInterval(() => {
			let chordSpan = this.chordSpan ?? this.$refs.chordSpan as HTMLElement;
			let mockupChordViewer = this.mockupChordViewer ?? this.$refs.mockupChordViewer as HTMLElement;

			this.chordSpan = chordSpan;
			this.mockupChordViewer = mockupChordViewer;

			let chordSpanExist = chordSpan !== undefined && chordSpan.offsetWidth !== undefined;
			let mockupChordViewerExist = mockupChordViewer !== undefined && mockupChordViewer.offsetHeight !== undefined;

			((chordSpanExist && mockupChordViewerExist) || triesLeft === 0) && clearInterval(interval);

			triesLeft--;
		}, 50);
	},
	methods: {
		async showChordViewer(e: MouseEvent) {
			if (this.open === true){
				await this.hideChordViewer();
				return;
			}

			this.currentChordIndex = 0;
			//this.flip = (e.clientY < 310);
			this.flip = this.mockupChordViewer ? this.mockupChordViewer.getBoundingClientRect().top < 64 : false;
			this.open = true;
			const chordWithIndex = await this.getChordObject(this.$props.chord);
			if (chordWithIndex == null) {
				this.open = false;
				return;
			}
			this.chordObject = chordWithIndex;
		},
		async hideChordViewer() {
			if (!this.open) return;
			this.open = false;
		},
		async getChordObject(chordName: string): Promise<IChord> {
			const chord = await chords.get(chordName.replaceAll("/","over").replaceAll("#", "sharp"));
			return chord;
		},
		async changeChordIndex(i: number){
			let placeholderIndex = this.currentChordIndex;
			placeholderIndex += i;
			if(placeholderIndex < 0 || placeholderIndex >= this.chordObject.imageArray.length){
				placeholderIndex += (-i * this.chordObject.imageArray.length);
			}
			this.currentChordIndex = placeholderIndex;
		},
	},
});
</script>
