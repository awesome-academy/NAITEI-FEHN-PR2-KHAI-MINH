<template>
  <div class="p-6 bg-pb-background text-pb-text flex flex-col">
    <!-- Loading and Error States -->
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

    <!-- Seat Layout Display -->
    <div v-else-if="room && seats" class="cinema-seat-layout flex-grow max-h-[calc(100vh-12rem)] overflow-y-auto"
      style="scrollbar-width: thin;">
      <div class="mb-6 text-center">
        <h4 class="text-lg font-medium text-pb-text">{{ room.name }}</h4>
      </div>
      <div
        class="screen-indicator bg-pb-border text-pb-text-secondary font-semibold py-1 px-4 rounded text-center mb-4">
        MÀN HÌNH
      </div>
      <div class="seat-grid-container my-4 overflow-x-auto pb-4">
        <div class="seat-grid inline-grid gap-1 md:gap-1.5" :style="gridStyle">
          <template v-for="rowIndex in room.totalRow" :key="`row-${rowIndex - 1}`">
            <template v-for="colIndex in room.totalCol" :key="`col-${colIndex - 1}`">
              <button type="button" :style="getSeatStyle(getSeatAt(rowIndex - 1, colIndex - 1))"
                :class="getSeatClasses(getSeatAt(rowIndex - 1, colIndex - 1))"
                class="seat-item w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-xs md:text-sm font-medium rounded flex items-center justify-center transition-all duration-150"
                @click="handleSeatClick(getSeatAt(rowIndex - 1, colIndex - 1))"
                :disabled="!getSeatAt(rowIndex - 1, colIndex - 1) || getSeatAt(rowIndex - 1, colIndex - 1)?.status === '1' || isUpdatingSeat">
                <span
                  v-if="getSeatAt(rowIndex - 1, colIndex - 1) && !isAisleType(getSeatAt(rowIndex - 1, colIndex - 1)) && getSeatAt(rowIndex - 1, colIndex - 1)?.momoId">
                  {{ getSeatDisplayName(getSeatAt(rowIndex - 1, colIndex - 1)) }}
                </span>
                <!-- Optional: Add a plus icon for clickable aisles -->
                <svg
                  v-else-if="getSeatAt(rowIndex - 1, colIndex - 1)?.seatType === '0' && getSeatAt(rowIndex - 1, colIndex - 1)?.status !== '1'"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-pb-accent" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </template>
          </template>
        </div>
      </div>

      <div
        class="seat-legend mt-6 flex flex-row justify-center flex-wrap gap-x-6 gap-y-3 text-xs md:text-sm text-pb-text px-4 py-3 border-t border-pb-border sticky bottom-0 bg-pb-background z-10">
        <div v-for="seatType in room.seatTypes.filter(st => st.type !== '0' && st.type !== '-1')" :key="seatType.type"
          class="flex items-center">
          <span class="w-4 h-4 md:w-5 md:h-5 rounded-sm mr-1.5 border border-pb-border-strong"
            :style="{ backgroundColor: seatType.color }"></span>
          <span class="text-pb-text">{{ seatType.name }}</span>
        </div>
        <div class="flex items-center">
          <span
            class="w-4 h-4 md:w-5 md:h-5 rounded-sm mr-1.5 border border-dashed border-gray-400 dark:border-gray-600"></span>
          <span class="text-pb-text">Lối đi / Trống</span>
        </div>
        <div class="flex items-center">
          <span
            class="w-4 h-4 md:w-5 md:h-5 rounded-sm mr-1.5 bg-gray-400 dark:bg-gray-600 opacity-60 border border-gray-500 dark:border-gray-700"></span>
          <span class="text-pb-text">Ghế đã đặt</span>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-10">
      <p class="text-pb-text-secondary">Không tìm thấy thông tin phòng hoặc ghế.</p>
    </div>

    <selectSeatTypeModal :open="isSelectSeatTypeModalOpen" :availableSeatTypes="room?.seatTypes || []"
      @update:open="isSelectSeatTypeModalOpen = $event" @select-type="handleSeatTypeSelected" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from "vue";
import type { Room, SeatType } from "~/types/room.type";
import type { Seat } from "~/types/seat.type";
import selectSeatTypeModal from "./select-seat-type-modal.vue";

const SWEETBOX_SEAT_TYPE_ID = "14";

interface Props {
  roomId: string;
}
const props = defineProps<Props>();

const { data: room, pending: pendingRoom, error: roomError, refresh: refreshRoom } =
  await useFetch<Room>(`http://localhost:5000/rooms/${props.roomId}`);
