<template>
  <div class="w-1/2 py-8">
    <UserProfileForm />
  </div>
</template>

<script setup>
import UserProfileForm from "~/components/user/user-profile.vue";

definePageMeta({
  layout: "user",
});
</script>
