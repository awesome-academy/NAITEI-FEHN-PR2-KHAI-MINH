<template>
  <section class="py-8 md:py-12 text-pb-text">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-end mb-8 md:mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-pb-text">
          Bình luận nổi bật
        </h2>
        <NuxtLink
          to="/review"
          class="group inline-flex ml-4 items-center px-2 py-1.5 border border-pb-accent text-pb-accent rounded-full font-semibold text-sm hover:bg-pb-accent hover:text-pb-background transition-colors duration-200"
        >
          <span class="max-w-0 group-hover:max-w-xs opacity-0 group-hover:opacity-100 group-hover:mr-1.5 transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap">
            Xem tất cả
          </span>
          <Icon icon="radix-icons:chevron-right" class="h-4 w-4" />
        </NuxtLink>
      </div>

      <div v-if="hotReviews.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        <ReviewItem
          v-for="review in hotReviews"
          :key="review.id"
          :review="review"
        />
      </div>
      <div v-else-if="!isLoading && initialLoadError" class="text-center py-10">
        <p class="text-xl text-pb-text-secondary">Không thể tải bình luận. Vui lòng thử lại sau.</p>
        <Icon icon="mdi:emoticon-sad-outline" class="h-12 w-12 mx-auto mt-4 text-pb-text-secondary" />
      </div>
       <div v-else-if="isLoading && hotReviews.length === 0" class="text-center py-10">
        <Icon icon="eos-icons:loading" class="h-12 w-12 mx-auto text-pb-accent" />
        <p class="mt-2 text-pb-text-secondary">Đang tải bình luận...</p>
      </div>


       <div v-if="!allServerMoviesLoaded && hotReviews.length > 0" class="text-center mt-8 md:mt-12">
       <button
         @click="loadMoreReviews"
          :disabled="isLoading"
          class="inline-flex items-center justify-center px-6 py-3 border border-pb-accent text-pb-accent font-semibold rounded-full hover:bg-pb-accent hover:text-pb-background transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon v-if="isLoading" icon="eos-icons:loading" class="mr-2 h-5 w-5" />
          <Icon v-else icon="mdi:arrow-down" class="mr-2 h-5 w-5" />
          {{ isLoading ? 'Đang tải...' : 'Xem tiếp nhé !' }}
        </button>
      </div>
      <div v-if="allServerMoviesLoaded && hotReviews.length > 0 && !initialLoadError" class="text-center mt-8 md:mt-12 text-pb-text-secondary">
      Đã hiển thị tất cả bình luận.
    </div>
     <div v-else-if="!isLoading && !initialLoadError && hotReviews.length === 0 && allServerMoviesLoaded" class="text-center py-10">
        <p class="text-xl text-pb-text-secondary">Không tìm thấy bình luận nào.</p>
       <Icon icon="mdi:comment-remove-outline" class="h-12 w-12 mx-auto mt-4 text-pb-text-secondary" />
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Icon } from '@iconify/vue';
import ReviewItem from './item.vue';

interface DbMovie {
  id: string;
  name: string;
  poster: string;
  rating?: {
    RatingValue?: number;
  };
  comments: DbComment[];
}
interface DbComment {
  id: string;
  movieId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}
interface DisplayComment {
  id: string;
  avatarUrl: string;
  userName: string;
  date: string;
  text: string;
}
interface DisplayMovie {
  title: string;
  posterUrl: string;
  rating: number | null;
}
interface DisplayReview {
  id: string; // Movie ID
  movie: DisplayMovie;
  comments: DisplayComment[];
}

const isLoading = ref(false);
const initialLoadError = ref(false);
const hotReviews = ref<DisplayReview[]>([]);
const currentPage = ref(1);
const reviewsPerPage = 4;
const allServerMoviesLoaded = ref(false);

const API_BASE_URL = 'http://localhost:5000';

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date string received: ${dateString}`);
      return 'N/A';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error(`Error formatting date: ${dateString}`, error);
    return 'N/A';
  }
};

const fetchAndProcessReviews = async (isInitialLoad: boolean) => {
  if (isLoading.value) return;
  isLoading.value = true;

  if (isInitialLoad) {
    initialLoadError.value = false;
    hotReviews.value = [];
    currentPage.value = 1;
    allServerMoviesLoaded.value = false; 
  }

  let newValidReviewsCollectedInThisBatch: DisplayReview[] = [];
  const reviewsToFindThisBatch = reviewsPerPage;
  const serverFetchLimit = reviewsPerPage;


  try {
    while (newValidReviewsCollectedInThisBatch.length < reviewsToFindThisBatch && !allServerMoviesLoaded.value) {
      const moviesResponse = await fetch(`${API_BASE_URL}/movies?_page=${currentPage.value}&_limit=${serverFetchLimit}&_sort=releaseYear&_embed=comments`);
      if (!moviesResponse.ok) {
        throw new Error(`Failed to fetch movies: ${moviesResponse.status} ${moviesResponse.statusText}`);
      }
      const fetchedMoviesFromServer: DbMovie[] = await moviesResponse.json();

      if (fetchedMoviesFromServer.length === 0) {
        allServerMoviesLoaded.value = true;
        break;
      }
      if (fetchedMoviesFromServer.length < serverFetchLimit) {
        allServerMoviesLoaded.value = true;
      }

      for (const movie of fetchedMoviesFromServer) {
        if (movie.comments && movie.comments.length > 0) {
          const dbComments: DbComment[] = movie.comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 2); // Sort by date and take top 2

          const displayComments: DisplayComment[] = dbComments.map(comment => ({
            id: comment.id,
            avatarUrl: `https://i.pravatar.cc/40?u=${comment.userId || comment.id}`,
            userName: comment.username,
            date: formatDate(comment.createdAt),
            text: comment.content,
          }));

          newValidReviewsCollectedInThisBatch.push({
            id: movie.id,
            movie: {
              title: movie.name,
              posterUrl: movie.poster,
              rating: movie.rating?.RatingValue !== undefined ? movie.rating.RatingValue : null,
            },
            comments: displayComments,
          });

          if (newValidReviewsCollectedInThisBatch.length >= reviewsToFindThisBatch) {
            break;
          }
        }
      }

      currentPage.value++;

      if (newValidReviewsCollectedInThisBatch.length >= reviewsToFindThisBatch) {
        break;
      }
    }

    if (newValidReviewsCollectedInThisBatch.length > 0) {
      hotReviews.value.push(...newValidReviewsCollectedInThisBatch);
    }

  } catch (error) {
    console.error('Error fetching reviews:', error);
    if (isInitialLoad) {
      initialLoadError.value = true;
    }
  } finally {
    isLoading.value = false;
  }
};

const loadMoreReviews = () => {
  if (!allServerMoviesLoaded.value && !isLoading.value) {
    fetchAndProcessReviews(false);
  }
};

onMounted(() => {
  fetchAndProcessReviews(true);
});

</script>
