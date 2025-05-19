<template>
  <div class="p-6  bg-pb-background text-pb-text flex flex-col">
    <div v-if="pendingRoom || pendingSeats" class="text-center py-10">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pb-accent"></div>
      <p class="mt-4 text-sm text-pb-text-secondary">Đang tải sơ đồ ghế...</p>
    </div>
    <div v-else-if="roomError || seatsError" class="text-center py-10 text-red-600 dark:text-red-400">
      <p class="font-medium">Lỗi khi tải dữ liệu ghế:</p>
      <p class="text-sm">{{ roomError?.message || seatsError?.message }}</p>
      <button type="button" @click="retryFetch"
        class="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-sm font-medium rounded-md hover:bg-red-200 dark:hover:bg-red-800/70 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-pb-background">
        Thử lại
      </button>
    </div>
    <div v-else-if="room && seats" class="cinema-seat-layout flex-grow max-h-[60vh] overflow-y-scroll">
      <div class="mb-6 text-center">
        <h4 class="text-lg font-medium text-pb-text">{{ movieName }}</h4>
        <p class="text-sm text-pb-text-secondary">
          {{ cinemaName }} - {{ roomName }} | {{ showTimeDetails }}
        </p>
      </div>

      <div
        class="screen-indicator bg-pb-border text-pb-text-secondary font-semibold py-1 px-4 rounded text-center mb-4">
        MÀN HÌNH</div>

      <div class="seat-grid-container my-4 overflow-x-auto">
        <div class="seat-grid inline-grid gap-1 md:gap-1.5" :style="gridStyle">
          <template v-for="rowIndex in room.totalRow" :key="`row-${rowIndex - 1}`">
            <template v-for="colIndex in room.totalCol" :key="`col-${colIndex - 1}`">
              <button type="button" :style="getSeatStyle(getSeatAt(rowIndex - 1, colIndex - 1))"
                :class="getSeatClasses(getSeatAt(rowIndex - 1, colIndex - 1))"
                :disabled="isSeatDisabled(getSeatAt(rowIndex - 1, colIndex - 1))"
                @click="toggleSeatSelection(getSeatAt(rowIndex - 1, colIndex - 1))"
                class="seat-item w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-xs md:text-sm font-medium rounded flex items-center justify-center transition-all duration-150">
                <span
                  v-if="getSeatAt(rowIndex - 1, colIndex - 1) && getSeatAt(rowIndex - 1, colIndex - 1)?.seatType !== '-1'">
                  {{ getSeatDisplayName(getSeatAt(rowIndex - 1, colIndex - 1)) }}
                </span>
              </button>
            </template>
          </template>
        </div>
      </div>

      <div
        class="seat-legend mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 text-xs md:text-sm text-pb-text">
        <div v-for="seatType in room.seatTypes" :key="seatType.type" class="flex items-center">
          <span class="w-4 h-4 md:w-5 md:h-5 rounded-sm mr-2 border border-pb-border"
            :style="{ backgroundColor: seatType.color }"></span>
          <span class="text-pb-text">{{ seatType.name }}</span>
        </div>
        <div class="flex items-center">
          <span class="w-4 h-4 md:w-5 md:h-5 rounded-sm mr-2 bg-pb-text-secondary border border-pb-border"></span>
          <span class="text-pb-text">Đã đặt</span>
        </div>
        <div class="flex items-center">
          <span class="w-4 h-4 md:w-5 md:h-5 rounded-sm mr-2 border border-pb-accent bg-[#2563eb]"></span>
          <span class="text-pb-text">Ghế bạn chọn</span>
        </div>
        <div class="flex items-center">
          <span class="w-4 h-4 md:w-5 md:h-5 rounded-sm mr-2 border border-dashed border-gray-400 "></span>
          <span class="text-pb-text">Lối đi</span>
        </div>
      </div>



    </div>
    <div v-else class="text-center py-10">
      <p class="text-pb-text-secondary">Không tìm thấy thông tin phòng hoặc ghế.</p>
    </div>
    <div v-if="selectedSeats.length > 0"
      class="selected-info-and-actions mt-auto  pt-4 border-t border-pb-border flex flex-wrap items-center justify-between gap-4">
      <div class="selected-seats-details">
        <p class="font-semibold text-lg text-pb-text">
          Ghế đã chọn:
          <span class="font-normal text-pb-text">{{ selectedSeatNames.join(', ') }}</span>
        </p>
        <p class="font-semibold text-lg text-pb-text">
          Tổng tiền:
          <span class="font-bold text-red-500 dark:text-red-400">{{ formatCurrency(totalPriceSeats) }}</span>
        </p>
      </div>

      <button type="button" @click="openComboDialog" :disabled="selectedSeats.length === 0"
        class="px-6 py-2 bg-pb-accent text-pb-background text-sm font-medium rounded-md shadow-sm hover:bg-pb-accent/90 focus:outline-none focus:ring-2 focus:ring-pb-accent focus:ring-offset-2 dark:focus:ring-offset-pb-background disabled:opacity-50 disabled:cursor-not-allowed">
        Tiếp tục chọn combo
      </button>
    </div>

    <DialogRoot v-model:open="isComboDialogOpen">
      <DialogPortal>
        <DialogOverlay
          class="fixed  z-[55] w-[100vw] h-[100vh] top-0 left-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm data-[state=open]:animate-overlayShow" />
        <DialogContent
          class="fixed left-1/2 top-1/2 z-[60] w-[90vw] max-w-md flex overflow-hidden flex-col -translate-x-1/2 -translate-y-1/2 rounded-xl bg-pb-surface text-pb-text p-0 shadow-2xl data-[state=open]:animate-contentShow focus:outline-none flex flex-col max-h-[85vh]"
          @escape-key-down="isComboDialogOpen = false" @pointer-down-outside="isComboDialogOpen = false">
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-pb-border sticky top-0 bg-pb-surface z-10">
            <DialogTitle class="text-lg font-semibold text-pb-text">
              <Icon icon="mdi:popcorn" class="inline-block mr-2 text-pb-accent" />
              Chọn Combo Bắp Nước
            </DialogTitle>
            <DialogClose as-child>
              <button type="button"
                class="p-1 rounded-full text-pb-text-secondary hover:text-pb-text focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-pb-surface focus:ring-pb-accent"
                aria-label="Đóng">
                <Icon icon="heroicons:x-mark-20-solid" class="h-6 w-6" />
              </button>
            </DialogClose>
          </div>

          <div class="flex-grow overflow-y-auto p-6 space-y-6">
            <div class="flex items-start gap-4 p-4 border border-pb-border rounded-lg shadow-sm bg-pb-background">
              <img src="~/assets/images/sweet-combo.png" alt="Sweet Combo"
                class="w-20 h-20 md:w-24 md:h-24 object-contain rounded-md flex-shrink-0 bg-pb-text p-1">
              <div class="flex-grow">
                <h5 class="text-base font-semibold text-pb-text">{{ fixedCombos[0].name }} - {{
                  formatCurrency(fixedCombos[0].price) }}</h5>
                <p class="text-xs text-pb-text-secondary mb-2">{{ fixedCombos[0].description }}</p>
                <div class="quantity-control flex items-center gap-2 mt-1">
                  <button @click="decreaseComboQuantity(fixedCombos[0].id)"
                    :disabled="getComboQuantity(fixedCombos[0].id) === 0"
                    class="p-1.5 rounded-full bg-pb-border text-pb-text-secondary hover:bg-pb-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Giảm số lượng">
                    <Icon icon="heroicons:minus-solid" class="h-5 w-5" />
                  </button>
                  <span class="w-8 text-center font-medium text-pb-text tabular-nums">{{
                    getComboQuantity(fixedCombos[0].id)
                    }}</span>
                  <button @click="increaseComboQuantity(fixedCombos[0].id)"
                    class="p-1.5 rounded-full bg-pb-accent text-pb-background hover:bg-pb-accent/90 transition-colors"
                    aria-label="Tăng số lượng">
                    <Icon icon="heroicons:plus-solid" class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div
              class="combo-item flex items-start gap-4 p-4 border border-pb-border rounded-lg shadow-sm bg-pb-background">
              <img src="~/assets/images/beta-combo.png" alt="Beta Combo"
                class="w-20 h-20 md:w-24 md:h-24 object-contain rounded-md flex-shrink-0 bg-pb-text p-1">
              <div class="flex-grow">
                <h5 class="text-base font-semibold text-pb-text">{{ fixedCombos[1].name }} - {{
                  formatCurrency(fixedCombos[1].price) }}</h5>
                <p class="text-xs text-pb-text-secondary mb-2">{{ fixedCombos[1].description }}</p>
                <div class="quantity-control flex items-center gap-2 mt-1">
                  <button @click="decreaseComboQuantity(fixedCombos[1].id)"
                    :disabled="getComboQuantity(fixedCombos[1].id) === 0"
                    class="p-1.5 rounded-full bg-pb-border text-pb-text-secondary hover:bg-pb-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Giảm số lượng">
                    <Icon icon="heroicons:minus-solid" class="h-5 w-5" />
                  </button>
                  <span class="w-8 text-center font-medium text-pb-text tabular-nums">{{
                    getComboQuantity(fixedCombos[1].id)
                    }}</span>
                  <button @click="increaseComboQuantity(fixedCombos[1].id)"
                    class="p-1.5 rounded-full bg-pb-accent text-pb-background hover:bg-pb-accent/90 transition-colors"
                    aria-label="Tăng số lượng">
                    <Icon icon="heroicons:plus-solid" class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 mt-auto border-t border-pb-border bg-pb-surface">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-pb-text-secondary">Tiền ghế:</span>
              <span class="text-sm font-semibold text-pb-text">{{ formatCurrency(totalPriceSeats) }}</span>
            </div>
            <div class="flex justify-between items-center mb-3">
              <span class="text-sm font-medium text-pb-text-secondary">Tiền combo:</span>
              <span class="text-sm font-semibold text-pb-text">{{ formatCurrency(totalPriceCombos) }}</span>
            </div>
            <div class="flex justify-between items-center mb-4">
              <span class="text-lg font-bold text-pb-text">Tổng cộng:</span>
              <span class="text-lg font-bold text-red-500 dark:text-red-400">{{ formatCurrency(finalTotalPrice)
                }}</span>
            </div>
            <button type="button" @click="proceedToPayment"
              class="w-full px-6 py-3 bg-pb-accent text-pb-background text-base font-semibold rounded-lg shadow-md hover:bg-pb-accent/90 focus:outline-none focus:ring-2 focus:ring-pb-accent focus:ring-offset-2 dark:focus:ring-offset-pb-surface">
              Tiếp tục thanh toán </button>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
    <PaymentMethodModal v-model:open="isPaymentModalOpen"
      :summary="{ totalPriceSeats, totalPriceCombos, finalTotalPrice }" @confirm="handleFinalCheckout" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Icon } from '@iconify/vue';
