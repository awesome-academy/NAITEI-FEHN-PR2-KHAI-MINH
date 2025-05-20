<template>
  <form
    @submit.prevent="onSubmit"
    class="space-y-6 bg-slate-800 p-6 md:p-8 rounded-lg shadow-xl"
  >
    <h2
      class="text-xl font-semibold text-white mb-6 border-b border-slate-700 pb-4"
    >
      {{
        initialData && initialData.id
          ? "Cập Nhật Rạp Chiếu Phim"
          : "Thêm Rạp Chiếu Phim Mới"
      }}
    </h2>
    <div>
      <label
        for="cinema-name"
        class="block text-sm font-medium text-gray-300 mb-1"
        >Tên rạp</label
      >
      <Field
        name="name"
        id="cinema-name"
        type="text"
        class="mt-1 block w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-100 placeholder-gray-400"
        :class="{ 'border-red-500': errors.name }"
        v-model="formValues.name"
        placeholder="Nhập tên rạp chiếu phim"
      />
      <ErrorMessage name="name" class="mt-1 text-xs text-red-400" />
    </div>

    <div>
      <label
        for="cinema-address"
        class="block text-sm font-medium text-gray-300 mb-1"
        >Địa chỉ</label
      >
      <Field
        as="textarea"
        name="address"
        id="cinema-address"
        rows="3"
        class="mt-1 block w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-100 placeholder-gray-400"
        :class="{ 'border-red-500': errors.address }"
        v-model="formValues.address"
        placeholder="Nhập địa chỉ chi tiết của rạp"
      />
      <ErrorMessage name="address" class="mt-1 text-xs text-red-400" />
    </div>

    <div>
      <label
        for="cinema-city"
        class="block text-sm font-medium text-gray-300 mb-1"
        >Thành phố</label
      >
      <Field
        name="city"
        id="cinema-city"
        type="text"
        class="mt-1 block w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-100 placeholder-gray-400"
        :class="{ 'border-red-500': errors.city }"
        v-model="formValues.city"
        placeholder="VD: Hà Nội, TP. Hồ Chí Minh"
      />
      <ErrorMessage name="city" class="mt-1 text-xs text-red-400" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
      <div>
        <label
          for="cinema-lat"
          class="block text-sm font-medium text-gray-300 mb-1"
          >Vĩ độ (Latitude)</label
        >
        <Field
          name="lat"
          id="cinema-lat"
          type="number"
          step="any"
          class="mt-1 block w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-100 placeholder-gray-400"
          :class="{ 'border-red-500': errors.lat }"
          v-model.number="formValues.lat"
          placeholder="VD: 21.036337"
        />
        <ErrorMessage name="lat" class="mt-1 text-xs text-red-400" />
      </div>

      <div>
        <label
          for="cinema-lon"
          class="block text-sm font-medium text-gray-300 mb-1"
          >Kinh độ (Longitude)</label
        >
        <Field
          name="lon"
          id="cinema-lon"
          type="number"
          step="any"
          class="mt-1 block w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-100 placeholder-gray-400"
          :class="{ 'border-red-500': errors.lon }"
          v-model.number="formValues.lon"
          placeholder="VD: 105.782455"
        />
        <ErrorMessage name="lon" class="mt-1 text-xs text-red-400" />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-300 mb-1"
        >Logo Preview</label
      >
      <img
        src="https://homepage.momocdn.net/cinema/momo-amazone-s3-api-240829164527-638605467276820522.png"
        alt="Cinema Logo Preview"
        class="mt-1 h-20 w-auto object-contain border border-slate-600 p-1 rounded bg-slate-700"
      />
      <p class="mt-1 text-xs text-gray-400">
        Logo sẽ được tự động sử dụng URL cố định.
      </p>
    </div>

    <div class="flex justify-end space-x-3 pt-6 border-t border-slate-700 mt-8">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 text-sm font-medium text-gray-300 bg-slate-600 border border-transparent rounded-md shadow-sm hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500"
        :disabled="loading"
      >
        Hủy
      </button>
      <button
        type="submit"
        :disabled="loading || Object.keys(errors).length > 0"
        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-green-500 disabled:opacity-60 disabled:bg-green-700"
      >
        <span v-if="loading">Đang xử lý...</span>
        <span v-else>{{
          initialData && initialData.id ? "Cập Nhật Rạp" : "Thêm Rạp Mới"
        }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { Field, ErrorMessage, useForm } from "vee-validate";
import { cinemaSchema } from "@/lib/validates";
import type { CinemaType } from "@/types/cinema.type";

const props = defineProps<{
  initialData?: CinemaType;
  loading?: boolean;
}>();

const emit = defineEmits(["submit", "cancel"]);

const FIXED_LOGO_URL =
  "https://homepage.momocdn.net/cinema/momo-amazone-s3-api-240829164527-638605467276820522.png";

const {
  handleSubmit,
  errors,
  values: formValues,
  resetForm,
} = useForm<Omit<CinemaType, "logo" | "createdAt" | "updatedAt">>({
  validationSchema: cinemaSchema,
  initialValues: props.initialData
    ? {
        id: props.initialData.id,
        name: props.initialData.name || "",
        address: props.initialData.address || "",
        city: props.initialData.city || "",
        lat: props.initialData.lat,
        lon: props.initialData.lon,
      }
    : {
        name: "",
        address: "",
        city: "",
        lat: undefined,
        lon: undefined,
      },
});

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      resetForm({
        values: {
          name: newData.name || "",
          address: newData.address || "",
          city: newData.city || "",
          lat: newData.lat,
          lon: newData.lon,
        },
      });
    } else {
      resetForm({
        values: {
          name: "",
          address: "",
          city: "",
          lat: undefined,
          lon: undefined,
        },
      });
    }
  },
  { immediate: true, deep: true }
);

const onSubmit = handleSubmit((values) => {
  const currentTime = new Date().toISOString();
  const finalCinemaData: CinemaType = {
    ...values,
    logo: FIXED_LOGO_URL,
    lat: values.lat,
    lon: values.lon,
    createdAt: props.initialData?.createdAt || currentTime,
    updatedAt: currentTime,
  };

  if (props.initialData?.id) {
    finalCinemaData.createdAt = currentTime;
  }

  emit("submit", finalCinemaData);
});
</script>
