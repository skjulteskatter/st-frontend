<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-2">
      <button
        class="flex gap-2 items-center hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md py-1 px-2"
        @click="close"
      >
        <ArrowLeftIcon class="w-4 h-4" />
        <span>{{ $t("common_back") }}</span>
      </button>
      <div class="flex gap-2 items-center ml-auto">
        <BaseButton v-if="ownedId" theme="error" @click="remove">
          <template #icon>
            <TrashIcon class="w-4 h-4" />
          </template>
          {{ $t("common_delete") }}
        </BaseButton>
        <BaseButton v-if="ownedId && shareUrl" theme="tertiary" @click="copyLink">
          <template #icon>
            <LinkIcon class="w-4 h-4" />
          </template>
          {{ $t("sheetEdits_copyLink") }}
        </BaseButton>
        <BaseButton
          :loading="saving"
          :disabled="!dirty || !name.trim() || !baseXml"
          @click="save"
        >
          <template #icon>
            <CheckIcon class="w-4 h-4" />
          </template>
          {{ $t("common_save") }}
        </BaseButton>
      </div>
    </div>

    <SongInfoCard v-if="song && collection" :song="song" :collection="collection" :language="languageKey" />

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      <BaseCard class="lg:col-span-3">
        <p v-if="error" class="text-sm text-red-700 mb-2">{{ error }}</p>
        <div class="relative overflow-x-auto min-h-[16rem]">
          <Loader :loading="loading" position="local" />
          <div ref="score" class="sheet-editor-score bg-white rounded"></div>
        </div>
      </BaseCard>

      <aside class="flex flex-col gap-4 lg:sticky lg:top-20">
        <BaseCard>
          <template #header>
            <h3 class="font-bold">{{ $t("sheetEdits_version") }}</h3>
          </template>
          <div class="flex flex-col gap-4">
            <BaseDropdown origin="left" :label="versionLabel">
              <div class="max-h-64 overflow-y-auto min-w-[12rem]">
                <button
                  :class="{ 'bg-primary text-white': !currentId }"
                  class="py-1 px-4 rounded w-full text-left"
                  @click="selectVersion(null)"
                >
                  {{ $t("sheetEdits_original") }}
                </button>
                <button
                  v-for="v in versions"
                  :key="v.id"
                  :class="{ 'bg-primary text-white': currentId == v.id }"
                  class="py-1 px-4 rounded w-full flex justify-between gap-4"
                  @click="selectVersion(v)"
                >
                  <span>{{ v.name }}</span>
                  <span class="opacity-50" v-if="v.ownerId != userId">
                    {{ $t("sheetEdits_shared") }}
                  </span>
                </button>
              </div>
            </BaseDropdown>
            <BaseInput v-model="name" :label="$t('sheetEdits_name')" maxlength="100" @input="dirty = true" />
          </div>
        </BaseCard>

        <BaseCard>
          <template #header>
            <h3 class="font-bold">
              {{ selection ? describePosition(selection.measure, selection.offset) : $t("sheetEdits_selection") }}
            </h3>
          </template>
          <p v-if="!selection" class="text-sm opacity-50">{{ $t("sheetEdits_hint") }}</p>
          <div v-else class="flex flex-col gap-4">
            <!-- One chord per beat the note lasts (four over a whole note in 4/4), plus any added between beats -->
            <label v-for="position in chordPositions" :key="positionKey(position)">
              <small class="block uppercase tracking-wide text-xs mb-1">
                {{ $t("sheetEdits_chord") }}
                <template v-if="chordPositions.length > 1">· {{ $t("sheetEdits_beat") }} {{ beatLabel(position) }}</template>
              </small>
              <div class="flex gap-2 items-center">
                <input
                  v-model="chordInputs[positionKey(position)]"
                  :data-chord-position="positionKey(position)"
                  class="w-full px-3 py-2 rounded-md border border-black/20 dark:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2 dark:bg-secondary"
                  :placeholder="$t('sheetEdits_chordPlaceholder')"
                  @keydown.enter="applyChord(position)"
                  @blur="applyChord(position)"
                />
                <!-- mousedown.prevent: the field keeps focus, so its blur doesn't apply a half-typed chord first -->
                <button
                  v-if="chordAt(position) || isExtraPosition(position)"
                  type="button"
                  class="p-2 rounded-md text-red-700 hover:bg-black/5 dark:hover:bg-white/10"
                  :title="$t('sheetEdits_removeChord')"
                  @mousedown.prevent
                  @click="removeChord(position)"
                >
                  <XIcon class="w-4 h-4" />
                </button>
              </div>
              <small v-if="chordErrors[positionKey(position)]" class="text-red-700">{{ chordErrors[positionKey(position)] }}</small>
            </label>
            <select
              v-if="addablePositions.length"
              value=""
              class="w-full px-3 py-2 rounded-md border border-dashed border-black/20 dark:border-white/20 bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              @change="onAddPosition"
            >
              <option value="" disabled>+ {{ $t("sheetEdits_addChord") }}</option>
              <option v-for="p in addablePositions" :key="positionKey(p)" :value="positionKey(p)">
                {{ $t("sheetEdits_beat") }} {{ beatLabel(p) }}
              </option>
            </select>

            <div v-if="selectedNotes.some((n) => n.original)" class="flex flex-col gap-2">
              <small class="block uppercase tracking-wide text-xs">{{ $t("sheetEdits_note") }}</small>
              <div v-if="selectedNotes.length > 1" class="flex flex-wrap gap-1">
                <button
                  v-for="(n, i) in selectedNotes"
                  :key="i"
                  class="px-2 py-1 rounded-md border border-black/20 dark:border-white/20"
                  :class="{ 'bg-primary text-white border-primary': i == selection.note }"
                  @click="selection.note = i"
                >
                  {{ currentPitchText(i) }}
                </button>
              </div>
              <span v-else class="font-semibold">{{ currentPitchText(0) }}</span>
              <div v-if="selectedNote?.original" class="grid grid-cols-2 gap-2">
                <BaseButton size="small" theme="secondary" @click="move(1, false)">↑ {{ $t("sheetEdits_stepUp") }}</BaseButton>
                <BaseButton size="small" theme="secondary" @click="move(-1, false)">↓ {{ $t("sheetEdits_stepDown") }}</BaseButton>
                <BaseButton size="small" theme="secondary" @click="move(1, true)">♯ {{ $t("sheetEdits_semitoneUp") }}</BaseButton>
                <BaseButton size="small" theme="secondary" @click="move(-1, true)">♭ {{ $t("sheetEdits_semitoneDown") }}</BaseButton>
              </div>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <template #header>
            <div class="flex items-center gap-2">
              <h3 class="font-bold">{{ $t("sheetEdits_changes") }}</h3>
              <span v-if="edits.length" class="ml-auto text-sm opacity-50">{{ edits.length }}</span>
            </div>
          </template>
          <p v-if="skipped.length" class="text-sm text-yellow-700 mb-2">
            {{ $t("sheetEdits_skipped").replace("$count", skipped.length.toString()) }}
            <button class="underline" @click="removeSkipped">
              {{ $t("sheetEdits_removeSkipped") }}
            </button>
          </p>
          <p v-if="!edits.length" class="text-sm opacity-50">{{ $t("sheetEdits_noChanges") }}</p>
          <div class="flex flex-col gap-1 max-h-80 overflow-y-auto">
            <div
              v-for="(edit, i) in edits"
              :key="i"
              class="flex items-center gap-2 text-sm rounded-md px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10"
              :class="{ 'opacity-50 line-through': skipped.includes(edit) }"
            >
              <span class="flex-grow">{{ describeEdit(edit) }}</span>
              <button class="text-red-700" :title="$t('common_delete')" @click="removeEdit(edit)">
                <XIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </BaseCard>
      </aside>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, markRaw, PropType } from "vue";
