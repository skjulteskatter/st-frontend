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
            <div class="song-details__metadata__content">
                <span
                    v-if="verses"
                    class="song-details__metadata__verse-count tag"
                >
                    {{ verses }} {{ $t("song.verses") }}
                </span>
                <div class="song-details__metadata__info">
                    <small class="song-details__metadata__credits gap-x">
                        <span>{{ $t("song.author") }}: </span>
                        <span v-for="author in song.authors" :key="author.id">
                            <router-link
                                :to="{
                                    name: 'contributor',
                                    params: {
                                        contributor: author.id,
                                    },
                                }"
                            >
                                {{ author.name }}
                            </router-link>
                        </span>
                    </small>
                    <small
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
                                        contributor: composer.id,
                                    },
                                }"
                            >
                                {{ composer.name }}
                            </router-link>
                        </span>
                    </small>
                    <small
                        class="song-details__metadata__credits"
                        v-if=" song.copyright.melody && song.copyright.text && identicalCopyright"
                    >
                        © {{ getLocaleString(song.copyright.melody.name) }}
                    </small>
                    <div v-else>
                        <small
                            class="song-details__metadata__credits"
                            v-if="song.copyright.text"
                        >
                            {{ $t("song.text" )}} ©: {{ getLocaleString(song.copyright.text.name) }}
                        </small>
                        <small
                            class="song-details__metadata__credits"
                            v-if="song.copyright.melody"
                        >
                            {{ $t("song.melody" )}} ©: {{ getLocaleString(song.copyright.melody.name) }}
                        </small>
                    </div>
                    <small
                        class="song-details__metadata__credits"
                        v-if="melodyOrigin"
                    >
                        {{ melodyOrigin }}
                    </small>
                    <small
                        class="song-details__metadata__credits"
                        v-if="song.yearWritten"
                    >
                        {{ song.yearWritten }}
                    </small>
                </div>
            </div>
        </template>
        <div
            v-if="description"
            class="song-details__metadata__description"
            v-html="description"
        ></div>
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

    public getLocaleString(dictionary: {[key: string]: string}) {
        return dictionary[this.languageKey] ?? dictionary.en ?? dictionary[Object.keys(dictionary)[0]];
    }

    public get description() {
        return (
            this.song?.description[this.languageKey] ??
            this.song?.description.en ??
            this.song?.description.no ??
            undefined
        );
    }

    public get melodyOrigin() {
        return (
            this.song?.melodyOrigin?.name[this.languageKey] ??
            this.song?.melodyOrigin?.name.no ??
            undefined
        );
    }

    public get identicalCopyright() {
        return this.song?.copyright.text?.id == this.song?.copyright.melody?.id;
    }
}
</script>

<style lang="scss">
.song-details__metadata {
    width: 100%;
    height: auto;

    &__content {
        display: flex;
        align-items: flex-start;
        gap: calc(var(--st-spacing) / 2);
    }

    &__credits {
        color: var(--st-primary-color);
        display: block;
        margin-bottom: 0.2rem;
    }

    &__description {
        display: flex;
        flex-direction: column;
        gap: var(--st-spacing);

        & > * {
            margin: 0;
        }
    }

    a {
        color: var(--st-primary-color);
    }
}
</style>