<template>
	<BaseCard>
		<template #header>
			<div class="flex gap-4 items-center">
				<h4 class="font-bold leading-tight tracking-wide">{{ $t('common_change') }} {{ $t('common_song').toLowerCase() }}</h4>
				<Tooltip text="Skriv inn nummeret på sangen du bytter til" />
				<span class="ml-auto text-xs tracking-wider bg-green-500/20 text-green-600 rounded px-2 py-1">BETA</span>
			</div>
		</template>
		<div class="grid gap-4">
            <input
				class="text-sm rounded-md bg-transparent border-black/20 dark:border-white/20 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-primary"
				v-model="number"
				type="number"
        @keyup="onInputKeyUp"
			/>
            <button
                v-for="i in filteredSongs"
                :key="i.id"
				class="text-left text-sm p-3 rounded-md border border-black/10 dark:border-white/10 hover:ring-2 hover:ring-gray-400"
                @click="selectSong(i.id)"
            >
                <b>{{ i.number }}</b>
                <p>{{ i.getName() }}</p>
            </button>
		</div>
	</BaseCard>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { Song } from "@/classes";

export default defineComponent({
	name: "presentation-theme-selector",
	props: {
		songs: {
			type: Array as PropType<Song[]>,
		},
	},
	data: () => ({
		number: null as number | null,
	}),
	emits: ["setSong"],
	computed: {
		Songs() {
			return this.songs ?? [];
		},
		filteredSongs() {
			const number = this.number;
			if (number) {
				const song = this.Songs.find(i => i.number == number);
				if (song)
					return [song];
			}
			return [];
		},
	},
	methods: {
		selectSong(songId: string) {
			this.number = null;
			this.$emit("setSong", songId);
		},

    onInputKeyUp(e: KeyboardEvent): void {
      if(e.key === "Enter") {
        if(this.filteredSongs.length === 1) {
          this.selectSong(this.filteredSongs[0].id);
        }
      }
    },
	},
});
</script>
