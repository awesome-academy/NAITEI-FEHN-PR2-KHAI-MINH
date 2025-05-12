// import { type ClassValue, clsx } from 'clsx'
// import { twMerge } from 'tailwind-merge'

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day: string = date.getDate().toString().padStart(2, "0");
  const month: string = (date.getMonth() + 1).toString().padStart(2, "0");
  const year: number = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getWeekday(dateString: string): string {
  const weekdays: string[] = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];
  const date = new Date(dateString);
  return weekdays[date.getDay()];
}

export function formatDuration(minutes: number | undefined): string {
  if (minutes === undefined || minutes === null || minutes <= 0) {
    return "N/A";
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) {
    return `${h}h ${m > 0 ? `${m}m` : ""}`.trim();
  }
  return `${m}m`;
}
