import type { Movie } from "@/types/movie.type";
import type { Cinema } from "@/types/cinema.type";
import type { Room } from "@/types/room.type";
export interface ShowTime {
  id: string;
  cinemaId: string;
  roomId: string;
  movieId: string;
  showDateTime: number;
  showTime: string;
  showTimeDuration: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShowTimeData {
  id: string;
  cinemaId: string;
  roomId: string;
  movieId: string;
  showDateTime: number;
  showDate: string;
  showTime: string;
  showTimeDuration: string;
  cinema: Cinema;
  room: Room;
  movie: Movie;
  createdAt: string;
  updatedAt: string;
}

export interface ShowTimeSelect {
  id: string;
  roomId: string;
  showDateTime: number;
  showTime: string;
  showTimeDuration: string;
}

export interface ShowTimeDataItem {
  id: string;
  cinemaId: string;
  movieId: string;
  showDate: string;
  cinema: Cinema;
  movie: Movie;
  showTimesSelect: ShowTimeSelect[];
}

export interface DateWeekDay {
  weekDay: string;
  date: string;
  showDate: string;
}
