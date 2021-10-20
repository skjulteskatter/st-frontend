<template>
    <div class="sheetmusic-viewer">
        <div v-if="song" class="mb-2 p-4 bg-white">
            <div class="flex flex-col">
                <h1 class="font-bold text-lg">
                    {{ song.getName(languageKey) }}
                </h1>
                <small class="text-gray-400 text-xs tracking-wide" v-if="Authors.length">
                    <span>{{ (song.yearWritten ? $t("song_writtenInBy").replace('$year', song.yearWritten.toString()) : $t("song_writtenBy")).replace('$authors', '') }}</span>
                    <span
                        v-for="c in Authors"
                        :key="c.id"
                        class="mr-1"
                    >
                        {{ c.name }}
                    </span>
                </small>
                <small class="text-gray-400 text-xs tracking-wide" v-if="Composers.length">
                    <span>{{ (song.yearComposed ? $t("song_composedInBy").replace('$year', song.yearComposed.toString()) : $t("song_composedBy")).replace('$composers', '') }}</span>
                    <span
                        v-for="c in Composers"
                        :key="c.id"
                        class="mr-1"
                    >
                        {{ c.name }}
                    </span>
                </small>
            </div>

            <div v-if="files.length > 1" class="mt-3 rounded-md border p-1">
                <button @click="showFiles = !showFiles" class="px-1 w-full flex gap-2 justify-between items-center text-gray-500 text-sm tracking-wide uppercase">
                    <small>{{ $t('song_sheetmusic') }}</small>
                    <ChevronUpIcon class="w-4 h-4" v-if="showFiles" />
                    <ChevronDownIcon class="w-4 h-4" v-else />
                </button>
                <media-list-item :files="files" :callback="setFile" v-if="showFiles" class="mt-2" />
            </div>
        </div>

        <div class="sheetmusic-wrapper">
            <open-sheet-music-display
                v-if="
                    loaded &&
                    type != pdfType &&
                    options &&
                    url &&
                    ['sheet-music', 'sheet-music-embed'].includes(routeName)
                "
                :options="options"
            ></open-sheet-music-display>
            <object
                v-if="type == pdfType && options"
                :data="options.url"
                type="application/pdf"
                width="100%"
                height="100%"
                class="bg-white"
            >
                <p>Couldn't load PDF</p>
            </object>
            <div id="osmd-canvas"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { osmd } from "@/services/osmd";
import { MediaFile } from "songtreasures";
import { Contributor, SheetMusicTypes, Song, transposer, User } from "@/classes";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import OpenSheetMusicDisplay from "@/components/OSMD.vue";
import http from "@/services/http";
import { session, songs } from "@/services/api";
// import { SheetMusicOptions } from "@/store/songs";
import { MediaListItem } from "@/components/media";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/vue/outline";

@Options({
    components: {
        OpenSheetMusicDisplay,
        MediaListItem,
        ChevronUpIcon,
        ChevronDownIcon,
    },
    name: "sheet-music",
})
export default class SheetMusic extends Vue {
    public store = useStore();
    public searchParams = new URLSearchParams(window.location.search);
    public osmd = osmd;
    public pdfType = SheetMusicTypes.PDF;
    public files: MediaFile[] = [];
    public song: Song | null = null;
    public user?: User;

    public showFiles = true;

    public get languageKey() {
        return this.user?.settings?.languageKey;
    }

    public loaded = false;

    public async mounted() {
        const c = document.getElementById("osmd-canvas");
        const pbc = document.getElementById("pb-canvas");
        const token = this.searchParams.get("token");
        await osmd.init(c, pbc);

        if (token) {
            http.setToken(token);

            const song = new Song(await songs.getSongById(this.$route.params.id as string, "participants/contributor"));
            this.user = new User(await session.getCurrentUser());

            this.song = song;
            this.files = (await songs.getSongFiles(song.id)).filter(f => f.type.startsWith("sheetmusic") && !f.type.includes("sibelius")) ?? [];
            if (this.files.length == 1) {
                this.setFile(this.files[0]);
            }
        }
        else {
            throw new Error("No token present");
        }
        // const o: SheetMusicOptions = {
        //     show: true,
        //     url: this.url,
        //     originalKey: this.originalKey,
        //     transposition: this.transposition,
        // }

        // this.songStore.commit("sheetMusic", o)

        this.loaded = true;
    }
    
