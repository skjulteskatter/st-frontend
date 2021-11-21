<template>
    <BaseButton @click="show = !show" class="mb-2">Select Translation</BaseButton>
    <div v-if="show">
        <CheckboxList
            v-if="checkboxData"
            :items="checkboxData"
            :title="$t('common_language')"
            @change="checkboxData = checkboxData"
        />

        <!-- <div class="flex flex-col gap-2 mb-2" v-if="languages">
            <label class="font-bold">
                {{ $t('common_language') }}
            </label>
            <label
                class="flex items-center gap-2"
                v-for="l in languages"
                :key="l"
            >
                <input
                    v-model="FilterOnLanguages[l.key]"
                    type="checkbox"
                    :name="l.name"
                    class="border-gray-300 rounded text-primary focus-visible:ring-primary"
                />
                {{ l.name }}
            </label>
        </div> -->
        <div class="mb-2" v-for="translation in Translations" :key="translation.id">
            <TranslationCard :translation="translation" @click="setTranslation(translation)" />
        </div>
    </div>
</template>
<script lang="ts">
import Translation from "@/classes/scriptures/translation";
import { Options, Vue } from "vue-class-component";
import { CheckboxList } from "@/components/inputs";
import TranslationCard from "./TranslationCard.vue";

@Options({
    name: "select-translation",
    components: {
        CheckboxList,
        TranslationCard,
    },
    props: {
        translation: {
            type: Object,
        },
        translations: {
            type: Array,
            required: true,
        },
        languages: {
            type: Array,
            required: true,
        },
        filterOnLanguages: {
            type: Object,
        },
    },
    emits: [
        "setTranslation",
    ],
})
export default class SelectTranslation extends Vue {
    public show = false;

    public translation?: Translation;
    private translations?: Translation[];
    public languages?: Language[];
    public filterOnLanguages?: ILocale<boolean>;

    mounted() {
        // this.checkboxData = [];

        // for (const language of this.languages ?? []) {
        //     this.checkboxData.push({
        //         key: language.key,
        //         label: language.name,
        //         value: this.filterOnLanguages?.[language.key] === true,
        //     });
        // }
    }

    public get checkboxData() {
        return this.languages?.map(l => {
            return {
                key: l.key,
                label: l.name,
                value: this.FilterOnLanguages[l.key] === true,
            };
        }) ?? [];
    }

    public set checkboxData(v) {
        for (const data of v) {
            this.FilterOnLanguages[data.key] = data.value;
        }
    }
    public get FilterOnLanguages() {
        return this.filterOnLanguages ?? {};
    }

    public set FilterOnLanguages(v) {
        this.filterOnLanguages = v;
    }

    public get Translations() {
        return this.translations?.filter(i => this.FilterOnLanguages[i.language] === true) ?? [];
    }

    public setTranslation(translation: Translation) {
        this.$emit("setTranslation", translation);
        this.show = false;
    }
}
</script>
