<template>
	<base-card class="md:col-span-2">
		<template #header>
			<div class="flex items-center">
				<h2 class="font-bold mr-4">{{ $t('common.collections') }}</h2>
				<tooltip :text="$t('tooltip.ownedCollections')" />
				<router-link
					v-if="collections?.length"
					to="/collections"
					class="flex gap-2 items-center px-2 py-1 rounded-md ml-auto text-sm hover:bg-black/5 dark:hover:bg-white/10"
				>
					{{ $t('playlist.seeall') }}
					<ArrowRightIcon class="h-4 w-4" />
				</router-link>
			</div>
		</template>
		<div class="flex flex-col gap-2 h-full">
			<div v-if="collections?.length" class="flex flex-col">
				<collection-card
					v-for="c in collections"
					:key="c.id"
					:collection="c"
				/>
			</div>
			<router-link to="/collections" v-else class="p-8 hover:bg-black/5 dark:hover:bg-white/10 rounded-md flex flex-col items-center">
				<CollectionIcon class="w-10 h-10 mb-4 opacity-50" />
				<small class="text-xs tracking-wide text-center">{{$t('dashboard.nocollections')}}</small>
				<p class="font-semibold flex gap-2 items-center">
					{{ $t('dashboard.gotocollections') }}
					<ArrowRightIcon class="w-4 h-4" />
				</p>
			</router-link>
		</div>
	</base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { CollectionCard } from "@/components";
import { ArrowRightIcon, CollectionIcon } from "@heroicons/vue/solid";
import { useStore } from "@/store";
import { Collection } from "@/classes";

@Options({
	name: "owned-collections",
	components: {
		CollectionCard,
		ArrowRightIcon,
		CollectionIcon,
	},
})
export default class OwnedCollections extends Vue {
	private store = useStore();

	public get collections(): Collection[] {
		return this.store.getters.collections.filter(c => c.available) ?? [];
	}
}
</script>
