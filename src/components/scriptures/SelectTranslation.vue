<template>
    <div>
        <div class="flex flex-col gap-2 mb-2" v-if="languages">
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
                    class="border-gray-300 rounded text-primary focus:ring-primary"
                />
                {{ l.name }}
            </label>
        </div>
        <div class="mb-2" v-for="translation in Translations" :key="translation.id">
            <base-button @click="setTranslation(translation)">{{translation.title}} | {{translation.language}}</base-button>
        </div>
    </div>
</template>
<script lang="ts">
import Translation from "@/classes/scriptures/translation";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "select-translation",
    props: {
        translations: {
            type: Array,
        },
        languages: {
            type: Array,
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
    private translations?: Translation[];
    public languages?: Language[];
    public filterOnLanguages?: ILocale<boolean>;

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
    }
}
</script>
