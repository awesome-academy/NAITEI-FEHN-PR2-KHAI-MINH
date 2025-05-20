<template>
  <div
    class="flex flex-1 bg-gray-900 p-4 md:p-8 lg:p-12 flex-col min-h-screen overflow-hidden"
  >
    <span class="text-2xl font-medium mb-4 text-white">Danh sách phim</span>
    <div>
      <button
        @click="openCreateModal"
        class="my-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-md transition-colors duration-150"
      >
        Thêm Phim Mới
      </button>
      <ReusableTable
        :columns="movieTableColumns"
        :data="paginatedMovies"
        row-key="id"
        :loading="isLoadingMovies"
      >
        <template #cell-poster="{ value }">
          <img
            v-if="value"
            :src="value"
            alt="Poster"
            class="w-16 h-24 object-cover rounded-md shadow-sm mx-auto"
          />
          <span v-else class="text-gray-400 text-xs block text-center"
            >No Poster</span
          >
        </template>

        <template #cell-genres="{ value }">
          <div class="flex flex-wrap gap-2 justify-start">
            <span
              v-for="genre in value"
              :key="genre"
              class="px-2 py-0.5 text-xs bg-green-500 text-white font-medium rounded-full"
            >
              {{ genre }}
            </span>
          </div>
        </template>

        <template #cell-status="{ value }">
          <span
            :class="[
            'px-3 py-1 text-xs font-semibold rounded-full inline-block leading-tight',
            getStatusClass(value as string)
          ]"
          >
            {{ getStatusText(value as string) }}
          </span>
        </template>

        <template #actions="{ item }">
          <div class="flex flex-row items-center justify-center gap-1">
            <button
              @click="openEditModal(item as Movie)"
              class="text-green-500 hover:text-green-600 mr-2"
            >
              <Icon icon="mdi:settings" class="w-8 h-8" />
            </button>
          </div>
        </template>
      </ReusableTable>

      <div
        v-if="!isLoadingMovies && movies.length > 0"
        class="mt-6 flex flex-col sm:flex-row justify-between items-center"
      >
        <div class="text-sm text-white mb-2 sm:mb-0">
          Hiển thị {{ paginatedMovies.length }} trong tổng số
          {{ movies.length }} phim
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 hover:bg-green-500 hover:text-white text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            Trước
          </button>
          <span class="text-sm text-white">
            Trang {{ currentPage }} / {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages || totalPages === 0"
            class="px-4 py-2 hover:bg-green-500 hover:text-white text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            Tiếp theo
          </button>
        </div>
      </div>

      <!-- <ReusableDetailModal
        :is-open="isViewModalOpen"
        :item="selectedMovie"
        :fields="movieDetailFields"
        title-key="name"
        @update:is-open="isViewModalOpen = $event"
      /> -->

      <DialogRoot
        :open="isEditModalOpen"
        @update:open="isEditModalOpen = $event"
      >
        <DialogPortal>
          <DialogOverlay
            class="fixed inset-0 bg-black/60 dark:bg-black/80 data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide z-[100]"
          />
          <DialogContent
            class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-[calc(100vw-2rem)] sm:w-[90vw] max-w-lg md:max-w-3xl lg:max-w-4xl max-h-[90vh] data-[state=open]:animate-contentShow data-[state=closed]:animate-contentHide focus:outline-none bg-slate-800 p-6 shadow-2xl rounded-xl overflow-y-auto"
          >
            <div class="flex justify-between items-center mb-6">
              <DialogTitle class="text-xl font-semibold text-gray-100">
                {{
                  selectedMovie && selectedMovie.id
                    ? "Chỉnh Sửa Phim"
                    : "Thêm Phim Mới"
                }}
              </DialogTitle>
              <DialogClose
                class="p-1 rounded-full text-gray-400 hover:text-gray-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 focus:ring-offset-slate-800"
                aria-label="Đóng"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </DialogClose>
            </div>

            <MovieForm
              v-if="isEditModalOpen"
              :initial-data="selectedMovie ?? undefined"
              @submit="handleMovieSubmit"
              @cancel="isEditModalOpen = false"
              :loading="isSubmittingMovie"
            />
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ReusableTable from "@/components/shared/reusable-table.vue";
import type { TableColumn } from "@/components/shared/reusable-table.vue";
import ReusableDetailModal from "@/components/shared/reusable-detail-modal.vue";
import type { DetailField } from "@/components/shared/reusable-detail-modal.vue";
import MovieForm from "@/components/admin/movies/movie-form.vue";
import type { Movie } from "@/types/movie.type";
import axios from "axios";
import { getStatusText, getStatusClass } from "@/lib/utils";
import { Icon } from "@iconify/vue";
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
} from "reka-ui";

const movies = ref<Movie[]>([]);
const isLoadingMovies = ref(false);
const isSubmittingMovie = ref(false);

