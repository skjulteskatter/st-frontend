<template>
    <BaseCard class="overflow-visible">
        <template #header>
            <div class="flex gap-4 items-center">
                <h3 class="font-bold">{{ $t("presentation_chooseVerses") }}</h3>
                <button aria-label="Toggle all verses" @click="toggleAll" class="text-sm rounded-md bg-black/10 hover:bg-black/20 px-3 py-1 flex gap-2 items-center focus-visible:ring-2 focus-visible:ring-primary">
                    <CheckCircleIcon class="w-4 h-4" v-if="!unset" />
                    <MinusCircleIcon class="w-4 h-4" v-else />
                    {{ $t('presentation_toggleAllVerses') }}
                </button>
                <span class="ml-auto px-2 py-1 rounded bg-green-500/20 text-green-600 tracking-wider text-xs">BETA</span>
            </div>
        </template>
        <div class="flex flex-col gap-4">
            <div
                class="rounded w-full cursor-pointer whitespace-pre-line hover:bg-black/5 dark:hover:bg-white/10 p-2"
                v-for="(verse, i) in Text"
                :key="verse.name + verse.content[0] + i"
                :class="{
                    'ring-1 ring-primary bg-primary/10': currentVerses?.includes((i + 1).toString()),
                    'bg-red-500/10': !availableVerses?.includes((i + 1).toString()),
                }"
                @click="$emit('toggle', (i + 1).toString())"
            >
                <b class="text-sm mb-1 flex items-center gap-2">
                    <CheckCircleIcon v-if="availableVerses?.includes((i + 1).toString())" class="w-5 h-5 text-green-500" />
                    <MinusCircleIcon v-else class="w-5 h-5 text-red-500" />
                    {{ verse.name }}
                </b>
                <p
                    class="leading-7"
                    :class="{ 'opacity-50 italic': !availableVerses?.includes((i + 1).toString()) }"
                >{{ verse.content.join("\n") }}</p>
            </div>
        </div>
    </BaseCard>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { CheckCircleIcon } from "@heroicons/vue/solid";
import { MinusCircleIcon } from "@heroicons/vue/outline";

type Text = {
    name: string;
    content: string[];
}

export default defineComponent({
    name: "lyrics-card",
    components: {
        CheckCircleIcon,
        MinusCircleIcon,
    },
    props: {
        text: {
            type: Array as PropType<Text[]>,
        },
        availableVerses: {
            type: Array as PropType<string[]>,
        },
        currentVerses: {
            type: Array as PropType<string[]>,
        },
    },
    emits: [
        "toggleAll",
        "toggle",
        "mounted",
    ],
    data: () => ({
        unset: false,
    }),
    computed: {
        Text() {
            return this.text ?? [];
        },
    },
    mounted() {
        this.$emit("mounted");
    },
    methods: {
        toggleAll() {
            this.$emit("toggleAll");
            this.unset = !this.unset;
        },
    },
});
</script>
