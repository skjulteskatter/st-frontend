<template>
    <BaseButton @click="show = !show" class="mb-2">{{translation?.title ?? $t('common_translation')}}</BaseButton>
    <Modal :show="show" @close="show = false">
        <CheckboxList
            v-if="checkboxData"
            :items="checkboxData"
            :title="$t('common_language')"
            @change="checkboxData = checkboxData"
        />
        <div class="mb-2" v-for="translation in Translations" :key="translation.id">
            <TranslationCard 
                class="cursor-pointer"
                :translation="translation" 
                @click="setTranslation(translation)"
            />
        </div>
    </Modal>
</template>
<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import Translation from "@/classes/scriptures/translation";
import { CheckboxList } from "@/components/inputs";
import TranslationCard from "./TranslationCard.vue";
import { BaseModal } from "@/components";

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
        Modal: BaseModal,
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
    },
    methods: {
        setTranslation(translation: Translation) {
            this.$emit("setTranslation", translation);
            this.show = false;
        },
    },
});
</script>
