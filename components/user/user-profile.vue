<template>
  <div class="mx-auto w-full">
    <h1 class="text-base font-semibold mb-2 text-white">Tài khoản</h1>
    <p class="text-gray-400 mb-8 text-sm">Cập nhật thông tin tài khoản</p>

    <form @submit.prevent="handleUpdateProfile" class="space-y-6">
      <div
        class="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10"
      >
        <div class="flex-grow w-full space-y-6">
          <div>
            <label
              for="email"
              class="block text-sm font-normal text-gray-300 mb-1"
              >Email</label
            >
            <input
              type="email"
              id="email"
              v-model="formData.email"
              disabled
              class="w-full px-4 py-2.5 bg-[#2D3047] border border-slate-700 rounded-md text-gray-400 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-sm cursor-not-allowed"
              placeholder="email@example.com"
            />
            <p v-if="!formData.email" class="mt-1 text-xs text-red-500">
              Email không được để trống.
            </p>
          </div>

          <div>
            <label
              for="username"
              class="block text-sm font-normal text-gray-300 mb-1"
              >Tên hiển thị</label
            >
            <input
              type="text"
              id="username"
              v-model="formData.username"
              required
              class="w-full px-4 py-2.5 bg-[#2D3047] border border-slate-700 rounded-md text-white focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-sm"
              placeholder="Nhập tên người dùng"
            />
            <p v-if="formErrors.username" class="mt-1 text-xs text-red-500">
              {{ formErrors.username }}
            </p>
          </div>

          <div>
            <label
              for="fullname"
              class="block text-sm font-normal text-gray-300 mb-1"
              >Tên đầy đủ</label
            >
            <input
              type="text"
              id="fullname"
              v-model="formData.fullname"
              required
              class="w-full px-4 py-2.5 bg-[#2D3047] border border-slate-700 rounded-md text-white focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-sm"
              placeholder="Nhập tên hiển thị"
            />
            <p v-if="formErrors.fullname" class="mt-1 text-xs text-red-500">
              {{ formErrors.fullname }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-normal text-gray-300 mb-2"
              >Giới tính</label
            >
            <div class="flex items-center space-x-6">
              <label class="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  v-model="formData.gender"
                  class="form-radio h-4 w-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-300">Nam</span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  v-model="formData.gender"
                  class="form-radio h-4 w-4 text-pink-600 bg-slate-700 border-slate-600 focus:ring-pink-500"
                />
                <span class="ml-2 text-sm text-gray-300">Nữ</span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  v-model="formData.gender"
                  class="form-radio h-4 w-4 text-purple-600 bg-slate-700 border-slate-600 focus:ring-purple-500"
                />
                <span class="ml-2 text-sm text-gray-300">Không xác định</span>
              </label>
            </div>
            <p v-if="formErrors.gender" class="mt-1 text-xs text-red-500">
              {{ formErrors.gender }}
            </p>
          </div>
        </div>

        <div
          class="flex-shrink-0 w-full md:w-auto flex flex-col items-center mt-6 md:mt-0"
        >
          <img
            :src="
              avatarPreview || formData.avatarUrl || '/img/default-avatar.png'
            "
            alt="Avatar"
            class="w-32 h-32 rounded-full object-cover mb-3 border-2 border-slate-600"
          />
          <input
            type="file"
            ref="avatarInput"
            @change="handleAvatarChange"
            accept="image/*"
            class="hidden"
          />
          <button
            type="button"
            @click="triggerAvatarUpload"
            class="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Đổi ảnh đại diện
          </button>
        </div>
      </div>

      <div class="pt-4">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-8 py-2.5 bg-yellow-400 text-slate-800 font-semibold rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-colors disabled:opacity-50"
        >
          {{ isSubmitting ? "Đang cập nhật..." : "Cập nhật" }}
        </button>
      </div>
    </form>

    <div class="mt-10 pt-6 border-t border-slate-700">
      <NuxtLink
        to="/user/change-password"
        class="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
      >
        Đổi mật khẩu, nhấn vào đây
      </NuxtLink>
    </div>

    <div
      v-if="updateStatus.message"
      :class="[
        'mt-4 p-3 rounded-md text-sm',
        updateStatus.success
          ? 'bg-green-600/30 text-green-300 border border-green-500'
          : 'bg-red-600/30 text-red-300 border border-red-500',
      ]"
    >
      {{ updateStatus.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { useCurrentUser, setUserStorage } from "@/lib/utils";
import axios from "axios";

const apiUrlBase = import.meta.env.VITE_APP_URL_API;
const initialUser = useCurrentUser();

const formData = reactive({
  email: "",
  username: "",
  fullname: "",
  avatarUrl: null,
  gender: "other",
});

const formErrors = reactive({
  username: "",
  fullname: "",
  gender: "",
});

const avatarInput = ref(null);
const avatarPreview = ref(null);
const avatarFile = ref(null);

const isSubmitting = ref(false);
const updateStatus = reactive({
  success: false,
  message: "",
});

const initializeFormData = (currentUserData) => {
  if (currentUserData) {
    formData.email = currentUserData.email || "";
    formData.username = currentUserData.username || "";
    formData.fullname = currentUserData.fullname || "";
    formData.avatarUrl = currentUserData.avatarUrl || null;
    formData.gender = currentUserData.gender || "other";
  }
};

onMounted(() => {
  if (initialUser.value && initialUser.value.id) {
    initializeFormData(initialUser.value);
  }
});

watch(
  () => initialUser.value,
  (newUserData) => {
    if (newUserData && newUserData.id) {
      initializeFormData(newUserData);
      avatarPreview.value = null;
      avatarFile.value = null;
    }
  },
  { deep: true }
);

const triggerAvatarUpload = () => {
  avatarInput.value?.click();
};

const handleAvatarChange = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    avatarFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result;
    };
    reader.readAsDataURL(file);
  }
};

