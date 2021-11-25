<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" static class="fixed inset-0 overflow-hidden" @close="$emit('close')" :open="open">
      <div class="absolute inset-0 overflow-hidden">
        <TransitionChild as="template" enter="ease-in-out duration-200" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="absolute inset-0 bg-black bg-opacity-50 transition-opacity" />
        </TransitionChild>
        <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <TransitionChild as="template" enter="transform transition ease-in-out duration-200 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-200 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
            <div class="relative w-screen max-w-md">
              <TransitionChild as="template" enter="ease-in-out duration-200" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute top-16 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
                  <button class="rounded-md text-gray-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" @click="$emit('close')">
                    <span class="sr-only">{{ $t('common_close') }}</span>
                    <XIcon class="h-6 w-6" />
                  </button>
                </div>
              </TransitionChild>
              <div class="h-full flex flex-col py-6 bg-white dark:bg-secondary shadow-xl overflow-y-scroll">
                <div class="px-4 sm:px-6" v-if="title">
                  <DialogTitle class="text-lg font-medium">
                    {{ title }}
                  </DialogTitle>
                </div>
                <div class="mt-6 relative flex-1 px-4 sm:px-6">
                  <slot name="default" />
                </div>
              </div>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import {
	Dialog,
	DialogOverlay,
	DialogTitle,
	TransitionChild,
	TransitionRoot,
} from "@headlessui/vue";
import { XIcon } from "@heroicons/vue/outline";

export default defineComponent({
	name: "slide-panel",
	components: {
		Dialog,	
		DialogOverlay,
		DialogTitle,
		TransitionChild,
		TransitionRoot,
    XIcon,
	},
	props: {
		open: {
			type: Boolean,
		},
		title: {
			type: String,
		},
	},
	emits: ["close"],
});
</script>
