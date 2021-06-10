<template>
    <div class="credit-song">
        <form
            @submit.prevent="getSong"
        >
            <select
                class="rounded border border-gray-300 focus:outline-none focus:ring focus:ring-primary ring-offset-2 dark:bg-secondary"
                id="collection"
                name="collection"
                v-model="collection"
            >
                <option value="" key="">Not set</option>
                <option v-for="collection in Collections" :key="collection.id" :value="collection.id">{{collection.getName(Language)}}</option>
            </select>
            <input v-model="number" type="number" placeholder="Number"/>
        </form>
        <div v-if="song">{{song.getName(Language)}}</div>
        <input type="file" id="credit-file-input" accept="audio/mpeg">
        <base-button @click="creditSong">Credit</base-button>
    </div>
</template>
<script lang="ts">
import { songs } from "@/services/api";
import { appSession } from "@/services/session";
import { useStore } from "@/store";
import { Options, Vue } from "vue-class-component";
import { Song } from "@/classes";

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
    return function (data: BlobPart[], name: string) {
        const blob = new Blob(data, {type: "audio/mpeg"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

@Options({
    name: "credit-song-view",
})
export default class CreditSongView extends Vue {
    private store = useStore();
    public collection = "";
    public number: number | null = null;
    public song: Song | null = null;

    public creditSong() {
        const el = document.getElementById("credit-file-input") as HTMLInputElement;

        if (el.files?.length) {
            const reader = new FileReader();
            
            reader.onload = async () => {
                const buffer = reader.result as ArrayBuffer;

                const stuff = arrayBufferToBase64(buffer);

                if (this.number && this.collection){
                    const r = await songs.creditSong(this.collection, this.number, this.Language, stuff);
                    const file = await r?.arrayBuffer();

                    if (file) {
                        saveByteArray([file], `${this.Collections.find(c => c.id == this.collection)?.key} ${this.number} - ${this.song?.getName(this.Language)}.mp3`);
                    }
                }
            };

            reader.readAsArrayBuffer(el.files[0]);
        }

        
    }

    public get Collections() {
        return appSession.collections;
    }

    public async getSong() {
        if (this.collection && this.number)
            this.song = appSession.songs.find(s => s.collectionIds.includes(this.collection) && s.getNumber(this.collection) == this.number) ?? null;
    }

    public get Language() {
        return this.store.getters.languageKey;
    }
}
</script>
