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
import { Options, Vue } from "vue-class-component";
import { Lyrics } from "@/classes";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/vue/solid";
import VerseView from "./VerseView.vue";

@Options({
    name: "performance-viewer",
    props: {
        lyrics: {
            type: Object,
        },
    },
    components: {
        ArrowRightIcon,
        ArrowLeftIcon,
        VerseView,
    },
})
export default class TransposedLyricsViewer extends Vue {
    private currentVerseIndex = 0;
    private length = 0;
    private size = 2;
    public lyrics?: Lyrics;

    private eventListener = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") {
            this.previous();
        }
        if (e.key === "ArrowRight") {
            this.next();
        }
    }

    public mounted() {
        if (this.lyrics) {
            this.length = this.lyrics.performanceView.length ?? 0;
            this.size = this.lyrics.performanceView[0].content.length > 5 ? 1 : 2;
        }
        window.addEventListener("keydown", this.eventListener);
    }

    public unmounted() {
        window.removeEventListener("keydown", this.eventListener);
    }

    public get currentVerses() {
        return this.lyrics?.performanceView.slice(this.currentVerseIndex, this.currentVerseIndex + this.size) ?? [];
    }

    public next() {
        if (this.currentVerseIndex < this.length - this.size)
            this.currentVerseIndex += this.size;
    }

    public previous() {
        if (this.currentVerseIndex > 0)
            this.currentVerseIndex -= this.size;
    }
}
</script>
