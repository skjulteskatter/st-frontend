<template>
  <div>
    <Loader :loading="loading">
      <div v-if="song" class="flex flex-col gap-4">
        <div class="flex justify-between">
          <BackButton :to="`/songs/${collection?.key}`" />
          <div class="flex gap-2 items-center ml-auto">
            <span
              v-if="isAdmin"
              class="bg-black/10 dark:bg-white/10 text-sm py-2 px-3 rounded-md hidden xl:block"
              >{{ song.id }}</span
            >
            <BaseButton
              v-if="isAdmin"
              @click="goToEditPage()"
              theme="tertiary"
              class="mr-4 hidden lg:flex"
            >
              <template #icon>
                <PencilAltIcon class="w-4 h-4" />
              </template>
              {{ $t("common_edit") }}
            </BaseButton>
            <BandSyncIcon @open="showBandSync = true" />
            <BandSyncModal
              :show="showBandSync"
              :start-context="bandSyncStartContext"
              @close="showBandSync = false"
            />
            <button
              @click="toggleFavorite"
              :disabled="favorites.loading"
              class="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
              title="Add to favorites"
            >
              <component
                :is="favorite ? 'HeartIcon' : 'HeartOutline'"
                :class="[
                  favorite ? 'text-red-500 dark:text-red-400' : 'opacity-50',
                  'w-6 h-6',
                ]"
              />
            </button>
            <BaseButton
              theme="secondary"
              @click="openAdder()"
              v-if="playlists.length"
              class="playlist-adder"
            >
              <template #icon>
                <FolderAddIcon class="w-4 h-4" />
              </template>
              {{
                $t("common_addTo") + " " + $t("common_collection").toLowerCase()
              }}
            </BaseButton>
            <BaseModal :show="show" @close="closeAdder()">
              <template #title>
                <div class="flex gap-4 items-center flex-grow">
                  <h3 class="font-bold">
                    {{ $t("common_select") }}
                    {{ $t("common_collection").toLocaleLowerCase() }}
                  </h3>
                  <button
                    aria-label="Create new collection"
                    title="Create new collection"
                    class="ml-auto rounded-md px-2 py-1 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 font-bold"
                    @click="showPlaylistModal = true"
                  >
                    <PlusIcon class="w-4 h-4" />
                  </button>
                </div>
              </template>
              <CreatePlaylistModal
                :show="showPlaylistModal"
                @close="showPlaylistModal = false"
              />
              <div
                class="flex flex-col gap-2 max-h-72 w-96 overflow-y-auto shadow-scroll"
              >
                <PlaylistCard
                  v-for="playlist in playlists"
                  :key="playlist.id"
                  :playlist="playlist"
                  @click="addToPlaylist(playlist)"
                />
              </div>
            </BaseModal>
          </div>
        </div>
        <div class="flex justify-between">
          <SongTags :song="song" />
          <a
            v-if="song?.hasLyrics"
            href="https://presentation.songtreasures.app"
            target="_blank"
            rel="noopener"
            class="hidden md:flex items-center text-xs tracking-wide hover:underline"
          >
            {{ $t("song_viewer") }}
          </a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="flex flex-col gap-4 md:col-span-2">
            <SongInfoCard
              :song="song"
              :language="languageKey"
              :viewCount="viewCount"
              :collection="collection"
              :isAdmin="isAdmin"
              class="md:col-span-2"
            />
            <LyricsCard
              :class="{ hidden: sheetMusicOptions?.show }"
              v-if="song.hasLyrics"
              :loading="loadingLyrics"
              :song="song"
              :lyrics="lyrics"
              :collection="collection"
              :type="type"
              @translate="translate"
              @transpose="transpose"
              @setView="setView"
            />
            <OpenSheetMusicDisplay
              v-if="
                sheetMusicOptions?.show === true &&
                sheetMusicOptions?.type === 'sheetmusic'
              "
              :key="`${sheetMusicOptions.fileId}:${sheetMusicOptions.transposition}`"
              :options="sheetMusicOptions"
              :relativeKey="user?.settings?.defaultTransposition"
              :languageKey="languageKey"
              :song="song"
              @close="
                () =>
                  sheetMusicOptions
                    ? (sheetMusicOptions.show = false)
                    : undefined
              "
            />
            <div
              v-if="
                sheetMusicOptions?.show &&
                sheetMusicOptions?.type == 'sheetmusic-pdf'
              "
              class="w-full h-full"
            >
              <div class="p-4 flex justify-end bg-white w-full">
                <BaseButton
                  theme="error"
                  @click="
                    sheetMusicOptions
                      ? (sheetMusicOptions.show = false)
                      : undefined
                  "
                >
                  <template #icon>
                    <XIcon class="w-4 h-4" />
                  </template>
                  {{ $t("common_close") }}
                </BaseButton>
              </div>
              <object
                :key="sheetMusicOptions?.url"
                :data="sheetMusicOptions?.url + '\#toolbar=0'"
                type="application/pdf"
                class="flex-grow"
                title="PDF cannot be displayed."
                width="100%"
                height="720px"
              ></object>
            </div>
          </div>
          <aside>
            <SongMediaCard
              :song="song"
              :collection="collection"
              @setAudioTrack="(t) => (audioTrack = t)"
              @setSheetMusic="(m) => (sheetMusicOptions = m)"
              class="sticky top-20"
            />
          </aside>
        </div>
      </div>
    </Loader>
    <BaseModal :show="song ? !song.available : false">
      <div class="flex flex-col items-center">
        <LockClosedIcon class="w-10 h-10 text-primary my-4" />
        <h2 class="text-2xl font-bold">{{ $t("store_limitedAccess") }}</h2>
        <p class="text-center">{{ $t("store_gainAccess") }}</p>
        <div
          class="p-2 rounded-md border border-gray-300 mt-4 flex items-center gap-4"
          v-if="collection"
        >
          <img
            class="max-h-12 rounded"
            height="48"
            :src="collection.image"
            :alt="collection.getName(languageKey)"
          />
          <p>{{ collection.getName(languageKey) }}</p>
        </div>
        <div class="flex gap-4 mt-8">
          <BaseButton theme="tertiary" @click="$router.back()">
            <template #icon>
              <ArrowLeftIcon class="w-4 h-4" />
            </template>
            {{ $t("common_back") }}
          </BaseButton>
          <BaseButton theme="secondary" @click="collection?.addToCart">
            <template #icon>
              <ShoppingCartIcon class="w-4 h-4" />
            </template>
            {{ $t("store_addToCart") }}
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { SongInfoCard, SongMediaCard, SongTags } from "@/components/songs";
import { LyricsCard, BackButton, BaseModal } from "@/components";
import OpenSheetMusicDisplay from "@/components/OSMD.vue";
import { PlaylistAddToCard, CreatePlaylistModal } from "@/components/playlist";
import BandSyncIcon from "@/components/bandSync/BandSyncIcon.vue";
import BandSyncModal from "@/components/bandSync/BandSyncModal.vue";
import {
  FolderAddIcon,
  LockClosedIcon,
  ShoppingCartIcon,
  ArrowLeftIcon,
  PencilAltIcon,
  HeartIcon,
  PlusIcon,
  XIcon,
} from "@heroicons/vue/solid";
import { HeartIcon as HeartOutline } from "@heroicons/vue/outline";
import { Collection, Lyrics, Song, transposer } from "@/classes";
import { ICustomCollection, Format, IMediaFile } from "songtreasures-api";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { SongsActionTypes } from "@/store/modules/songs/action-types";
import { notify } from "@/services/notify";
import { analytics } from "@/services/api";
import { appSession } from "@/services/session";
import { toSheetApiTransposition } from "@/services/bandSync/bandSyncSession";
import { AudioTrack, SongViewType } from "@/store/modules/songs/state";
import { SheetMusicOptions } from "songtreasures";
import { application } from "@/classes/application";

