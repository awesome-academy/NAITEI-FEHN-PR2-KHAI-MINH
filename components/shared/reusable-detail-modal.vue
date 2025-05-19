<template>
  <DialogRoot :open="isOpen" @update:open="emitUpdateOpen">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow"
      />
      <DialogContent
        class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-3xl max-h-[85vh] bg-white p-6 rounded-lg shadow-xl focus:outline-none data-[state=open]:animate-contentShow overflow-y-auto"
      >
        <template v-if="item">
          <DialogTitle class="text-2xl font-bold text-gray-800 mb-4">
            {{ getNestedValue(item, titleKey || "name") || "Chi Tiết Mục" }}
          </DialogTitle>

          <div class="space-y-4">
            <div
              v-for="field in fields"
              :key="field.key"
              class="py-2 border-b border-gray-100 last:border-b-0"
            >
              <strong class="font-semibold text-gray-700 block text-sm mb-1"
                >{{ field.label }}:</strong
              >
              <slot
                :name="`field-${field.key}`"
                :item="item"
                :value="getNestedValue(item, field.key)"
              >
                <div class="text-sm text-gray-800">
                  <template
                    v-if="field.format && typeof field.format === 'function'"
                  >
                    <span
                      v-html="field.format(getNestedValue(item, field.key), item as T)"
                    ></span>
                  </template>
                  <template
                    v-else-if="
                      field.type === 'image' && getNestedValue(item, field.key)
                    "
                  >
                    <img
                      :src="getNestedValue(item, field.key)"
                      :alt="field.label"
                      class="max-w-xs max-h-60 object-contain rounded border p-1 my-1"
                    />
                  </template>
                  <template
                    v-else-if="
                      field.type === 'tags' &&
                      Array.isArray(getNestedValue(item, field.key))
                    "
                  >
                    <div class="flex flex-wrap gap-2 mt-1">
                      <span
                        v-for="tag in getNestedValue(item, field.key)"
                        :key="tag"
                        class="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </template>
                  <template
                    v-else-if="
                      field.type === 'richtext' &&
                      getNestedValue(item, field.key)
                    "
                  >
                    <div
                      class="prose prose-sm max-w-none"
                      v-html="getNestedValue(item, field.key)"
                    ></div>
                  </template>
                  <template
                    v-else-if="
                      field.type === 'link' && getNestedValue(item, field.key)
                    "
                  >
                    <a
                      :href="getNestedValue(item, field.key)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:underline"
                    >
                      {{ getNestedValue(item, field.key) }}
                    </a>
                  </template>
                  <template
                    v-else-if="
                      (field.type === 'date' || field.type === 'datetime') &&
                      getNestedValue(item, field.key)
                    "
                  >
                    {{
                      formatDate(
                        getNestedValue(item, field.key),
                        field.type === "datetime"
                      )
                    }}
                  </template>
                  <template v-else>
                    {{ getNestedValue(item, field.key) || "N/A" }}
                  </template>
                </div>
              </slot>
            </div>
          </div>

          <div class="mt-8 flex justify-end">
            <DialogClose asChild>
              <button
                type="button"
                @click="emitUpdateOpen(false)"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              >
                Đóng
              </button>
            </DialogClose>
          </div>
        </template>
        <div v-else class="text-center py-10">
          <p class="text-gray-500">
            Không có dữ liệu để hiển thị hoặc đang tải...
          </p>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import type { PropType } from "vue";
import type { VNode } from "vue";

export interface DetailField<D = Record<string, any>> {
  key: string;
  label: string;
  format?: (value: any, item: D) => string | VNode;
  type?: "image" | "tags" | "richtext" | "link" | "date" | "datetime" | "text";
}

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  item: {
    type: Object as PropType<T | null>,
    default: null,
  },
  fields: {
    type: Array as PropType<DetailField<T>[]>,
    required: true,
  },
  titleKey: {
    type: String,
    default: "name",
  },
});

const emit = defineEmits(["update:isOpen"]);

const emitUpdateOpen = (value: boolean) => {
  emit("update:isOpen", value);
};

const getNestedValue = (obj: any, path: string): any => {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

const formatDate = (dateString: string | Date, includeTime = false): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return String(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    if (includeTime) {
      options.hour = "2-digit";
      options.minute = "2-digit";
    }
    return date.toLocaleDateString("vi-VN", options);
  } catch (e) {
    return String(dateString);
  }
};
</script>
