<template>
	<Disclosure as="nav" class="bg-white dark:bg-secondary sticky top-0 shadow-md z-30" v-slot="{ open }">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex gap-4 items-center justify-between h-16">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<router-link to="/">
							<img class="h-8 w-8" src="/img/logo/icon.svg" alt="SongTreasures logo" />
						</router-link>
					</div>
					<div class="hidden md:block">
						<div class="ml-10 flex items-baseline space-x-4">
							<template v-for="item in links" :key="item.name">
								<router-link v-if="item.condition" :to="item.path" class="hover:bg-black/5 dark:hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium">
									<span class="flex items-center gap-2">
										<LockClosedIcon v-if="item.name == 'Admin'" class="w-3 h-3" />
										{{ item.name }}
									</span>
								</router-link>
							</template>
						</div>
					</div>
				</div>

				<full-search-input class="md:ml-auto" :disabled="$route.name == 'search'" />
				
				<div class="hidden md:block">
					<div class="ml-4 flex items-center md:ml-6">
						<store-cart v-if="store.state.stripe.cart.length > 0" class="mr-2" />
						<feedback />
						<notification-list />

						<!-- Profile dropdown -->
						<Menu as="div" class="ml-3 relative">
							<div>
								<MenuButton class="max-w-xs rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
									<span class="sr-only">Open user menu</span>
									<img loading="lazy" class="h-8 w-8 rounded-full" :src="image" :alt="user.displayName + ' profile picture'" />
								</MenuButton>
							</div>
							<transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
								<MenuItems class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-secondary ring-1 ring-black ring-opacity-5 focus:outline-none">
									<MenuItem v-slot="{ active }">
										<router-link to="/settings" :class="[active ? 'bg-black/5 dark:bg-white/10' : '', 'block px-4 py-2 text-sm']">{{ $t('common.settings') }}</router-link>
									</MenuItem>
									<MenuItem>
										<button @click="logout()" class="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-500/10">{{ $t('common.logout') }}</button>
									</MenuItem>
								</MenuItems>
							</transition>
						</Menu>
					</div>
				</div>
				<div class="-mr-2 flex md:hidden">
					<!-- Mobile menu button -->
					<DisclosureButton class="hover:bg-black/5 dark:hover:bg-white/10 inline-flex items-center justify-center p-2 rounded-md text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
						<span class="sr-only">Open main menu</span>
						<icon name="menu" v-if="!open" class="block h-6 w-6" aria-hidden="true" />
						<icon name="error" v-else class="block h-6 w-6" aria-hidden="true" />
					</DisclosureButton>
				</div>
			</div>
		</div>

		<!-- Mobile -->
		<DisclosurePanel class="md:hidden">
			<div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
				<template v-for="item in links" :key="item.name">
					<router-link v-if="item.condition" :to="item.path" class="hover:bg-black/5 dark:hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium">{{ item.name }}</router-link>
				</template>
			</div>
			<div class="pt-4 pb-3 border-t border-gray-300">
				<div class="flex items-center px-5">
					<div class="flex-shrink-0">
						<img loading="lazy" class="h-10 w-10 rounded-full" :src="image" :alt="user.displayName + ' profile picture'" />
					</div>
					<div class="ml-3">
						<div class="text-base leading-tight font-medium">{{ user.displayName }}</div>
						<div class="text-sm leading-tight opacity-50">{{ user.email }}</div>
					</div>
					<notification-list class="ml-auto" />
				</div>
				<div class="mt-3 px-2 space-y-1">
					<router-link to="/settings" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-black/5 dark:hover:bg-white/10">{{ $t('common.settings') }}</router-link>
					<button class="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-red-500/10 text-red-500" @click="logout()">{{ $t('common.logout') }}</button>
				</div>
			</div>
		</DisclosurePanel>
	</Disclosure>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { FullSearchInput } from "@/components/inputs";
import { StoreCart } from "@/components/store";
import { useStore } from "vuex";
import { 
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
} from "@headlessui/vue";
import NotificationList from "@/components/notification/NotificationList.vue";
import Feedback from "@/components/feedback/Feedback.vue";
import { LockClosedIcon } from "@heroicons/vue/solid";
import { SessionActionTypes } from "@/store/modules/session/action-types";

@Options({
	components: {
		FullSearchInput,
		StoreCart,
		Disclosure,
		DisclosureButton,
		DisclosurePanel,
		Menu,
		MenuButton,
		MenuItem,
		MenuItems,
		Feedback,
		NotificationList,
		LockClosedIcon,
	},
	name: "the-navbar",
})
export default class TheNavbar extends Vue {
	public store = useStore();
	public open = false;

	public logout() {
        this.store.dispatch(SessionActionTypes.SESSION_CLEAR).then(() => {
            window.location.replace("/login");
        });
    }

	private get links() {
		return [
			{
				name: this.$t("common.home"),
				path: "/",
				condition: true,
			},
			{
				name: this.$t("common.collections"),
				path: "/collections",
				condition: true,
			},
			{
				name: `${this.$t("common.your")} ${this.$t("common.collections").toLocaleLowerCase()}`,
				path: "/playlists",
				condition: true,
			},
			{
				name: "Admin",
				path: "/admin",
				condition: this.isAdmin,
			},
		];
	}

	public get image() {
        return this.user?.image ?? "/img/portrait-placeholder.png";
    }

	public get isAdmin() {
		return this.store.getters.isAdmin;
	}

	public get user() {
		return this.store.getters.user;
	}
}
</script>

<style scoped>
.router-link-exact-active {
	@apply text-primary;
}
</style>
