<template>
  <div class="bg-pb-background min-h-screen text-pb-text">
    <div v-if="isLoading" class="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Icon icon="eos-icons:loading" class="h-16 w-16 text-pb-accent" />
    </div>
    <div v-else-if="error" class="text-center py-20">
      <p class="text-2xl text-pb-text-secondary">Không thể tải thông tin phim.</p>
      <Icon icon="mdi:emoticon-sad-outline" class="h-16 w-16 mx-auto mt-6 text-pb-text-secondary" />
      <p class="mt-4 text-pb-text-secondary">{{ error }}</p>
    </div>
    <div v-else-if="movie" class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div class="flex flex-col md:flex-row gap-8 lg:gap-12">
        <div class="md:w-1/3 lg:w-1/4 md:sticky md:top-24 self-start">
          <div class="bg-pb-surface rounded-lg shadow-lg overflow-hidden">
            <div class="relative">
              <img
                :src="movie.poster"
                :alt="`Poster for ${movie.name}`"
                class="w-full h-auto object-cover aspect-[2/3]"
              />
              <div
                class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                @click="playTrailer"
              >
                <Icon icon="mdi:play-circle" class="text-white text-7xl" />
              </div>
              <span v-if="movie.ageRating" class="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                {{ movie.ageRating }}+
              </span>
            </div>
            <div class="p-4">
              <h2 class="text-xl font-bold text-pb-text mb-1">{{ movie.name }}</h2>
              <p v-if="movie.subname" class="text-sm text-pb-text-secondary mb-3">{{ movie.subname }}</p>
              <div class="text-sm text-pb-text-secondary mb-1">
                <span class="font-semibold text-pb-text">Thể loại:</span> {{ movie.genres?.join(', ') || 'N/A' }}
              </div>
              <div class="text-sm text-pb-text-secondary mb-3">
                <span class="font-semibold text-pb-text">Ngày chiếu:</span> {{ formattedReleaseDate || 'N/A' }}
              </div>
              <button
                @click="goToMovieDetails"
                class="w-full bg-pb-accent text-white font-semibold py-2.5 px-4 rounded-md hover:bg-opacity-80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pb-accent focus:ring-opacity-50"
              >
                Đặt vé ngay
              </button>
            </div>
          </div>
        </div>

        <div class="md:w-2/3 lg:w-3/4 px-16 pt-12">
          <div v-if="movie.coverImage || movie.trailerUrl" class="mb-6 rounded-lg overflow-hidden shadow-lg">
            <div v-if="showTrailer && movie.trailerUrl" class="aspect-video">
              <iframe
                :src="getEmbedUrl(movie.trailerUrl)"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="w-full h-full"
              ></iframe>
            </div>
            <img
              v-else-if="movie.coverImage"
              :src="movie.coverImage"
              :alt="`Cover image for ${movie.name}`"
              class="w-full h-auto object-cover aspect-video"
            />
          </div>

          <h1 class="text-3xl md:text-4xl font-bold text-pb-text mb-2">
            {{ movie.reviewTitle || `Review phim ${movie.name}` }}
          </h1>
          <div class="flex items-center text-pb-text-secondary mb-6 text-sm">
            <div class="flex items-center mr-4">
              <Icon icon="ph:star-bold" class="h-5 w-5 text-yellow-400 mr-1" />
              <span class="font-semibold text-pb-text">{{ movie.rating?.RatingValue?.toFixed(1) || 'N/A' }}</span>
              <span class="ml-1">({{ movie.rating?.RatingCount || 0 }} đánh giá)</span>
            </div>

          </div>

          <div class="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none text-pb-text-secondary leading-relaxed" >

            <div class="text-xl"><p class="mb-10" data-end="672" data-start="587">
              Trong một thế giới nơi ánh sáng và bóng tối đan xen, nơi cái đẹp không chỉ là vẻ bề ngoài mà còn là chứng nhân của sự thật,
            </p><p class="mb-10" data-end="832" data-start="707">
              Ngay từ những khung hình đầu tiên, tôi đã bị cuốn hút bởi sự chỉn chu trong từng chi tiết của phim. Không gian cổ trang được tái hiện một cách sống động, từ những bộ trang phục được may thủ công, nhuộm màu và xử lý để mang đến cảm giác thời gian, đến những bối cảnh được dàn dựng công phu, tất cả tạo nên một thế giới vừa lạ lẫm vừa quen thuộc.​
            </p><p class="mb-10" data-end="999" data-start="834">
              Diễn xuất của Quốc Huy trong vai thám tử Kiên thực sự ấn tượng. Anh thể hiện một nhân vật vừa cương nghị, mưu trí, vừa mang trong mình những tổn thương sâu sắc. Đinh Ngọc Diệp trong vai Hai Mẫn mang đến một nét duyên dáng, hiện đại nhưng không kém phần sâu sắc, tạo nên một đối trọng thú vị với Kiên.
            </p><p class="mb-10" data-end="999" data-start="834">
              Phim không chỉ đơn thuần là một câu chuyện trinh thám mà còn là một bức tranh phản ánh xã hội. Những định kiến về phụ nữ, sự mê tín dị đoan, và những bi kịch gia đình được khắc họa một cách chân thực và cảm động. Nhân vật Nga, dù bị xã hội ruồng bỏ, vẫn giữ được sự lương thiện và niềm tin vào tình yêu, là minh chứng cho sức mạnh nội tâm và khát khao sống của con người.​
            </p><p class="mb-10" data-end="1372" data-start="1247">
              Thám Tử Kiên là bộ phim dành cho những ai yêu thích thể loại trinh thám nhưng cũng mong muốn tìm thấy những giá trị nhân văn sâu sắc. Phim phù hợp để xem cùng bạn bè, người thân, hoặc thậm chí là một mình, để có thể đắm chìm hoàn toàn vào thế giới mà Victor Vũ đã tạo ra.​
            </p><p class="mb-10" data-end="1459" data-start="1374">
              Nếu bạn từng cảm thấy mình bị lạc lõng giữa xã hội, từng phải đối mặt với những định kiến và bất công, liệu bạn có đủ can đảm để giữ vững niềm tin và lòng lương thiện như Nga?
            </p>
            </div>

            <div class="text-gray-300 w-full">
              <div class="flex justify-between items-center mb-4">
                <span class="font-semibold text-lg"
                  >Bình luận ({{ comments.length }})</span
                >
              </div>
              <p class="mb-4 text-sm">
                Vui lòng
                <span class="text-blue-400 hover:underline cursor-pointer"
                  >đăng nhập</span
                >
                để tham gia bình luận.
              </p>
              <div
                class="flex w-full flex-col bg-[#ffffff10] px-2 py-2 rounded-lg"
              >
                <div class="relative mb-4">
                  <textarea
                    ref="commentTextarea"
                    v-model="comment"
                    class="w-full h-28 p-3 border border-gray-700 rounded-lg bg-gray-900 text-gray-300 focus:outline-none focus:border-blue-500 text-sm resize-y"
                    placeholder="Viết bình luận"
                    maxlength="1000"
                  ></textarea>
                  <span class="absolute bottom-3 right-3 text-xs text-gray-500"
                    >{{ comment.length }}/1000</span
                  >
                </div>
                <div class="flex justify-between items-center mb-1">
                  <label class="flex items-center text-sm cursor-pointer">
                    <div
                      class="relative w-10 h-5 rounded-full transition duration-200"
                      :class="{
                        'bg-green-500': isSpoiler,
                        'bg-gray-500': !isSpoiler,
                      }"
                      @click="isSpoiler = !isSpoiler"
                    >
                      <span
                        class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-gray-300 transition duration-200"
                        :class="{ 'translate-x-5': isSpoiler }"
                      ></span>
                    </div>
                    <span class="ml-2 text-gray-500">Tiết lộ?</span>
                  </label>
                  <button
                    :disabled="!comment"
                    class="bg-green-400 text-white rounded-md px-4 py-2 font-medium text-sm hover:bg-green-500 transition duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center"
                  >
                    Gửi
                    <Icon
                      icon="ic:round-arrow-forward-ios"
                      class="h-4 w-4 ml-2 text-green-600"
                    />
                  </button>
                </div>
              </div>

              <div class="flex flex-col w-full justify-start items-start mt-6">
                <CommentItem2
                  v-for="(comment, index) in comments.slice(0, commentCount)"
                  :key="index"
                  :review="comment"
                />

                <div
                  v-if="commentCount < comments.length"
                  class="flex items-center justify-center w-full mt-4"
                  @click="readMoreComments"
                >
                  <button
                    class="bg-gray-700 text-gray-300 rounded-md px-4 py-2 font-medium text-sm hover:bg-green-500 transition duration-200"
                  >
                    Xem thêm bình luận
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-20">
        <p class="text-2xl text-pb-text-secondary">Không tìm thấy thông tin phim.</p>
        <Icon icon="mdi:movie-search-outline" class="h-16 w-16 mx-auto mt-6 text-pb-text-secondary" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import type { CommentData } from '~/types/comment.type';

