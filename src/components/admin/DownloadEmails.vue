<template>
	<BaseCard>
		<template #header>
			<div class="flex justify-between items-baseline">
				<h3 class="font-bold">Download email adresses</h3>
			</div>
		</template>
		<Loader :loading="loading" position="local">
			<BaseInput v-model="dateCreatedAt" type="date" label="From date" />
		</Loader>
		<template #footer>
			<BaseButton theme="secondary" :loading="loadingDownload" @click="downloadEmails" class="ml-auto">
				<template #icon>
					<DownloadIcon class="w-4 h-4" />
				</template>
				Download
			</BaseButton>
		</template>
	</BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import api from "@/services/api";
import { DownloadIcon } from "@heroicons/vue/solid";

export default defineComponent({
    name: "download-emails",
	components: {
		DownloadIcon,
	},
	data: () => ({
		loading: false,
		loadingDownload: false,
		dateCreatedAt: new Date().toISOString(),
	}),
	methods: {
		async downloadEmails() {
			this.loadingDownload = true;
			const response = await api.admin.getEmails(new Date(this.dateCreatedAt));

			const file = new Blob([response], {type: "text/plain"});

			const a = document.createElement("a"), url = URL.createObjectURL(file);

			a.href = url;
			a.download = "emails.txt";
			document.body.appendChild(a);
			a.click();
			setTimeout(() => {
				document.body.removeChild(a);
				window.URL.revokeObjectURL(url);
			}, 0);

			this.loadingDownload = false;
		},
	},
});
</script>
