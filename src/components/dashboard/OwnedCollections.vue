<template>
	<base-card class="border border-primary md:col-span-2">
		<div class="flex flex-col h-full">
			<div class="flex items-center mb-2">
				<h3 class="font-bold mr-4">{{ $t('common.collections') }}</h3>
				<tooltip :text="$t('tooltip.ownedCollections')" />
			</div>
			<div v-if="collections?.length" class="flex flex-col">
				<collection-card
					class="mt-2"
					v-for="c in collections"
					:key="c.id"
					:collection="c"
				/>
			</div>
			<div v-else class="p-8 bg-black bg-opacity-10 rounded-md border-dashed border-2 border-black border-opacity-10 flex flex-col justify-center items-center gap-4 flex-grow">
				<p class="text-gray-500 dark:text-gray-400 text-sm text-center">{{$t('dashboard.nocollections')}}</p>
				<router-link to="/collections" class="rounded bg-secondary py-2 px-4 shadow-md text-white focus:outline-none focus:ring focus:ring-primary ring-offset-2 dark:bg-white dark:text-gray-800">{{$t('dashboard.gotocollections')}}</router-link>
			</div>
		</div>
	</base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { CollectionCard } from "@/components";
import { useStore } from "@/store";
import { Collection } from "@/classes";

@Options({
	name: "owned-collections",
	components: {
		CollectionCard,
	},
})
export default class OwnedCollections extends Vue {
	private store = useStore();

	public get collections(): Collection[] {
		return this.store.getters.collections.filter(c => c.available) ?? [];
	}
}
</script>
