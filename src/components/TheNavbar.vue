<template>
  <Disclosure
    as="nav"
    class="bg-white dark:bg-secondary sticky top-0 shadow-md z-30"
    v-slot="{ open }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex gap-4 items-center justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <router-link to="/">
              <img
                class="h-8 w-8"
                src="/img/logo/icon.svg"
                alt="SongTreasures logo"
                width="32"
                height="32"
              />
            </router-link>
          </div>
          <div class="hidden lg:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <template v-for="item in Links" :key="item.name">
                <router-link
                  v-bind="getNavLinkProps(item)"
                  v-on="getNavLinkEvents(item)"
                  class="hover:bg-black/5 dark:hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <span class="flex items-center gap-2">
                    <!-- <LockClosedIcon v-if="item.condition != undefined" class="w-3 h-3 opacity-50" /> -->
                    {{ item.name }}
                  </span>
                </router-link>
              </template>
            </div>
          </div>
        </div>

        <FullSearchInput
          class="md:ml-auto"
          :disabled="$route.name == 'search'"
        />

        <div class="hidden lg:block">
          <div class="ml-4 flex items-center md:ml-6">
            <!-- <StoreCart v-if="showCart" class="mr-2" /> -->
            <Feedback />
            <Notification-list />

            <!-- Profile dropdown -->
            <Menu as="div" class="ml-3 relative">
              <div>
                <MenuButton
                  class="max-w-xs rounded-full flex items-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-white"
                >
                  <span class="sr-only">Open user menu</span>
                  <img
                    loading="lazy"
                    class="h-8 w-8 rounded-full border border-black/20 dark:border-white/20 flex-shrink-0"
                    :src="image"
                    :alt="user.displayName + ' profile picture'"
                    width="32"
                    height="32"
                  />
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-secondary ring-1 ring-black ring-opacity-5 focus-visible:outline-none"
                >
                  <MenuItem v-slot="{ active }">
                    <router-link
                      to="/settings"
                      :class="[
                        active ? 'bg-black/5 dark:bg-white/10' : '',
                        'block px-4 py-2 text-sm',
                      ]"
                      >{{ $t("common_settings") }}</router-link
                    >
                  </MenuItem>
                  <MenuItem
                    v-for="link in dropDownLinks"
                    :key="link.name"
                    :id="link.name"
                    v-slot="{ active }"
                  >
                    <router-link
                      :to="link.path"
                      :class="[
                        active ? 'bg-black/5 dark:bg-white/10' : '',
                        'block px-4 py-2 text-sm',
                      ]"
                      >{{ link.name }}</router-link
                    >
                  </MenuItem>
                  <MenuItem>
                    <button
                      class="w-full text-left px-4 py-2 text-sm"
                      @click="clearCache"
                    >
                      Clear cache
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      @click="logout()"
                      class="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-500/10"
                    >
                      {{ $t("common_logout") }}
                    </button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
        <div class="-mr-2 flex lg:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton
            class="hover:bg-black/5 dark:hover:bg-white/10 inline-flex items-center justify-center p-2 rounded-md text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-white"
          >
            <span class="sr-only">Open main menu</span>
            <MenuIcon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
      </div>
    </div>

    <!-- Mobile -->
    <DisclosurePanel class="lg:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <template v-for="item in Links" :key="item.name">
          <router-link
            :to="item.path"
            class="hover:bg-black/5 dark:hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium"
          >
            <span class="flex items-center gap-2">
              <!-- <LockClosedIcon v-if="item.condition != undefined" class="w-3 h-3 opacity-50" /> -->
              {{ item.name }}
            </span>
          </router-link>
        </template>
      </div>
      <div class="pt-4 pb-3 border-t border-gray-300">
        <div class="flex items-center px-5">
          <div class="flex-shrink-0">
            <img
              loading="lazy"
              class="h-10 w-10 rounded-full border border-black/20 dark:border-white/20 flex-shrink-0"
              :src="image"
              :alt="user.displayName + ' profile picture'"
              width="40"
              height="40"
            />
          </div>
          <div class="ml-3">
            <div class="text-base leading-tight font-medium">
              {{ user.displayName }}
            </div>
            <div class="text-sm leading-tight opacity-50">{{ user.email }}</div>
          </div>
          <Notification-list class="ml-auto" />
        </div>
        <div class="mt-3 px-2 space-y-1">
          <router-link
            to="/settings"
            class="block px-3 py-2 rounded-md text-base font-medium hover:bg-black/5 dark:hover:bg-white/10"
            >{{ $t("common_settings") }}</router-link
          >
          <router-link
            v-for="link in dropDownLinks"
            :key="link.name"
            :to="link.path"
            class="block px-3 py-2 rounded-md text-base font-medium hover:bg-black/5 dark:hover:bg-white/10"
            >{{ link.name }}</router-link
          >
          <button
            class="w-full text-left px-3 py-2 rounded-md text-base font-medium"
            @click="clearCache"
          >
            Clear cache
          </button>
          <button
            class="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-red-500/10 text-red-500"
            @click="logout()"
          >
            {{ $t("common_logout") }}
          </button>
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FullSearchInput } from "@/components/inputs";
import { StoreCart } from "@/components/store";
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
import {
  // LockClosedIcon,
  MenuIcon,
  XIcon,
} from "@heroicons/vue/solid";
import { storeService } from "@/services/modules";
import { appSession } from "@/services/session";
import { cache } from "@/services/cache";

