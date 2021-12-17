<template>
	<BaseCard>
		<template #header>
			<div class="flex justify-between items-baseline">
				<h3 class="font-bold">Download emails</h3>
			</div>
		</template>
		<Loader :loading="loading" position="local">
			<div>
				<h3 class="mb-2 text-l">From date</h3>
				<input v-model="dateCreatedAt" class="mb-2" type="date" />
				<BaseButton :loading="loadingDownload" @click="downloadEmails">Download</BaseButton>
			</div>
		</Loader>
	</BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import api from "@/services/api";

export default defineComponent({
    name: "download-emails",
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
