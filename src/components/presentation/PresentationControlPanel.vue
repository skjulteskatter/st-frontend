<template>
    <div class="flex flex-col gap-4">
        <base-card>
            <template #header>
                <div class="flex gap-4 items-center justify-between">
                    <h3 class="font-bold">
                        {{ $t("song.viewer") }}
                    </h3>
                    <span class="tracking-wider text-xs py-1 px-2 rounded text-green-600 bg-green-500/20">BETA</span>
                </div>
            </template>
            <div class="flex flex-col items-center gap-2 py-4">
                <base-button
                    theme="primary"
                    @click="open()"
                >
                    {{ $t("song.openviewer") }}
                </base-button>
                <base-button
                    theme="tertiary"
                    @click="$emit('refresh')"
                >
                    <template #icon>
                        <RefreshIcon class="w-4 h-4" />
                    </template>
                    {{ $t("song.updateviewer") }}
                </base-button>
            </div>
            <template #footer>
                <h4 class="tracking-wider uppercase text-xs opacity-50 mb-2">
                    {{ $t("song.controlpanel") }}
                </h4>
                <div class="flex gap-2">
                    <base-button
                        class="flex-grow"
                        @click="$emit('previous')"
                        theme="secondary"
                    >
                        <template #icon>
                            <ArrowSmLeftIcon class="w-4 h-4" />
                        </template>
                        {{ $t("common.previous") }} {{ $t('song.verse').toLocaleLowerCase() }}
                    </base-button>
                    <base-button
                        class="flex-grow"
                        @click="$emit('next')"
                        theme="secondary"
                    >
                        <template #icon>
                            <ArrowSmRightIcon class="w-4 h-4" />
                        </template>
                        {{ $t("common.next") }} {{ $t('song.verse').toLocaleLowerCase() }}
                    </base-button>
                </div>
            </template>
        </base-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { RefreshIcon, ArrowSmLeftIcon, ArrowSmRightIcon } from "@heroicons/vue/solid";

@Options({
    components: {
        RefreshIcon,
        ArrowSmLeftIcon,
        ArrowSmRightIcon,
    },
    name: "presentation-controlpanel",
    emits: [
        "next",
        "previous",
        "refresh",
    ],
})
export default class PresentationControlPanel extends Vue {
    public open() {
        this.$emit("refresh");
        window.open("/presentation", "SongTreasures - Presentation View", "resizeable,scrollbars");
    }
}
</script>
