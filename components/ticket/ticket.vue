<template>
  <div class="flex py-8 w-full flex-col overflow-hidden">
    <h1 class="text-base font-semibold mb-4 text-white">Danh sách Đặt Vé</h1>
    <div>
      <ReusableTable
        :columns="bookingTableColumns"
        :data="paginatedBookings"
        row-key="id"
        :loading="isLoadingBookings"
      >
        <template #cell-seats="{ value }">
          <div class="flex flex-wrap gap-1 justify-start">
            <span
              v-for="seat in value"
              :key="seat.seatId"
              class="px-2 py-0.5 text-xs bg-sky-500 text-white font-medium rounded-full"
            >
              {{ seat.name }}
            </span>
          </div>
        </template>

        <template #cell-finalTotalPrice="{ value }">
          <span class="font-semibold text-green-400">
            {{
              value.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })
            }}
          </span>
        </template>

        <template #cell-bookingRequestTime="{ value }">
          {{
            new Date(value).toLocaleString("vi-VN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          }}
        </template>

        <template #actions="{ item }">
          <div class="flex flex-row items-center justify-center gap-1">
            <button
              @click="viewBookingDetails(item as Booking)"
              class="text-blue-500 hover:text-blue-600"
              title="Xem chi tiết"
            >
              <Icon icon="mdi:eye-outline" class="w-6 h-6" />
            </button>
          </div>
        </template>
      </ReusableTable>

      <div
        v-if="!isLoadingBookings && bookings.length > 0"
        class="mt-6 flex flex-col sm:flex-row justify-between items-center"
      >
        <div class="text-sm text-white mb-2 sm:mb-0">
          Hiển thị {{ paginatedBookings.length }} trong tổng số
          {{ bookings.length }} đặt vé
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

      <DialogRoot
        :open="isDetailModalOpen"
        @update:open="isDetailModalOpen = $event"
      >
        <DialogPortal>
          <DialogOverlay
            class="fixed inset-0 bg-black/60 dark:bg-black/80 data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide z-[100]"
          />
          <DialogContent
            class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-[calc(100vw-2rem)] sm:w-[90vw] max-w-xl max-h-[90vh] data-[state=open]:animate-contentShow data-[state=closed]:animate-contentHide focus:outline-none bg-slate-800 p-6 shadow-2xl rounded-xl overflow-y-auto"
          >
            <div class="flex justify-between items-center mb-6">
              <DialogTitle class="text-xl font-semibold text-gray-100">
                Chi Tiết Đặt Vé #{{ selectedBooking?.id }}
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

            <div v-if="selectedBooking" class="text-sm">
              <div class="flex items-center mb-5">
                <h2 class="text-xl sm:text-2xl font-semibold text-white">
                  {{ selectedBooking.movieName }}
                </h2>
              </div>

              <div
                class="flex flex-row justify-between items-center gap-x-4 gap-y-2 mb-4 pb-4 border-b border-slate-700"
              >
                <div>
                  <p class="text-xs text-gray-400 uppercase tracking-wider">
                    Thời gian
                  </p>
                  <p class="text-base text-gray-100 font-medium">
                    {{ selectedBooking.showTimeDetails }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-400 uppercase tracking-wider">
                    Ngày chiếu
                  </p>
                  <p class="text-base text-gray-100 font-medium">
                    {{
                      new Date(
                        selectedBooking.bookingRequestTime
                      ).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    }}
                  </p>
                </div>
              </div>

              <div class="mb-4 pb-4 border-b border-slate-700">
                <p class="text-xs text-gray-400 uppercase tracking-wider">
                  Rạp
                </p>
                <p class="text-base text-gray-100 font-medium">
                  {{ selectedBooking.cinemaName }}
                </p>
                <p
                  v-if="selectedBooking.cinema.address"
                  class="text-sm text-gray-400 mt-1"
                >
                  {{ selectedBooking.cinema.address }}
                </p>
                <p v-else class="text-sm text-gray-500 italic mt-1">
                  Thông tin địa chỉ rạp chiếu (nếu có)
                </p>
              </div>

              <div
                class="flex flex-row justify-between items-center gap-x-4 gap-y-2 mb-4 pb-4 border-b border-slate-700"
              >
                <div>
                  <p class="text-xs text-gray-400 uppercase tracking-wider">
                    Phòng chiếu
                  </p>
                  <p class="text-base text-gray-100 font-medium">
                    {{ selectedBooking.room.name }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-400 uppercase tracking-wider">
                    Định dạng
                  </p>
                  <p class="text-base text-gray-100 font-medium">2D Phụ đề</p>
                </div>
              </div>

              <div
                class="mb-4 pb-4"
                :class="{
                  'border-b border-slate-700': !(
                    selectedBooking.combos && selectedBooking.combos.length > 0
                  ),
                }"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <p class="text-xs text-gray-400 uppercase tracking-wider">
                      Ghế
                    </p>
                    <p class="text-base text-gray-100 font-medium mt-1">
                      <span
                        v-for="(seat, index) in selectedBooking.seats"
                        :key="seat.seatId"
                      >
                        {{ seat.name
                        }}{{
                          index < selectedBooking.seats.length - 1 ? ", " : ""
                        }}
                      </span>
                    </p>
                  </div>
                  <p class="text-base text-gray-100 font-medium text-right">
                    {{
                      selectedBooking.totalPriceSeats.toLocaleString("vi-VN")
                    }}đ
                  </p>
                </div>
              </div>

              <div
                v-if="
                  selectedBooking.combos && selectedBooking.combos.length > 0
                "
                class="mb-4 pb-4 border-b border-slate-700"
              >
                <p class="text-xs text-gray-400 uppercase tracking-wider mb-2">
                  Combo
                </p>
                <ul class="space-y-1 mb-2">
                  <li
                    v-for="combo in selectedBooking.combos"
                    :key="combo.id"
                    class="flex justify-between items-center text-sm"
                  >
                    <span class="text-gray-200"
                      >{{ combo.name }} (x{{ combo.quantity }})</span
                    >
                    <span class="text-gray-200"
                      >{{ combo.totalPrice.toLocaleString("vi-VN") }}đ</span
                    >
                  </li>
                </ul>
                <div
                  class="flex justify-between items-center pt-2 border-t border-slate-600"
                >
                  <p class="text-sm text-gray-300 font-medium">
                    Tổng tiền combo
                  </p>
                  <p class="text-sm text-gray-100 font-semibold">
                    {{
                      selectedBooking.totalPriceCombos.toLocaleString("vi-VN")
                    }}đ
                  </p>
                </div>
              </div>

              <div class="mt-2 mb-4">
                <div class="flex justify-between items-center">
                  <p
                    class="text-base text-gray-100 font-semibold uppercase tracking-wider"
                  >
                    Tạm tính
                  </p>
                  <p class="text-xl sm:text-2xl font-bold text-green-400">
                    {{
                      selectedBooking.finalTotalPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                    }}
                  </p>
                </div>
              </div>

              <div class="pt-4 border-t border-slate-700 space-y-3">
                <div>
                  <p class="text-xs text-gray-400 uppercase tracking-wider">
                    Phương thức thanh toán
                  </p>
                  <p class="text-base text-gray-100 font-medium">
                    {{ selectedBooking.paymentMethod }}
                  </p>
                </div>
                <div v-if="selectedBooking.note">
                  <p class="text-xs text-gray-400 uppercase tracking-wider">
                    Ghi chú
                  </p>
                  <p class="text-base text-gray-100 font-medium leading-snug">
                    {{ selectedBooking.note }}
                  </p>
                </div>
              </div>

              <p class="text-xs text-gray-500 italic mt-6 text-center">
                Ưu đãi (nếu có) sẽ được áp dụng ở bước thanh toán.
              </p>
            </div>
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
import type { Booking, Seat } from "@/types/booking2.type";
import axios from "axios";
import { Icon } from "@iconify/vue";
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "reka-ui";
import { useCurrentUser } from "@/lib/utils";

const currentUser = useCurrentUser();
const bookings = ref<Booking[]>([]);
const isLoadingBookings = ref(false);

const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() => {
  if (!bookings.value || bookings.value.length === 0) return 1;
  return Math.ceil(bookings.value.length / itemsPerPage);
});

const paginatedBookings = computed(() => {
  if (!bookings.value) return [];
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return bookings.value.slice(start, end);
});

async function fetchBookings(): Promise<void> {
  isLoadingBookings.value = true;
  const response = await axios.get(
    `${import.meta.env.VITE_APP_URL_API}/bookings?userId=${
      currentUser.value.id
    }&_expand=cinema&_expand=room`
  );

  const data: Booking[] = response.data;
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    bookings.value = data.sort(
      (a, b) =>
        new Date(b.bookingRequestTime).getTime() -
        new Date(a.bookingRequestTime).getTime()
    );

    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value;
    } else if (totalPages.value === 0 || bookings.value.length === 0) {
      currentPage.value = 1;
    }
  } catch (error) {
    console.error("Lỗi khi tải danh sách đặt vé:", error);
    bookings.value = [];
    currentPage.value = 1;
  } finally {
    isLoadingBookings.value = false;
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const bookingTableColumns: TableColumn<Booking>[] = [
  { key: "id", label: "Mã Vé", cellClass: "w-20 text-center text-xs" },
  {
    key: "movieName",
    label: "Tên Phim",
    cellClass: "w-48 font-medium truncate max-w-[250px]",
  },
  { key: "cinemaName", label: "Rạp Chiếu", cellClass: "min-w-[180px]" },
  {
    key: "room.name",
    label: "Phòng",
    cellClass: "w-32 text-center",
    format: (value, item) => item.room.name,
  },
  {
    key: "showTimeDetails",
    label: "Suất Chiếu",
    cellClass: "w-36 text-center",
  },
  {
    key: "bookingRequestTime",
    label: "Ngày Đặt",
    cellClass: "min-w-[150px] text-center",
  },
  {
    key: "seats",
    label: "Ghế Đã Đặt",
    cellClass: "min-w-[150px] max-w-[200px]",
  },
  {
    key: "finalTotalPrice",
    label: "Tổng Tiền",
    cellClass: "w-36 text-right",
  },
];

const isDetailModalOpen = ref(false);
const selectedBooking = ref<Booking | undefined>(undefined);

const viewBookingDetails = (booking: Booking) => {
  selectedBooking.value = booking;
  isDetailModalOpen.value = true;
};

onMounted(async () => {
  await fetchBookings();
});
</script>
