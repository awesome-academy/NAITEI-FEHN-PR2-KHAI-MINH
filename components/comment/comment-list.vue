<template>
  <div class="h-full w-1/4 mt-8">
    <ul
      v-if="comments.length > 0"
      ref="commentListRef"
      class="overflow-y-auto overflow-x-hidden max-h-[calc(46vh-11px)] space-y-2 comment-list-scrollbar-hidden"
    >
      <CommentItem
        v-for="(comment, index) in comments"
        :key="comment.id"
        :review="comment"
        :ref="(el) => setCommentItemRef(el, index)"
      />
    </ul>
    <div v-else class="p-4 text-center text-gray-500">
      <p>Không có bình luận nào.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import CommentItem from "@/components/comment/comment-item.vue";
import type { CommentData } from "@/types/comment.type";

interface Props {
  comments: CommentData[];
}

const props = defineProps<Props>();

const commentListRef = ref<HTMLUListElement | null>(null);
const commentItemElements = ref<HTMLElement[]>([]);

const setCommentItemRef = (el: any, index: number) => {
  if (el && el.$el) {
    commentItemElements.value[index] = el.$el as HTMLElement;
  } else {
    if (commentItemElements.value[index]) {
      commentItemElements.value.splice(index, 1);
    }
  }
};

let scrollInterval: number | undefined;
let currentScrollTargetIndex = 0;

const stopAutoScroll = () => {
  if (scrollInterval) {
    clearInterval(scrollInterval);
    scrollInterval = undefined;
  }
};

const initializeAndStartScroll = async () => {
  stopAutoScroll();
  currentScrollTargetIndex = 0;
  commentItemElements.value = [];

  if (props.comments.length > 0 && commentListRef.value) {
    commentListRef.value.scrollTop = 0;
    commentItemElements.value = new Array(props.comments.length);
    await nextTick();
    const allRefsPopulated =
      commentItemElements.value.length === props.comments.length &&
      commentItemElements.value.every((el) => el);

    if (allRefsPopulated) {
      autoScrollView();
    } else {
      console.warn(
        "Một số refs của CommentItem chưa được thiết lập sau nextTick. Sẽ thử lại sau một chút."
      );

      setTimeout(async () => {
        await nextTick();
        const finalCheckPopulated =
          commentItemElements.value.length === props.comments.length &&
          commentItemElements.value.every((el) => el);
        if (finalCheckPopulated) {
          autoScrollView();
        } else {
          console.error(
            "Không thể thiết lập đầy đủ refs cho CommentItem. Tính năng tự cuộn có thể không hoạt động đúng."
          );
        }
      }, 100); // 100ms delay
    }
  }
};

const autoScrollView = () => {
  if (
    props.comments.length === 0 ||
    !commentListRef.value ||
    commentItemElements.value.length === 0
  ) {
    currentScrollTargetIndex = 0;
    return;
  }

  scrollInterval = window.setInterval(() => {
    if (
      commentListRef.value &&
      currentScrollTargetIndex < props.comments.length
    ) {
      const scrollContainer = commentListRef.value;
      const targetElement = commentItemElements.value[currentScrollTargetIndex];

      if (targetElement) {
        const scrollContainerRect = scrollContainer.getBoundingClientRect();
        const targetElementRect = targetElement.getBoundingClientRect();
        const relativeOffsetTop =
          targetElementRect.top - scrollContainerRect.top;
        const targetScrollTop = scrollContainer.scrollTop + relativeOffsetTop;

        scrollContainer.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });

        currentScrollTargetIndex++;

        if (currentScrollTargetIndex >= props.comments.length) {
          stopAutoScroll();
        }
      } else {
        console.warn(
          `Không tìm thấy phần tử bình luận tại chỉ số ${currentScrollTargetIndex}. Dừng cuộn.`
        );
        stopAutoScroll();
      }
    } else {
      stopAutoScroll();
    }
  }, 2000);
};

onMounted(() => {
  initializeAndStartScroll();
});

onBeforeUnmount(() => {
  stopAutoScroll();
});

watch(
  () => props.comments,
  () => {
    initializeAndStartScroll();
  },
  { deep: true }
);
</script>

<style scoped>
.comment-list-scrollbar-hidden {
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
