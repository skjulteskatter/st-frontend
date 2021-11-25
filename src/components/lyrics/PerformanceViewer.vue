<template>
    <div
        v-if="lyrics"
        class="performance-viewer"
    >
        <div class="song">
            <VerseView 
                v-for="(v, i) in currentVerses"
                :key="i"
                :verse="v"
            />
        </div>
        <div class="flex gap-2 mt-4">
            <BaseButton @click="previous">
                <template #icon>
                    <ArrowLeftIcon class="w-4 h-4" />
                </template>
                {{ $t('common_previous') }}
            </BaseButton>
            <BaseButton @click="next">
                <template #icon>
                    <ArrowRightIcon class="w-4 h-4" />
                </template>
                {{$t('common_next')}}
            </BaseButton>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { Lyrics } from "@/classes";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/vue/solid";
import VerseView from "./VerseView.vue";

export default defineComponent({
    name: "performance-viewer",
    props: {
        lyrics: {
            type: Object as PropType<Lyrics>,
        },
    },
    components: {
        ArrowRightIcon,
        ArrowLeftIcon,
        VerseView,
    },
    data: () => ({
        currentVerseIndex: 0,
        length: 0,
        size: 2,
    }),
    mounted() {
        if (this.lyrics) {
            this.length = this.lyrics.performanceView.length ?? 0;
            this.size = this.lyrics.performanceView[0].content.length > 5 ? 1 : 2;
        }
        window.addEventListener("keydown", this.eventListener);
    },
    unmounted() {
        window.removeEventListener("keydown", this.eventListener);
    },
    computed: {
        currentVerses() {
            return this.lyrics?.performanceView.slice(this.currentVerseIndex, this.currentVerseIndex + this.size) ?? [];
        },
    },
    methods: {
        eventListener(e: KeyboardEvent) {
           if (e.key === "ArrowLeft") {
                this.previous();
            }
            if (e.key === "ArrowRight") {
                this.next();
            }
        },
        next() {
            if (this.currentVerseIndex < this.length - this.size)
                this.currentVerseIndex += this.size;
        },
        previous() {
            if (this.currentVerseIndex > 0)
                this.currentVerseIndex -= this.size;
        },
    },
});
</script>