const currentPage = ref(1);
const itemsPerPage = 5;

const totalPages = computed(() => {
  if (!movies.value || movies.value.length === 0) {
    return 1;
  }
  return Math.ceil(movies.value.length / itemsPerPage);
});

const paginatedMovies = computed(() => {
  if (!movies.value) {
    return [];
  }
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return movies.value.slice(start, end);
});

async function fetchMovies(): Promise<void> {
  isLoadingMovies.value = true;
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_URL_API}/movies`
    );
    movies.value = response.data.sort(
      (a: Movie, b: Movie) =>
        new Date(b.updatedAt ?? "").getTime() -
        new Date(a.updatedAt ?? "").getTime()
    );
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value;
    } else if (totalPages.value === 0 || movies.value.length === 0) {
      currentPage.value = 1;
    }
  } catch (error) {
    console.error("Lỗi khi fetch movies:", error);
    movies.value = [];
    currentPage.value = 1;
  } finally {
    isLoadingMovies.value = false;
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// const isViewModalOpen = ref(false);
const isEditModalOpen = ref(false);
const selectedMovie = ref<Movie | undefined>(undefined);

const movieTableColumns: TableColumn<Movie>[] = [
  { key: "id", label: "ID", cellClass: "w-16 text-center" },
  { key: "poster", label: "Poster", cellClass: "w-32" },
  {
    key: "name",
    label: "Tên Phim",
    cellClass: "w-40 font-medium truncate max-w-[250px]",
  },
  {
    key: "releaseYear",
    label: "Năm SX",
    type: "badge",
    cellClass: "text-center",
  },
  {
    key: "duration",
    label: "Thời Lượng",
    format: (val) => (val ? `${val} phút` : "-"),
    cellClass: "text-center",
  },
  { key: "country", label: "Quốc Gia", cellClass: "min-w-[100px]" },
  {
    key: "genres",
    label: "Thể Loại",
    cellClass: "min-w-[130px] max-w-[150px]",
  },
  { key: "status", label: "Tình trạng", cellClass: "center" },
  {
    key: "updatedAt",
    label: "Cập nhật",
    format: (val) => new Date(val).toLocaleDateString("vi-VN"),
    cellClass: "min-w-[100px] text-center",
  },
];

// const movieDetailFields: DetailField<Movie>[] = [
//   { key: "id", label: "ID" },
//   { key: "name", label: "Tên chính thức" },
//   { key: "subname", label: "Tên phụ" },
//   { key: "coverImage", label: "Ảnh bìa", type: "image" },
//   { key: "poster", label: "Poster nhỏ", type: "image" },
//   { key: "releaseYear", label: "Năm phát hành" },
//   {
//     key: "duration",
//     label: "Thời lượng",
//     format: (val) => (val ? `${val} phút` : "N/A"),
//   },
//   { key: "country", label: "Quốc gia" },
//   { key: "genres", label: "Thể loại", type: "tags" },
//   { key: "description", label: "Mô tả", type: "richtext" },
//   {
//     key: "rating.RatingValue",
//     label: "Đánh giá",
//     format: (val, item) => {
//       const ratingValue = item?.rating?.RatingValue;
//       const ratingCount = item?.rating?.RatingCount;
//       return typeof ratingValue === "number"
//         ? `${ratingValue.toFixed(1)}/5 (${ratingCount || 0} lượt)`
//         : "Chưa có";
//     },
//   },
//   { key: "trailerUrl", label: "Trailer", type: "link" },
//   { key: "createdAt", label: "Ngày tạo", type: "datetime" },
//   { key: "updatedAt", label: "Cập nhật cuối", type: "datetime" },
// ];

// const openViewModal = (movie: Movie) => {
//   selectedMovie.value = movie;
//   isViewModalOpen.value = true;
// };

const openEditModal = (movie: Movie) => {
  selectedMovie.value = { ...movie };
  isEditModalOpen.value = true;
};

const openCreateModal = () => {
  selectedMovie.value = undefined;
  isEditModalOpen.value = true;
};

const handleMovieSubmit = async (formData: Movie) => {
  isSubmittingMovie.value = true;
  try {
    if (formData.id) {
      await axios.patch(
        `${import.meta.env.VITE_APP_URL_API}/movies/${formData.id}`,
        formData
      );
    } else {
      await axios.post(`${import.meta.env.VITE_APP_URL_API}/movies`, formData);
      console.log("Creating movie:", formData);
    }
    await fetchMovies();
    isEditModalOpen.value = false;
  } catch (error) {
    console.error("Lỗi khi submit phim:", error);
  } finally {
    isSubmittingMovie.value = false;
  }
};

definePageMeta({
  layout: "admin",
});

onMounted(async () => {
  await fetchMovies();
});
</script>
