<template>
  <div class="p-4 md:p-6 lg:p-8 bg-slate-900 min-h-screen w-full text-gray-100">
    <header class="mb-6">
      <h1 class="text-3xl font-bold text-white">Quản Lý Vé Đặt</h1>
    </header>

    <div v-if="fetchBookingsError" class="mb-6 text-center py-6 bg-red-800 bg-opacity-40 p-4 rounded-md">
      <p class="text-red-300 font-semibold text-lg">Không thể tải danh sách vé.</p>
      <p class="text-red-400 text-sm mt-1">{{ fetchBookingsError.message }}</p>
      <button @click="refreshBookings"
        class="mt-4 px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
        Thử lại
      </button>
    </div>

    <ReusableTable :columns="columns" :data="bookings" row-key="id" :loading="pendingBookings">
      <template #actions="{ item }">
        <div class="flex space-x-3 justify-end items-center">
          <!-- Accept/Reject Buttons -->
          <div v-if="item.status === 'pending'" class="flex space-x-3">
            <button @click="acceptTicket(item)" :disabled="actionLoading[item.id] !== false"
              class="px-3 py-1 text-sm font-medium rounded-md text-green-100 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
              <span v-if="actionLoading[item.id] === 'accept'">
                <svg class="animate-spin inline mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Đang...
              </span>
              <span v-else>Chấp Nhận</span>
            </button>
            <button @click="rejectTicket(item)" :disabled="actionLoading[item.id] !== false"
              class="px-3 py-1 text-sm font-medium rounded-md text-red-100 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
              <span v-if="actionLoading[item.id] === 'reject'">
                <svg class="animate-spin inline mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Đang...
              </span>
              <span v-else>Từ Chối</span>
            </button>
          </div>
          <!-- <span v-else-if="item.status !== 'pending'" class="text-gray-400 italic text-sm mr-3">Đã xử lý</span> -->

          <!-- View Detail Button -->
          <button @click="openDetailModal(item)"
            class="px-3 py-1 text-sm font-medium rounded-md text-blue-100 bg-blue-600 hover:bg-blue-700 transition-colors">
            Xem Chi Tiết
          </button>
        </div>
      </template>
    </ReusableTable>

    <!-- Detail Modal -->
    <DialogRoot :open="isDetailModalOpen" @update:open="isDetailModalOpen = $event">
      <DialogPortal>
        <DialogOverlay
          class="fixed inset-0 bg-black/60 dark:bg-black/80 data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide z-[100]" />
        <DialogContent
          class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-[calc(100vw-2rem)] sm:w-[90vw] max-w-xl max-h-[90vh] data-[state=open]:animate-contentShow data-[state=closed]:animate-contentHide focus:outline-none bg-slate-800 p-6 shadow-2xl rounded-xl overflow-y-auto"
          style="scrollbar-width: thin; scrollbar-color: #4a5568 #2d3748;">
          <div class="flex justify-between items-center mb-6">
            <DialogTitle class="text-xl font-semibold text-gray-100">
              Chi Tiết Đặt Vé #{{ selectedBooking?.id }}
            </DialogTitle>
            <DialogClose @click="isDetailModalOpen = false"
              class="p-1 rounded-full text-gray-400 hover:text-gray-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 focus:ring-offset-slate-800"
              aria-label="Đóng">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <div class="flex flex-row justify-between items-center gap-x-4 gap-y-2 mb-4 pb-4 border-b border-slate-700">
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
                  Ngày đặt
                </p>
                <p class="text-base text-gray-100 font-medium">
                  {{
                    formatDateTime(selectedBooking.bookingRequestTime)
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

            </div>
            <div class="flex flex-row justify-between items-center gap-x-4 gap-y-2 mb-4 pb-4 border-b border-slate-700">
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wider">
                  Phòng chiếu
                </p>
                <p class="text-base text-gray-100 font-medium">
                  {{ selectedBooking.roomName }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wider">
                  Định dạng
                </p>
                <p class="text-base text-gray-100 font-medium">2D Phụ đề</p>
              </div>
            </div>
            <div class="mb-4 pb-4" :class="{
              'border-b border-slate-700': !(
                selectedBooking.combos && selectedBooking.combos.length > 0
              ),
            }">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-xs text-gray-400 uppercase tracking-wider">
                    Ghế
                  </p>
                  <p class="text-base text-gray-100 font-medium mt-1">
                    <span v-for="(seat, index) in selectedBooking.seats" :key="seat.seatId">
                      {{ seat.name
                      }}{{
                        index < selectedBooking.seats.length - 1 ? ", " : "" }} </span>
                  </p>
                </div>
                <p class="text-base text-gray-100 font-medium text-right">
                  {{
                    formatCurrency(selectedBooking.totalPriceSeats)
                  }}
                </p>
              </div>
            </div>
            <div v-if="
              selectedBooking.combos && selectedBooking.combos.length > 0
            " class="mb-4 pb-4 border-b border-slate-700">
              <p class="text-xs text-gray-400 uppercase tracking-wider mb-2">
                Combo
              </p>
              <ul class="space-y-1 mb-2">
                <li v-for="combo in selectedBooking.combos" :key="combo.id"
                  class="flex justify-between items-center text-sm">
                  <span class="text-gray-200">{{ combo.name }} (x{{ combo.quantity }})</span>
                  <span class="text-gray-200">{{ formatCurrency(combo.totalPrice) }}</span>
                </li>
              </ul>
              <div class="flex justify-between items-center pt-2 border-t border-slate-600">
                <p class="text-sm text-gray-300 font-medium">
                  Tổng tiền combo
                </p>
                <p class="text-sm text-gray-100 font-semibold">
                  {{
                    formatCurrency(selectedBooking.totalPriceCombos)
                  }}
                </p>
              </div>
            </div>
            <div class="mt-2 mb-4">
              <div class="flex justify-between items-center">
                <p class="text-base text-gray-100 font-semibold uppercase tracking-wider">
                  Tổng cộng
                </p>
                <p class="text-xl sm:text-2xl font-bold text-green-400">
                  {{
                    formatCurrency(selectedBooking.finalTotalPrice)
                  }}
                </p>
              </div>
            </div>
            <div class="pt-4 border-t border-slate-700 space-y-3">
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wider">
                  Phương thức thanh toán
                </p>
                <div v-if="selectedBooking" class="mt-1">
                  <div v-if="selectedBooking.paymentMethod === 'online'" class="flex items-center">
                    <Icon icon="mdi:credit-card-check-outline" class="h-6 w-6 mr-2 text-blue-400 flex-shrink-0" />
                    <div>
                      <span class="text-base text-gray-100 font-medium">Thanh toán Online</span>
                      <span class="block text-xs text-gray-400">(Qua cổng thanh toán)</span>
                    </div>
                  </div>
                  <div v-else-if="selectedBooking.paymentMethod === 'offline'" class="flex items-center">
                    <Icon icon="mdi:cash-multiple" class="h-6 w-6 mr-2 text-green-400 flex-shrink-0" />
                    <div>
                      <span class="text-base text-gray-100 font-medium">Thanh toán Tại quầy</span>
                      <span class="block text-xs text-gray-400">(Trả tiền mặt tại rạp)</span>
                    </div>
                  </div>
                  <p v-else class="text-base text-gray-100 font-medium">
                    {{ selectedBooking.paymentMethod || 'Không xác định' }}
                  </p>
                </div>
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

          </div>
          <div v-else class="text-center py-10 text-gray-400">
            <p>Đang tải chi tiết vé...</p>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import ReusableTable, { type TableColumn } from '~/components/shared/reusable-table.vue';
import type { Booking, SeatInBooking } from '~/types/booking.type'; // Adjusted path assuming types folder is in root
import { Icon } from '@iconify/vue';
definePageMeta({
  layout: "admin",
});

const API_BASE_URL = 'http://localhost:5000';

const bookings = ref<Booking[]>([]);
const pendingBookings = ref(true);
const fetchBookingsError = ref<Error | null>(null);
const actionLoading = reactive<Record<string | number, 'accept' | 'reject' | false>>({});

// Refs for Detail Modal
const isDetailModalOpen = ref(false);
const selectedBooking = ref<Booking | null>(null);

const openDetailModal = (booking: Booking) => {
  selectedBooking.value = booking;
  isDetailModalOpen.value = true;
};

const formatCurrency = (value: number) => {
  if (typeof value !== 'number') return '0đ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatDateTime = (isoString: string) => {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch (e) { return isoString; }
};

const getStatusText = (status: Booking['status'] | undefined): string => {
  switch (status) {
    case 'pending': return 'Chờ xử lý';
    case 'accepted': return 'Đã chấp nhận';
    case 'rejected': return 'Đã từ chối';
    default: return 'Không rõ';
  }
};

const getStatusClass = (status: Booking['status'] | undefined): string => {
  let baseClass = 'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full';
  switch (status) {
    case 'pending': return `${baseClass} bg-yellow-600 text-yellow-100`;
    case 'accepted': return `${baseClass} bg-green-600 text-green-100`;
    case 'rejected': return `${baseClass} bg-red-600 text-red-100`;
    default: return `${baseClass} bg-gray-600 text-gray-100`;
  }
};

const columns: TableColumn<Booking>[] = [
  { key: 'id', label: 'ID Vé', cellClass: 'text-gray-300 font-mono text-xs' },
  { key: 'movieName', label: 'Phim', cellClass: 'text-white font-semibold' },
  {
    key: 'cinemaInfo',
    label: 'Rạp & Phòng',
    format: (_, item) => `<div class="text-gray-200">${item.cinemaName}</div><div class="text-xs text-gray-400">${item.roomName} (ID: ${item.roomId})</div>`,
  },
  { key: 'showTimeDetails', label: 'Suất Chiếu', cellClass: 'text-gray-300' },
  {
    key: 'seats',
    label: 'Ghế',
    format: (seatsArray: SeatInBooking[]) => seatsArray.map(s => s.name).join(', ') || 'N/A',
    cellClass: 'text-gray-300',
  },
  {
    key: 'finalTotalPrice',
    label: 'Tổng Tiền',
    format: (value: number) => formatCurrency(value),
    cellClass: 'text-green-400 font-semibold',
  },
  {
    key: 'bookingRequestTime',
    label: 'Thời Gian Đặt',
    format: (value: string) => formatDateTime(value),
    cellClass: 'text-gray-400 text-xs',
  },
  {
    key: 'status',
    label: 'Trạng Thái',
    format: (status: Booking['status']) => `<span class="${getStatusClass(status)}">${getStatusText(status)}</span>`,
  },
  // The 'actions' column is now handled by the #actions slot in ReusableTable
];

const fetchBookings = async () => {
  pendingBookings.value = true;
  fetchBookingsError.value = null;
  try {
    const response = await fetch(`${API_BASE_URL}/bookings?_sort=bookingRequestTime&_order=desc`);
    if (!response.ok) throw new Error(`Lỗi ${response.status}: Không thể tải danh sách vé.`);
    const data = await response.json();
    bookings.value = data.map((b: any) => ({ ...b, status: b.status || 'pending' }));
  } catch (e: any) {
    fetchBookingsError.value = e;
    console.error("Lỗi khi tải vé:", e);
  } finally {
    pendingBookings.value = false;
  }
};

const refreshBookings = () => fetchBookings();

const updateBookingStatusAPI = async (bookingId: number | string, status: Booking['status']): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return response.ok;
  } catch (error) {
    console.error(`Lỗi khi cập nhật trạng thái vé ${bookingId}:`, error);
    return false;
  }
};

