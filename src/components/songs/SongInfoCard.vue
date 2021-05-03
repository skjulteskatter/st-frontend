<template>
    <base-card
        class="song-details__metadata"
        v-if="song"
        header
        toggleable
        v-cloak
        :disableContent="!description"
    >
        <template #header>
            <p class="song-details__metadata__collection" v-if="collection">
                {{ collection.getName(languageKey) }}
            </p>
            <h2 class="song-details__metadata__title">
                <span class="song-details__metadata__number">
                    {{ song.number }}
                </span>
                <span>
                    {{ title }}
                </span>
            </h2>
            <div class="song-details__metadata__content">
                <img
                    id="song-details-image"
                    class="song-details__metadata__image"
                    v-if="song.image"
                    height="100"
                />
                <span
                    v-if="song.verses && imageLoaded"
                    class="song-details__metadata__verse-count tag song-details-transition"
                >
                    {{ song.verses }}
                    {{ song.verses > 1 ? $t("song.verses") : $t("song.verse") }}
                </span>
                <div class="song-details__metadata__info" v-if="imageLoaded">
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
                        v-if="
                            song.copyright.melody &&
                            song.copyright.text &&
                            identicalCopyright
                        "
                    >
                        © {{ getLocaleString(song.copyright.melody.name) }}
                    </small>
                    <div v-else>
                        <small
                            class="song-details__metadata__credits"
                            v-if="song.copyright.text"
                        >
                            {{ $t("song.text") }} ©:
                            {{ getLocaleString(song.copyright.text.name) }}
                        </small>
                        <small
                            class="song-details__metadata__credits"
                            v-if="song.copyright.melody"
                        >
                            {{ $t("song.melody") }} ©:
                            {{ getLocaleString(song.copyright.melody.name) }}
                        </small>
                    </div>
                    <small
                        class="song-details__metadata__credits"
                        v-if="melodyOrigin"
                    >
                        {{ melodyOrigin }}
                    </small>
                    <small class="song-details__metadata__credits gap-x">
                        <span v-if="song.originCountry">
                            {{ song.originCountry.name }}
                        </span>
                        <span v-if="song.yearWritten">
                            {{ song.yearWritten }}
                        </span>
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
import { Collection, Song } from "@/classes";
import { Options, Vue } from "vue-class-component";
import { BaseCard, Modal } from "@/components";
import { useStore } from "@/store";

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
    },
    name: "song-info-card",
})
export default class SongInfoCard extends Vue {
    public languageKey = "";
    public song?: Song;
    public imageLoaded = false;
    public store = useStore();

    public mounted() {
        if (this.song?.image) {
            const image = document.getElementById(
                "song-details-image"
            ) as HTMLImageElement;

            image.style.display = "none";

            image.src = this.song.image;

            image.onload = () => {
                image.classList.add("song-details-transition");
                this.imageLoaded = true;
                image.style.display = "";
            };
        } else {
            this.imageLoaded = true;
        }
    }

    public get collection(): Collection | undefined {
        const id = this.store.state.songs.collectionId;
        const collection = this.store.state.songs.collections.find(
            (c) => c.key == id
        );
        return collection;
    }

    public get title() {
        return this.song?.getName(this.languageKey);
    }

    public getLocaleString(dictionary: { [key: string]: string }) {
        return (
            dictionary[this.languageKey] ??
            dictionary.en ??
            dictionary[Object.keys(dictionary)[0]]
        );
    }

    public get description() {
        return this.song?.getTranslatedProperty(
            this.song.description,
            this.languageKey
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
@keyframes slideInFromLeft {
    0% {
        transform: translateX(-50px);
        opacity: 0;
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

[v-cloak] {
    display: none;
}

.song-details-transition {
    animation: 0.5s ease-out 0s 1 slideInFromLeft;
}

.song-details__metadata {
    width: 100%;

    &__number {
        color: var(--st-color-text);
        text-decoration: none;
        opacity: 0.5;
        padding-right: 0.5em;
    }

    &__collection {
        opacity: 0.5;
        margin-top: 0;
    }

    &__info {
        animation: 0.5s ease-out 0s 1 slideInFromLeft;
    }

    &__content {
        display: flex;
        align-items: flex-start;
        gap: calc(var(--st-spacing) / 2);
    }

    &__credits {
        color: var(--st-color-primary);
        display: block;
        margin-bottom: 0.2rem;

        a {
            color: var(--st-color-primary);
        }
    }

    &__description {
        display: flex;
        flex-direction: column;
        gap: var(--st-spacing);

        & > * {
            margin: 0;
        }
    }
}
</style>
