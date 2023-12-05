<template>
    <div>
        <h1 class="text-xl">Tools</h1>
        <div class="grid grid-cols-4 gap-4">
            <BaseCard class="col-span-2">
                <template #header>Subtitles</template>
                <select v-model="collectionId" class="mb-2">
                    <option
                        :value="collection.id"
                        v-for="collection in collections"
                        :key="collection.id"
                    >
                        {{ collection.name.default }}
                    </option>
                </select>
                <input
                    v-model="codepage"
                    class="mb-2"
                    type="number"
                    placeholder="Codepage"
                />
                <BaseButton
                    @click="showCustomFiles = !showCustomFiles"
                    class="mb-2"
                >
                    Custom Files
                </BaseButton>
                <!-- <div
                    class="mb-2"
                    v-for="language in languages"
                    :key="language.key"
                >
                    <Checkbox
                        class="cursor-pointer select-none"
                        v-model="includeLanguages[language.key]"
                        ><h3>{{ language.name }}</h3></Checkbox
                    >
                    <FileSelector
                        v-if="showCustomFiles"
                        @files="(files) => setFiles(language, files)"
                    />
                </div> -->
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
            <BaseCard class="col-span-2">
                <template #header> Credits </template>
                <select v-model="collectionIdCredits" class="mb-2">
                    <option
                        :value="collection.id"
                        v-for="collection in collections"
                        :key="collection.id"
                    >
                        {{ collection.name.default }}
                    </option>
                </select>
                <template #footer>
                    <BaseButton
                        @click="downloadCredits"
                        :loading="loadingCreds"
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
import { defineComponent } from "vue";
import { Language } from "songtreasures";
import BaseButton from "../components/BaseButton.vue";
import Checkbox from "../components/inputs/Checkbox.vue";
import BaseCard from "../components/BaseCard.vue";
import songService from "@/services/songs/songService";
import contributorService from "@/services/contributorService";
import collectionService from "@/services/collectionService";
import copyrightService from "@/services/songs/copyrightService";
import { addAbortSignal } from "stream";

