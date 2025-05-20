<template>
  <UCard>
    <div class="w-full flex flex-col md:flex-row gap-4 py-4 px-4">
      <div class="md:w-1/4 lg:w-1/6 flex-shrink-0">
        <div class="relative w-full h-52 md:h-full">
          <img :src="showtime.movie.poster" :alt="showtime.movie.name" class="w-full h-full object-cover rounded-md" />
          <span v-if="showtime.movie.ageRating"
            class="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded">
            {{ showtime.movie.ageRating }}
          </span>
        </div>
      </div>

      <div class="flex-grow flex flex-col justify-between">
        <div>
          <h3 class="text-xl font-semibold mb-1 text-gray-800 dark:text-white">
            {{ showtime.movie.name }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span v-for="(genre, index) in showtime.movie.genres" :key="genre">
              {{ genre }}
              <span v-if="index < showtime.movie.genres.length - 1" class="mx-1">•</span>
            </span>
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
            {{ showtime.movie.ApiFilmType }} Phụ đề
            <span v-if="showtime.movie.duration" class="ml-2">
              - {{ showtime.movie.duration }} phút
            </span>
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <UButton v-for="showTimeSlot in showtime.showTimesSelect" :key="showTimeSlot.id"
            :label="formatShowTime(showTimeSlot.showTimeDuration)"
            class="border border-green-500 px-2 py-1 rounded-md text-green-500 text-base cursor-pointer hover:bg-green-500 hover:bg-opacity-10"
            color="primary" @click="openRekaDialog(showTimeSlot)">
            {{ formatShowTime(showTimeSlot.showTimeDuration) }}
          </UButton>
        </div>
      </div>
    </div>

    <DialogRoot v-model:open="isRekaDialogOpen">
      <DialogPortal>
        <DialogOverlay
          class="fixed inset-0 data-[state=open]:animate-overlayShow bg-black/50 dark:bg-black/70 z-40 backdrop-blur-sm" />
        <DialogContent
          class="data-[state=open]:animate-contentShow  fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] sm:w-[90vw] max-w-3xl md:max-w-4xl lg:max-w-5xl max-h-[90vh]  bg-white dark:bg-gray-900 rounded-lg shadow-xl focus:outline-none flex flex-col"
          @escape-key-down="isRekaDialogOpen = false" @pointer-down-outside="isRekaDialogOpen = false">
          <div class="flex flex-col flex-grow h-full bg-pb-surface dark:bg-gray-800 rounded-lg">
            <div class="flex items-center justify-between p-4 border-b border-pb-accent">
              <DialogTitle class="text-lg font-semibold text-white">
                Đặt vé cho phim {{ showtime.movie.name }} - {{ showtime.cinema.name }} -
                {{ getRoomName(selectedShowTime!.roomId) }} -
                {{ selectedShowTime ? formatShowTime(selectedShowTime.showTimeDuration) : '' }}
              </DialogTitle>
              <button type="button"
                class="p-1 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pb-accent dark:focus:ring-offset-gray-800"
                @click="isRekaDialogOpen = false" aria-label="Đóng">
                <Icon icon="heroicons:x-mark-20-solid" class="w-5 h-5" />
              </button>
            </div>

            <div v-if="selectedShowTime" class="p-4 md:p-6  ">
              <BookingModal :room-id="selectedShowTime.roomId" :show-time-id="selectedShowTime.id"
                :movie-id="showtime.movie.id" :cinema-id="showtime.cinema.id" :movie-name="showtime.movie.name"
                :show-time-details="selectedShowTime.showTimeDuration" :cinema-name="showtime.cinema.name"
                :room-name="getRoomName(selectedShowTime.roomId)" @checkout="handleCheckout" />
            </div>
            <div v-else class="p-4 text-center flex-grow flex items-center justify-center">
              <p class="text-gray-500 dark:text-gray-400">Đang tải dữ liệu suất chiếu...</p>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </UCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
} from 'reka-ui';

import { Icon } from "@iconify/vue";
import type { ShowTimeDataItem, ShowTimeSelect } from "@/types/show-time.type";
import type { Room } from "@/types/room.type";
import type { BookingPayload } from '~/types/booking.type';

interface Props {
  showtime: ShowTimeDataItem;
}

const props = defineProps<Props>();

const isRekaDialogOpen = ref(false);
const selectedShowTime = ref<ShowTimeSelect | null>(null);

const openRekaDialog = (showTimeData: ShowTimeSelect) => {
  selectedShowTime.value = showTimeData;
  isRekaDialogOpen.value = true;
};

const formatShowTime = (duration: string) => {
  return duration.replace(" ~ ", " - ");
};



const getRoomName = (roomId: string): string => {
  return 'Phòng chiếu' + roomId;
};

const handleCheckout = async (orderDetails: BookingPayload) => {
  console.log('Checkout data received in parent:', orderDetails);

  try {

    const currentUserId = '642cba0f-d810-4241-b073-ef64f5922eaf';

    const payloadToServer = {
      ...orderDetails,
      userId: currentUserId,

      bookingRequestTime: new Date().toISOString(),
    };

    const response = await fetch('http://localhost:5000/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payloadToServer),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error:', errorData);
      throw new Error(`Lỗi khi tạo đơn đặt vé: ${errorData.message || response.status}`);
    }

    const newBooking = await response.json();
    console.log('Đơn đặt vé đã được tạo thành công:', newBooking);
    isRekaDialogOpen.value = false;
    alert(`Đặt vé thành công! Mã đặt vé của bạn là: ${newBooking.id}`); // Ví dụ thông báo đơn giản

  } catch (error) {
    console.error('Không thể hoàn tất đặt vé:', error);
    alert(`Đã có lỗi xảy ra khi đặt vé: ${error instanceof Error ? error.message : String(error)}`);
  }
};

</script>