import type { Room, SeatType } from '~/types/room.type';
import type { Seat } from '~/types/seat.type';
import PaymentMethodModal from './payment-method-modal.vue';
import type { BookingPayload } from '~/types/booking.type';

const SWEETBOX_SEAT_TYPE_ID = '14';

interface Props {
  roomId: string;
  showTimeId: string;
  movieName: string;
  showTimeDetails: string;
  cinemaName: string;
  roomName: string;
}
interface Combo {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}


const props = defineProps<Props>();

const { data: room, pending: pendingRoom, error: roomError, refresh: refreshRoom } = await useFetch<Room>(`http://localhost:5000/rooms/${props.roomId}`);
const { data: seats, pending: pendingSeats, error: seatsError, refresh: refreshSeats } = await useFetch<Seat[]>(() => `http://localhost:5000/seats?roomId=${props.roomId}&showTimeId=${props.showTimeId}`);

const selectedSeats = ref<Seat[]>([]);
const isComboDialogOpen = ref(false);
const selectedCombos = ref<Map<string, number>>(new Map()); // Map<comboId, quantity>
const isPaymentModalOpen = ref(false);
const selectedPaymentMethod = ref<'online' | 'offline' | null>(null);
const bookingNote = ref('');

const fixedCombos = ref<Combo[]>([
  {
    id: 'sweet_combo_69',
    name: 'Sweet Combo 69oz',
    price: 88000,
    description: 'TIẾT KIỆM 46K!!! Gồm: 1 Bắp (69oz) + 2 Nước có gaz (22oz)',
    image: '/images/sweet-combo.png'
  },
  {
    id: 'beta_combo_69',
    name: 'Beta Combo 69oz',
    price: 68000,
    description: 'TIẾT KIỆM 28K!!! Gồm: 1 Bắp (69oz) + 1 Nước có gaz (22oz)',
    image: '/images/beta-combo.png'
  }
]);

