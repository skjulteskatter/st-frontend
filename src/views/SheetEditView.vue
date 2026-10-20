<template>
  <!-- A single root element, for the route transition -->
  <div>
    <Loader :loading="loading">
      <SheetEditor
        v-if="song && collection && sheet"
        :key="sheet.id"
        :fileId="sheet.id"
        :url="sheet.directUrl"
        :editId="editId"
        :size="size"
        :song="song"
        :collection="collection"
        :languageKey="languageKey"
        @version="setVersion"
        @close="close"
      />
      <BaseCard v-else>
        <p>{{ $t("sheetEdits_notFound") }}</p>
      </BaseCard>
    </Loader>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";
import { Collection, SheetMusicTypes, Song } from "@/classes";
import Loader from "@/components/Loader.vue";
import { appSession } from "@/services/session";
import { useStore } from "@/store";
import { SongsActionTypes } from "@/store/modules/songs/action-types";

/**
 * Editor for a song's sheet music, at the song's route + `/edit`.
 * Query: `fileid` (the sheet), `edits` (version to open), `size` (as on the song page).
 */
export default defineComponent({
  name: "sheet-edit-view",
  components: {
    Loader,
    // Loaded on demand so OSMD is only downloaded when editing
    SheetEditor: defineAsyncComponent(() => import("@/components/sheetEdits/SheetEditor.vue")),
  },
  data: () => ({
    store: useStore(),
    loading: true,
  }),
  computed: {
    collection() {
      return this.store.getters.collection as Collection | undefined;
    },
    song(): Song | undefined {
      return this.collection?.songs.find((s) => s.id == this.store.state.songs.songId);
    },
    sheet() {
      const fileId = this.$route.query.fileid as string | undefined;
      return this.song?.sheetMusic.find((s) => s.id === fileId && s.type === SheetMusicTypes.XML);
    },
    editId() {
      return (this.$route.query.edits as string | undefined) ?? null;
    },
    size() {
      const size = this.$route.query.size as string | undefined;
      return size === "sm" || size === "lg" || size === "xl" ? size : "md";
    },
    languageKey() {
      return this.store.getters.languageKey as string;
    },
  },
  async mounted() {
    // Only some roles may edit; others go back to the song
    if (appSession.User?.CanEditSheets !== true) {
      void this.$router.replace({ name: "song", params: this.$route.params });
      return;
    }
    try {
      const routeCollection = this.$route.params.collection as string;
      const current = this.collection;
      if (!current || !(current.id === routeCollection || current.getKeys().includes(routeCollection))) {
        await this.store.dispatch(SongsActionTypes.SELECT_COLLECTION, routeCollection);
      }
      while (this.collection?.loading) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      await this.store.dispatch(SongsActionTypes.SELECT_SONG, this.$route.params.number as string);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    /** Keeps the open version in the URL, so reloading or sharing the page opens it again. */
    setVersion(id: string | null) {
      const query = { ...this.$route.query };
      if (id) query.edits = id;
      else delete query.edits;
      void this.$router.replace({ query });
    },
    /** Back to the song with this sheet open, showing the version that was open in the editor. */
    close(id: string | null) {
      void this.$router.push({
        name: "song",
        params: this.$route.params,
        query: { sheet: this.sheet?.id, ...(id ? { edits: id } : {}) },
      });
    },
  },
});
</script>
