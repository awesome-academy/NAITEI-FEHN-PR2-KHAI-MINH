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

export function formatDatetime(datetime: string): string {
  const [datePart] = datetime.split(" ");
  const [year, month, day] = datePart.split("-");
  return `${Number(day)}/${month}/${year}`;
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

const USER_KEY = "user";

export const setUserStorage = (user: object, rememberMe = true) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("user-storage-updated"));
};

export const removeUserStorage = () => {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("user-storage-updated"));
};

export const getUserStorage = () => {
  try {
    const raw =
      localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Lỗi khi parse user từ storage:", e);
    return null;
  }
};

export const useCurrentUser = () => {
  const user = ref(getUserStorage());

  const updateUser = () => {
    user.value = getUserStorage();
  };

  if (process.client) {
    window.addEventListener("storage", (e) => {
      if (e.key === USER_KEY) updateUser();
    });

    window.addEventListener("user-storage-updated", updateUser);
  }

  return user;
};
