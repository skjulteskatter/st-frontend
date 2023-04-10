<template>
    <section>
        <BackButton class="mb-4" />
        <header class="flex gap-4 mb-4">
            <h1 class="font-bold text-3xl">{{ $t('credits_songCredit') }}</h1>
        </header>
        <section class="mb-4">
            <BaseCard v-if="step == 1">
                <template #header>
                    <h2 class="font-semibold">Choose song</h2>
                </template>
                <div class="flex flex-col gap-4">
                    <label class="text-xs flex flex-col gap-1 relative">
                        {{ $t('common_collection') }}
                        <BookOpenIcon class="opacity-50 w-4 h-4 absolute bottom-3 left-3" />
                        <select
                            class="pl-10 rounded-md border border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2 dark:bg-secondary"
                            id="collection"
                            name="collection"
                            v-model="collection"
                        >
                            <option value="" key="">{{ $t('common_collection') }}</option>
                            <option v-for="collection in Collections" :key="collection.id" :value="collection.id">{{collection.getName(Language)}}</option>
                        </select>
                    </label>
                    <label class="text-xs flex flex-col gap-1 relative">
                        {{ $t('song_number') }}
                        <HashtagIcon class="w-4 h-4 opacity-50 absolute bottom-3 left-3" />
                        <input type="number" v-model="number" :placeholder="$t('song_number')" class="pl-10 rounded-md border-black/20 dark:border-white/20" />
                    </label>
                    
                    <label class="text-xs flex flex-col gap-1 relative">{{ $t("common_language") }}
                        <select
                            class="pl-10 rounded-md border border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2 dark:bg-secondary"
                            id="language"
                            name="language"
                            v-model="selectedLanguage"
                        >
                            <option
                                v-for="lang in languages"
                                :value="lang"
                                :key="lang.key"
                            >
                                {{ lang.name }}
                            </option>
                        </select>
                        <TranslateIcon class="opacity-50 w-4 h-4 absolute bottom-3 left-3" />
                    </label>
            </div>
            </BaseCard>
            <BaseCard v-if="step == 2">
                <div v-if="song">
                    <div class="flex flex-col mb-4">
                        <h2 class="font-bold text-lg">{{ song.getName(Language) }}</h2>
                        <small class="opacity-50">{{ $t('song_author') }}: {{ song.Authors[0]?.name }}</small>
                        <small class="opacity-50">{{ $t('song_composer') }}: {{ song.Composers[0]?.name }}</small>
                    </div>
                    <input ref="file" type="file" id="credit-file-input" accept="audio/*, video/*"/>
                </div>
                <p v-else>Please select a song</p>
            </BaseCard>
        </section>
        <div class="flex gap-4 justify-end">
            <BaseButton theme="tertiary" @click="previousStep()" v-if="step > 1">
                <template #icon>
                    <ArrowLeftIcon class="w-4 h-4" />
                </template>
                {{ $t('common_previous') }}
            </BaseButton>
            <BaseButton theme="secondary" :disabled="!(collection && number && selectedLanguage.name)" @click="nextStep()" v-if="step < 2">
                <template #icon>
                    <ArrowRightIcon class="w-4 h-4" />
                </template>
                {{ $t('common_next') }}
            </BaseButton>
            <BaseButton theme="secondary" :loading="loading" :disabled="!downloadReady" @click="creditSong()" v-if="step == 2">
                <template #icon>
                    <DownloadIcon class="w-4 h-4" />
                </template>
                {{ $t('credits_creditAndDownload') }}
            </BaseButton>
        </div>
    </section>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { songs } from "@/services/api";
import { appSession } from "@/services/session";
import { useStore } from "@/store";
import { Song } from "@/classes";
import { ArrowRightIcon, ArrowLeftIcon, DownloadIcon, BookOpenIcon, HashtagIcon, TranslateIcon } from "@heroicons/vue/solid";
import { notify } from "@/services/notify";
import { Language } from "songtreasures";

function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

const saveByteArray = (function () {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.setProperty("display", "none");
    // eslint-disable-next-line no-undef
    return function (data: BlobPart[], name: string) {
        const blob = new Blob(data),
        url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

export default defineComponent({
    name: "credit-song-view",
    components: {
        ArrowRightIcon,
        ArrowLeftIcon,
        DownloadIcon,
        BookOpenIcon,
        HashtagIcon,
        TranslateIcon,
    },
    data: () => ({
        store: useStore(),
        collection: "",
        number: null as number | null,
        song: null as Song | null,
        loading: false,
        step: 1,
        selectedLanguage: {} as Language,
        currentFileExtension: "",
    }),
    computed: {
        downloadReady() {
            return this.song != undefined;
        },
        Collections() {
            return appSession.collections;
        },
        Language() {
            return this.store.getters.languageKey;
        },
        languages(): Language[] {
            return appSession.languages || [];
        },
    },
    methods: {
        nextStep() {
            if(this.step >= 2) return;
            this.step ++;
            this.getSong();
        },
        previousStep() {
            if(this.step <= 1) return;
            this.step --;
        },
        creditSong() {
            const el = document.getElementById("credit-file-input") as HTMLInputElement;

            if (el.files?.length) {
                this.loading = true;
                const reader = new FileReader();

                this.currentFileExtension = (el.files[0].name.match(/[^.]*$/g) || [""])[0].trim();
                
                reader.onload = async () => {
                    const buffer = reader.result as ArrayBuffer;

                    const stuff = arrayBufferToBase64(buffer);

                    if (this.number && this.collection){
                        const r = await songs.creditSong(this.collection, this.number, this.selectedLanguage.key, stuff, this.currentFileExtension);

                        switch(r?.status){
                            case 413:
                                notify("error", "File size exceeds limit (30 MB)", "warning");
                                this.loading = false;
                                return;
                                
                            case 200: {
                                const file = await r?.arrayBuffer();

                                if (file) {
                                    saveByteArray([file], `${this.Collections.find(c => c.id == this.collection)?.key} ${this.number} - ${this.song?.getName(this.selectedLanguage.key)}.${this.currentFileExtension}`);
                                    this.loading = false;
                                }
                                break;
                            }
                            default: 
                                notify("error", "Something went wrong", "warning");
                                this.loading = false;
                                return;
                        }

                    }
                };

                reader.readAsArrayBuffer(el.files[0]);
            }

        },
        async getSong() {
            if (this.collection && this.number)
                this.song = appSession.songs.find(s => s.collectionIds.includes(this.collection) && s.getNumber(this.collection) == this.number) ?? null;
        },
    },
});
</script>