function proceedToPayment() {
  if (selectedSeats.value.length === 0) {
    alert("Vui lòng chọn ghế trước khi tiếp tục.");
    return;
  }
  isComboDialogOpen.value = false;
  isPaymentModalOpen.value = true;
}

watch(() => [props.roomId, props.showTimeId], () => {
  refreshRoom();
  refreshSeats();
  selectedSeats.value = [];
  selectedCombos.value.clear();
});

const retryFetch = () => {
  if (roomError.value) refreshRoom();
  if (seatsError.value) refreshSeats();
}




const sweetboxPairs = computed(() => {
  if (!seats.value) return [];
  const pairs: Seat[][] = [];
  const allSweetboxSeats = seats.value.filter(seat => seat.seatType === SWEETBOX_SEAT_TYPE_ID);
  const sortedSweetboxSeats = allSweetboxSeats.sort((a, b) => a.colIndex - b.colIndex);
  for (let i = 0; i < sortedSweetboxSeats.length; i++) {
    const seat = sortedSweetboxSeats[i];
    if (seat.seatType === SWEETBOX_SEAT_TYPE_ID) {
      const pair = sortedSweetboxSeats.find(s => s.rowIndex === seat.rowIndex && s.colIndex === seat.colIndex + 1);
      if (pair) {
        pairs.push([seat, pair]);
        i++;
      }
    }
  }
  return pairs;
});

