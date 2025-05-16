<template>
  <div class="min-h-screen text-white">
    <div class="movie-details-component">
      <div class="relative w-full h-[81vh] bg-cover bg-center">
        <img
          :src="movieData?.coverImage"
          alt="Movie background"
          class="w-full h-full object-cover object-center scale-120"
          style="transform-origin: center; object-position: 50% 10%"
          @error="onImageError"
        />
        <div
          class="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white/40 to-transparent"
        ></div>
        <div
          class="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white/40 to-transparent"
        ></div>
        <div
          class="absolute bottom-0 left-0 right-0 h-1/2 sm:h-2/3 bg-gradient-to-t from-[#17171F] via-[#17171F]/40 to-transparent"
        ></div>
      </div>

      <div class="relative z-10 -mt-[26vh] flex justify-center">
        <div
          class="w-[84vw] flex flex-row justify-start rounded-3xl bg-gradient-to-b from-[#17171F]/70 to-[#17171F]/100 from-50% px-10 py-10 gap-4"
        >
          <div class="flex flex-col justify-start items-start w-1/4">
            <div class="w-42 h-60">
              <img
                :src="movieData?.poster"
                :alt="`Poster phim ${movieData?.name}`"
                class="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div class="flex-1 pt-4 md:pt-6 md:pr-6 pb-6 px-4 md:px-0">
              <h1 class="text-xl font-meidum mb-1">{{ movieData?.name }}</h1>
              <p
                v-if="movieData?.subname"
                class="text-base text-green-500 mb-4"
              >
                {{ movieData?.subname }}
              </p>

              <div class="flex flex-wrap items-center gap-2 mb-4 text-xs">
                <span
                  v-if="movieData?.rating?.RatingValue"
                  class="bg-green-500 text-black font-bold px-2.5 py-1 rounded"
                  >IMDb {{ movieData?.rating.RatingValue.toFixed(1) }}</span
                >
                <span
                  v-if="movieData?.ageRating"
                  class="border border-gray-500 text-gray-300 px-2.5 py-1 rounded"
                  >{{ movieData?.ageRating }}</span
                >
                <span
                  v-if="movieData?.releaseYear"
                  class="border border-gray-500 text-gray-300 px-2.5 py-1 rounded"
                  >{{ movieData?.releaseYear }}</span
                >
              </div>

              <div class="flex flex-wrap items-center gap-2 mb-5">
                <span
                  v-for="genre in movieData?.genres"
                  :key="genre"
                  class="bg-gray-700 text-gray-300 text-xs font-medium px-3 py-1 rounded-full hover:bg-gray-600 cursor-pointer"
                >
                  {{ genre }}
                </span>
              </div>

              <div v-if="movieData?.description" class="mb-6">
                <h3 class="font-medium mb-2">Giới thiệu:</h3>
                <p class="text-gray-300 text-sm leading-relaxed">
                  {{ movieData?.description }}
                </p>
              </div>

              <div class="space-y-2 text-sm mb-4">
                <div v-if="movieData?.releaseDate" class="flex">
                  <span class="w-24 font-medium">Ngày chiếu:</span>
                  <span class="flex-1 text-gray-200">{{
                    formatDatetime(movieData?.releaseDate)
                  }}</span>
                </div>
              </div>

              <div class="space-y-2 text-sm mb-4">
                <div v-if="movieData?.duration" class="flex">
                  <span class="w-24 font-medium">Thời lượng:</span>
                  <span class="flex-1 text-gray-200">{{
                    formatDuration(movieData?.duration)
                  }}</span>
                </div>
              </div>

              <div class="space-y-2 text-sm mb-4">
                <div v-if="movieData?.duration" class="flex">
                  <span class="w-24 font-medium">Quốc gia:</span>
                  <span class="flex-1 text-gray-200">{{
                    movieData?.country
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex-1 flex flex-col justify-start items-start">
            <div class="text-gray-300 w-full">
              <span class="font-semibold text-lg"
                >Lịch chiếu phim {{ movieData?.name }}</span
              >

              <div
                v-if="uniqueShowDates.length === 0"
                class="my-4 text-green-500 text-sm font-semibold"
              >
                Hiện tại phim không có lịch chiếu tại rạp
                {{
                  cinemasFromHome.filter(
                    (cinema) => cinema.id === currentCinemaId
                  )[0]?.name
                }}.
              </div>
              <div
                v-else
                class="flex w-full flex-row justify-start items-center gap-2 my-4"
              >
                <div
                  v-for="date in uniqueShowDates"
                  :key="date.date"
                  :class="[
                    'group w-1/5 box-sizing w-40 flex flex-col justify-between bg-[#282b3a] py-2 px-3 items-start gap-2 cursor-pointer',
                    date.date === currentDate?.date
                      ? 'border-t-2 border-green-500'
                      : 'hover:border-green-500 hover:border-t-2',
                  ]"
                  @click="updateCurrentDate(date)"
                  style="opacity: 0.8"
                >
                  <span class="text-sm text-gray-500">{{ date.date }}</span>
                  <span
                    :class="[
                      'text-base font-semibold group-hover:text-green-500',
                      date.date === currentDate?.date
                        ? 'text-green-500'
                        : 'text-white',
                    ]"
                  >
                    {{ date.weekDay }}
                  </span>
                </div>
              </div>

              <div class="w-full flex flex-col justify-start items-start">
                <div
                  v-for="cinema in cinemasFromHome.slice(0, cinemaCount)"
                  :key="cinema.id"
                  @click="updateCurrentCinema(cinema)"
                  class="w-full flex flex-col justify-start items-start"
                  :class="{
                    'shadow-lg bg-black bg-opacity-20':
                      cinema.id === currentCinemaId,
                  }"
                >
                  <div
                    class="flex w-full flex-row justify-between items-center p-3 pr-6 space-x-3 cursor-pointer hover:shadow-lg hover:bg-black hover:bg-opacity-20"
                  >
                    <div class="flex flex-row justify-start items-center gap-3">
                      <img
                        :src="cinema.logo"
                        :alt="cinema.name"
                        class="w-10 h-10 object-contain rounded flex-shrink-0"
                        @error="onImageError"
                      />
                      <div
                        class="flex flex-col justify-center items-start gap-1"
                      >
                        <span
                          class="flex-grow text-sm duration-300"
                          :class="{
                            'text-green-400': cinema.id === currentCinemaId,
                            'text-white group-hover:text-green-400':
                              cinema.id !== currentCinemaId,
                          }"
                        >
                          {{ cinema.name }}
                        </span>

                        <span
                          class="flex-grow text-xs duration-300"
                          :class="{
                            'text-gray-400': cinema.id === currentCinemaId,
                            hidden: cinema.id !== currentCinemaId,
                          }"
                        >
                          {{ cinema.address }}
                        </span>
                      </div>
                    </div>
                    <Icon
                      :icon="
                        cinema.id === currentCinemaId
                          ? 'heroicons:chevron-down-20-solid'
                          : 'heroicons:chevron-right-20-solid'
                      "
                      class="w-5 h-5 text-gray-400 duration-300"
                      :class="{
                        'text-green-400': cinema.id === currentCinemaId,
                        'group-hover:text-green-500':
                          cinema.id !== currentCinemaId,
                      }"
                    />
                  </div>

                  <div
                    v-if="cinema.id === currentCinemaId && showTimes.length > 0"
                    class="flex flex-wrap gap-2 pl-4 my-4"
                  >
                    <UButton
                      v-for="showTimeSlot in groupedShowTimeSelect"
                      :key="showTimeSlot.id"
                      class="border border-green-500 px-2 py-1 rounded-md text-green-500 text-base cursor-pointer hover:bg-green-500 hover:bg-opacity-10"
                      block
                      color="primary"
                    >
                      {{ showTimeSlot.showTimeDuration.replace(" ~ ", " - ") }}
                    </UButton>
                  </div>
                </div>
                <div
                  v-if="cinemaCount < cinemasFromHome.length"
                  class="flex items-center justify-center w-full mt-4"
                  @click="readMoreCinemas"
                >
                  <button
                    class="bg-gray-700 text-gray-300 rounded-md px-4 py-2 font-medium text-sm hover:bg-green-500 transition duration-200"
                  >
                    Xem thêm
                  </button>
                </div>
              </div>
            </div>

            <CommentForm :comments="comments" :movieId="movieId" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import type { Movie } from "@/types/movie.type";
