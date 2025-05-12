<template>
  <div class="w-full px-12 mb-5">
    <h2 class="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
      Lịch chiếu phim
    </h2>

    <div
      class="rounded-2xl bg-gradient-to-b from-[#282b3a]/100 to-[#282b3a]/0 from-20% px-6 py-5 gap-8 h-[60vh]"
    >
      <div class="w-full flex flex-row items-center">
        <div class="flex w-1/4 items-center space-x-4 font-sans">
          <span class="text-xl text-white font-semibold">Vị trí</span>
          <div class="flex items-center space-x-3">
            <div
              class="flex items-center cursor-pointer justify-between w-48 h-10 px-3 py-2 bg-white border border-gray-300 rounded-md"
            >
              <div class="flex items-center">
                <Icon
                  icon="heroicons:map-pin-20-solid"
                  class="w-5 h-5 text-gray-500 mr-2"
                />
                <span class="text-sm text-gray-800">Hà Nội</span>
              </div>
              <Icon
                icon="heroicons:chevron-down-20-solid"
                class="w-5 h-5 text-gray-400"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-1 flex-row items-center justify-start gap-4">
          <div
            v-for="(item, index) in uniqueShowDates"
            :key="index"
            @click="updateCurrentDate(item)"
            :class="[
              'flex flex-col items-center justify-center border rounded-md cursor-pointer',
              item.date === currentDate?.date
                ? 'bg-green-500 bg-opacity-30 border-green-500'
                : 'border-green-500 hover:bg-green-500 hover:bg-opacity-10',
            ]"
          >
            <div class="bg-green-500 w-full text-center py-1 rounded-t-md">
              <span class="text-white text-base">{{ item.weekDay }}</span>
            </div>
            <div class="flex items-center justify-center w-full px-3 py-2">
              <span class="text-white text-sm">{{ item.date }}</span>
            </div>
          </div>
        </div>

        <div class="flex w-1/4">
          <span class="text-xl text-white font-semibold"
            >Bình luận mới nhất</span
          >
        </div>
      </div>

      <div class="h-full w-full flex flex-row justify-start">
        <CinemaList
          :initial-cinemas="cinemasFromHome"
          :onSelectCinema="updateCurrentCinema"
          :current-cinema-id="currentCinemaId"
        />
        <ShowTimeList :showtimes="groupedShowTimeDataItems" />
        <CommentList :comments="comments" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type {
  DateWeekDay,
  ShowTimeData,
  ShowTimeDataItem,
} from "@/types/show-time.type";
import type { Cinema } from "@/types/cinema.type";
import type { CommentData } from "@/types/comment.type";
import { formatDate, getWeekday } from "@/lib/utils";
import CinemaList from "@/components/cinema/cinema-list.vue";
import ShowTimeList from "@/components/showtimes/show-time-list.vue";
import { Icon } from "@iconify/vue";
import CommentList from "@/components/comment/comment-list.vue";
import axios from "axios";

const cinemasFromHome = ref<Cinema[]>([]);
const showTimes = ref<ShowTimeData[]>([]);
const comments = ref<CommentData[]>([]);
const currentCinemaId = ref<string>("");
const currentDate = ref<DateWeekDay | undefined>(undefined);

onMounted(async () => {
  try {
    const response1 = await axios.get(
      `${import.meta.env.VITE_APP_URL_API}/cinemas`
    );
    cinemasFromHome.value = response1.data;

    const response2 = await axios.get(
      `${import.meta.env.VITE_APP_URL_API}/comments?_expand=movie&_expand=user`
    );
    comments.value = response2.data;

    if (cinemasFromHome.value.length > 0) {
      currentCinemaId.value = cinemasFromHome.value[0].id;
    }
  } catch (error) {
    console.error("Lỗi khi fetch cinemas:", error);
  }
});

watch(currentCinemaId, async (newCinemaId) => {
  if (!newCinemaId) return;

  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_APP_URL_API
      }/showTimes?cinemaId=${newCinemaId}&_expand=cinema&_expand=room&_expand=movie`
    );

    showTimes.value = response.data;
  } catch (error) {
    console.error("Lỗi khi fetch showTimes:", error);
  }
});

const uniqueShowDates = computed((): DateWeekDay[] => {
  const datesMap = new Map<string, DateWeekDay>();
  for (const showTime of showTimes.value) {
    if (showTime && showTime.showTime) {
      const dateKey = formatDate(showTime.showTime);
      if (!datesMap.has(dateKey)) {
        datesMap.set(dateKey, {
          weekDay: getWeekday(showTime.showTime),
          date: formatDate(showTime.showTime),
          showDate: showTime.showDate,
        });
      }
    }
  }

  return Array.from(datesMap.values()).sort(
    (a, b) => new Date(a.showDate).getTime() - new Date(b.showDate).getTime()
  );
});

function updateCurrentDate(newDate: DateWeekDay): void {
  currentDate.value = newDate;
}

function updateCurrentCinema(newCinema: Cinema): void {
  currentCinemaId.value = newCinema.id;
}

watch(uniqueShowDates, (newDates) => {
  if (newDates.length > 0 && !currentDate.value) {
    currentDate.value = newDates[0];
  }
});

const groupedShowTimeDataItems = computed((): ShowTimeDataItem[] => {
  const groupedMap = new Map<string, ShowTimeDataItem>();

  const showTimesOfDate = computed(() =>
    currentDate.value
      ? showTimes.value.filter(
          (showTime) => showTime.showDate === currentDate.value!.showDate
        )
      : []
  );

  for (const currentShowTime of showTimesOfDate.value) {
    const groupKey = `${currentShowTime.movieId}-${currentShowTime.cinemaId}-${currentShowTime.showDate}`;

    let showTimeGroup = groupedMap.get(groupKey);

    if (!showTimeGroup) {
      showTimeGroup = {
        id: groupKey,
        cinemaId: currentShowTime.cinemaId,
        movieId: currentShowTime.movieId,
        showDate: currentShowTime.showDate,
        cinema: currentShowTime.cinema,
        movie: currentShowTime.movie,
        showTimesSelect: [],
      };
      groupedMap.set(groupKey, showTimeGroup);
    }
    showTimeGroup.showTimesSelect.push({
      id: currentShowTime.id,
      roomId: currentShowTime.roomId,
      showDateTime: currentShowTime.showDateTime,
      showTime: currentShowTime.showTime,
      showTimeDuration: currentShowTime.showTimeDuration,
    });

    showTimeGroup.showTimesSelect.sort(
      (a, b) => a.showDateTime - b.showDateTime
    );
  }

  return Array.from(groupedMap.values());
});
</script>
