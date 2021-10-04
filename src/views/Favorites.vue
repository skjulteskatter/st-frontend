<template>
	<h1 class="font-bold text-2xl">Favorites</h1>
	<p>{{ favorites }}</p>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { Options, Vue } from "vue-class-component";

@Options({
	name: "favorites-view",
})
export default class Favorites extends Vue {
	public store = useStore();

	public get favorites() {
		return this.store.getters.favorites;
	}
}
</script>
