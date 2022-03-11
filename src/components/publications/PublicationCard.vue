<script setup lang="ts">
import { ArrowSmRightIcon } from "@heroicons/vue/solid";
import { Publication } from "hiddentreasures-js";

interface Props {
    publication: Publication;
}

interface Emits {
    (event: "clicked"): void;
}

defineProps<Props>();

const emit = defineEmits<Emits>();

function onClick() {
    emit("clicked");
}
</script>

<template>
    <div>
        <BaseCard class="mb-4">
            <div class="flex justify-between items-center">
                <h2>{{ publication.title }}</h2>
                <BaseButton @click="onClick" theme="secondary">
                    {{ $t("common_readHere") }}
                    <template #icon>
                        <ArrowSmRightIcon class="w-4 h-4" />
                    </template>
                </BaseButton>
            </div>
        </BaseCard>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "publication-card",
});
</script>