import {
  formatDate,
  formatDatetime,
  formatDuration,
  getWeekday,
} from "@/lib/utils";
import { Icon } from "@iconify/vue";
import type { CommentData } from "@/types/comment.type";
import type {
  DateWeekDay,
  ShowTimeData,
  ShowTimeSelect,
} from "@/types/show-time.type";
import type { Cinema } from "@/types/cinema.type";
import CommentForm from "@/components/movie-detail/comment-form.vue";

const movieData = ref<Movie | null>(null);
const comments = ref<CommentData[]>([]);
const showTimes = ref<ShowTimeData[]>([]);
const currentCinemaId = ref<string | null>(null);
const currentDate = ref<DateWeekDay | undefined>(undefined);
const cinemasFromHome = ref<Cinema[]>([]);

const route = useRoute();
const movieId = route.params.id as string;

const apiUrlBase = import.meta.env.VITE_APP_URL_API;

const fetchMovieData = async () => {
  try {
    const response = await axios.get(`${apiUrlBase}/movies/${movieId}`);
    if (response.status === 200) {
      movieData.value = response.data as Movie;
    } else {
      console.error("Error fetching movie data:", response.status);
    }
  } catch (error) {
    console.error("Error fetching movie data:", error);
  }
};

const fetchComments = async () => {
  try {
    const response = await axios.get(
      `${apiUrlBase}/comments?movieId=${movieId}&_expand=user`
    );
    if (response.status === 200) {
      comments.value = (response.data as CommentData[]).sort(
        (a: CommentData, b: CommentData) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      console.error("Error fetching comments:", response.status);
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};

const fetchCinemas = async () => {
  try {
    const response1 = await axios.get(
      `${import.meta.env.VITE_APP_URL_API}/cinemas`
    );
    cinemasFromHome.value = response1.data;

    if (cinemasFromHome.value.length > 0) {
      currentCinemaId.value = cinemasFromHome.value[0].id;
    }
  } catch (error) {
    console.error("Lỗi khi fetch cinemas:", error);
  }
};

watch(currentCinemaId, async (newCinemaId) => {
  if (!newCinemaId) return;

  try {
    const response = await axios.get(
      `${apiUrlBase}/showTimes?cinemaId=${newCinemaId}&movieId=${movieId}&_expand=cinema&_expand=room&_expand=movie`
    );
    showTimes.value = response.data as ShowTimeData[];
  } catch (error) {
    console.error("Error fetching show times:", error);
  }
});
const defaultPlaceholder =
  "https://via.placeholder.com/300x450.png?text=No+Image";
const onImageError = (event: Event) => {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = defaultPlaceholder;
};

const cinemaCount = ref(0);

watch(cinemasFromHome, (newCinemas) => {
  if (newCinemas.length > 0) {
    cinemaCount.value = newCinemas.length > 8 ? 8 : newCinemas.length;
  } else cinemaCount.value = 0;
});

function readMoreCinemas() {
  if (cinemasFromHome.value.length - cinemaCount.value > 8) {
    cinemaCount.value += 8;
  } else {
    cinemaCount.value = cinemasFromHome.value.length;
  }
}

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
  if (newDates.length > 0) {
    currentDate.value = newDates[0];
  }
});

const groupedShowTimeSelect = computed((): ShowTimeSelect[] => {
  const showTimesSelect = <ShowTimeSelect[]>[];

  const showTimesOfDate = computed(() =>
    currentDate.value
      ? showTimes.value.filter(
          (showTime) => showTime.showDate === currentDate.value!.showDate
        )
      : []
  );

  for (const currentShowTime of showTimesOfDate.value) {
    showTimesSelect.push({
      id: currentShowTime.id,
      roomId: currentShowTime.roomId,
      showDateTime: currentShowTime.showDateTime,
      showTime: currentShowTime.showTime,
      showTimeDuration: currentShowTime.showTimeDuration,
    });

    showTimesSelect.sort((a, b) => a.showDateTime - b.showDateTime);
  }

  return showTimesSelect;
});

onMounted(() => {
  fetchMovieData();
  fetchComments();
  fetchCinemas();
});
</script>

<style scoped>
.relative.w-full {
  padding-top: var(--header-height) !important;
  margin-top: calc(-1 * var(--header-height)) !important;
}
</style>
