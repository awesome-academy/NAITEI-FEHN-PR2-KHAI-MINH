import type { User } from "@/types/user.type";
import type { Movie } from "@/types/movie.type";

export interface Comment {
  id: string;
  movieId: string;
  userId: string;
  username: string;
  email: string;
  content: string;
  images: string[];
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CommentData {
  id: string;
  movieId: string;
  userId: string;
  username: string;
  email: string;
  content: string;
  images: string[];
  keywords: string[];
  user: User;
  movie: Movie;
  createdAt: string;
  updatedAt: string;
}
