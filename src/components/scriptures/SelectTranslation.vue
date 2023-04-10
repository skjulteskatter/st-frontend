<template>
    <button @click="show = !show" :title="$t('common_translation')">
        {{translation?.title ?? $t('common_translation')}}
    </button>
    <Modal
        :show="show" 
        @close="show = false"
    >
        <template #title>
            <small class="opacity-50 uppercase text-xs tracking-wider mb-1">{{ $t("common_language") }}</small>
            <BaseDropdown>
                <template #button>
                    <button class="px-3 py-2 rounded-md border border-black/20 flex gap-4 items-center">
                        <span v-if="selectedLanguagesString">{{ selectedLanguagesString }}</span>
                        <span v-else>Select language</span>
                        <span class="opacity-50 text-sm" v-if="additionalSelections">{{ additionalSelections }}</span>
                        <ChevronDownIcon class="w-5 h-5" />
                    </button>
                </template>
                <CheckboxList
                    v-if="checkboxData"
                    :items="checkboxData"
                    :title="$t('common_language')"
                    @change="checkboxData = checkboxData"
                />
            </BaseDropdown>
        </template>
        <div class="md:w-80 w-full">
            <div class="flex flex-col gap-2">
                <template v-for="translation in Translations" :key="translation.id">
                    <TranslationCard
                        :translation="translation"
                        @click="setTranslation(translation)"
                    />
                </template>
            </div>
        </div>
    </Modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Translation from "@/classes/scriptures/translation";
import { CheckboxList, BaseDropdown } from "@/components/inputs";
import TranslationCard from "./TranslationCard.vue";
import { BaseModal } from "@/components";
import { ChevronDownIcon } from "@heroicons/vue/outline";
import type { ILocale, Language } from "songtreasures";

type CheckboxData = {
    key: string;
    label: string;
    value: boolean;
}

export default defineComponent({
    name: "select-translation",
    components: {
        CheckboxList,
        BaseDropdown,
        TranslationCard,
        Modal: BaseModal,
        ChevronDownIcon,
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
    mounted() {
        if (!this.translation) {
            this.show = true;
        }
    },
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
        selectedLanguagesString() {
            const strings = this.checkboxData.filter(c => c.value === true).map(c => c.label).slice(0, 2);
            return strings.join(", ");
        },
        additionalSelections() {
            const count = this.checkboxData.filter(c => c.value === true).length - 2;
            return count > 0 ? `+${count} more` : "";
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