import { OpenSheetMusicDisplay, VexFlowGraphicalNote, GraphicalNote } from "opensheetmusicdisplay";
import { ArrowLeftIcon, CheckIcon, LinkIcon, TrashIcon, XIcon } from "@heroicons/vue/solid";
import Loader from "@/components/Loader.vue";
import { SongInfoCard } from "@/components/songs";
import { Collection, Song } from "@/classes";
import { notify } from "@/services/notify";
import { parseChord, sameChord } from "@/services/sheetEdits/chords";
import {
  applyEdits,
  chordPositionsOver,
  fetchMusicXml,
  lessThan,
  subdivisionsOver,
  formatPitch,
  fraction,
  hashMusicXml,
  indexScore,
  moveChromatic,
  moveDiatonic,
  NoteEntry,
  parseMusicXml,
  readHarmony,
  readPitch,
  sameFraction,
  samePitch,
  ScoreIndex,
  serializeMusicXml,
  tiedNotes,
} from "@/services/sheetEdits/musicxml";
import { sheetEditsService } from "@/services/sheetEdits/sheetEditsService";
import type { Fraction, Harmony, Pitch, SheetEdit, SheetEdits, Step } from "@/services/sheetEdits/types";

type Selection = {
  part: string;
  measure: number;
  offset: Fraction;
  voice: string;
  /** Index into the selected notes, for chords with several notes. */
  note: number;
};