const gridStyle = computed(() => {
  if (!room.value) return {};
  return {
    gridTemplateRows: `repeat(${room.value.totalRow}, minmax(0, 1fr))`,
    gridTemplateColumns: `repeat(${room.value.totalCol}, minmax(0, 1fr))`,
  };
});

function getSeatAt(rowIndex: number, colIndex: number): Seat | undefined {
  if (!seats.value || rowIndex < 0 || colIndex < 0 || rowIndex >= (room.value?.totalRow || 0) || colIndex >= (room.value?.totalCol || 0)) {
    return undefined;
  }
  return seats.value.find(seat => seat.rowIndex === rowIndex && seat.colIndex === colIndex);
}

function getSeatTypeInfo(seatData?: Seat): SeatType | undefined {
  if (!seatData || !room.value?.seatTypes) return undefined;
  return room.value.seatTypes.find(st => st.type.toString() === seatData.seatType.toString());
}

function getSeatDisplayName(seatData?: Seat): string {
  if (!seatData || seatData.seatType === '-1') return '';
  if (!room.value) return '';
  const totalColsInRoom = room.value.totalCol;
  let colDisplayNumber = seatData.colIndex + 1;
  const reversedRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'
  ];
  if (reversedRows.includes(seatData.nameRow)) {
    colDisplayNumber = totalColsInRoom - seatData.colIndex;
  }
  return `${seatData.nameRow}${colDisplayNumber}`;
}

function getSeatStyle(seatData?: Seat) {
  const typeInfo = getSeatTypeInfo(seatData);

  if (!seatData || seatData.seatType === '-1') {
    return {  };
  }

  const isSelected = selectedSeats.value.some(s => s.id === seatData.id && s.rowIndex === seatData.rowIndex && s.colIndex === seatData.colIndex);

  if (isSelected) {
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-500').trim() || '#3b82f6';
    const primaryBorderColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-600').trim() || '#2563eb';
    return { backgroundColor: primaryColor, color: 'white', borderColor: primaryBorderColor };
  }

  if (seatData.status === '1') {
    return { backgroundColor: '#9ca3af', color: '#e5e7eb', cursor: 'not-allowed', borderColor: '#6b7280' };
  }

  if (typeInfo) {
    return { backgroundColor: typeInfo.color, color: 'white', borderColor: darkenColor(typeInfo.color, 20) };
  }

  return { backgroundColor: '#e5e7eb', borderColor: '#d1d5db' };
}



