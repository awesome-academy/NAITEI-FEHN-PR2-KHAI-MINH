<template>
    <DialogRoot :open="open" @update:open="emit('update:open', $event)">
        <DialogPortal>
            <DialogOverlay class="fixed inset-0 bg-black/70 dark:bg-black/80 z-[100]" />
            <DialogContent
                class="fixed bg-pb-background top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-[calc(100vw-2rem)] sm:w-[90vw] max-w-md max-h-[80vh] bg-pb-surface-raised p-6 shadow-2xl rounded-xl overflow-y-auto"
                style="scrollbar-width: thin; scrollbar-color: var(--color-scrollbar-thumb) var(--color-scrollbar-track);">
                <div class="flex justify-between items-center mb-6">
                    <DialogTitle class="text-xl font-semibold text-pb-text">
                        Chọn Loại Ghế Mới
                    </DialogTitle>
                    <DialogClose @click="emit('update:open', false)"
                        class="p-1.5 rounded-full text-pb-text-secondary hover:text-pb-text hover:bg-pb-surface-hover focus:outline-none focus:ring-2 focus:ring-pb-focus focus:ring-offset-2 focus:ring-offset-pb-surface-raised"
                        aria-label="Đóng">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </DialogClose>
                </div>

                <div v-if="filteredSeatTypes.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button v-for="seatType in filteredSeatTypes" :key="seatType.type" type="button"
                        @click="handleSelectType(seatType.type)"
                        class="flex flex-col items-center justify-center p-4 border rounded-lg transition-all duration-150 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pb-accent"
                        :class="[
                            'border-pb-border hover:border-pb-accent/70 bg-pb-background hover:bg-pb-surface-hover dark:bg-pb-surface dark:hover:bg-pb-surface-hover'
                        ]">
                        <span class="w-7 h-7 md:w-8 md:h-8 rounded-sm mb-2 border border-pb-border-strong"
                            :style="{ backgroundColor: seatType.color }"></span>
                        <span class="font-medium text-pb-text text-sm text-center">{{ seatType.name }}</span>
                        <!-- <span class="text-xs text-pb-text-secondary mt-0.5">{{ formatCurrency(seatType.) }}</span> -->
                    </button>
                </div>
                <div v-else class="text-center py-4 text-pb-text-secondary">
                    Không có loại ghế nào phù hợp để gán.
                </div>

                <div class="mt-8 flex justify-end">
                    <button type="button" @click="emit('update:open', false)"
                        class="px-5 py-2 text-sm font-medium rounded-md text-pb-text bg-pb-subtle-control hover:bg-pb-subtle-control-hover focus:outline-none focus:ring-2 focus:ring-pb-focus focus:ring-offset-2 focus:ring-offset-pb-surface-raised">
                        Hủy
                    </button>
                </div>
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DialogRoot, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogClose } from 'reka-ui';
import type { SeatType } from '~/types/room.type';

interface Props {
    open: boolean;
    availableSeatTypes: SeatType[];
}
const props = defineProps<Props>();
const emit = defineEmits(['update:open', 'select-type']);

const assignableSeatTypeIds = ["15", "19", "14", "11"];

const filteredSeatTypes = computed(() => {
    if (!props.availableSeatTypes) return [];
    return props.availableSeatTypes.filter(st => assignableSeatTypeIds.includes(st.type.toString()));
});

function handleSelectType(type: string) {
    emit('select-type', type);
}

function formatCurrency(value: number | undefined) {
    if (typeof value !== 'number') return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}
</script>

<style scoped>
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: var(--color-scrollbar-track, #e2e8f0);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: var(--color-scrollbar-thumb, #94a3b8);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--color-scrollbar-thumb-hover, #64748b);
}

.dark ::-webkit-scrollbar-track {
    background: var(--color-scrollbar-track-dark, #374151);
}

.dark ::-webkit-scrollbar-thumb {
    background: var(--color-scrollbar-thumb-dark, #4b5563);
}

.dark ::-webkit-scrollbar-thumb:hover {
    background: var(--color-scrollbar-thumb-hover-dark, #6b7280);
}
</style>
