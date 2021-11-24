<template>
    <BaseCard>
        <template #header>
            <div class="flex gap-4 items-center justify-between">
                <h3 class="font-bold">
                    {{ $t("song_viewer") }}
                </h3>
                <span class="tracking-wider text-xs py-1 px-2 rounded text-green-600 bg-green-500/20">BETA</span>
            </div>
        </template>
        <div class="flex flex-col items-center gap-2 py-4">
            <BaseButton
                theme="primary"
                @click="$emit('open')"
            >
                {{ $t("song_openviewer") }}
            </BaseButton>
            <BaseButton
                theme="tertiary"
                @click="$emit('refresh')"
            >
                <template #icon>
                    <RefreshIcon class="w-4 h-4" />
                </template>
                {{ $t("song_updateviewer") }}
            </BaseButton>
            <BaseButton
                theme="tertiary"
                @click="$emit('mute')"
            >
                {{ $t("mute") }}
            </BaseButton>
        </div>
        <template #footer>
            <h4 class="tracking-wider uppercase text-xs opacity-50 mb-2">
                {{ $t("song_controlpanel") }}
            </h4>
            <div class="flex gap-2">
                <BaseButton
                    class="flex-grow"
                    @click="$emit('previous')"
                    theme="secondary"
                >
                    <template #icon>
                        <ArrowSmLeftIcon class="w-4 h-4" />
                    </template>
                    {{ $t("common_previous") }} {{ $t('song_verse').toLocaleLowerCase() }}
                </BaseButton>
                <BaseButton
                    class="flex-grow"
                    @click="$emit('next')"
                    theme="secondary"
                >
                    <template #icon>
                        <ArrowSmRightIcon class="w-4 h-4" />
                    </template>
                    {{ $t("common_next") }} {{ $t('song_verse').toLocaleLowerCase() }}
                </BaseButton>
            </div>
        </template>
    </BaseCard>
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
        "mute",
    ],
})
export default class PresentationControlPanel extends Vue {
}
</script>
