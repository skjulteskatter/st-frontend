<template>
    <base-card class="song-details__metadata" border v-if="song" header>
        <template #header>
            <h2 class="song-details__metadata__title">
                <span style="opacity: 0.5; padding-right: 0.5em">
                    {{ song.number }}
                </span>
                <span>
                    {{ title }}
                </span>
            </h2>
            <span
                v-if="verses"
                class="lyrics-settings__metadata__verse-count tag"
            >
                {{ verses }} {{ $t("song.verses") }}
            </span>
            <p class="song-details__metadata__credits gap-x">
                <span>{{ $t("song.author") }}: </span>
                <span v-for="author in song.authors" :key="author.id">
                    <router-link
                        :to="{
                            name: 'contributor',
                            params: {
                                collection: $route.params.collection,
                                contributor: author.id,
                            },
                        }"
                    >
                        {{ author.name }}
                    </router-link>
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
                    <router-link
                        :to="{
                            name: 'contributor',
                            params: {
                                collection: $route.params.collection,
                                contributor: composer.id,
                            },
                        }"
                    >
                        {{ composer.name }}
                    </router-link>
                </span>
            </p>
            <p class="lyrics-settings__metadata__credits" v-if="melodyOrigin">
                <span>{{ melodyOrigin }}</span>
            </p>
            <p
                class="lyrics-settings__metadata__credits"
                v-if="song.yearWritten"
            >
                <span>{{ song.yearWritten }}</span>
            </p>
        </template>
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
        return this.song?.getName(this.languageKey);
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

<style lang="scss">
.song-details__metadata {
    width: 100%;
    height: auto;

    &__credits {
        color: var(--st-primary-color);
    }

    a {
        color: var(--st-primary-color);
    }
}
</style>