const validateForm = () => {
  formErrors.username = "";
  formErrors.fullname = "";
  formErrors.gender = "";
  let isValid = true;

  if (!formData.username.trim()) {
    formErrors.username = "Tên người dùng không được để trống.";
    isValid = false;
  } else if (formData.username.trim().length < 3) {
    formErrors.username = "Tên người dùng phải có ít nhất 3 ký tự.";
    isValid = false;
  }

  if (!formData.fullname.trim()) {
    formErrors.fullname = "Tên hiển thị không được để trống.";
    isValid = false;
  }

  if (!formData.gender) {
    formErrors.gender = "Vui lòng chọn giới tính.";
    isValid = false;
  }

  return isValid;
};

const handleUpdateProfile = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  updateStatus.message = "";
  updateStatus.success = false;

  if (!initialUser.value || !initialUser.value.id) {
    updateStatus.message =
      "Không thể xác định người dùng hiện tại để cập nhật.";
    updateStatus.success = false;
    isSubmitting.value = false;
    return;
  }

  const userId = initialUser.value.id;
  const apiEndpoint = `${apiUrlBase}/users/${userId}`;

  try {
    const response = await axios(apiEndpoint, {
      method: "PATCH",
      data: formData,
    });

    const responseData = response.data;

    if (response.status >= 200 && response.status < 300) {
      const updatedUserFromAPI = responseData.user || responseData;
      const completeUpdatedUser = {
        ...initialUser.value,
        ...updatedUserFromAPI,
        username: updatedUserFromAPI.username || formData.username,
        fullname: updatedUserFromAPI.fullname || formData.fullname,
        gender: updatedUserFromAPI.gender || formData.gender,
        avatarUrl: updatedUserFromAPI.avatarUrl || formData.avatarUrl,
      };
      setUserStorage(completeUpdatedUser, true);

      avatarFile.value = null;

      updateStatus.success = true;
      updateStatus.message =
        responseData.message || "Cập nhật thông tin thành công!";
    } else {
      updateStatus.success = false;
      updateStatus.message =
        responseData.message || `Lỗi ${response.status}: Cập nhật thất bại.`;
      if (responseData.errors) {
        if (responseData.errors.username)
          formErrors.username = responseData.errors.username;
        if (responseData.errors.fullname)
          formErrors.fullname = responseData.errors.fullname;
        if (responseData.errors.gender)
          formErrors.gender = responseData.errors.gender;
      }
      console.error("API Error:", responseData);
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật profile:", error);
    updateStatus.success = false;
    updateStatus.message =
      "Đã xảy ra lỗi kết nối hoặc lỗi không xác định. Vui lòng thử lại.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.form-radio {
  appearance: none;
  border-radius: 50%;
  background-color: #4a5568;
  border: 1px solid #718096;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
}
.form-radio:checked {
  background-color: currentColor;
  border-color: currentColor;
}
.form-radio:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
}
.hidden {
  display: none;
}
</style>
