<template>
    <base-card class="border hover:border-gray-400 cursor-pointer">
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
                            v-for="author in song.authors"
                            :key="author.id"
                            >{{ author.name }}</small
                        >
                    </div>
                    <div
                        class=""
                        v-if="song.composers.length"
                    >
                        <small>{{ $t("song.composer") }}: </small>
                        <small
                            v-for="composer in song.composers"
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
import BaseCard from "@/components/BaseCard.vue";
import { Song } from "@/classes";
import { useStore } from "@/store";

@Options({
    components: {
        BaseCard,
    },
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
    public context = "";

    public get languageKey() {
        return useStore().getters.languageKey;
    }
}
</script>
