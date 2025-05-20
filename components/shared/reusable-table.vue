<template>
  <div
    class="overflow-x-auto border-white border-2 shadow-md rounded-lg h-full"
  >
    <table class="min-w-full divide-y divide-white-200">
      <thead class="bg-white-100">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            class="px-6 py-3 text-left text-sm font-semibold text-white tracking-wider bg-[#27293D]"
            :class="column.headerClass"
          >
            {{ column.label }}
          </th>
          <th
            v-if="$slots.actions"
            scope="col"
            class="relative px-6 py-3 bg-[#27293D]"
          >
            <span class="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white-200">
        <tr v-if="loading">
          <td
            :colspan="columns.length + ($slots.actions ? 1 : 0)"
            class="px-6 py-12 text-center"
          >
            <div class="text-white-500">Đang tải dữ liệu...</div>
          </td>
        </tr>
        <tr v-else-if="!data || data.length === 0">
          <td
            :colspan="columns.length + ($slots.actions ? 1 : 0)"
            class="px-6 py-12 text-center text-white-500"
          >
            Không có dữ liệu.
          </td>
        </tr>
        <tr
          v-for="item in data"
          :key="item[rowKey as keyof TData] || JSON.stringify(item)"
          v-else
        >
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-4 whitespace-nowrap text-sm"
            :class="[
              column.cellClass,
              column.key === 'name'
                ? 'font-medium text-white-900'
                : 'text-white-500',
            ]"
          >
            <slot
              :name="`cell-${column.key}`"
              :item="item"
              :value="getNestedValue(item, column.key)"
            >
              <template
                v-if="column.format && typeof column.format === 'function'"
              >
                <span
                  v-html="column.format(getNestedValue(item, column.key), item)"
                ></span>
              </template>
              <template
                v-else-if="
                  column.type === 'image' && getNestedValue(item, column.key)
                "
              >
                <img
                  :src="getNestedValue(item, column.key)"
                  :alt="column.label"
                  class="w-12 h-16 object-cover rounded shadow-sm"
                />
              </template>
              <template
                v-else-if="
                  column.type === 'badge' && getNestedValue(item, column.key)
                "
              >
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="
                    column.badgeClass
                      ? column.badgeClass(getNestedValue(item, column.key))
                      : 'bg-green-100 text-green-800'
                  "
                >
                  {{ getNestedValue(item, column.key) }}
                </span>
              </template>
              <template v-else>
                {{ getNestedValue(item, column.key) || "-" }}
              </template>
            </slot>
          </td>
          <td
            v-if="$slots.actions"
            class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
          >
            <slot name="actions" :item="item"></slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts" generic="TData extends Record<string, any>">
import type { VNode, PropType } from "vue";

export interface TableColumn<
  D extends Record<string, any> = Record<string, any>
> {
  key: string;
  label: string;
  headerClass?: string;
  cellClass?: string;
  format?: (value: any, item: D) => string | VNode | number;
  type?: "image" | "badge" | "date" | "datetime";
  badgeClass?: (value: any) => string;
  sortable?: boolean;
}

const props = defineProps({
  columns: {
    type: Array as PropType<TableColumn<TData>[]>,
    required: true,
  },
  data: {
    type: Array as PropType<TData[]>,
    required: true,
  },
  rowKey: {
    type: String as PropType<keyof TData & string>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const getNestedValue = (obj: TData, path: string): any => {
  if (!path) return undefined;
  return path.split(".").reduce((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, any>)[part];
    }
    return undefined;
  }, obj);
};
</script>
