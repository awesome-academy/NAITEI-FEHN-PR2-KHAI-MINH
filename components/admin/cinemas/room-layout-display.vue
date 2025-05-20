<template>
  <div class="p-6 bg-pb-background text-pb-text flex flex-col">
    <div v-if="pendingRoom || pendingSeats" class="text-center py-10">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pb-accent"
      ></div>
      <p class="mt-4 text-sm text-pb-text-secondary">Đang tải sơ đồ ghế...</p>
    </div>
    <div
      v-else-if="roomError || seatsError"
      class="text-center py-10 text-red-600 dark:text-red-400"
    >
      <p class="font-medium">Lỗi khi tải dữ liệu ghế:</p>
      <p class="text-sm">{{ roomError?.message || seatsError?.message }}</p>
      <button
        type="button"
        @click="retryFetch"
        class="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-sm font-medium rounded-md hover:bg-red-200 dark:hover:bg-red-800/70 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-pb-background"
      >
        Thử lại
      </button>
    </div>
    <div
      v-else-if="room && seats"
      class="cinema-seat-layout flex-grow max-h-[60vh] overflow-y-scroll"
    >
      <div class="mb-6 text-center">
        <h4 class="text-lg font-medium text-pb-text">{{ room.name }}</h4>
      </div>

      <div
        class="screen-indicator bg-pb-border text-pb-text-secondary font-semibold py-1 px-4 rounded text-center mb-4"
      >
        MÀN HÌNH
      </div>

      <div class="seat-grid-container my-4 overflow-x-auto">
        <div class="seat-grid inline-grid gap-1 md:gap-1.5" :style="gridStyle">
          <template
            v-for="rowIndex in room.totalRow"
            :key="`row-${rowIndex - 1}`"
          >
            <template
              v-for="colIndex in room.totalCol"
              :key="`col-${colIndex - 1}`"
            >
              <div
                :style="getSeatStyle(getSeatAt(rowIndex - 1, colIndex - 1))"
                :class="getSeatClasses(getSeatAt(rowIndex - 1, colIndex - 1))"
                class="seat-item w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-xs md:text-sm font-medium rounded flex items-center justify-center transition-all duration-150"
              >
                <span
                  v-if="
                    getSeatAt(rowIndex - 1, colIndex - 1) &&
                    getSeatAt(rowIndex - 1, colIndex - 1)?.seatType !== '-1' &&
                    getSeatAt(rowIndex - 1, colIndex - 1)?.momoId
                  "
                >
                  {{
                    getSeatDisplayName(getSeatAt(rowIndex - 1, colIndex - 1))
                  }}
                </span>
              </div>
            </template>
          </template>
        </div>
      </div>

      <div
        class="seat-legend mt-6 flex flex-row justify-between flex-wrap gap-y-2 text-xs md:text-sm text-pb-text px-12 py-4"
      >
        <div
          v-for="seatType in room.seatTypes"
          :key="seatType.type"
          class="flex items-center"
        >
          <span
            class="w-4 h-4 md:w-5 md:h-5 rounded-sm mr-2 border border-pb-border"
            :style="{ backgroundColor: seatType.color }"
          ></span>
          <span class="text-pb-text">{{ seatType.name }}</span>
        </div>
        <div class="flex items-center">
          <span
            class="w-4 h-4 md:w-5 md:h-5 rounded-sm mr-2 border border-dashed border-gray-400"
          ></span>
          <span class="text-pb-text">Lối đi</span>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-10">
      <p class="text-pb-text-secondary">
        Không tìm thấy thông tin phòng hoặc ghế.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import type { Room, SeatType } from "~/types/room.type";
import type { Seat } from "~/types/seat.type";

const SWEETBOX_SEAT_TYPE_ID = "14";

interface Props {
  roomId: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["checkout"]);

const {
  data: room,
  pending: pendingRoom,
  error: roomError,
  refresh: refreshRoom,
} = await useFetch<Room>(`http://localhost:5000/rooms/${props.roomId}`);
const {
  data: seats,
  pending: pendingSeats,
  error: seatsError,
  refresh: refreshSeats,
} = await useFetch<Seat[]>(
  () => `http://localhost:5000/seats?roomId=${props.roomId}`
);

