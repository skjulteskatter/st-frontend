<template>
    <div>
        <h1 class="text-xl">
            Tools
        </h1>
        <div class="grid grid-cols-4 gap-4">
            <BaseCard class="col-span-2">
                <template #header>Subtitles</template>
                <select 
                    v-model="collectionId"
                    class="mb-2"
                >
                    <option 
                        :value="collection.id" 
                        v-for="collection in collections" 
                        :key="collection.id"
                    >
                        {{collection.name.default}}
                    </option>
                </select>
                <input v-model="codepage" class="mb-2" type="number" placeholder="Codepage"/>
                <BaseButton 
                    @click="showCustomFiles = !showCustomFiles"
                    class="mb-2"
                >
                    Custom Files
                </BaseButton>
                <div class="mb-2" v-for="language in languages" :key="language.key">
                    <Checkbox class="cursor-pointer select-none" v-model="includeLanguages[language.key]"><h3>{{language.name}}</h3></Checkbox>
                    <FileSelector v-if="showCustomFiles" @files="(files) => setFiles(language, files)"/>
                </div>
                <template #footer>
                    <BaseButton 
                        @click="downloadSubtitles" 
                        :loading="loading"
                        class="mb-2 float-right"
                    >
                        Download
                    </BaseButton>
                </template>
            </BaseCard>
        </div>
    </div>
</template>
<script lang="ts">
import { Collection } from "@/classes";
import { FileSelector } from "@/components/tools";
import api from "@/services/api";
import { appSession } from "@/services/session";
import { defineComponent } from "@vue/runtime-core";
import { Language } from "songtreasures";
import BaseButton from "../components/BaseButton.vue";
import Checkbox from "../components/inputs/Checkbox.vue";
import BaseCard from "../components/BaseCard.vue";

type CustomLyrics = {
    [key: string]: {
        [key: number]: string;
    }
}

export default defineComponent({
    name: "tools-view",
    components: {
    FileSelector,
    BaseButton,
    Checkbox,
    BaseCard,
},
    data() {
        return {
            customLyrics: {} as CustomLyrics,
            collectionId: null as string | null,
            loading: false,
            includeLanguages: {} as {[key: string]: boolean},
            codepage: null as number | null,
            showCustomFiles: false,
        };
    },
    mounted() {
        this.includeLanguages = this.languages.reduce((a, b) => {
            a[b.key] = true;
            return a;
        }, {} as {[key: string]: boolean});

        this.collectionId = this.collections.find(c => c.keys["no"] === "HV")?.id ?? null;
    },
    computed: {
        languages(): Language[] {
            return appSession.languages.filter(l => ["no", "de", "nl", "en", "fr", "ro", "es", "pl"].includes(l.key));
        },
        collections(): Collection[] {
            return appSession.collections.filter(c => c.enabled && c.type === "song");
        },
    },
    methods: {
        async setFiles(language: Language, files: FileList | null) {
            this.customLyrics[language.key] = {};

            if (files) {
                for (const file of files) {
                    const number = parseInt(file.name.replace(".txt", ""));
                    this.customLyrics[language.key][number] = await file.text();
                }
            }
        },
        async downloadSubtitles() {
            if (this.collectionId) {
                this.loading = true;
                const zip = await api.admin.exportSubtitles(this.collectionId, 
                    this.codepage ?? undefined, 
                    Object.entries(this.includeLanguages)
                    .filter((e) => e[1])
                    .map(([key]) => key), this.customLyrics);
                const blob = new Blob([zip], {type: "application/zip"});
                const a = document.createElement("a"), url = URL.createObjectURL(blob);
                a.href = url;
                a.download = `${this.collections.find(c => c.id === this.collectionId)?.name.default}.zip`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.removeChild(a);
                    window.URL.revokeObjectURL(url);
                });
                this.loading = false;
            }
        },
    },
});
</script>
