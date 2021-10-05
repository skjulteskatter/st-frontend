<template>
	<h1 class="font-bold text-2xl">Favorites</h1>
	<p>{{ favorites }}</p>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";

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