watch(
  () => [props.roomId],
  () => {
    refreshRoom();
    refreshSeats();
  }
);

const retryFetch = () => {
  if (roomError.value) refreshRoom();
  if (seatsError.value) refreshSeats();
};

const sweetboxPairs = computed(() => {
  if (!seats.value) return [];
  const pairs: Seat[][] = [];
  const allSweetboxSeats = seats.value.filter(
    (seat) => seat.seatType === SWEETBOX_SEAT_TYPE_ID && seat.id !== null
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
  if (
    !seats.value ||
    rowIndex < 0 ||
    colIndex < 0 ||
    rowIndex >= (room.value?.totalRow || 0) ||
    colIndex >= (room.value?.totalCol || 0)
  ) {
    return undefined;
  }
  return seats.value.find(
    (seat) => seat.rowIndex === rowIndex && seat.colIndex === colIndex
  );
}

function getSeatTypeInfo(seatData?: Seat): SeatType | undefined {
  if (!seatData || !room.value?.seatTypes) return undefined;
  return room.value.seatTypes.find(
    (st) => st.type.toString() === seatData.seatType.toString()
  );
}

function getSeatDisplayName(seatData?: Seat): string {
  if (seatData && seatData.seatType !== "-1" && seatData.momoId) {
    return `${seatData.nameRow}${seatData.momoId}`;
  }
  return "";
}

function getSeatStyle(seatData?: Seat) {
  const typeInfo = getSeatTypeInfo(seatData);

  if (!seatData || seatData.seatType === "-1") {
    return {};
  }

  if (typeInfo) {
    return {
      backgroundColor: typeInfo.color,
      color: "white",
      borderColor: darkenColor(typeInfo.color, 20),
    };
  }
  return { backgroundColor: "#e5e7eb", borderColor: "#d1d5db" };
}

function getSeatClasses(seatData?: Seat): object {
  const isSweetbox = seatData?.seatType === SWEETBOX_SEAT_TYPE_ID;
  let isSweetboxLeft = false;
  let isSweetboxRight = false;

  if (isSweetbox && seatData?.id) {
    for (const pair of sweetboxPairs.value) {
      if (pair[0].id === seatData.id) {
        isSweetboxLeft = true;
        break;
      }
      if (pair[1].id === seatData.id) {
        isSweetboxRight = true;
        break;
      }
    }
  }

  return {
    "opacity-60": seatData?.status === "1" && seatData?.seatType !== "-1",
    "cursor-default": true,
    "sweetbox-left": isSweetboxLeft,
    "sweetbox-right": isSweetboxRight,
    "sweet-box": isSweetbox && (isSweetboxLeft || isSweetboxRight),
    "text-white":
      seatData && seatData.seatType !== "-1" && seatData.seatType !== "-1",
    "border-dashed !bg-transparent border !border-gray-400 dark:!border-gray-600 !text-transparent select-none":
      seatData && seatData.seatType === "-1",
    "!cursor-not-allowed":
      seatData?.status === "1" && seatData?.seatType !== "-1",
  };
}

function darkenColor(hex: string, percent: number): string {
  if (!hex) return "#000000";
  hex = hex.replace(/^\s*#|\s*$/g, "");
  if (hex.length === 3) {
    hex = hex.replace(/(.)/g, "$1$1");
  }
  let r = parseInt(hex.substring(0, 2), 16),
    g = parseInt(hex.substring(2, 4), 16),
    b = parseInt(hex.substring(4, 6), 16);

  r = Math.floor((r * (100 - percent)) / 100);
  g = Math.floor((g * (100 - percent)) / 100);
  b = Math.floor((b * (100 - percent)) / 100);

  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
</script>

<style scoped>
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
  content: "";
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
.selected-seats-info p {
  margin-bottom: 0.25rem;
}
</style>