interface DbMovie {
  id: string;
  name: string;
  subname?: string;
  poster: string;
  coverImage?: string;
  releaseYear?: number;
  duration?: number;
  rating?: {
    RatingCount?: number;
    RatingValue?: number;
  };
  description?: string;
  releaseDate?: string | null;
  genres?: string[];
  trailerUrl?: string;
  review?: string;
  reviewTitle?: string;
  ageRating?: string;
}

const route = useRoute();
const movieId = computed(() => route.params.id as string);

const movie = ref<DbMovie | null>(null);
const comments = ref<CommentData[]>([]);

const isLoading = ref(true);
const error = ref<string | null>(null);
const showTrailer = ref(false);

const API_BASE_URL = 'http://localhost:5000'; 
const goToMovieDetails = () => {
  if (movieId.value) {
    navigateTo(`/movies/${movieId.value}`);
  }
};

const fetchComments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments?movieId=${movieId.value}&_expand=user`);
    if (!response.ok) {
      throw new Error(`Lỗi ${response.status}: Không thể tải dữ liệu bình luận.`);
    }
    const data = await response.json();
    comments.value = data;
    console.warn('Fetched comments:', comments.value.length);
  } catch (e: any) {
    console.error('Failed to fetch comments:', e);
    error.value = e.message || 'Đã xảy ra lỗi không xác định.';
  }
};

const commentTextarea = ref(null);
const comment = ref("");
const isSpoiler = ref(false);
const commentCount = ref(0);
function readMoreComments() {
  if (comments.value.length - commentCount.value > 8) {
    commentCount.value += 8;
  } else {
    commentCount.value = comments.value.length;
  }
}
watch(comments, (newComments) => {
  if (newComments.length > 0) {
    commentCount.value = newComments.length > 8 ? 8 : newComments.length;
  } else commentCount.value = 0;
});

const fetchMovieData = async () => {
  isLoading.value = true;
  error.value = null;
  movie.value = null;
  showTrailer.value = false;
  try {
    const response = await fetch(`${API_BASE_URL}/movies/${movieId.value}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Phim với ID ${movieId.value} không tồn tại.`);
      }
      throw new Error(`Lỗi ${response.status}: Không thể tải dữ liệu phim.`);
    }
    const data = await response.json();
    movie.value = data;
  } catch (e: any) {
    console.error('Failed to fetch movie data:', e);
    error.value = e.message || 'Đã xảy ra lỗi không xác định.';
  } finally {
    isLoading.value = false;
  }
};

const formattedReleaseDate = computed(() => {
  if (movie.value?.releaseDate) {
    try {
      const date = new Date(movie.value.releaseDate);
      if (isNaN(date.getTime())) return movie.value.releaseDate;
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return movie.value.releaseDate;
    }
  }
  return null;
});

const playTrailer = () => {
  if (movie.value?.trailerUrl) {
    showTrailer.value = true;
  }
};

const getEmbedUrl = (youtubeUrl: string): string => {
  try {
    const url = new URL(youtubeUrl);
    if (url.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${url.pathname.slice(1)}`;
    }
    if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') {
      const videoId = url.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
  } catch (e) {
    console.warn("Could not parse YouTube URL:", youtubeUrl, e);
  }
  return youtubeUrl.replace("watch?v=", "embed/");
};

onMounted(() => {
  fetchMovieData();
  fetchComments();
});

watch(movieId, () => {
    fetchMovieData();
});

</script>

<style>

</style>
