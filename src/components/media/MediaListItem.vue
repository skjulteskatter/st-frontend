<template>
    <div class="flex flex-col gap-2">
        <button
            class="cursor-pointer p-2 rounded border border-gray-300 hover:border-gray-500 flex gap-2 items-center focus:ring focus:ring-primary focus:outline-none"
            v-for="file in Files"
            :key="file.id"
            @click="callback ? callback(file) : undefined"
        >
            <icon :name="icon" size="14" class="text-gray-500" />
            <small>
                {{$t(`types.${file.category}`) + (file.languageKey ? ' (' + file.languageKey + ')' : '')}}
                <!-- <span style="opacity: 0.5">{{ $t(`types.${audio.category}`).toLowerCase() }}</span> -->
            </small>
        </button>
    </div>
</template>

<script lang="ts">
import { Collection, Song } from "@/classes";
import { useStore } from "@/store";
import { MediaFile } from "dmb-api";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "audio-playlist",
    props: {
        icon: {
            type: String,
            default: "book",
        },
        files: {
            type: Array,
            required: true,
        },
        callback: {
            type: Function,
        },
    },
})
export default class MediaListItem extends Vue {
    public store = useStore();
    public icon?: string;
    public files?: MediaFile[];
    public callback?: Function;

    public get Files() {
        return this.files ?? [];
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get song(): Song | undefined {
        return this.store.getters.song;
    }

    public get collection(): Collection | undefined {
        return this.store.getters.collection;
    }
}
</script>