const updateSeatStatusAPI = async (seatCode: string, roomId: string, newStatus: "0" | "1"): Promise<boolean> => {
  // This function's reliability depends on how json-server handles PATCH /seats/:seatCode
  // if seatCode is not a globally unique ID for the /seats collection.
  // As discussed, for robust updates, seat.seatId should ideally be a globally unique ID.
  try {
    // Attempt to find the specific seat entry if your /seats collection uses composite keys logically
    // but json-server still relies on a single ID for PATCH.
    // This GET is more for verification or if you needed to fetch a different unique ID.
    const findResponse = await fetch(`${API_BASE_URL}/seats?id=${encodeURIComponent(seatCode)}&roomId=${encodeURIComponent(roomId)}`);
    if (!findResponse.ok) {
      console.error(`Error finding seat ${seatCode} in room ${roomId} before update. Status: ${findResponse.status}`);
      // Decide if you want to proceed or return false
    }
    const foundSeats = await findResponse.json();
    if (!foundSeats || foundSeats.length === 0) {
      console.error(`Seat ${seatCode} in room ${roomId} not found. Cannot update.`);
      return false;
    }
    // If foundSeats[0] has a different, truly unique ID (e.g., _id from MongoDB, or a globalId you added), use that for the PATCH URL.
    // For now, assuming seatCode is the ID json-server uses for PATCH, despite potential non-uniqueness globally.
    // This is the risky part if `seatCode` isn't the true unique primary key for the /seats endpoint.
    const patchId = foundSeats[0].id; // Assuming the 'id' field from the query result is what json-server uses for PATCH.

    const response = await fetch(`${API_BASE_URL}/seats/${patchId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) {
      console.error(`Failed to update seat ${patchId}. Status: ${response.status}, Text: ${await response.text()}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Lỗi khi cập nhật trạng thái ghế (seatCode: ${seatCode}, roomId: ${roomId}):`, error);
    return false;
  }
};

const acceptTicket = async (booking: Booking) => {
  if (actionLoading[booking.id]) return;
  actionLoading[booking.id] = 'accept';

  const bookingStatusUpdated = await updateBookingStatusAPI(booking.id, 'accepted');
  if (bookingStatusUpdated) {
    let allSeatsSuccessfullyUpdated = true;
    for (const seat of booking.seats) {
      // Pass seat.seatId (which is the 'id' like "00500401") and booking.roomId
      const seatUpdated = await updateSeatStatusAPI(seat.seatId, booking.roomId, "1");
      if (!seatUpdated) {
        allSeatsSuccessfullyUpdated = false;
        console.error(`Không thể cập nhật ghế: ${seat.seatId} (Phòng: ${booking.roomId}) cho vé ${booking.id}.`);
      }
    }

    if (!allSeatsSuccessfullyUpdated) {
      alert(`Vé ${booking.id} đã được chấp nhận, NHƯNG có lỗi khi cập nhật trạng thái một số ghế. Vui lòng kiểm tra thủ công.`);
    } else {
      alert(`Vé ${booking.id} đã được chấp nhận thành công.`);
    }
    const index = bookings.value.findIndex(b => b.id === booking.id);
    if (index !== -1) bookings.value[index].status = 'accepted';
  } else {
    alert(`Có lỗi xảy ra khi chấp nhận vé ${booking.id}.`);
  }
  actionLoading[booking.id] = false;
};

const rejectTicket = async (booking: Booking) => {
  if (actionLoading[booking.id]) return;
  actionLoading[booking.id] = 'reject';

  const bookingStatusUpdated = await updateBookingStatusAPI(booking.id, 'rejected');
  if (bookingStatusUpdated) {
    alert(`Vé ${booking.id} đã được từ chối.`);
    const index = bookings.value.findIndex(b => b.id === booking.id);
    if (index !== -1) bookings.value[index].status = 'rejected';
  } else {
    alert(`Có lỗi xảy ra khi từ chối vé ${booking.id}.`);
  }
  actionLoading[booking.id] = false;
};

onMounted(() => {
  fetchBookings();
});
</script>
