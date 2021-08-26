<template>
	<base-card>
		<template #header>
			<div class="flex gap-4 items-center justify-between">
				<h4 class="text-sm font-bold tracking-wide">{{ $t('common.change') }} {{ $t('common.song').toLowerCase() }}</h4>
				<span class="text-xs tracking-wider bg-green-500/20 text-green-600 rounded px-2 py-1">BETA</span>
			</div>
		</template>
		<div class="grid gap-4">
            <input v-model="number" type="number" />
            <button 
                v-for="i in filteredSongs" 
                :key="i.id"
				class="text-left p-2 rounded-md bg-white text-black border border-black/20"
                @click="selectSong(i.id)"
            >
                <b>{{i.number}}</b>
                <div>{{i.getName()}}</div>
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