const { data: seats, pending: pendingSeats, error: seatsError, refresh: refreshSeats } =
  await useFetch<Seat[]>(() => `http://localhost:5000/seats?roomId=${props.roomId}`);

const isUpdatingSeat = ref(false);
const isSelectSeatTypeModalOpen = ref(false);
const targetSeatForTypeChange = ref<Seat | null>(null);

watch(() => props.roomId, () => {
  refreshRoom();
  refreshSeats();
});

const retryFetch = () => {
  if (roomError.value) refreshRoom();
  if (seatsError.value) refreshSeats();
};

async function handleSeatClick(seat?: Seat) {
  if (!seat || seat.status === '1' || isUpdatingSeat.value) return;

  if (seat.seatType === "0") {
    targetSeatForTypeChange.value = seat;
    isSelectSeatTypeModalOpen.value = true;
  } else {
    isUpdatingSeat.value = true;
    try {
      const response = await fetch(`http://localhost:5000/seats/${seat.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatType: "0", nameRow: null, momoId: null, price: 0 }), // Reset relevant fields for aisle
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to update seat to aisle: ${response.status} - ${errorData}`);
      }
      await refreshSeats();
    } catch (error) {
      console.error("Error updating seat to aisle:", error);
      alert(`Lỗi khi cập nhật ghế thành lối đi: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      isUpdatingSeat.value = false;
    }
  }
}

async function handleSeatTypeSelected(newSeatTypeCode: string) {
  if (!targetSeatForTypeChange.value || !room.value?.seatTypes || isUpdatingSeat.value) return;

  const seatToUpdate = targetSeatForTypeChange.value;
  console.log(room.value.seatTypes, newSeatTypeCode);
  const selectedSeatTypeInfo = room.value.seatTypes.find(st => st.type === newSeatTypeCode);

  if (!selectedSeatTypeInfo) {
    alert("Không tìm thấy thông tin loại ghế đã chọn.");
    isSelectSeatTypeModalOpen.value = false;
    return;
  }

  isUpdatingSeat.value = true;
  isSelectSeatTypeModalOpen.value = false;

  try {
    const payload: Partial<Seat> = {
      seatType: newSeatTypeCode,
      price: 0,
      nameRow: String.fromCharCode(65 + seatToUpdate.rowIndex),
      momoId: (seatToUpdate.colIndex).toString(),
      status: "0",
    };

    const response = await fetch(`http://localhost:5000/seats/${seatToUpdate.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to update seat type: ${response.status} - ${errorData}`);
    }
    await refreshSeats();
  } catch (error) {
    console.error("Error updating seat type:", error);
    alert(`Lỗi khi cập nhật loại ghế: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    isUpdatingSeat.value = false;
    targetSeatForTypeChange.value = null;
  }
}


const sweetboxPairs = computed(() => {
  // ... (existing sweetboxPairs logic - no changes needed here)
  if (!seats.value) return [];
  const pairs: Seat[][] = [];
  const allSweetboxSeats = seats.value.filter(
    (seat) => seat.seatType === SWEETBOX_SEAT_TYPE_ID && seat.id !== null && seat.status !== '1' // Consider status
  );
  const sortedSweetboxSeats = [...allSweetboxSeats].sort((a, b) => {
    if (a.rowIndex === b.rowIndex) {
      return a.colIndex - b.colIndex;
    }
    return a.rowIndex - b.rowIndex;
  });

  const processedSeats = new Set<string>();

  for (const seat of sortedSweetboxSeats) {
    if (processedSeats.has(seat.id!)) continue;
    const pair = sortedSweetboxSeats.find(
      (s) =>
        s.rowIndex === seat.rowIndex &&
        s.colIndex === seat.colIndex + 1 &&
        !processedSeats.has(s.id!)
    );

    if (pair) {
      pairs.push([seat, pair]);
      processedSeats.add(seat.id!);
      processedSeats.add(pair.id!);
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
  return seats.value.find((seat) => seat.rowIndex === rowIndex && seat.colIndex === colIndex);
}

function getSeatTypeInfo(seatData?: Seat): SeatType | undefined {
  if (!seatData || !room.value?.seatTypes || isAisleType(seatData)) return undefined;
  return room.value.seatTypes.find((st) => st.type.toString() === seatData.seatType.toString());
}

function isAisleType(seatData?: Seat): boolean {
  return seatData?.seatType === "0" || seatData?.seatType === "-1";
}

function getSeatDisplayName(seatData?: Seat): string {
  if (seatData && !isAisleType(seatData) && seatData.momoId) {
    return `${seatData.nameRow}${seatData.momoId}`;
  }
  return "";
}

function getSeatStyle(seatData?: Seat) {
  if (!seatData || isAisleType(seatData)) {
    return { borderColor: 'transparent' };
  }
  const typeInfo = getSeatTypeInfo(seatData);
  if (typeInfo) {
    return {
      backgroundColor: typeInfo.color,
      color: "white",
      borderColor: darkenColor(typeInfo.color, 20),
    };
  }
  return { backgroundColor: "#e5e7eb", borderColor: "#d1d5db", color: "#1f2937" }; // Fallback
}

function getSeatClasses(seatData?: Seat): object {
  const isSeatAisle = isAisleType(seatData);
  const isOccupied = seatData?.status === "1";
  const isClickable = seatData && !isOccupied && !isUpdatingSeat.value;

  let sweetboxRelatedClasses: Record<string, boolean> = {};
  if (seatData?.seatType === SWEETBOX_SEAT_TYPE_ID && !isSeatAisle && !isOccupied) {
    let isSweetboxLeft = false;
    let isSweetboxRight = false;
    for (const pair of sweetboxPairs.value) {
      if (pair[0].id === seatData.id) isSweetboxLeft = true;
      if (pair[1].id === seatData.id) isSweetboxRight = true;
      if (isSweetboxLeft || isSweetboxRight) break;
    }
    if (isSweetboxLeft || isSweetboxRight) {
      sweetboxRelatedClasses['sweet-box'] = true;
      if (isSweetboxLeft) sweetboxRelatedClasses['sweetbox-left'] = true;
      if (isSweetboxRight) sweetboxRelatedClasses['sweetbox-right'] = true;
    }
  }

  return {
    'group': true,
    "cursor-pointer hover:ring-2 hover:ring-pb-accent focus:ring-2 focus:ring-pb-accent": isClickable,
    "cursor-not-allowed": !isClickable || isUpdatingSeat.value,

    "opacity-50": isOccupied,

    "border-dashed !bg-transparent !border-gray-400 dark:!border-gray-500": isSeatAisle && !isOccupied,
    "border-dashed !bg-transparent !border-gray-500 dark:!border-gray-600 opacity-50": isSeatAisle && isOccupied, // Aisle but occupied (rare)

    "text-white": !isSeatAisle && !isOccupied,
    "text-gray-300": !isSeatAisle && isOccupied,

    ...sweetboxRelatedClasses,
  };
}

function darkenColor(hex: string, percent: number): string {
  if (!hex) return "#000000";
  hex = hex.replace(/^\s*#|\s*$/g, "");
  if (hex.length === 3) hex = hex.replace(/(.)/g, "$1$1");
  let r = parseInt(hex.substring(0, 2), 16),
    g = parseInt(hex.substring(2, 4), 16),
    b = parseInt(hex.substring(4, 6), 16);
  r = Math.max(0, Math.min(255, Math.floor((r * (100 - percent)) / 100)));
  g = Math.max(0, Math.min(255, Math.floor((g * (100 - percent)) / 100)));
  b = Math.max(0, Math.min(255, Math.floor((b * (100 - percent)) / 100)));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
</script>

<style scoped>
.screen-indicator {
  background-color: #4a5568;
  /* Tailwind gray-600 */
  color: white;
  padding: 6px 0;
  width: 60%;
  max-width: 350px;
  text-align: center;
  margin: 0 auto 16px auto;
  border-radius: 3px;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  border: 1px solid #2d3748;
  /* Tailwind gray-700 */
}

.dark .screen-indicator {
  background-color: #374151;
  /* Tailwind gray-700 */
  border-color: #1f2937;
  /* Tailwind gray-800 */
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
}

.seat-item.sweet-box:not(.border-dashed) {
  border-radius: 0;
  border-top-right-radius: 0.375rem;
  /* rounded-md */
  border-bottom-right-radius: 0.375rem;
  box-shadow: none !important;
}

.seat-item.sweetbox-left:not(.border-dashed) {
  border-radius: 0;
  border-top-left-radius: 0.375rem !important;
  border-bottom-left-radius: 0.375rem !important;
}

.seat-item.sweetbox-left:not(.border-dashed)::after {
  content: "";
  position: absolute;
  right: -5px;
  /* Adjust based on gap and seat size */
  top: 0;
  bottom: 0;
  width: 6px;
  /* Adjust */
  background-color: inherit;
  z-index: -1;
}

.seat-legend {
  font-size: 0.8rem;
  /* Slightly smaller legend text */
}
</style>