/** Layout width and zoom per size, the same as the backend's SheetSize, so the editor looks like the rendered sheet. */
const sizes: Record<string, { width: number; zoom: number }> = {
  sm: { width: 1920, zoom: 0.8 },
  md: { width: 1280, zoom: 1.2 },
  lg: { width: 1280, zoom: 1.6 },
  xl: { width: 1280, zoom: 2.0 },
};

const fundamentalSteps: Record<number, Step> = { 0: "C", 2: "D", 4: "E", 5: "F", 7: "G", 9: "A", 11: "B" };

export default defineComponent({
  name: "sheet-editor",
  components: {
    Loader,
    SongInfoCard,
    ArrowLeftIcon,
    CheckIcon,
    LinkIcon,
    TrashIcon,
    XIcon,
  },
  props: {
    fileId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    /** Version to open. The current user's own versions are saved in place, others' as a copy. */
    editId: {
      type: String as PropType<string | null>,
      default: null,
    },
    size: {
      type: String as PropType<"sm" | "md" | "lg" | "xl">,
      default: "md",
    },
    song: {
      type: Object as PropType<Song>,
    },
    collection: {
      type: Object as PropType<Collection>,
    },
    languageKey: {
      type: String,
      default: "en",
    },
  },
  /** `version` is the open version's id (null for the original); `close` passes the id to show afterwards. */
  emits: ["version", "close"],
  data() {
    return {
      userId: sheetEditsService.userId,
      versions: [] as SheetEdits[],
      /** The open version, also when it belongs to someone else. */
      currentId: null as string | null,
      /** The open version when the current user owns it, so saving updates it. */
      ownedId: null as string | null,
      name: this.$t("sheetEdits_untitled"),
      edits: [] as SheetEdit[],
      dirty: false,
      baseXml: "",
      baseHash: "",
      osmd: null as OpenSheetMusicDisplay | null,
      index: null as ScoreIndex | null,
      noteElements: markRaw(new Map<NoteEntry, SVGGElement>()),
      /** Bumped after every render, since the index itself isn't reactive. */
      renderVersion: 0,
      skipped: [] as SheetEdit[],
      selection: null as Selection | null,
      /** Chord field per position over the selected note, keyed by positionKey(). */
      chordInputs: {} as Record<string, string>,
      chordErrors: {} as Record<string, string>,
      /** Positions between beats the user added a chord field for, over the selected note. */
      extraPositions: [] as Fraction[],
      error: "",
      loading: true,
      saving: false,
    };
  },
  async mounted() {
    window.addEventListener("keydown", this.onKeydown);
    try {
      const [xml] = await Promise.all([fetchMusicXml(this.url), this.loadVersions()]);
      this.baseXml = xml;
      this.baseHash = await hashMusicXml(xml);
      const initial = this.editId
        ? this.versions.find((v) => v.id === this.editId) ?? (await sheetEditsService.get(this.editId))
        : null;
      this.openVersion(initial?.fileId === this.fileId ? initial : null);
      this.osmd = markRaw(
        new OpenSheetMusicDisplay(this.$refs.score as HTMLElement, {
          // A resize re-renders without our click handlers
          autoResize: false,
          // The same options as the backend (ST.Utilities)
          backend: "svg",
          pageBackgroundColor: "#FFFFFF",
          pageFormat: "Endless",
          drawingParameters: "default",
          drawPartNames: false,
          drawTitle: false,
          drawSubtitle: false,
          drawComposer: false,
          drawLyricist: false,
          drawCredits: false,
          setWantedStemDirectionByXml: false,
          measureNumberInterval: 4,
          useXMLMeasureNumbers: false,
          drawPartAbbreviations: true,
          drawSlurs: true,
          percussionOneLineCutoff: 4,
          autoBeam: true,
          autoBeamOptions: {
            beam_rests: false,
            beam_middle_rests_only: false,
            maintain_stem_directions: false,
          },
          drawHiddenNotes: true,
          newSystemFromXML: true,
          stretchLastSystemLine: true,
          defaultFontFamily: "Arial",
        }),
      );
      await this.render();
    } catch (e) {
      this.error = e instanceof Error ? e.message : String(e);
    } finally {
      this.loading = false;
    }
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.onKeydown);
    this.osmd?.clear();
  },
  computed: {
    versionLabel(): string {
      return this.currentId ? this.versions.find((v) => v.id === this.currentId)?.name ?? this.name : this.$t("sheetEdits_original");
    },
    shareUrl(): string | undefined {
      if (!this.song || !this.collection) return undefined;
      const path = this.$router.resolve({
        name: "song",
        params: { collection: this.collection.key ?? this.collection.id, number: this.song.getNumber(this.collection.id) },
        query: { sheet: this.fileId },
      }).href;
      return new URL(path, window.location.origin).toString();
    },
    selectedNotes(): NoteEntry[] {
      // Depends on renderVersion: entries are rebuilt on every render
      if (!this.index || !this.selection || this.renderVersion < 0) return [];
      const s = this.selection;
      return this.index.notes
        .filter((n) => n.part === s.part && n.measure === s.measure && n.voice === s.voice && sameFraction(n.offset, s.offset))
        .sort((a, b) => this.pitchValue(readPitch(b.element)) - this.pitchValue(readPitch(a.element)));
    },
    selectedNote(): NoteEntry | undefined {
      return this.selection ? this.selectedNotes[this.selection.note] ?? this.selectedNotes[0] : undefined;
    },
    /** The beats over the selected note, chords already between them, and positions added with +. */
    chordPositions(): Fraction[] {
      const note = this.selectedNote;
      if (!note || !this.index) return [];
      const between = this.index.harmonies
        .filter((h) => h.part === note.part && h.measure === note.measure && !lessThan(h.offset, note.offset) && lessThan(h.offset, note.end))
        .map((h) => h.offset);
      const positions: Fraction[] = [];
      for (const p of [...chordPositionsOver(note), ...between, ...this.extraPositions]) {
        if (!positions.some((q) => sameFraction(p, q))) positions.push(p);
      }
      return positions.sort((a, b) => (lessThan(a, b) ? -1 : 1));
    },
    /** Positions between the beats that have no chord field yet. */
    addablePositions(): Fraction[] {
      const note = this.selectedNote;
      if (!note) return [];
      return subdivisionsOver(note).filter((p) => !this.chordPositions.some((q) => sameFraction(p, q)));
    },
  },
  watch: {
    selection: {
      handler() {
        this.refreshChords();
        this.highlight();
      },
      deep: true,
    },
  },
  methods: {
    async loadVersions() {
      const mine = await sheetEditsService.listMine(this.fileId);
      // Keep a shared version that is open in the list
      const shared = this.versions.find((v) => v.id === this.currentId && v.ownerId !== this.userId);
      this.versions = shared ? [...mine, shared] : mine;
    },
    /** Loads a version into the editor; null starts a new version from the original. */
    openVersion(version: SheetEdits | null) {
      if (version && !this.versions.some((v) => v.id === version.id)) this.versions.push(version);
      const owned = version?.ownerId === this.userId;
      this.currentId = version?.id ?? null;
      this.ownedId = owned ? version?.id ?? null : null;
      this.name = version?.name ?? this.$t("sheetEdits_untitled");
      this.edits = version?.edits.map((e) => ({ ...e })) ?? [];
      // Someone else's version is only saved as a copy
      this.dirty = !!version && !owned;
      this.selection = null;
      this.extraPositions = [];
      this.$emit("version", this.currentId);
    },
    async selectVersion(version: SheetEdits | null) {
      if ((version?.id ?? null) === this.currentId) return;
      if (this.dirty && !confirm(this.$t("sheetEdits_unsaved"))) return;
      this.openVersion(version);
      await this.rerender();
    },
    pitchValue(pitch: Pitch | null) {
      return pitch ? pitch.octave * 12 + "CDEFGAB".indexOf(pitch.step) * 2 + pitch.alter : -Infinity;
    },
    currentPitchText(i: number) {
      const pitch = this.selectedNotes[i] && readPitch(this.selectedNotes[i].element);
      return pitch ? formatPitch(pitch) : this.$t("sheetEdits_rest");
    },
    positionKey(position: Fraction) {
      return `${position[0]}/${position[1]}`;
    },
    /** Beat number in the measure, counted in the note's time signature. */
    beatLabel(position: Fraction) {
      const beat = this.selectedNote?.beat ?? [1, 4];
      // Position in beats: a whole beat plus a part of one, e.g. 1 ⅔ for the 3rd eighth in 6/8
      const numerator = position[0] * beat[1];
      const denominator = position[1] * beat[0];
      const whole = Math.floor(numerator / denominator);
      const [n, d] = fraction(numerator - whole * denominator, denominator);
      if (n === 0) return `${whole + 1}`;
      const vulgar: Record<string, string> = {
        "1/2": "½", "1/3": "⅓", "2/3": "⅔", "1/4": "¼", "3/4": "¾", "1/6": "⅙", "5/6": "⅚",
        "1/8": "⅛", "3/8": "⅜", "5/8": "⅝", "7/8": "⅞",
      };
      return `${whole + 1} ${vulgar[`${n}/${d}`] ?? `${n}/${d}`}`;
    },
    isExtraPosition(position: Fraction) {
      return this.extraPositions.some((p) => sameFraction(p, position));
    },
    /** Removes the chord at a position, and the field when it was added with +. */
    async removeChord(position: Fraction) {
      this.extraPositions = this.extraPositions.filter((p) => !sameFraction(p, position));
      this.chordInputs[this.positionKey(position)] = "";
      if (this.chordAt(position)) await this.applyChord(position);
    },
    /** Adds a chord field at a position picked from the + list, and focuses it. */
    onAddPosition(event: Event) {
      const select = event.target as HTMLSelectElement;
      const key = select.value;
      select.value = "";
      const position = this.addablePositions.find((p) => this.positionKey(p) === key);
      if (!position) return;
      this.extraPositions.push(position);
      this.chordInputs[key] = "";
      void this.$nextTick(() => (document.querySelector(`[data-chord-position="${key}"]`) as HTMLInputElement | null)?.focus());
    },
    /** The chord at a position in the selected note's measure, as currently shown. */
    chordAt(offset: Fraction): Harmony | null {
      const s = this.selection;
      if (!this.index || !s) return null;
      const entry = this.index.harmonies.find((h) => h.part === s.part && h.measure === s.measure && sameFraction(h.offset, offset));
      return entry ? readHarmony(entry.element) : null;
    },
    /** Fills the chord fields from the score. */
    refreshChords() {
      this.chordInputs = Object.fromEntries(this.chordPositions.map((p) => [this.positionKey(p), this.chordAt(p)?.text ?? ""]));
      this.chordErrors = {};
    },

    /** Applies the edits to a fresh copy of the original and renders it. */
    async render() {
      if (!this.osmd || !this.baseXml) return;
      const index = indexScore(parseMusicXml(this.baseXml));
      this.skipped = applyEdits(index, this.edits);
      this.index = markRaw(index);

      await this.osmd.load(serializeMusicXml(index.doc));

      // Lay out at the backend's width and zoom, then scale the result to fit
      const container = this.$refs.score as HTMLElement;
      const size = sizes[this.size] ?? sizes.md;
      container.style.width = `${size.width}px`;
      this.osmd.zoom = size.zoom;
      this.osmd.render();
      container.style.width = "";
      container.querySelectorAll("svg").forEach((svg) => {
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        svg.style.width = "100%";
        svg.style.height = "auto";
        // VexFlow also gives the wrapping div a fixed pixel width
        if (svg.parentElement && svg.parentElement !== container) svg.parentElement.style.width = "";
      });
      this.bindNotes();
      this.renderVersion++;
      this.highlight();
    },

    /** Connects every drawn note to its entry in the index and makes it clickable. */
    bindNotes() {
      // Vue's unwrapped type of the (raw) instance doesn't match OSMD's own classes
      const osmd = this.osmd as unknown as OpenSheetMusicDisplay | null;
      const index = this.index;
      if (!osmd || !index) return;
      this.noteElements.clear();

      for (const staves of osmd.GraphicSheet.MeasureList) {
        for (const measure of staves) {
          if (!measure?.parentSourceMeasure) continue;
          for (const staffEntry of measure.staffEntries) {
            for (const voiceEntry of staffEntry.graphicalVoiceEntries) {
              for (const graphicalNote of voiceEntry.notes) {
                const entry = this.findEntry(index, graphicalNote, measure.parentSourceMeasure.measureListIndex);
                const element = (graphicalNote as VexFlowGraphicalNote).getSVGGElement?.();
                if (!entry || !element) continue;
                this.noteElements.set(entry, element);
                element.style.cursor = "pointer";
                element.onclick = (event) => {
                  event.stopPropagation();
                  this.select(entry);
                };
              }
            }
          }
        }
      }
    },
    findEntry(index: ScoreIndex, graphicalNote: GraphicalNote, measure: number): NoteEntry | undefined {
      const note = graphicalNote.sourceNote;
      if (!note || note.IsGraceNote) return undefined;
      const voiceEntry = note.ParentVoiceEntry;
      const part = note.ParentStaffEntry?.ParentStaff?.ParentInstrument?.IdString;
      const offset = fraction(voiceEntry.Timestamp.GetExpandedNumerator(), voiceEntry.Timestamp.Denominator);
      const pitch: Pitch | null = note.isRest()
        ? null
        : {
            step: fundamentalSteps[note.Pitch.FundamentalNote],
            alter: note.Pitch.AccidentalHalfTones,
            octave: note.Pitch.Octave + 3,
          };

      const candidates = index.notes.filter(
        (n) => n.part === part && n.measure === measure && sameFraction(n.offset, offset) && samePitch(readPitch(n.element), pitch),
      );
      const voice = voiceEntry.ParentVoice?.VoiceId?.toString();
      return candidates.find((n) => n.voice === voice) ?? candidates[0];
    },
    select(entry: NoteEntry) {
      this.extraPositions = [];
      const notes = this.index?.notes.filter(
        (n) => n.part === entry.part && n.measure === entry.measure && n.voice === entry.voice && sameFraction(n.offset, entry.offset),
      ) ?? [entry];
      notes.sort((a, b) => this.pitchValue(readPitch(b.element)) - this.pitchValue(readPitch(a.element)));
      this.selection = {
        part: entry.part,
        measure: entry.measure,
        offset: entry.offset,
        voice: entry.voice,
        note: Math.max(0, notes.indexOf(entry)),
      };
    },
    highlight() {
      this.noteElements.forEach((element) => element.classList.remove("sheet-editor-selected"));
      for (const note of this.selectedNotes) {
        this.noteElements.get(note)?.classList.add("sheet-editor-selected");
      }
    },

    /** Replaces the edit with the same address, or drops it when the value is back to the original. */
    putEdit(matches: (e: SheetEdit) => boolean, edit: SheetEdit | null) {
      const i = this.edits.findIndex(matches);
      if (i >= 0) this.edits.splice(i, 1);
      if (edit) this.edits.splice(i >= 0 ? i : this.edits.length, 0, edit);
      this.dirty = true;
    },
    async applyChord(offset: Fraction) {
      const s = this.selection;
      if (!s || this.loading) return;
      const key = this.positionKey(offset);
      const text = (this.chordInputs[key] ?? "").trim();
      const current = this.chordAt(offset);
      if (text === (current?.text ?? "")) return;

      const to = text ? parseChord(text) : null;
      if (text && !to) {
        this.chordErrors[key] = this.$t("sheetEdits_invalidChord");
        return;
      }
      delete this.chordErrors[key];

      const matches = (e: SheetEdit) =>
        e.type === "chord" && e.part === s.part && e.measure === s.measure && sameFraction(e.offset, offset);
      const existing = this.edits.find(matches);
      // Unedited positions still hold the original chord
      const from = existing ? (existing as { from: Harmony | null }).from : current;
      const unchanged = sameChord(from, to) && from?.kindText === to?.kindText;

      this.putEdit(matches, unchanged ? null : { type: "chord", part: s.part, measure: s.measure, offset, from, to });
      await this.rerender();
    },
    async move(direction: 1 | -1, chromatic: boolean) {
      const note = this.selectedNote;
      const pitch = note && readPitch(note.element);
      if (!note || !pitch || !this.index || this.loading) return;

      const to = chromatic ? moveChromatic(pitch, direction, note.fifths) : moveDiatonic(pitch, direction, note.fifths);
      for (const n of [note, ...tiedNotes(this.index, note)]) {
        if (!n.original) continue;
        const original = n.original;
        this.putEdit(
          (e) =>
            e.type === "pitch" &&
            e.part === n.part &&
            e.measure === n.measure &&
            e.voice === n.voice &&
            sameFraction(e.offset, n.offset) &&
            samePitch(e.from, original),
          samePitch(to, original)
            ? null
            : { type: "pitch", part: n.part, measure: n.measure, voice: n.voice, offset: n.offset, from: original, to },
        );
      }
      await this.rerender();
    },
    async rerender() {
      this.loading = true;
      try {
        await this.render();
      } finally {
        this.loading = false;
      }
      // Keep the chord fields in step with the score
      this.refreshChords();
    },
    async removeEdit(edit: SheetEdit) {
      this.edits.splice(this.edits.indexOf(edit), 1);
      this.dirty = true;
      await this.rerender();
    },
    async removeSkipped() {
      this.edits = this.edits.filter((e) => !this.skipped.includes(e));
      this.dirty = true;
      await this.rerender();
    },
    onKeydown(event: KeyboardEvent) {
      if (!this.selectedNote || (event.target as HTMLElement)?.tagName === "INPUT") return;
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        this.move(event.key === "ArrowUp" ? 1 : -1, event.shiftKey);
      }
    },

    describePosition(measure: number, offset: Fraction) {
      const beat = (offset[0] * 4) / offset[1] + 1;
      return `${this.$t("sheetEdits_measure")} ${measure + 1}, ${this.$t("sheetEdits_beat")} ${Number.isInteger(beat) ? beat : beat.toFixed(2)}`;
    },
    describeEdit(edit: SheetEdit) {
      const position = this.describePosition(edit.measure, edit.offset);
      if (edit.type === "chord") return `${position}: ${edit.from?.text ?? "–"} → ${edit.to?.text ?? "–"}`;
      return `${position}: ${formatPitch(edit.from)} → ${formatPitch(edit.to)}`;
    },

    async save() {
      this.saving = true;
      try {
        const name = this.name.trim();
        if (this.ownedId) {
          await sheetEditsService.update(this.ownedId, { name, baseHash: this.baseHash, edits: this.edits });
        } else {
          this.ownedId = await sheetEditsService.create(this.fileId, name, this.baseHash, this.edits);
        }
        this.currentId = this.ownedId;
        this.dirty = false;
        await this.loadVersions();
        notify("success", this.$t("sheetEdits_saved"), "check", undefined, undefined, undefined, false);
        this.$emit("version", this.currentId);
      } catch (e) {
        this.error = e instanceof Error ? e.message : String(e);
      } finally {
        this.saving = false;
      }
    },
    async remove() {
      if (!this.ownedId || !confirm(this.$t("sheetEdits_deleteConfirm"))) return;
      await sheetEditsService.delete(this.ownedId);
      this.dirty = false;
      this.openVersion(null);
      await this.loadVersions();
      await this.rerender();
    },
    copyLink() {
      if (!this.ownedId || !this.shareUrl) return;
      const url = new URL(this.shareUrl);
      url.searchParams.set("edits", this.ownedId);
      void navigator.clipboard.writeText(url.toString());
      notify("success", this.$t("sheetEdits_linkCopied"), "check", undefined, undefined, undefined, false);
    },
    close() {
      if (this.dirty && !confirm(this.$t("sheetEdits_unsaved"))) return;
      this.$emit("close", this.currentId);
    },
  },
});
</script>

<style lang="scss">
.sheet-editor-score {
  .sheet-editor-selected path,
  .sheet-editor-selected rect {
    fill: #2563eb;
    stroke: #2563eb;
  }
}
</style>
