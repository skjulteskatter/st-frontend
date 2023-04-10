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
            <div class="flex gap-2">
                <BaseButton
                    class="flex-grow"
                    @click="previous"
                    theme="secondary"
					:loading="loading && clicked == 'previous'"
                >
                    <template #icon>
                        <ArrowSmLeftIcon class="w-4 h-4" />
                    </template>
                    {{ $t("common_previous") }} {{ $t('common_song').toLocaleLowerCase() }}
                </BaseButton>
                <BaseButton
                    class="flex-grow"
                    @click="next"
                    theme="secondary"
					:loading="loading && clicked == 'next'"
                >
                    <template #icon>
                        <ArrowSmRightIcon class="w-4 h-4" />
                    </template>
                    {{ $t("common_next") }} {{ $t('common_song').toLocaleLowerCase() }}
                </BaseButton>
            </div>
            <input
				class="text-sm rounded-md bg-transparent border-black/20 dark:border-white/20 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-primary"
				v-model="number"
				type="number"
				@keyup="onInputKeyUp"
			/>
            <button v-if="filteredSong"
                :key="filteredSong.id"
				class="text-left text-sm p-3 rounded-md border border-black/10 dark:border-white/10 hover:ring-2 hover:ring-gray-400"
                @click="selectSong(filteredSong?.id)"
            >
                <b>{{ filteredSong.number }}</b>
                <p>{{ filteredSong.getName() }}</p>
            </button>
		</div>
	</BaseCard>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Song } from "@/classes";
import { ArrowSmRightIcon, ArrowSmLeftIcon } from "@heroicons/vue/outline";

export default defineComponent({
	name: "SongSelector",
	components: {
		ArrowSmLeftIcon,
		ArrowSmRightIcon,
	},
	props: {
		songs: {
			type: Array as PropType<Song[]>,
		},
		loading: {
			type: Boolean,
		}
	},
	data: () => ({
		number: null as number | null,
		clicked: null as "next" | "previous" | null
	}),
	emits: [
		"setSong",
		"previous",
		"next",
	],
	computed: {
		Songs(): Song[] {
			return this.songs ?? [];
		},
		filteredSong(): Song | null {
			const number = this.number;
			if (number) {
				const song = this.Songs.find(i => i.number == number);
				if (song)
					return song;
			}
			return null;
		},
	},
	methods: {
		selectSong(songId: string) {
			this.number = null;
			this.$emit("setSong", songId);
		},
		next() {
			this.$emit("next");
			this.clicked = "next"
		},
		previous() {
			this.$emit("previous")
			this.clicked = "previous"
		},
    	onInputKeyUp(e: KeyboardEvent): void {
			if(e.key === "Enter") {
				if(this.filteredSong) {
					this.selectSong(this.filteredSong.id);
				}
			}
		},
	},
});
</script>
