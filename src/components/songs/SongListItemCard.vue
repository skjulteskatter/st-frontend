<template>
    <BaseCard class="hover:ring-2 hover:ring-gray-400 cursor-pointer">
        <div class="flex gap-2" v-if="song">
            <b class="text-gray-400 leading-snug">{{ song.number }}</b>
            <div>
                <p class="font-bold leading-snug mb-2">{{ song.getName(languageKey) }}</p>
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
                    <small class="mt-1 flex gap-2">
                        <span>{{ song.verses }} {{ $t('song_verses').toLocaleLowerCase() }}</span>
                        <span>&middot;</span>
                        <span>{{ song.originalKey }}</span>
                    </small>
                    <p class="mt-4 text-gray-400" v-if="context">{{ context }}</p>
                </div>
            </div>
        </div>
    </BaseCard>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Song } from "@/classes";
import { useStore } from "@/store";

export default defineComponent({
    name: "song-list-item-card",
    props: {
        song: {
            type: Object as PropType<Song>,
        },
        context: {
            type: String,
        },
    },
    computed: {
        languageKey() {
            return useStore().getters.languageKey;
        },
    },
});
</script>