function getSeatClasses(seatData?: Seat): object {
  const isSelected = !!selectedSeats.value.find(s => s.id === seatData?.id && s.rowIndex === seatData.rowIndex && s.colIndex === seatData.colIndex);
  const isDisabled = isSeatDisabled(seatData);

  const isSweetbox = seatData?.seatType === SWEETBOX_SEAT_TYPE_ID;
  const isSweetboxLeft = isSweetbox && sweetboxPairs.value.some(pair => pair[0].id === seatData?.id);

  return {
    'cursor-not-allowed opacity-60': isDisabled && seatData?.seatType !== '-1',
    'hover:opacity-80 focus:ring-blue-500 dark:focus:ring-blue-400': !isDisabled && !isSelected,
    'ring-2 ring-offset-1 dark:ring-offset-gray-800 shadow-lg': isSelected,
    'sweetbox-left': isSweetboxLeft,
    'sweet-box': isSweetbox,
    'text-white': seatData && seatData.seatType !== '-1' && seatData.status !== '1',
    'text-gray-300 dark:text-gray-500': seatData && seatData.status === '1',
    'border-dashed !bg-transparent border !border-gray-400 dark:!border-gray-600 !cursor-default !text-transparent': seatData && seatData.seatType === '-1',
  };
}

function isSeatDisabled(seatData?: Seat): boolean {
  if (!seatData || seatData.seatType === '-1' || seatData.status === '1') {
    return true;
  }
  return false;
}

function findSweetboxPair(seatData: Seat): Seat | undefined {
  if (seatData.seatType !== SWEETBOX_SEAT_TYPE_ID) return undefined;


  const pairSeat = sweetboxPairs.value.find(pair => {
    return (pair[0].rowIndex === seatData.rowIndex && pair[0].colIndex === seatData.colIndex) ||
      (pair[1].rowIndex === seatData.rowIndex && pair[1].colIndex === seatData.colIndex);
  });
  return pairSeat ? (pairSeat[0].id === seatData.id ? pairSeat[1] : pairSeat[0]) : undefined;

}

function isSeatSelected(seatData: Seat): boolean {
  return selectedSeats.value.some(s => s.id === seatData.id && s.rowIndex === seatData.rowIndex && s.colIndex === seatData.colIndex);
}

function toggleSeatSelection(seatData?: Seat) {
  if (!seatData || isSeatDisabled(seatData)) return;

  const isSweetbox = seatData.seatType === SWEETBOX_SEAT_TYPE_ID;
  let seatsToToggle: Seat[] = [seatData];
  let pairSeat: Seat | undefined = undefined;

  if (isSweetbox) {
    pairSeat = findSweetboxPair(seatData);
    if (pairSeat && !isSeatDisabled(pairSeat)) {
      seatsToToggle.push(pairSeat);
    } else if (pairSeat && isSeatDisabled(pairSeat)) {
      console.warn("Ghế đôi không khả dụng hoàn toàn.");
      return;
    }
  }

  const allCurrentlySelected = seatsToToggle.every(s => isSeatSelected(s));

  if (allCurrentlySelected) {
    seatsToToggle.forEach(s_to_remove => {
      const index = selectedSeats.value.findIndex(s => s.id === s_to_remove.id && s.rowIndex === s_to_remove.rowIndex && s.colIndex === s_to_remove.colIndex);
      if (index > -1) {
        selectedSeats.value.splice(index, 1);
      }
    });
  } else {
    const canSelectAll = seatsToToggle.every(s => !isSeatDisabled(s));
    if (canSelectAll) {
      seatsToToggle.forEach(s_to_add => {
        if (!isSeatSelected(s_to_add)) {
          selectedSeats.value.push(s_to_add);
        }
      });
    } else {
      console.warn("Một phần của ghế đôi không thể chọn.");

    }
  }
}


const selectedSeatNames = computed(() => {
  return selectedSeats.value.map(seat => getSeatDisplayName(seat)).sort((a, b) => {
    const rowA = a.charAt(0);
    const numA = parseInt(a.substring(1));
    const rowB = b.charAt(0);
    const numB = parseInt(b.substring(1));

    if (rowA < rowB) return -1;
    if (rowA > rowB) return 1;
    return numA - numB;
  });
});

const totalPriceSeats = computed(() => {
  return selectedSeats.value.reduce((total, seat) => total + (seat.price || 0), 0);
});

const totalPriceCombos = computed(() => {
  let total = 0;
  selectedCombos.value.forEach((quantity, comboId) => {
    const comboInfo = fixedCombos.value.find(c => c.id === comboId);
    if (comboInfo) {
      total += comboInfo.price * quantity;
    }
  });
  return total;
});

const finalTotalPrice = computed(() => {
  return totalPriceSeats.value + totalPriceCombos.value;
});
function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

const openComboDialog = () => {
  if (selectedSeats.value.length === 0) {
    return;
  }
  isComboDialogOpen.value = true;
};

