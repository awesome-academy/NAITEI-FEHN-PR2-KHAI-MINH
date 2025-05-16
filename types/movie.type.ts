export interface Rating {
  RatingCount?: number;
  RatingValue?: number;
}

export interface Image {
  url: string;
  alt: string;
}

export interface Movie {
  id: string;
  name: string;
  subname?: string;
  poster: string;
  coverImage?: string;
  releaseYear?: number;
  duration?: number;
  rating?: Rating;
  description?: string;
  releaseDate?: string | null;
  genres: string[];
  trailerUrl?: string;
  ApiFilmType?: string | null;
  review?: string;
  reviewTitle?: string;
  country?: string;
  images: Image[];
  ageRating?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
