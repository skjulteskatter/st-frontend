<template>
	<BaseCard>
		<template #header>
			<div class="flex justify-between items-baseline">
				<h3 class="font-bold">Email lookup</h3>
				<SearchInput v-model="email" @search="lookupEmail" />
			</div>
		</template>
		<Loader :loading="loading" position="local">
			<div v-if="response.user" class="grid md:grid-cols-2 gap-4">
				<div class="p-4 flex flex-col gap-4">
					<img :src="response.user.image" class="rounded h-24 w-24 object-cover" />
					<div v-if="response.userId">
						<small>UserID</small>
						<p>Firebase: {{ response.userId["firebase"] }}</p>
						<p>Stripe: {{ response.userId["stripe"] }}</p>
					</div>
					<div>
						<small class="opacity-50">Name</small>
						<p>{{ response.user.displayName }}</p>
					</div>
					<div>
						<small class="opacity-50">Last Login</small>
						<p>{{ new Date(response.user.lastLogin).toLocaleString() }}</p>
					</div>
					<div>
						<small class="opacity-50">Accepted Policies</small>
						<span class="flex gap-2 items-center">
							<CheckCircleIcon class="w-4 h-4 opacity-50 text-green-700" v-if="response.user.privacyPolicy" />
							<XCircleIcon class="w-4 h-4 opacity-50 text-red-700" v-else />
							Privacy Policy
						</span>
						<span class="flex gap-2 items-center">
							<CheckCircleIcon class="w-4 h-4 opacity-50 text-green-700" v-if="response.user.termsAndConditions" />
							<XCircleIcon class="w-4 h-4 opacity-50 text-red-700" v-else />
							Terms of Service
						</span>
					</div>
					<div v-if="response.user.settings">
						<small class="opacity-50">User Settings</small>
						<table>
							<tbody>
								<tr v-for="(value, key, i) in response.user.settings" :key="`${key}-${i}`">
									<td class="pr-4">{{key}}</td>
									<td>{{value}}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div class="flex gap-4 flex-col p-4">
					<div class="flex flex-col gap-2">
						<small class="opacity-50">Status</small>
						<div
							class="p-4 rounded-md border"
							:class="[response.stripeStatus[0].toLowerCase().match(/^no/) ? 'bg-red-500/5 border-red-500 text-red-700' : 'bg-green-500/5 border-green-500 text-green-700']"
						>
							<small class="opacity-50">Stripe</small>
							<p>{{ response.stripeStatus[0] }}</p>
						</div>
						<div
							class="p-4 rounded-md border"
							:class="[response.firebaseStatus[0].toLowerCase().match(/^no/) ? 'bg-red-500/5 border-red-500 text-red-700' : 'bg-green-500/5 border-green-500 text-green-700']"
						>
							<small class="opacity-50">Firebase</small>
							<p>{{ response.firebaseStatus[0] }}</p>
						</div>
					</div>
					<div class="flex flex-col gap-2">
						<small class="opacity-50">Subscriptions</small>
						<div v-for="sub in response.stripeSubscriptions" :key="sub.id" class="rounded-md bg-black/5 p-4">
							<small class="opacity-50 inline-block">Stripe</small>
							<p v-for="p in sub.productIds" :key="sub.id + p">{{ p }}</p>
						</div>
						<div v-for="sub in response.firebaseSubscriptions" :key="sub.id" class="rounded-md bg-black/5 p-4">
							<small class="opacity-50 inline-block">Firebase</small>
							<p v-for="p in sub.productIds" :key="sub.id + p">{{ p }}</p>
						</div>
					</div>
				</div>
			</div>
			<p v-else class="opacity-50 p-4 text-center">No users to show</p>
		</Loader>
	</BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { SearchInput } from "@/components/inputs";
import api from "@/services/api";
import { ISubscription, IUser } from "songtreasures";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/vue/solid";

type EmailLookupResponse = {
	userId: {
		[key: string]: string;
	};
	stripeStatus: string[];
	firebaseStatus: string[];
	user: IUser;
	stripeSubscriptions: ISubscription[];
	firebaseSubscriptions: ISubscription[];
}

export default defineComponent({
    name: "email-lookup",
    components: {
		SearchInput,
		CheckCircleIcon,
		XCircleIcon,
	},
	data: () => ({
		response: {} as EmailLookupResponse,
		email: "",
		loading: false,
	}),
	methods: {
		async lookupEmail() {
			this.loading = true;

			try {
				this.response = await api.admin.emailLookup(this.email);
			}
			catch {
				throw new Error("Not a valid email address.");
			}
			finally {
				this.loading = false;
			}
		},
	},
});
</script>
