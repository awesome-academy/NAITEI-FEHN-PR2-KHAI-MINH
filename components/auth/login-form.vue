<template>
  <DialogPortal>
    <DialogOverlay
      class="fixed inset-0 bg-black/60 dark:bg-black/70 data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide z-[100]"
    />
    <DialogContent
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-[calc(100vw-2rem)] sm:w-[90vw] max-w-lg md:max-w-3xl lg:max-w-4xl max-h-[90vh] data-[state=open]:animate-contentShow data-[state=closed]:animate-contentHide focus:outline-none p-0 shadow-2xl rounded-xl overflow-hidden"
    >
      <div class="flex bg-white dark:bg-slate-900">
        <div
          class="hidden md:flex w-1/2 bg-slate-800 p-6 lg:p-8 flex-col justify-between"
          :style="{
            backgroundImage: `url('https://images.herzindagi.info/her-zindagi-english/images/2025/04/28/article/image/Weak-Hero-Class-2-Ending-Explained-1745820695593.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }"
        ></div>

        <div class="w-full md:w-1/2 p-6 lg:p-8 overflow-y-auto max-h-[90vh]">
          <div class="flex justify-between items-center mb-4 md:mb-6">
            <DialogTitle
              class="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white"
            >
              Đăng nhập
            </DialogTitle>
            <DialogClose as-child>
              <button
                aria-label="Đóng"
                class="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Icon icon="radix-icons:cross-2" class="h-5 w-5" />
              </button>
            </DialogClose>
          </div>

          <DialogDescription
            class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-6 -mt-3 md:-mt-5"
          >
            Nếu bạn chưa có tài khoản,
            <span
              @click="() => openLogupModal()"
              class="font-medium text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400 cursor-pointer"
              >đăng ký tại đây</span
            >.
          </DialogDescription>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label
                for="reka-email"
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >Email</label
              >
              <input
                id="reka-email"
                type="email"
                v-model="loginForm.email"
                required
                placeholder="you@example.com"
                class="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 sm:text-sm"
              />
            </div>
            <div>
              <label
                for="reka-password"
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >Mật khẩu</label
              >
              <input
                id="reka-password"
                type="password"
                v-model="loginForm.password"
                required
                placeholder="••••••••"
                class="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 sm:text-sm"
              />
            </div>
            <div class="flex items-center justify-between pt-2">
              <div class="flex items-center">
                <input
                  id="reka-rememberMe"
                  type="checkbox"
                  v-model="loginForm.rememberMe"
                  class="h-4 w-4 text-green-600 border-gray-300 dark:border-slate-600 rounded focus:ring-green-500 focus:ring-offset-0 dark:focus:ring-offset-slate-900"
                />
                <label
                  for="reka-rememberMe"
                  class="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                  >Duy trì đăng nhập</label
                >
              </div>
            </div>
            <button
              type="submit"
              :disabled="isLoggingIn"
              class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
            >
              <Icon
                v-if="isLoggingIn"
                icon="line-md:loading-twotone-loop"
                class="w-5 h-5 mr-2"
              />
              {{ isLoggingIn ? "Đang xử lý..." : "Đăng nhập" }}
            </button>
          </form>
          <div class="mt-6 text-sm text-center">
            <NuxtLink
              to="/forgot-password"
              @click="closeLoginModal"
              class="font-medium text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400"
              >Quên mật khẩu?</NuxtLink
            >
          </div>
        </div>
      </div>
    </DialogContent>
  </DialogPortal>
</template>

<script setup lang="ts">
import {
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "reka-ui";
import { setUserStorage } from "@/lib/utils";

const props = defineProps({
  closeLoginModal: {
    type: Function,
    required: true,
  },
  openLogupModal: {
    type: Function,
    required: true,
  },
});

const isLoggingIn = ref(false);

const loginForm = reactive({
  email: "",
  password: "",
  rememberMe: false,
});

function resetForm() {
  loginForm.email = "";
  loginForm.password = "";
  loginForm.rememberMe = false;
}

async function handleLogin() {
  isLoggingIn.value = true;

  if (!loginForm.email || !loginForm.password) {
    alert("Vui lòng điền đầy đủ email và mật khẩu!");
    isLoggingIn.value = false;
    return;
  }

  try {
    const config = useRuntimeConfig();
    const serverApiUrl = import.meta.env.VITE_APP_URL_API;

    const response = await $fetch(`${serverApiUrl}/users`, {
      method: "GET",
      query: {
        email: loginForm.email,
        password: loginForm.password,
      },
    });

    if (!Array.isArray(response) || response.length === 0) {
      throw new Error("Sai email hoặc mật khẩu!");
    }

    const user = response[0];

    if (!user || typeof user !== "object") {
      throw new Error("Dữ liệu user không hợp lệ từ API!");
    }

    setUserStorage(user, true);
    alert("Đăng nhập thành công!");
    resetForm();
    props.closeLoginModal();
  } catch (error) {
    let errorMessage = "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    alert(errorMessage);
  } finally {
    isLoggingIn.value = false;
  }
}
</script>