type CustomLyrics = {
    [key: string]: {
        [key: number]: string;
    };
};

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
            collectionIdCredits: null as string | null,
            loading: false,
            includeLanguages: {} as { [key: string]: boolean },
            codepage: null as number | null,
            showCustomFiles: false,
            loadingCreds: false,
        };
    },
    mounted() {
        this.includeLanguages = this.languages.reduce((a, b) => {
            a[b.key] = true;
            return a;
        }, {} as { [key: string]: boolean });

        this.collectionId = this.collectionIdCredits =
            this.collections.find((c) => c.keys["no"] === "HV")?.id ?? null;
    },
    computed: {
        languages(): Language[] {
            return appSession.languages.filter((l) =>
                ["no", "de", "nl", "en", "fr", "ro", "es", "pl"].includes(l.key)
            );
        },
        collections(): Collection[] {
            return appSession.collections.filter(
                (c) => c.enabled && c.type === "song"
            );
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
                const zip = await api.admin.exportSubtitles(
                    this.collectionId,
                    this.codepage ?? undefined,
                    Object.entries(this.includeLanguages)
                        .filter((e) => e[1])
                        .map(([key]) => key),
                    this.customLyrics
                );
                const blob = new Blob([zip], { type: "application/zip" });
                const a = document.createElement("a"),
                    url = URL.createObjectURL(blob);
                a.href = url;
                const d = new Date();
                a.download = `${d.getFullYear()}${d
                    .getMonth()
                    .toString()
                    .padStart(2, "0")}${d
                    .getDay()
                    .toString()
                    .padStart(2, "0")} - ${
                    this.collections.find((c) => c.id === this.collectionId)
                        ?.name.default
                } - CP${this.codepage}.zip`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.removeChild(a);
                    window.URL.revokeObjectURL(url);
                });
                this.loading = false;
            }
        },
        async downloadCredits() {
            if (!this.collectionIdCredits) {
                return;
            }
            this.loadingCreds = true;
            const collection = await collectionService.get(
                this.collectionIdCredits
            );
            const songs = (await songService.childrenOf(collection.id)).sort(
                (a, b) => {
                    return (
                        (a.collections[0].number ?? 0) -
                        (b.collections[0].number ?? 0)
                    );
                }
            );
            const contributors = await contributorService.list();
            const copyrights = await copyrightService.list();

            let csv = "Number;Title;Authors;Composers;Year Written;Copyright\n";
            for (const song of songs) {
                const parts: (string | number)[] = [];

                parts.push(song.collections[0].number ?? "");
                parts.push(song.title);

                const getContributorCsv = (type: string) => {
                    let conCsv = "";
                    const cons = song.participants
                        .filter((p) => p.type === type)
                        .map(
                            (i) =>
                                contributors.find(
                                    (c) => c.id === i.contributorId
                                )?.name ?? ""
                        );
                    if (cons) {
                        if (cons.length > 1) {
                            conCsv +=
                                cons.slice(0, cons.length - 1).join(", ") +
                                    " & " +
                                    cons[cons.length - 1] ?? "";
                        } else {
                            conCsv += cons[0] ?? "";
                        }
                    } else {
                        if (type === "composer") {
                            const origin = song.origins.find(
                                (i) => i.type === "melody"
                            )?.description;
                            conCsv += origin ?? "";
                        }
                    }
                    return conCsv;
                };
                parts.push(getContributorCsv("author"));
                if (!song.participants.some((i) => i.type === "composer")) {
                    const origin = song.origins.find(
                        (i) => i.type === "melody"
                    )?.description;
                    parts.push(origin ?? "");
                } else {
                    parts.push(getContributorCsv("composer"));
                }
                // csv += getContributorCsv("arranger")
                parts.push(song.yearWritten ?? "");
                // if (song.yearComposed) {
                //     csv += song.yearComposed + ";"
                // }
                const filterCopyrights = [
                    "f8ca2745-72d6-4082-9be9-e39bb90567fb",
                    "e627e22a-a621-4377-aaa6-886e3437b5fc",
                ];

                const textCopyright = song.copyrights.find(
                    (t) =>
                        t.type === "text" &&
                        filterCopyrights.includes(t.referenceId)
                );
                const melodyCopyright = song.copyrights.find(
                    (c) =>
                        c.type === "melody" &&
                        filterCopyrights.includes(c.referenceId)
                );

                if (textCopyright) {
                    if (melodyCopyright) {
                        if (
                            melodyCopyright.referenceId ===
                            textCopyright.referenceId
                        ) {
                            parts.push(
                                "Tekst & Melodi © " +
                                    copyrights.find(
                                        (i) =>
                                            i.id === textCopyright.referenceId
                                    )?.name
                            );
                        } else {
                            parts.push(
                                "Tekst © " +
                                    copyrights.find(
                                        (i) =>
                                            i.id === textCopyright.referenceId
                                    )?.name +
                                    ", " +
                                    "Melodi © " +
                                    copyrights.find(
                                        (i) =>
                                            i.id === melodyCopyright.referenceId
                                    )?.name
                            );
                        }
                    } else {
                        parts.push(
                            "Tekst © " +
                                copyrights.find(
                                    (i) => i.id === textCopyright.referenceId
                                )?.name
                        );
                    }
                } else if (melodyCopyright) {
                    parts.push(
                        "Melodi © " +
                            copyrights.find(
                                (i) => i.id === melodyCopyright.referenceId
                            )?.name
                    );
                }

                csv += parts
                    .map((i) =>
                        typeof i === "string"
                            ? '"' + i.replace(/"/g, '""') + '"'
                            : i
                    )
                    .join(";");
                csv += "\n";
            }

            const blob = new Blob([csv], { type: "text/csv" });
            const a = document.createElement("a"),
                url = URL.createObjectURL(blob);
            a.href = url;
            a.download = `${collection.key}.csv`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.removeChild(a);
                window.URL.revokeObjectURL(url);
            });
            this.loadingCreds = false;
        },
    },
});
</script>
