<template>
	<BaseCard class="2xl:col-span-2">
		<template #header>
			<div class="flex items-center">
				<h2 class="font-bold mr-4">{{ $t('common_collections') }}</h2>
				<Tooltip :text="$t('tooltip_ownedCollections')" />
				<router-link
					v-if="collections?.length"
					to="/collections"
					class="flex gap-2 items-center px-2 py-1 rounded-md ml-auto text-sm hover:bg-black/5 dark:hover:bg-white/10"
				>
					{{ $t('playlist_seeall') }}
					<ArrowRightIcon class="h-4 w-4" />
				</router-link>
			</div>
		</template>
		<div class="flex flex-col gap-2 h-full">
			<div v-if="collections?.length" class="flex flex-col gap-2">
				<button
					v-for="c in collections"
					:key="c.id"
					class="flex items-center gap-4 p-2 text-xs text-left relative rounded-md bg-white hover:bg-black/5 dark:bg-secondary dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2"
					:disabled="!c?.owned"
				>
					<img
						loading="lazy"
						:src="c.image"
						:alt="c.title"
						class="max-h-10 rounded border"
						width="40"
						height="40"
					/>
					<span class="text-xs font-medium tracking-wide w-full flex justify-between items-center">
						{{ c.title }}
					</span>
				</button>
				<button
					class="flex items-center gap-4 p-2 text-xs text-left relative rounded-md bg-white hover:bg-black/5 dark:bg-secondary dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2"
					@click="$router.push({ name: 'tutorials' })"
				>
					<img
						loading="lazy"
						src="/img/Tutorials.png"
						alt="Tutorials"
						class="max-h-10 rounded border"
						width="40"
						height="40"
					/>
					<span class="text-xs font-medium tracking-wide flex justify-between items-center">
						Tutorials
					</span>
					<span class="w-2 h-2 rounded-full bg-green-500"></span>
				</button>
			</div>
			<router-link to="/collections" v-else class="p-8 hover:bg-black/5 dark:hover:bg-white/10 rounded-md flex flex-col items-center">
				<div class="mb-4 p-4 rounded-full bg-black/5 dark:bg-white/5">
					<CollectionIcon class="w-6 h-6 opacity-50" />
				</div>
				<small class="text-xs tracking-wide text-center">{{$t('dashboard_noCollections')}}</small>
				<p class="font-semibold flex gap-2 items-center">
					{{ $t('dashboard_goToCollections') }}
					<ArrowRightIcon class="w-4 h-4" />
				</p>
			</router-link>
		</div>
	</BaseCard>
</template>
<script lang="ts" setup>
const collections = (await collectionService.list()).filter(i => i.owned);
</script>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ArrowRightIcon, CollectionIcon } from "@heroicons/vue/outline";
import { Collection } from "@/classes";
import { appSession } from "@/services/session";
import collectionService from "@/services/collectionService";

export default defineComponent({
	name: "owned-collections",
	components: {
		ArrowRightIcon,
		CollectionIcon,
	},
});
</script>
