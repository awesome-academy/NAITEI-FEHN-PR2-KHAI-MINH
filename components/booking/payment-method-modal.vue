<template>
  <DialogRoot :open="open"  @update:open="(newOpenState) => emit('update:open', newOpenState)">
    <DialogPortal>
      <DialogOverlay class="fixed z-[65] w-[100vw] h-[100vh] top-0 left-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm data-[state=open]:animate-overlayShow" />
      <DialogContent
        class="fixed left-1/2 top-1/2 z-[70] w-[90vw] max-w-lg flex flex-col -translate-x-1/2 -translate-y-1/2 rounded-xl bg-pb-surface text-pb-text p-0 shadow-2xl data-[state=open]:animate-contentShow focus:outline-none max-h-[90vh]"
        @escape-key-down="closeModal"
        @pointer-down-outside="closeModal"
      >
        <div class="flex items-center justify-between px-6 py-4 border-b border-pb-border sticky top-0 bg-pb-surface z-10">
          <DialogTitle class="text-lg font-semibold text-pb-text">
            <Icon icon="mdi:credit-card-outline" class="inline-block mr-2 text-pb-accent" />
            Thanh toán & Ghi chú
          </DialogTitle>
          <DialogClose as-child>
            <button
              type="button"
              class="p-1 rounded-full text-pb-text-secondary hover:text-pb-text focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-pb-surface focus:ring-pb-accent"
              aria-label="Đóng"
              @click="closeModal"
            >
              <Icon icon="heroicons:x-mark-20-solid" class="h-6 w-6" />
            </button>
          </DialogClose>
        </div>

        <div class="flex-grow overflow-y-auto p-6 space-y-6">
          <div>
            <h3 class="text-md font-semibold text-pb-text mb-3">Chọn hình thức thanh toán:</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                @click="selectPaymentMethod('online')"
                :class="[
                  'flex flex-col items-center justify-center p-4 border rounded-lg transition-all duration-150',
                  localSelectedPaymentMethod === 'online'
                    ? 'border-pb-accent ring-2 ring-pb-accent bg-pb-accent/10 dark:bg-pb-accent/20'
                    : 'border-pb-border hover:border-pb-accent/70 hover:bg-pb-background dark:hover:bg-pb-surface-hover'
                ]"
              >
                <Icon icon="mdi:credit-card-check-outline" class="h-10 w-10 mb-2" :class="localSelectedPaymentMethod === 'online' ? 'text-pb-accent' : 'text-pb-text-secondary'" />
                <span class="font-medium text-pb-text">Thanh toán Online</span>
                <span class="text-xs text-pb-text-secondary">(Qua cổng thanh toán)</span>
              </button>
              <button
                type="button"
                @click="selectPaymentMethod('offline')"
                :class="[
                  'flex flex-col items-center justify-center p-4 border rounded-lg transition-all duration-150',
                  localSelectedPaymentMethod === 'offline'
                    ? 'border-pb-accent ring-2 ring-pb-accent bg-pb-accent/10 dark:bg-pb-accent/20'
                    : 'border-pb-border hover:border-pb-accent/70 hover:bg-pb-background dark:hover:bg-pb-surface-hover'
                ]"
              >
                <Icon icon="mdi:cash-multiple" class="h-10 w-10 mb-2" :class="localSelectedPaymentMethod === 'offline' ? 'text-pb-accent' : 'text-pb-text-secondary'" />
                <span class="font-medium text-pb-text">Thanh toán Tại quầy</span>
                 <span class="text-xs text-pb-text-secondary">(Trả tiền mặt tại rạp)</span>
              </button>
            </div>
            <p v-if="showPaymentError" class="text-sm text-red-500 dark:text-red-400 mt-2">Vui lòng chọn hình thức thanh toán.</p>
          </div>

          <div>
            <label for="bookingNote" class="block text-md font-semibold text-pb-text mb-2">Ghi chú (tùy chọn):</label>
            <textarea
              id="bookingNote"
              v-model="localBookingNote"
              rows="3"
              class="w-full p-3 border border-pb-border rounded-lg bg-pb-background focus:ring-pb-accent focus:border-pb-accent text-sm text-pb-text placeholder-pb-text-secondary"
              placeholder="Ví dụ: Xin không lấy đá cho combo nước, lấy bắp vị phô mai..."
            ></textarea>
          </div>

           <div class="border-t border-pb-border pt-4">
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm text-pb-text-secondary">Tiền ghế:</span>
              <span class="text-sm font-semibold text-pb-text">{{ formatCurrency(summary.totalPriceSeats) }}</span>
            </div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm text-pb-text-secondary">Tiền combo:</span>
              <span class="text-sm font-semibold text-pb-text">{{ formatCurrency(summary.totalPriceCombos) }}</span>
            </div>
            <div class="flex justify-between items-center mt-2">
              <span class="text-lg font-bold text-pb-text">Tổng cộng:</span>
              <span class="text-lg font-bold text-red-500 dark:text-red-400">{{ formatCurrency(summary.finalTotalPrice) }}</span>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-pb-border bg-pb-surface mt-auto z-10">
          <button
            type="button"
            @click="handleConfirmBooking"
            class="w-full px-6 py-3 bg-pb-accent text-pb-background text-base font-semibold rounded-lg shadow-md hover:bg-pb-accent/90 focus:outline-none focus:ring-2 focus:ring-pb-accent focus:ring-offset-2 dark:focus:ring-offset-pb-surface disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="!localSelectedPaymentMethod"
          >
            Xác nhận đặt vé
          </button>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
interface Props {
  open: boolean;
  summary: {
    totalPriceSeats: number;
    totalPriceCombos: number;
    finalTotalPrice: number;
  };
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (e: 'confirm', paymentMethod: 'online' | 'offline', note: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const localSelectedPaymentMethod = ref<'online' | 'offline' | null>(null);
const localBookingNote = ref('');
const showPaymentError = ref(false);

watch(() => props.open, (newVal) => {
  if (newVal) {
    // Reset khi modal mở
    localSelectedPaymentMethod.value = null;
    localBookingNote.value = '';
    showPaymentError.value = false;
  }
});

const selectPaymentMethod = (method: 'online' | 'offline') => {
  localSelectedPaymentMethod.value = method;
  showPaymentError.value = false;
};

const closeModal = () => {
  emit('update:open', false);
};

const handleConfirmBooking = () => {
  if (!localSelectedPaymentMethod.value) {
    showPaymentError.value = true;
    return;
  }
  emit('confirm', localSelectedPaymentMethod.value, localBookingNote.value);
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}
</script>

<style scoped>
</style>
