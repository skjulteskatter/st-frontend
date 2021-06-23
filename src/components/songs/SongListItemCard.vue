<template>
    <base-card class="border hover:border-gray-400 cursor-pointer dark:border-gray-500 dark:hover:border-gray-300">
        <div class="flex gap-2" v-if="song">
            <b class="text-gray-400">{{ song.number }}</b>
            <div class="song-list__item-card__body">
                <b class="song-list__item-card__title">{{
                    song.getName(languageKey)
                }}</b>
                <small class="text-xs text-primary flex gap-2 mb-2">
                    <span>{{ song.verses }} {{ $t('song.verses').toLocaleLowerCase() }}</span>
                    <span>({{ song.originalKey }})</span>
                </small>
                <div class="text-gray-500 text-sm">
                    <div class="">
                        <small>{{ $t("song.author") }}: </small>
                        <small
                            v-for="author in song.Authors"
                            :key="author.id"
                            >{{ author.name }}</small
                        >
                    </div>
                    <div
                        class=""
                        v-if="song.Composers.length"
                    >
                        <small>{{ $t("song.composer") }}: </small>
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