    public async setFile(file: MediaFile) {
        this.loaded = false;

        await new Promise(r => setTimeout(r, 10));
        const options: SheetMusicOptions = {
            show: true,
            originalKey: this.song?.originalKey ?? "C",
            url: file.directUrl,
            type: file.type,
            transposition: (this.transposeKey ? parseInt(this.transposeKey) : undefined) ?? transposer.getRelativeTransposition(this.user?.settings.defaultTransposition ?? "C", true),
            zoom: this.zoom,
            clef: "treble",
        };
        this.store.commit(SongsMutationTypes.SET_SHEETMUSIC_OPTIONS, options);
        this.loaded = true;
    }

    public get Authors() {
        return this.song?.participants.filter(i => i.type === "author").map(i => i.contributor as Contributor) ?? [];
    }

    public get Composers() {
        return this.song?.participants.filter(i => i.type === "composer").map(i => i.contributor as Contributor) ?? [];
    }


    public get options() {
        return this.store.state.songs.sheetMusic;
    }

    public get sheetMusic() {
        return this.store.state.songs.sheetMusic ?? {} as SheetMusicOptions;
    }

    public get url() {
        return (
            this.sheetMusic.url ??
            `https://dmb-cdn.azureedge.net/files/${this.$route.params.id}`
        );
    }

    public get originalKey() {
        return (
            this.sheetMusic.originalKey ??
            this.searchParams
                .get("originalKey")
                ?.replace("sharp", "#")
                .replace("flat", "b")
        );
    }

    public get routeName() {
        return this.$route.name?.toString() ?? "";
    }

    public get transposeKey() {
        return this.searchParams.get("transposition");
    }

    public get transposition() {
        return (
            this.sheetMusic.transposition ??
            (this.transposeKey ? parseInt(this.transposeKey) : undefined)
        );
    }

    public get embed() {
        const query = this.searchParams.get("embed");

        const embed = ["", "true"].includes(query ?? "false");

        return embed;
    }

    public get zoom() {
        const query = this.searchParams.get("zoom");

        const zoom = query ? parseInt(query) / 100 : undefined;

        return zoom;
    }

    public get showSheetMusic() {
        return this.sheetMusic.show;
    }

    public get type() {
        return (
            this.sheetMusic.type ??
            this.searchParams.get("type")
        );
    }

    // public get options(): SheetMusicOptions {
    //     return {
    //         show: this.showSheetMusic,
    //         url: this.url,
    //         originalKey: this.originalKey,
    //         transposition: this.transposition,
    //         type: this.type ?? undefined,
    //         clef: "treble",
    //     };
    // }
}
</script>
<style lang="scss">
@import "../style/mixins";

.sheetmusic-viewer {
    height: 100vh;
    max-width: 1600px;
    margin: auto;

    &__info {
        margin-bottom: var(--st-spacing);

        &__author,
        &__composer {
            color: var(--st-color-primary);
            margin: 0.5em 0;
        }

        &__title {
            margin-top: 0;
            margin-bottom: calc(var(--st-spacing) / 2);
        }
    }
}

#pb-canvas .control-panel {
    background-color: var(--st-color-background-medium);
    border-radius: var(--st-border-radius);
    width: 350px;
    left: unset;
}

.sheetmusic-controlpanel {
    position: fixed;
    bottom: calc(var(--st-spacing) * 2);
    left: 50%;
    transform: translateX(-50%);

    width: 100%;
    display: flex;
    justify-content: center;
    gap: var(--st-spacing);

    @include breakpoint("small") {
        bottom: var(--st-spacing);
    }
}

.sheetmusic-wrapper {
    width: 100%;
    height: 90%;
}

#pb-canvas {
    width: 100%;
    text-align: center;
}

.pbcontrol-toggle {
    position: fixed;
    z-index: 50;
    bottom: 10px;

    @include breakpoint("small") {
        .button__content {
            display: none;
        }
    }
}
</style>
