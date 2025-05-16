<template>
  <div class="text-gray-300 w-full">
    <div class="flex justify-between items-center mb-4">
      <span class="font-semibold text-lg"
        >Bình luận ({{ comments.length }})</span
      >
    </div>
    <p v-if="!currentUser" class="mb-4 text-sm">
      Vui lòng
      <span class="text-blue-400 hover:underline cursor-pointer"
        >đăng nhập</span
      >
      để tham gia bình luận.
    </p>
    <div class="flex w-full flex-col bg-[#ffffff10] px-2 py-2 rounded-lg">
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
          @click="handleCommentSubmit"
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
</template>

<script setup lang="ts">
import CommentItem2 from "@/components/comment/comment-item-2.vue";
import { useCurrentUser } from "@/lib/utils";
import type { Comment, CommentData } from "@/types/comment.type";
import { Icon } from "@iconify/vue";

const props = defineProps<{
  comments: CommentData[];
  movieId: string;
}>();

const commentTextarea = ref(null);
const isSpoiler = ref(false);
const comment = ref("");
const commentCount = ref(0);
const comments = toRef(props, "comments");
const currentUser = useCurrentUser();

watch(
  () => props.comments,
  (newComments) => {
    if (newComments.length > 0) {
      commentCount.value = newComments.length > 8 ? 8 : newComments.length;
    } else {
      commentCount.value = 0;
    }
  },
  { immediate: true }
);

function readMoreComments() {
  if (props.comments.length - commentCount.value > 8) {
    commentCount.value += 8;
  } else {
    commentCount.value = props.comments.length;
  }
}

async function handleCommentSubmit() {
  if (comment.value.trim() === "" || !currentUser.value) {
    return;
  }

  const newComment: Comment = {
    id: crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substr(2, 9),
    content: comment.value,
    movieId: props.movieId,
    userId: currentUser.value.id,
    username: currentUser.value.username,
    email: currentUser.value.email,
    images: [],
    keywords: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const serverApiUrl = import.meta.env.VITE_APP_URL_API;
  try {
    await $fetch(`${serverApiUrl}/comments`, {
      method: "POST",
      body: newComment,
    });
    comment.value = "";
    isSpoiler.value = false;
  } catch (error) {
    alert("Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại sau.");
  }
  const newCommentData: CommentData = {
    ...newComment,
    user: currentUser.value,
  };
  const updatedComments = [newCommentData, ...comments.value];
  comments.value.splice(0, comments.value.length, ...updatedComments);
  commentCount.value = updatedComments.length > 8 ? 8 : updatedComments.length;
}
</script>
