<template>
    <base-card
        v-if="song"
        header
        toggleable
        v-cloak
        :disableContent="!description"
    >
        <template #header>
            <router-link
                :to="`/songs/${collection.key}`"
                class="text-sm text-primary hover:underline"
                v-if="collection"
            >
                {{ collection.getName(languageKey) }}
            </router-link>
            <h2 class="flex gap-4 text-xl font-bold mb-2">
                <span class="text-gray-400">
                    {{ song.number }}
                </span>
                <span>
                    {{ title }}
                </span>
            </h2>
            <div class="flex items-start gap-2">
                <img
                    id="song-details-image"
                    class="rounded"
                    v-if="song.image"
                    height="100"
                />
                <span
                    v-if="song.verses && imageLoaded"
                    class="p-1 rounded border border-gray-500 text-gray-500 text-sm song-details-transition"
                >
                    {{ song.verses }}
                    {{ song.verses > 1 ? $t("song.verses").toLocaleLowerCase() : $t("song.verse").toLocaleLowerCase() }}
                </span>
                <div class="text-gray-500 text-base flex flex-col gap-1" v-if="imageLoaded">
                    <small class="flex gap-2" v-if="song.hasLyrics">
                        <span>{{ $t("song.author") }}: </span>
                        <span v-for="author in song.authors" :key="author.id" class="px-1 rounded bg-gray-200 border hover:border-gray-400">
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
                        class="flex gap-2"
                    >
                        <span>{{ $t("song.composer") }}: </span>
                        <span
                            v-for="composer in song.composers"
                            :key="composer.id"
                            :label="composer.name"
                            class="px-1 rounded bg-gray-200 border hover:border-gray-400"
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
                        class="flex gap-2"
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
                            class="flex gap-2"
                            v-if="song.copyright.text"
                        >
                            {{ $t("song.text") }} ©:
                            {{ getLocaleString(song.copyright.text.name) }}
                        </small>
                        <small
                            class="flex gap-2"
                            v-if="song.copyright.melody"
                        >
                            {{ $t("song.melody") }} ©:
                            {{ getLocaleString(song.copyright.melody.name) }}
                        </small>
                    </div>
                    <small
                        class="flex gap-2"
                        v-if="melodyOrigin"
                    >
                        {{ melodyOrigin }}
                    </small>
                    <small class="flex gap-2">
                        <span v-if="song.originCountry">{{ song.originCountry }}</span>
                        <span v-if="song.yearWritten">{{ song.yearWritten }}</span>
                        <span v-if="song.originalKey">({{ song.originalKey }})</span>
                    </small>
                </div>
            </div>
        </template>
        <div
            v-if="description"
            class="text-sm"
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
                "song-details-image",
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
        if (!id) return undefined;
        const collection = this.store.state.songs.collections.find((c) =>
            Object.values(c.keys).includes(id),
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
            this.song?.melodyOrigin?.description[this.languageKey] ??
            this.song?.melodyOrigin?.description.no ??
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
    &__info {
        animation: 0.5s ease-out 0s 1 slideInFromLeft;
    }
}
</style>
