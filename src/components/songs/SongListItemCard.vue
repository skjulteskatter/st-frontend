<template>
    <base-card class="hover:ring-2 hover:ring-gray-400 cursor-pointer">
        <div class="flex gap-2" v-if="song">
            <b class="text-gray-400">{{ song.number }}</b>
            <div>
                <b>{{ song.getName(languageKey) }}</b>
                <small class="text-xs text-primary flex gap-2 mb-2">
                    <span>{{ song.verses }} {{ $t('song_verses').toLocaleLowerCase() }}</span>
                    <span>&middot;</span>
                    <span>{{ song.originalKey }}</span>
                </small>
                <div class="opacity-50 text-sm leading-tight">
                    <div v-if="song.Authors.length">
                        <small>{{ $t("song_author") }}: </small>
                        <small
                            v-for="author in song.Authors"
                            :key="author.id"
                            >{{ author.name }}</small
                        >
                    </div>
                    <div v-if="song.Composers.length">
                        <small>{{ $t("song_composer") }}: </small>
                        <small
                            v-for="composer in song.Composers"
                            :key="composer.id"
                            >{{ composer.name }}</small
                        >
                    </div>
                    <p class="mt-4 text-gray-400">{{ context }}</p>
                </div>
            </div>
        </div>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Song } from "@/classes";
import { useStore } from "@/store";

@Options({
    props: {
        song: {
            type: Object,
        },
        context: {
            type: String,
        },
    },
    name: "song-list-item-card",
})
export default class SongListItemCard extends Vue {
    public song?: Song;
    public context?: string;

    public get languageKey() {
        return useStore().getters.languageKey;
    }
}
</script>
