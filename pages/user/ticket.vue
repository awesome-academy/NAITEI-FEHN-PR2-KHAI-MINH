<template>
  <div>
    <TicketsList />
  </div>
</template>
<script setup lang="ts">
import TicketsList from "@/components/ticket/ticket.vue";

definePageMeta({
  layout: "user",
});
</script>
