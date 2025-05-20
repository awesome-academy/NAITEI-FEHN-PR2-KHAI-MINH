<template>
  <div class="flex flex-col justify-start">
    <div class="w-full flex flex-row justify-between items-center mb-6">
      <span class="text-2xl font-medium mb-4 text-white"
        >Danh sách rạp chiếu phim</span
      >
      <button
        @click="openCreateCinemaModal"
        class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-md transition-colors duration-150"
      >
        Thêm Rạp Mới
      </button>
    </div>

    <div v-if="pending" class="text-center py-10">
      <svg
        class="animate-spin h-8 w-8 text-green-400 mx-auto"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p class="mt-2 text-gray-400">Đang tải danh sách rạp...</p>
    </div>

    <div
      v-else-if="fetchError"
      class="text-center py-10 bg-red-800 bg-opacity-40 p-4 rounded-md"
    >
      <p class="text-red-400 font-semibold">
        Oops! Đã có lỗi xảy ra khi tải dữ liệu.
      </p>
      <p class="text-red-500 text-sm mt-1">
        {{ fetchError.message || "Vui lòng thử lại sau." }}
      </p>
      <button
        @click="refreshPageData"
        class="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        Thử lại
      </button>
    </div>

    <div v-else-if="cinemas && cinemas.length > 0" class="space-y-3">
      <div
        v-for="cinema in cinemas"
        :key="cinema.id"
        class="w-full flex flex-col justify-start items-start rounded-md overflow-hidden"
        :class="{
          'bg-gray-800 shadow-lg': cinema.id === currentCinemaId,
          'bg-gray-700 bg-opacity-80': cinema.id !== currentCinemaId,
        }"
      >
        <div
          class="flex w-full flex-row justify-between items-center p-4 cursor-pointer hover:bg-gray-800 transition-colors duration-200 group"
          :class="{ 'border-b border-gray-300': cinema.id === currentCinemaId }"
          @click="toggleCinema(cinema.id)"
        >
          <div class="flex flex-row justify-start items-center gap-4">
            <img
              :src="cinema.logo"
              :alt="cinema.name"
              class="w-12 h-12 object-contain rounded bg-gray-600 flex-shrink-0"
              @error="onImageError"
            />
            <div class="flex flex-col justify-center items-start gap-1">
              <span
                class="flex-grow text-md font-semibold duration-300"
                :class="{
                  'text-green-500': cinema.id === currentCinemaId,
                  'text-gray-100 group-hover:text-green-500':
                    cinema.id !== currentCinemaId,
                }"
              >
                {{ cinema.name }}
              </span>
              <div class="flex flex-row justify-center items-center gap-2">
                <span
                  v-if="cinema.id === currentCinemaId"
                  class="text-xs text-white duration-300"
                >
                  {{ cinema.address }}
                </span>

                <button
                  v-if="cinema.id === currentCinemaId"
                  @click="openEditCinemaModal(cinema as Cinema)"
                  class="text-green-500 hover:text-green-600 mr-2"
                >
                  <Icon icon="mdi:settings" class="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-5 h-5 text-gray-400 duration-300 transform group-hover:text-green-300"
            :class="{
              'rotate-180 text-green-400': cinema.id === currentCinemaId,
            }"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>

        <div
          v-if="
            cinema.id === currentCinemaId &&
            cinema.rooms &&
            cinema.rooms.length > 0
          "
          class="flex flex-wrap gap-3 p-4 bg-gray-800 border-gray-700"
        >
          <button
            v-for="room in cinema.rooms"
            :key="room.id"
            @click="openRoomLayoutModel(room)"
            class="border border-green-600 px-4 py-2 rounded-md text-green-400 text-sm font-medium cursor-pointer hover:bg-green-500 hover:text-white hover:border-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            {{ room.name }}
          </button>
        </div>
        <div
          v-if="
            cinema.id === currentCinemaId &&
            (!cinema.rooms || cinema.rooms.length === 0)
          "
          class="p-4 text-sm text-gray-400 bg-gray-800 border-t border-gray-700"
        >
          Rạp này hiện chưa có thông tin phòng chiếu.
        </div>
      </div>

      <div
        v-if="totalPages > 1"
        class="flex justify-end items-center space-x-4 py-6"
      >
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1 || pending"
          class="px-4 py-2 bg-white border-gray-300 text-gray-800 rounded hover:bg-green-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Trước
        </button>
        <span class="text-gray-300">
          Trang {{ currentPage }} / {{ totalPages }}
        </span>
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages || pending"
          class="px-4 py-2 bg-white border-gray-300 text-gray-800 rounded hover:bg-green-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sau
        </button>
      </div>
    </div>

    <div v-else class="text-center text-gray-400 py-8">
      <p>Không tìm thấy rạp chiếu phim nào.</p>
    </div>

    <DialogRoot
      :open="isCinemaModalOpen"
      @update:open="isCinemaModalOpen = $event"
    >
      <DialogPortal>
        <DialogOverlay
          class="fixed inset-0 bg-black/60 dark:bg-black/80 data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide z-[100]"
        />
        <DialogContent
          class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-[calc(100vw-2rem)] sm:w-[90vw] max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[90vh] data-[state=open]:animate-contentShow data-[state=closed]:animate-contentHide focus:outline-none bg-slate-900 shadow-2xl rounded-xl overflow-y-auto"
          @escape-key-down="isCinemaModalOpen = false"
          @pointer-down-outside="isCinemaModalOpen = false"
        >
          <CinemaForm
            v-if="isCinemaModalOpen"
            :initial-data="selectedCinema"
            @submit="handleCinemaSubmit"
            @cancel="isCinemaModalOpen = false"
            :loading="isSubmittingCinema"
            class="custom-form-padding"
          />
        </DialogContent>
      </DialogPortal>
    </DialogRoot>

    <DialogRoot :open="isRoomModalOpen" @update:open="isRoomModalOpen = $event">
      <DialogPortal>
        <DialogOverlay
          class="fixed inset-0 bg-black/60 dark:bg-black/80 data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide z-[100]"
        />
        <DialogContent
          class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-[calc(100vw-1rem)] sm:w-[90vw] max-w-[80] md:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] data-[state=open]:animate-contentShow data-[state=closed]:animate-contentHide focus:outline-none bg-slate-900 shadow-2xl rounded-xl overflow-y-auto"
          @escape-key-down="isRoomModalOpen = false"
          @pointer-down-outside="isRoomModalOpen = false"
        >
          <RoomLayoutDisplay :room-id="selectRoomId" />
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios, { AxiosError } from "axios";
import type { Cinema, CinemaType } from "@/types/cinema.type";
import type { Room } from "@/types/room.type";
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "reka-ui";
import CinemaForm from "@/components/admin/cinemas/cinema-form.vue";
import { Icon } from "@iconify/vue";
import RoomLayoutDisplay from "@/components/admin/cinemas/room-layout-display.vue";

