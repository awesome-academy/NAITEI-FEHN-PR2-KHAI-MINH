<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-300 mb-1"
        >Tên phim</label
      >
      <Field
        name="name"
        id="name"
        type="text"
        class="mt-1 block w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-100 placeholder-gray-400"
        :class="{ 'border-red-500': errors.name }"
        v-model="formValues.name"
        placeholder="Nhập tên phim"
      />
      <ErrorMessage name="name" class="mt-1 text-xs text-red-400" />
    </div>

    <div>
      <label for="subname" class="block text-sm font-medium text-gray-300 mb-1"
        >Tên phụ (Subname)</label
      >
      <Field
        name="subname"
        id="subname"
        type="text"
        class="mt-1 block w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-100 placeholder-gray-400"
        v-model="formValues.subname"
        placeholder="Tên phụ nếu có"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
      <div>
        <label
          for="releaseYear"
          class="block text-sm font-medium text-gray-300 mb-1"
          >Năm phát hành</label
        >
        <Field
          name="releaseYear"
          id="releaseYear"
          type="number"
          class="mt-1 block w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-100 placeholder-gray-400"
          :class="{ 'border-red-500': errors.releaseYear }"
          v-model.number="formValues.releaseYear"
          placeholder="VD: 2024"
        />
        <ErrorMessage name="releaseYear" class="mt-1 text-xs text-red-400" />
      </div>

      <div>
        <label
          for="duration"
          class="block text-sm font-medium text-gray-300 mb-1"
          >Thời lượng (phút)</label
        >
        <Field
          name="duration"
          id="duration"
          type="number"
          class="mt-1 block w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-100 placeholder-gray-400"
          v-model.number="formValues.duration"
          placeholder="VD: 120"
        />
        <ErrorMessage name="duration" class="mt-1 text-xs text-red-400" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
      <div>
        <label
          for="country"
          class="block text-sm font-medium text-gray-300 mb-1"
          >Quốc gia</label
        >
        <Field
          name="country"
          id="country"
          type="text"
          class="mt-1 block w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-100 placeholder-gray-400"
          v-model="formValues.country"
          placeholder="VD: Việt Nam, Mỹ"
        />
        <ErrorMessage name="country" class="mt-1 text-xs text-red-400" />
      </div>
      <div>
        <label for="status" class="block text-sm font-medium text-gray-300 mb-1"
          >Tình trạng phim</label
        >
        <Field
          as="select"
          name="status"
          id="status"
          class="mt-1 block w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-100"
          :class="{ 'border-red-500': errors.status }"
          v-model="formValues.status"
        >
          <option
            v-for="option in statusOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </Field>
        <ErrorMessage name="status" class="mt-1 text-xs text-red-400" />
      </div>
    </div>

    <div>
      <label
        for="trailerUrl"
        class="block text-sm font-medium text-gray-300 mb-1"
        >Trailer Youtube</label
      >
      <Field
        name="trailerUrl"
        id="trailerUrl"
        type="url"
        class="mt-1 block w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-100 placeholder-gray-400"
        v-model="formValues.trailerUrl"
        placeholder="https://example.com/poster.jpg"
      />
      <ErrorMessage name="trailerUrl" class="mt-1 text-xs text-red-400" />
    </div>

    <div>
      <label for="poster" class="block text-sm font-medium text-gray-300 mb-1"
        >URL Poster</label
      >
      <Field
        name="poster"
        id="poster"
        type="url"
        class="mt-1 block w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-100 placeholder-gray-400"
        v-model="formValues.poster"
        placeholder="https://example.com/poster.jpg"
      />
      <img
        v-if="formValues.poster"
        :src="formValues.poster"
        alt="Poster preview"
        class="mt-2 h-32 object-contain border border-slate-600 p-1 rounded bg-slate-700"
      />
      <ErrorMessage name="poster" class="mt-1 text-xs text-red-400" />
    </div>

    <div>
      <label
        for="coverImage"
        class="block text-sm font-medium text-gray-300 mb-1"
        >URL Ảnh bìa</label
      >
      <Field
        name="coverImage"
        id="coverImage"
        type="url"
        class="mt-1 block w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-100 placeholder-gray-400"
        v-model="formValues.coverImage"
        placeholder="https://example.com/cover.jpg"
      />
      <img
        v-if="formValues.coverImage"
        :src="formValues.coverImage"
        alt="Cover preview"
        class="mt-2 h-32 object-contain border border-slate-600 p-1 rounded bg-slate-700"
      />
      <ErrorMessage name="coverImage" class="mt-1 text-xs text-red-400" />
    </div>

    <div>
      <label
        for="genres_text"
        class="block text-sm font-medium text-gray-300 mb-1"
        >Thể loại (phân cách bởi dấu phẩy)</label
      >
      <Field
        name="genres_text"
        id="genres_text"
        type="text"
        @input="updateGenresArray"
        class="mt-1 block w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-100 placeholder-gray-400"
        :class="{ 'border-red-500': errors.genres }"
        v-model="genresText"
        placeholder="Hành động, Phiêu lưu, Hài"
      />
      <ErrorMessage name="genres" class="mt-1 text-xs text-red-400" />
      <div
        v-if="formValues.genres && formValues.genres.length"
        class="mt-2 flex flex-wrap gap-2"
      >
        <span
          v-for="genre in formValues.genres"
          :key="genre"
          class="px-2.5 py-1 bg-green-600 text-green-100 text-xs rounded-full"
        >
          {{ genre }}
        </span>
      </div>
    </div>

    <div>
      <label
        for="description"
        class="block text-sm font-medium text-gray-300 mb-1"
        >Mô tả</label
      >
      <Field
        as="textarea"
        name="description"
        id="description"
        rows="4"
        class="mt-1 block w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-100 placeholder-gray-400"
        :class="{ 'border-red-500': errors.description }"
        v-model="formValues.description"
        placeholder="Viết mô tả chi tiết cho phim..."
      />
      <ErrorMessage name="description" class="mt-1 text-xs text-red-400" />
    </div>

    <div class="flex justify-end space-x-3 pt-6 border-t border-slate-700 mt-8">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 text-sm font-medium text-gray-300 bg-slate-600 border border-transparent rounded-md shadow-sm hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500"
        :disabled="loading"
      >
        Hủy
      </button>
      <button
        type="submit"
        :disabled="loading || Object.keys(errors).length > 0"
        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 disabled:opacity-60 disabled:bg-green-700"
      >
        <span v-if="loading">Đang xử lý...</span>
        <span v-else>{{
          initialData && initialData.id ? "Cập Nhật Phim" : "Thêm Phim Mới"
        }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Field, ErrorMessage, useForm } from "vee-validate";