function getComboQuantity(comboId: string): number {
  return selectedCombos.value.get(comboId) || 0;
}

function increaseComboQuantity(comboId: string) {
  const currentQuantity = selectedCombos.value.get(comboId) || 0;
  selectedCombos.value.set(comboId, currentQuantity + 1);
}

function decreaseComboQuantity(comboId: string) {
  const currentQuantity = selectedCombos.value.get(comboId) || 0;
  if (currentQuantity > 0) {
    selectedCombos.value.set(comboId, currentQuantity - 1);
    if (currentQuantity - 1 === 0) {
      selectedCombos.value.delete(comboId);
    }
  }
}

const emit = defineEmits(['checkout']);

function handleFinalCheckout(paymentMethod: 'online' | 'offline', note: string) {
  selectedPaymentMethod.value = paymentMethod;
  bookingNote.value = note;

  isPaymentModalOpen.value = false;

  const finalOrderDetails: BookingPayload = {
    seats: selectedSeats.value.map(s => ({
      seatId: s.id,
      name: getSeatDisplayName(s),
      price: s.price,
      rowIndex: s.rowIndex,
      colIndex: s.colIndex,
      seatType: s.seatType,
    })),
    combos: Array.from(selectedCombos.value.entries())
      .filter(([_, quantity]) => quantity > 0)
      .map(([comboId, quantity]) => {
        const comboInfo = fixedCombos.value.find(c => c.id === comboId);
        return {
          id: comboId,
          name: comboInfo?.name,
          pricePerUnit: comboInfo?.price,
          quantity: quantity,
          totalPrice: (comboInfo?.price || 0) * quantity,
        };
      }),
    totalPriceSeats: totalPriceSeats.value,
    totalPriceCombos: totalPriceCombos.value,
    finalTotalPrice: finalTotalPrice.value,
    showTimeId: props.showTimeId,
    roomId: props.roomId,
    movieName: props.movieName,
    cinemaName: props.cinemaName,
    roomName: props.roomName,
    showTimeDetails: props.showTimeDetails,
    paymentMethod: selectedPaymentMethod.value,
    note: bookingNote.value,

  };

  console.log('Final Booking Details:', finalOrderDetails);

  emit('checkout', finalOrderDetails);


}


function darkenColor(hex: string, percent: number): string {
  hex = hex.replace(/^\s*#|\s*$/g, '');
  if (hex.length === 3) {
    hex = hex.replace(/(.)/g, '$1$1');
  }
  let r = parseInt(hex.substring(0, 2), 16),
    g = parseInt(hex.substring(2, 4), 16),
    b = parseInt(hex.substring(4, 6), 16);

  r = Math.floor(r * (100 - percent) / 100);
  g = Math.floor(g * (100 - percent) / 100);
  b = Math.floor(b * (100 - percent) / 100);

  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  return `#${(r).toString(16).padStart(2, '0')}${(g).toString(16).padStart(2, '0')}${(b).toString(16).padStart(2, '0')}`;
}
</script>

<style scoped>
.cinema-seat-layout {}

.screen-indicator {
  background-color: #4a5568;
  color: white;
  padding: 8px 0;
  width: 70%;
  max-width: 400px;
  text-align: center;
  margin: 0 auto 20px auto;
  border-radius: 2px;
  font-size: 0.875rem;
  letter-spacing: 0.1em;
  border: 1px solid #2d3748;
}

.dark .screen-indicator {
  background-color: #2d3748;
  border-color: #1a202c;
}


.seat-grid-container {
  display: flex;
  justify-content: center;
}

.seat-item {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  overflow: visible;
}

.sweet-box {
  border-radius: 0;
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
  box-shadow: none !important;
}

.sweetbox-left {
  border-radius: 0;
  border-top-left-radius: 0.375rem !important;
  border-bottom-left-radius: 0.375rem !important;
}


.seat-item.sweetbox-left::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 0;
  bottom: 0;
  width: 8px;
  background-color: inherit;
}

.seat-item.sweetbox-left.selected::after {
  background-color: var(--color-primary-500, #3b82f6);
}

.seat-item.sweetbox-left.sweetbox-left.disabled::after,
.seat-item.sweetbox-left.occupied::after {
  background-color: #9ca3af;
}


.seat-item:focus-visible {}

.dark .seat-item:focus-visible {}


.selected-seats-info p {
  margin-bottom: 0.25rem;
}
</style>
