<template>
    <base-card class="song-details__metadata" border secondary v-if="song">
        <h2 class="song-details__metadata__title">
            <span style="opacity: 0.5; padding-right: 0.5em">{{
                song.number
            }}</span>
            {{ title }}
        </h2>
        <span v-if="verses" class="lyrics-settings__metadata__verse-count tag"
            >{{ verses }} verses</span
        >
        <p class="song-details__metadata__credits gap-x">
            <span>{{ $t("song.author") }}: </span>
            <span v-for="author in song.authors" :key="author.id">
                <span v-if="!author.getBiography(languageKey)">{{
                    author.name
                }}</span>
                <modal :label="author.name" type="span" v-else>
                    <div
                        v-html="author.getBiography(languageKey)"
                        class="biography-wrapper"
                    ></div>
                </modal>
            </span>
        </p>
        <p
            v-if="song.composers.length > 0"
            class="song-details__metadata__credits gap-x"
        >
            <span>{{ $t("song.composer") }}: </span>
            <span
                v-for="composer in song.composers"
                :key="composer.id"
                :label="composer.name"
            >
                <span v-if="!composer.getBiography(languageKey)">{{
                    composer.name
                }}</span>
                <modal :label="composer.name" type="span" v-else>
                    <div
                        v-html="composer.getBiography(languageKey)"
                        class="biography-wrapper"
                    ></div>
                </modal>
            </span>
        </p>
        <p class="lyrics-settings__metadata__credits" v-if="melodyOrigin">
            {{ melodyOrigin }}
        </p>
        <p class="lyrics-settings__metadata__credits" v-if="song.yearWritten">
            {{ song.yearWritten }}
        </p>
        <div v-if="description" v-html="description"></div>
    </base-card>
</template>
<script lang="ts">
import { Song } from "@/classes";
import { Options, Vue } from "vue-class-component";
import { BaseCard, Modal } from "@/components";

@Options({
    components: {
        BaseCard,
        Modal,
    },
    props: {
        languageKey: {
            type: String,
        },
        song: {
            type: Object,
        },
        verses: {
            type: Number,
        },
    },
})
export default class SongInfoCard extends Vue {
    public languageKey = "";
    public song?: Song;
    public verses = 0;

    public get title() {
        return (
            this.song?.name[this.languageKey] ??
            this.song?.name.en ??
            this.song?.name.no ??
            ""
        );
    }

    public get description() {
        return (
            this.song?.description[this.languageKey] ??
            this.song?.description.en ??
            this.song?.description.no ??
            ""
        );
    }

    public get melodyOrigin() {
        return (
            this.song?.melodyOrigin?.name[this.languageKey] ??
            this.song?.melodyOrigin?.name.no ??
            undefined
        );
    }
}
</script>