export default defineComponent({
  name: "song-viewer",
  components: {
    LyricsCard,
    SongInfoCard,
    SongMediaCard,
    SongTags,
    BackButton,
    BaseModal,
    OpenSheetMusicDisplay,
    PlaylistCard: PlaylistAddToCard,
    CreatePlaylistModal,
    FolderAddIcon,
    LockClosedIcon,
    ShoppingCartIcon,
    ArrowLeftIcon,
    PencilAltIcon,
    HeartIcon,
    PlusIcon,
    HeartOutline,
    XIcon,
    BandSyncIcon,
    BandSyncModal,
  },
  data: () => ({
    store: useStore(),
    number: 0 as number | string,
    selectedSheetMusic: {} as IMediaFile,
    sheetMusicOptions: null as SheetMusicOptions | null,
    songViewCount: null as number | null,
    show: false,
    showPlaylistModal: false,
    lyrics: null as Lyrics | null,
    componentLoading: {} as {
      [key: string]: boolean;
    },
    fullLoading: false,
    loadGeneration: 0,
    favorite: false,
    showSheet: false,
    showBandSync: false,
  }),
  computed: {
    selectedLanguage() {
      return this.languageKey;
    },
    favorites() {
      return appSession.favorites;
    },
    user() {
      return appSession.user;
    },
    admin() {
      return appSession.user.roles.some((r) =>
        ["editor", "administrator"].includes(r),
      );
    },
    audioTrack: {
      get() {
        return undefined;
      },
      set(v: AudioTrack) {
        this.store.commit(SongsMutationTypes.SET_AUDIO, v);
      },
    },
    playlists() {
      return this.store.state.session.playlists.filter(
        (p) => p.userId == this.user?.id,
      );
    },
    isAdmin() {
      return this.store.getters.isAdmin;
    },
    loading() {
      return this.collection?.loading === true;
    },
    loadingLyrics() {
      return this.song?.loadingLyrics === true;
    },
    song() {
      return this.collection?.songs.find(
        (s) => s.id == this.store.state.songs.songId,
      ) as Song;
    },
    languageKey() {
      return this.store.getters.languageKey;
    },
    collection() {
      return this.store.getters.collection as Collection;
    },
    type() {
      return this.store.state.songs.view;
    },
    defaultTransposition() {
      return this.user.settings?.defaultTransposition ?? "C";
    },
    selectedTransposition: {
      get() {
        return this.store.state.songs.transposition ?? 0;
      },
      set(v: number) {
        this.store.commit(SongsMutationTypes.SET_TRANSPOSITION, v);
      },
    },
    viewCount() {
      return this.songViewCount ?? appSession.Views[this.song?.id ?? ""] ?? 0;
    },
    bandSyncStartContext() {
      if (!this.collection?.id || !this.song) return null;
      return {
        songbookId: this.collection.id,
        songNumber: this.song.getNumber(this.collection.id) ?? 0,
        transposition: this.store.state.songs.transposition ?? 0,
      };
    },
  },
  async beforeMount() {
    await this.load();
  },
  mounted() {
    this.favorite = this.favorites.has(this.song?.id);
  },
  watch: {
    "$route.params.collection"() {
      void this.load();
    },
    "$route.params.number"() {
      void this.load();
    },
    "store.state.songs.songId"(id: string | undefined) {
      this.favorite = this.favorites.has(id);
    },
    "store.state.songs.transposition"(
      value: number | undefined,
      previous: number | undefined,
    ) {
      if (value === previous || value === undefined || this.fullLoading) {
        return;
      }
      void this.transpose();

      // Followers: refresh open sheet with local instrument API transposition
      // (Flutter SheetsCubit.syncSessionTransposition). Solo / leader lyrics
      // changes leave sheet independent.
      const bandSync = this.store.state.bandSync;
      if (
        this.sheetMusicOptions?.show &&
        bandSync.role === "member" &&
        bandSync.followingLeaderUpdates
      ) {
        const defaultKey = this.user?.settings?.defaultTransposition ?? "C";
        this.sheetMusicOptions = {
          ...this.sheetMusicOptions,
          transposition: toSheetApiTransposition(value, defaultKey),
        };
      }
    },
  },
  methods: {
    /**
     * Re-points an open sheet at the song now being shown.
     *
     * `sheetMusicOptions` is component state and survives the params-only
     * route change a band sync follower gets when the leader picks another
     * song, so without this the previous song's sheet keeps rendering
     * (its `fileId` drives the OSMD key) while the lyrics and header
     * around it update.
     */
    rebindSheetMusicToCurrentSong() {
      const current = this.sheetMusicOptions;
      if (!current?.show) {
        return;
      }

      const sheets =
        this.song?.sheetMusic.filter((s) => !s.type.endsWith("sibelius")) ?? [];

      if (!sheets.length) {
        // Nothing to show for this song — fall back to the lyrics.
        this.sheetMusicOptions = { ...current, show: false };
        return;
      }

      if (sheets.some((s) => s.id === current.fileId)) {
        return;
      }

      const bandSync = this.store.state.bandSync;
      const following =
        bandSync.role === "member" && bandSync.followingLeaderUpdates;

      const sheet = sheets[0];
      this.sheetMusicOptions = {
        ...current,
        fileId: sheet.id,
        url: sheet.directUrl,
        type: sheet.type,
        originalKey: this.song?.originalKey ?? "C",
        // Followers land on the leader's key; everyone else opens the
        // new song the way selectSheetMusic would.
        transposition: following
          ? toSheetApiTransposition(
              this.store.state.songs.transposition ?? 0,
              this.defaultTransposition,
            )
          : transposer.getRelativeTransposition(
              this.defaultTransposition,
              true,
            ),
      };
    },
    setSong(songId: string) {
      this.$router.push({
        name: "song",
        params: {
          number: songId,
        },
      });
    },
    setLyrics() {
      if (!this.song) {
        return;
      }
      this.control.setSong(this.song);
      this.control.setContributors(
        appSession.contributors
          .filter((i) =>
            this.song?.participants.some((p) => p.contributorId === i.id),
          )
          .map((i) => i.item),
      );
      if (this.lyrics && !this.lyrics.ContainsChords)
        this.control.setLyrics(this.lyrics);
    },
    toggleSidebar() {
      this.control.toggleSidebar();
    },
    toggleSingleVerse() {
      this.control.toggleSingleVerse();
    },
    setTheme(theme: "dark" | "light") {
      this.control.setTheme(theme);
    },
    // PRESENTATION VIEW
    toggleVerse(index: string) {
      this.control.toggleVerse(index);
      this.control.AvailableVerses;
    },
    setSync(v: boolean) {
      this.control.setSync(v);
    },
    toggleAll() {
      if (this.lyrics) {
        this.control.toggleAll();
        this.unset = !this.control.AvailableVerses.length;
      }
    },
    refresh() {
      this.control.commit();
    },
    next() {
      this.control.next();
    },
    goToWidescreen() {
      window.location.replace("https://presentation.songtreasures.app");
    },
    previous() {
      this.control.previous();
    },
    openAdder() {
      this.show = true;
    },
    closeAdder() {
      this.show = false;
    },
    async load() {
      await this.doLoad();
      if (!this.song || !this.collection) {
        return;
      }
      application.setTitle(
        this.collection.key +
          " " +
          this.song.getNumber(this.collection.id) +
          " - " +
          this.song.getName(),
      );
    },
    async doLoad() {
      const loadId = ++this.loadGeneration;
      this.fullLoading = true;
      try {
        this.store.commit(SongsMutationTypes.SET_SHEETMUSIC_OPTIONS, {
          fileId: "",
          show: false,
          clef: "treble",
          originalKey: "C",
        });
        this.store.commit(SongsMutationTypes.SET_SHEETMUSIC_OPTIONS, undefined);

        const routeCollection = this.$route.params.collection as string;
        const routeNumber = this.$route.params.number as string;
        this.number = routeNumber;

        const current = this.store.getters.collection as Collection | undefined;
        const routeMatchesCurrent =
          current != null &&
          (current.id === routeCollection ||
            current.getKeys().includes(routeCollection));

        if (!routeMatchesCurrent) {
          await this.store.dispatch(
            SongsActionTypes.SELECT_COLLECTION,
            routeCollection,
          );
        }

        if (loadId !== this.loadGeneration) {
          return;
        }

        while (this.collection?.loading) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          if (loadId !== this.loadGeneration) {
            return;
          }
        }

        // Re-read route in case a newer navigation started while we waited.
        const number = this.$route.params.number as string;
        this.number = number;
        await this.store.dispatch(SongsActionTypes.SELECT_SONG, number);

        if (loadId !== this.loadGeneration) {
          return;
        }

        this.rebindSheetMusicToCurrentSong();

        if (this.song?.hasLyrics && this.collection) {
          if (this.lyrics?.ContainsChords) {
            this.lyrics = await this.song?.transposeLyrics(
              this.store.state.songs.transposition ?? 0,
              this.selectedLanguage,
            );
          } else {
            this.lyrics = await this.song?.getLyrics(
              this.store.state.songs.language,
            );
          }
        }

        if (loadId !== this.loadGeneration) {
          return;
        }

        const route = this.$route.fullPath;
        const log = () => {
          if (route == this.$route.fullPath && this.song) {
            analytics.viewSong(this.song.id).then((r) => {
              this.songViewCount = r;
              if (this.song) appSession.Views[this.song.id] = r;
            });
            this.store.dispatch(SessionActionTypes.LOG_SONG_ITEM, this.song);
          }
        };
        setTimeout(log, 5000);
        this.setView(this.store.state.songs.view);
      } finally {
        if (loadId === this.loadGeneration) {
          this.fullLoading = false;
        }
      }
    },
    async addToPlaylist(playlist: ICustomCollection) {
      // Add song to playlist with ID
      const song = this.song;

      if (song) {
        if (
          playlist.entries.find((e) => e.type == "song" && e.songId == song.id)
        ) {
          if (!confirm("Song is already in playlist. Add duplicate?")) return;
        }

        this.componentLoading[playlist.id] = true;
        await this.store.dispatch(SessionActionTypes.PLAYLIST_ADD_SONG, {
          playlistId: playlist.id,
          songId: song.id,
        });
        this.componentLoading[playlist.id] = false;

        notify(
          "success",
          "Added to playlist",
          "check",
          `Added "${song.getName()}" to playlist ${playlist.name}`,
          undefined,
          undefined,
          false,
        );
      }
      // Close the modal
      this.closeAdder();
    },
    goToEditPage() {
      window.open(
        `https://songtreasures.sanity.studio/desk/select-songs;${this.collection?.id};${this.song?.id}`,
      );
    },
    getTransposedLyrics(language?: string, format?: Format) {
      return this.song?.transposeLyrics(
        transposer.getRelativeTransposition(this.defaultTransposition),
        language ?? this.store.state.songs.language,
        undefined,
        this.store.state.songs.newMelody,
        format ?? "performance",
      );
    },
    async translate(language: string) {
      if (this.song?.hasLyrics === true) {
        switch (this.store.state.songs.view) {
          case "chords":
          case "performance":
            this.lyrics = (await this.getTransposedLyrics(
              language,
              "performance",
            )) as Lyrics;
            break;
          default:
            this.lyrics = await this.song.getLyrics(language);
        }
        this.store.commit(SongsMutationTypes.LANGUAGE, language);
      }
    },
    async setView(type: SongViewType) {
      if (this.type !== type) this.store.commit(SongsMutationTypes.VIEW, type);

      if (!this.song?.hasLyrics) return;

      if (type === "chords" || type === "performance") {
        this.lyrics = (await this.getTransposedLyrics(
          undefined,
          "performance",
        )) as Lyrics;
      } else {
        this.lyrics = await this.song?.getLyrics(
          this.store.state.songs.language,
        );
      }
    },
    async transpose(n?: number) {
      if (n !== undefined) {
        this.selectedTransposition = n;
      }

      if (this.song) {
        this.lyrics = await this.song?.transposeLyrics(
          this.selectedTransposition,
          this.store.state.songs.language,
          undefined,
          this.store.state.songs.newMelody,
          this.lyrics?.format,
        );
      }
    },
    async toggleFavorite() {
      await this.favorites.toggle(this.song?.id);
      this.favorite = !this.favorite;
    },
  },
});
</script>

<style lang="scss">
@import "../style/mixins";

.shadow-scroll {
  @include scrollShadow(white);
  max-height: 400px;
  overflow-y: auto;
}

.dark {
  .shadow-scroll {
    @include scrollShadow(#213f47);
  }
}
</style>
