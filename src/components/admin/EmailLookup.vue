<template>
	<BaseCard>
		<template #header>
			<div class="flex justify-between items-baseline">
				<h3 class="font-bold">Email lookup</h3>
				<SearchInput v-model="email" @search="lookupEmail" />
			</div>
		</template>
		<div v-if="response.user" class="grid md:grid-cols-2 gap-6">
			<div class="flex gap-4 flex-col">
				<div
					class="p-4 rounded-md"
					:class="[response.stripeStatus[0].toLowerCase().match(/^no/) ? 'bg-red-500/10 text-red-700' : 'bg-green-500/10 text-green-700']"
				>
					<small class="opacity-50">Stripe</small>
					<p>{{ response.stripeStatus[0] }}</p>
				</div>
				<div
					class="p-4 rounded-md"
					:class="[response.firebaseStatus[0].toLowerCase().match(/^no/) ? 'bg-red-500/10 text-red-700' : 'bg-green-500/10 text-green-700']"
				>
					<small class="opacity-50">Firebase</small>
					<p>{{ response.firebaseStatus[0] }}</p>
				</div>
			</div>
			<div class="bg-black/5 rounded-md p-4 flex flex-col gap-2">
				<div>
					<img :src="response.user.image" class="rounded max-h-24" />
				</div>
				<div v-if="response.userId">
					<small>UserID</small>
					<p>{{ response.userId }}</p>
				</div>
				<div>
					<small>Name</small>
					<p>{{ response.user.displayName }}</p>
				</div>
			</div>
		</div>
		<p v-else class="opacity-50 p-4 text-center">No users to show</p>
	</BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { SearchInput } from "@/components/inputs";
import api from "@/services/api";
import { IUser } from "songtreasures";

type Response = {
	userId: {
		[key: string]: string;
	};
	stripeStatus: string[];
	firebaseStatus: string[];
	user: IUser;
}

export default defineComponent({
    name: "email-lookup",
    components: {
		SearchInput,
	},
	data: () => ({
		response: {} as Response,
		email: "",
	}),
	methods: {
		async lookupEmail() {
			this.response = await api.admin.emailLookup(this.email);
		},
	},
});
</script>