interface FetchError {
  message: string;
  statusCode?: number;
}

const config = useRuntimeConfig();
const API_BASE_URL = import.meta.env.VITE_APP_URL_API;

const cinemas = ref<Cinema[]>([]);
const pending = ref(false);
const fetchError = ref<FetchError | null>(null);

const currentCinemaId = ref<string | number | null>(null);
const currentPage = ref(1);
const itemsPerPage = 8;
const totalCinemas = ref(0);

const isCinemaModalOpen = ref(false);
const isRoomModalOpen = ref(false);
const selectRoomId = ref("");
const selectedCinema = ref<CinemaType | undefined>(undefined);
const isSubmittingCinema = ref(false);

const fetchCinemas = async (pageToFetch: number = 1) => {
  pending.value = true;
  fetchError.value = null;
  try {
    const response = await axios.get<Cinema[]>(
      `${API_BASE_URL}/cinemas?_embed=rooms&_page=${pageToFetch}&_limit=${itemsPerPage}`
    );
    cinemas.value = response.data;
    const totalCountHeader = response.headers["x-total-count"];
    if (totalCountHeader) {
      totalCinemas.value = parseInt(totalCountHeader, 10);
    } else {
      if (response.data.length < itemsPerPage && response.data.length > 0) {
        totalCinemas.value =
          (pageToFetch - 1) * itemsPerPage + response.data.length;
      } else if (response.data.length === itemsPerPage) {
        totalCinemas.value =
          pageToFetch * itemsPerPage +
          (response.data.length === itemsPerPage ? 1 : 0);
      } else if (response.data.length === 0 && pageToFetch === 1) {
        totalCinemas.value = 0;
      }
    }
  } catch (e: any) {
    const axiosError = e as AxiosError;
    fetchError.value = {
      message: axiosError.message || "Lỗi không xác định từ API",
      statusCode: axiosError.response?.status,
    };
    cinemas.value = [];
  } finally {
    pending.value = false;
  }
};

const totalPages = computed(() => {
  if (totalCinemas.value === 0) return 1;
  return Math.ceil(totalCinemas.value / itemsPerPage);
});

const refreshPageData = async () => {
  await fetchCinemas(currentPage.value);
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && !pending.value) {
    currentPage.value = page;
    currentCinemaId.value = null;
    fetchCinemas(currentPage.value);
  }
};

const toggleCinema = (cinemaId: string | number) => {
  if (currentCinemaId.value === cinemaId) {
    currentCinemaId.value = null;
  } else {
    currentCinemaId.value = cinemaId;
  }
};

const selectRoom = (cinema: Cinema, room: Room) => {
  console.log("Đã chọn Phòng:", room.name, "- Rạp:", cinema.name);
};

const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = "https://via.placeholder.com/48/CBD5E0/4A5568?text=Logo";
  target.classList.add("bg-gray-500");
};

const openCreateCinemaModal = () => {
  selectedCinema.value = undefined;
  isCinemaModalOpen.value = true;
};

const openRoomLayoutModel = (room: Room) => {
  selectRoomId.value = room.id;
  isRoomModalOpen.value = true;
};

const openEditCinemaModal = (cinema: Cinema) => {
  selectedCinema.value = {
    id: cinema.id,
    name: cinema.name,
    address: cinema.address,
    city: cinema.city,
    lat: cinema.lat,
    lon: cinema.lon,
    logo: cinema.logo,
    createdAt: cinema.createdAt,
    updatedAt: cinema.updatedAt,
  };
  isCinemaModalOpen.value = true;
};

const handleCinemaSubmit = async (formData: Cinema) => {
  isSubmittingCinema.value = true;
  try {
    if (formData.id) {
      await axios.patch(`${API_BASE_URL}/cinemas/${formData.id}`, formData);
    } else {
      await axios.post(`${API_BASE_URL}/cinemas`, formData);
    }
    await fetchCinemas(currentPage.value);
    isCinemaModalOpen.value = false;
  } catch (error) {
    console.error("Lỗi khi submit rạp:", error);
  } finally {
    isSubmittingCinema.value = false;
  }
};

onMounted(() => {
  fetchCinemas(currentPage.value);
});
</script>
