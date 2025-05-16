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

        <div class="w-1/2 p-6 lg:p-8 overflow-y-auto max-h-[90vh]">
          <div class="flex justify-between items-center mb-4 md:mb-6">
            <DialogTitle
              class="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white"
            >
              Đăng ký
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
            Nếu bạn đã có tài khoản,
            <span
              @click="() => openLoginModal()"
              class="font-medium text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400 cursor-pointer"
              >đăng nhập tại đây</span
            >.
          </DialogDescription>

          <form @submit.prevent="handleRegister" class="space-y-4">
            <div>
              <label
                for="reka-username"
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >Tên người dùng</label
              >
              <input
                id="reka-username"
                type="text"
                v-model="registerForm.username"
                required
                placeholder="Tên người dùng"
                class="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 sm:text-sm"
              />
            </div>
            <div>
              <label
                for="reka-email"
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >Email</label
              >
              <input
                id="reka-email"
                type="email"
                v-model="registerForm.email"
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
                v-model="registerForm.password"
                required
                placeholder="••••••••"
                class="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 sm:text-sm"
              />
            </div>
            <div>
              <label
                for="reka-confirm-password"
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >Xác nhận mật khẩu</label
              >
              <input
                id="reka-confirm-password"
                type="password"
                v-model="registerForm.confirmPassword"
                required
                placeholder="••••••••"
                class="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              :disabled="isRegistering"
              class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
            >
              <Icon
                v-if="isRegistering"
                icon="line-md:loading-twotone-loop"
                class="w-5 h-5 mr-2"
              />
              {{ isRegistering ? "Đang xử lý..." : "Đăng ký" }}
            </button>
          </form>
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

const props = defineProps({
  closeRegisterModal: {
    type: Function,
    required: true,
  },
  openLoginModal: {
    type: Function,
    required: true,
  },
});

const isRegistering = ref(false);

const registerForm = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const apiUrlBase = import.meta.env.VITE_APP_URL_API;

function resetForm() {
  registerForm.username = "";
  registerForm.email = "";
  registerForm.password = "";
  registerForm.confirmPassword = "";
}

async function handleRegister() {
  isRegistering.value = true;

  const requiredFields = ["username", "email", "password", "confirmPassword"];
  for (const field of requiredFields) {
    if (!registerForm[field as keyof typeof registerForm]) {
      alert("Vui lòng điền đầy đủ tất cả các trường bắt buộc!");
      isRegistering.value = false;
      return;
    }
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    alert("Mật khẩu và xác nhận mật khẩu không khớp!");
    isRegistering.value = false;
    return;
  }

  try {
    const emailCheck = await $fetch(`${apiUrlBase}/users`, {
      method: "GET",
      query: { email: registerForm.email },
    });

    if (Array.isArray(emailCheck) && emailCheck.length > 0) {
      throw new Error("Email này đã được sử dụng, vui lòng chọn email khác!");
    }

    const currentTime = new Date().toISOString();
    const userData = {
      id: crypto.randomUUID(),
      username: registerForm.username,
      fullname: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
      role: "user",
      createdAt: currentTime,
      updatedAt: currentTime,
      avatarUrl:
        "https://nuxt.com/cdn-cgi/image/w=40,h=40/https://raw.githubusercontent.com/nuxt/modules/main/icons/reka-ui.svg",
    };

    const response = await $fetch(`${apiUrlBase}/users`, {
      method: "POST",
      body: userData,
    });

    if (!response) {
      throw new Error("Đăng ký không thành công, vui lòng thử lại.");
    }

    alert("Đăng ký thành công!");

    resetForm();

    props.closeRegisterModal();
    props.openLoginModal();
  } catch (error) {
    let errorMessage = "Có lỗi xảy ra khi đăng ký, vui lòng thử lại.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    alert(errorMessage);
  } finally {
    isRegistering.value = false;
  }
}
</script>
