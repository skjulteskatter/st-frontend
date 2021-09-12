<template>
	<base-card>
		<template #header>
			<div class="flex gap-4 items-center">
				<h4 class="font-bold leading-tight tracking-wide">{{ $t('common.change') }} {{ $t('common.song').toLowerCase() }}</h4>
				<tooltip text="Skriv inn nummeret på sangen du bytter til" />
				<span class="ml-auto text-xs tracking-wider bg-green-500/20 text-green-600 rounded px-2 py-1">BETA</span>
			</div>
		</template>
		<div class="grid gap-4">
            <input
				class="text-sm rounded-md bg-transparent border-black/20 dark:border-white/20 focus:border-transparent focus:ring-2 focus:ring-primary"
				v-model="number"
				type="number"
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
	</base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { CheckCircleIcon } from "@heroicons/vue/solid";
import { Song } from "@/classes";

@Options({
	name: "presentation-theme-selector",
	components: {
		CheckCircleIcon,
	},
	props: {
		songs: {
			type: Array,
		},
	},
	emits: ["setSong"],
})
export default class SongSelector extends Vue {
    public songs?: Song[];
    public number: number | null = null;

    public get Songs() {
        return this.songs ?? [];
    }

	public selectSong(songId: string) {
        this.number = null;
		this.$emit("setSong", songId);
	}

    public get filteredSongs() {
        const number = this.number;
        if (number) {
            const song = this.Songs.find(i => i.number == number);
            if (song)
                return [song];
        }
        return [];
    }
}
</script>