type NavigationLink = {
  name: string;
  path: string;
  condition?: boolean;
  onClick?: (...args: any[]) => void;
};

export default defineComponent({
  name: "the-navbar",
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
    // LockClosedIcon,
    MenuIcon,
    XIcon,
  },
  data: () => ({
    open: false,
    storeService,
    showCart: false,
  }),
  computed: {
    image() {
      return this.user?.image ?? "/img/portrait-placeholder.png";
    },
    isAdmin() {
      return this.user.Admin;
    },
    isTechnician() {
      return this.user.Techinican;
    },
    user() {
      return appSession.user;
    },
    Links(): NavigationLink[] {
      return [
        {
          name: this.$t("common_home"),
          path: "/",
        },
        {
          name: this.$t("common_collections"),
          path: "/collections",
        },
        {
          name: `${this.$t("common_your")} ${this.$t(
            "common_collections"
          ).toLocaleLowerCase()}`,
          path: "/custom-collections",
        },
        {
          name: this.$t("favorites"),
          path: "/favorites",
        },
        {
          name: this.$t("credits_songCredit"),
          path: this.$route.path,
          onClick: (e: Event) => {
            e.preventDefault();
            window.open("/files/kreditering.pdf");
          },
        },
        // {
        // 	name: "Admin",
        // 	path: "/admin",
        // 	condition: this.isAdmin,
        // },
        // {
        // 	name: "Scriptures",
        // 	path: "/scriptures",
        // 	condition: this.isAdmin,
        // },
        // {
        // 	name: "Tools",
        // 	path: "/tools",
        // 	condition: this.isTechnician,
        // },
      ];
    },
    dropDownLinks(): NavigationLink[] {
      return [
        {
          name: "Admin",
          path: "/admin",
          condition: this.isAdmin,
        },
        {
          name: this.$t("scriptures_title"),
          path: "/scriptures",
          condition: this.isAdmin,
        },
        {
          name: this.$t("publications_title"),
          path: "/publications",
          condition: this.isAdmin,
        },
        {
          name: "Tools",
          path: "/tools",
          condition: this.isTechnician,
        },
      ].filter((i) => i.condition);
    },
  },
  async mounted() {
    this.storeService.registerHook("productsUpdated", () => {
      this.showCart = this.storeService.cart.length > 0;
    });
  },
  methods: {
    logout() {
      appSession.clear();
    },
    clearCache() {
      cache.clearCache();
      window.location.reload();
    },
    getNavLinkEvents(link: NavigationLink) {
      if (!link.onClick) return {};
      return {
        click: link.onClick,
      };
    },
    getNavLinkProps(link: NavigationLink) {
      if (!link.path) return {};
      return {
        to: link.path,
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.router-link-exact-active {
  @apply text-primary;
}
</style>
