<template>
    <BaseButton @click="show = !show" class="mb-2">Select Translation</BaseButton>
    <div v-if="show">
        <CheckboxList
            v-if="checkboxData"
            :items="checkboxData"
            :title="$t('common_language')"
            @change="checkboxData = checkboxData"
        />
        <div class="mb-2" v-for="translation in Translations" :key="translation.id">
            <TranslationCard :translation="translation" @click="setTranslation(translation)" />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import Translation from "@/classes/scriptures/translation";
import { CheckboxList } from "@/components/inputs";
import TranslationCard from "./TranslationCard.vue";

type CheckboxData = {
    key: string;
    label: string;
    value: boolean;
}

export default defineComponent({
    name: "select-translation",
    components: {
        CheckboxList,
        TranslationCard,
    },
    props: {
        translation: {
            type: Object as PropType<Translation>,
        },
        translations: {
            type: Array as PropType<Translation[]>,
            required: true,
        },
        languages: {
            type: Array as PropType<Language[]>,
            required: true,
        },
        filterOnLanguages: {
            type: Object as PropType<ILocale<boolean>>,
        },
    },
    data: () => ({
        show: false,
    }),
    emits: [
        "setTranslation",
    ],
    computed: {
        checkboxData: {
            get() {
                return this.languages?.map(l => ({
                    key: l.key,
                    label: l.name,
                    value: this.FilterOnLanguages[l.key] === true,
                })) ?? [];
            },
            set(v: CheckboxData[]) {
                for (const data of v) {
                    this.FilterOnLanguages[data.key] = data.value;
                }
            },
        },
        FilterOnLanguages() {
            return this.filterOnLanguages ?? {};
        },
        Translations() {
            return this.translations?.filter(i => this.FilterOnLanguages[i.language] === true) ?? [];
        },
    },
    methods: {
        setTranslation(translation: Translation) {
            this.$emit("setTranslation", translation);
            this.show = false;
        },
    },
});
</script>