import { movieSchema } from "@/lib/validates";
import type { Movie } from "@/types/movie.type";

const statusOptions = ref([
  { value: "now_showing", label: "Đang chiếu" },
  { value: "coming_soon", label: "Sắp chiếu" },
  { value: "released", label: "Đã chiếu" },
]);

const props = defineProps<{
  initialData?: Movie;
  loading?: boolean;
}>();

const emit = defineEmits(["submit", "cancel"]);

const getInitialStatus = () => {
  if (props.initialData && props.initialData.status) {
    return props.initialData.status;
  }
  return "released";
};

const {
  handleSubmit,
  errors,
  setValues,
  values: formValues,
  resetForm,
  setFieldValue,
} = useForm<Partial<Movie>>({
  validationSchema: movieSchema,
  initialValues: props.initialData
    ? {
        ...props.initialData,
        genres: props.initialData.genres || [],
        status: getInitialStatus(),
      }
    : {
        name: "",
        subname: "",
        releaseYear: undefined,
        duration: undefined,
        country: "",
        poster: "",
        coverImage: "",
        genres: [],
        trailerUrl: "",
        status: getInitialStatus(),
        description: "",
      },
});

const genresText = ref(
  props.initialData?.genres ? props.initialData.genres.join(", ") : ""
);

watch(
  () => props.initialData,
  (newData) => {
    const newStatus = newData?.status || getInitialStatus();
    if (newData) {
      resetForm({
        values: { ...newData, genres: newData.genres || [], status: newStatus },
      });
      genresText.value = newData.genres ? newData.genres.join(", ") : "";
    } else {
      resetForm({
        values: {
          name: "",
          subname: "",
          releaseYear: undefined,
          duration: undefined,
          country: "",
          poster: "",
          coverImage: "",
          genres: [],
          trailerUrl: "",
          status: newStatus,
          description: "",
        },
      });
      genresText.value = "";
    }
  },
  { immediate: true, deep: true }
);

const updateGenresArray = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const newGenresText = target.value;
  let processedGenres: string[] = [];
  if (newGenresText && newGenresText.trim() !== "") {
    processedGenres = newGenresText
      .split(",")
      .map((g) => g.trim())
      .filter((g) => g !== "");
  }
  setFieldValue("genres", processedGenres);
};

const onSubmit = handleSubmit((values) => {
  const currentTime = new Date().toISOString();
  const finalValues = {
    ...values,
    genres: formValues.genres || [],
    status: formValues.status,
    createdAt: props.initialData?.createdAt || currentTime,
    updatedAt: currentTime,
  };

  if (!props.initialData?.id) {
    (finalValues as Movie).createdAt = currentTime;
  }

  emit("submit", finalValues as Movie);
});
</script>
