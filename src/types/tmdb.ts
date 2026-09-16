export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
  media_type?: string;
}

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  original_language: string;
  media_type?: string;
}

export interface MovieDetail {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  genres: Genre[];
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  production_companies: ProductionCompany[];
  spoken_languages: SpokenLanguage[];
  belongs_to_collection: Collection | null;
  credits: Credits;
  videos: VideoResponse;
  similar: MovieResponse;
  recommendations: MovieResponse;
  images: ImageResponse;
}

export interface TVDetail {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  episode_run_time: number[];
  genres: Genre[];
  tagline: string;
  status: string;
  number_of_seasons: number;
  number_of_episodes: number;
  created_by: Creator[];
  seasons: Season[];
  production_companies: ProductionCompany[];
  spoken_languages: SpokenLanguage[];
  credits: Credits;
  videos: VideoResponse;
  similar: TVResponse;
  recommendations: TVResponse;
  images: ImageResponse;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Person {
  id: number;
  name: string;
  original_name: string;
  known_for_department: string;
  profile_path: string | null;
  popularity: number;
  known_for: (Movie | TVShow)[];
  gender: number;
}

export interface PersonDetail {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  popularity: number;
  known_for_department: string;
  also_known_as: string[];
  imdb_id: string | null;
  combined_credits: {
    cast: (MovieCast | TVCast)[];
    crew: (MovieCrew | TVCrew)[];
  };
  images: ImageResponse;
}

export interface MovieCast {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  character: string;
  genre_ids: number[];
  media_type: string;
  order: number;
}

export interface TVCast {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  character: string;
  genre_ids: number[];
  media_type: string;
  order: number;
}

export interface MovieCrew {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  job: string;
  department: string;
  genre_ids: number[];
  media_type: string;
}

export interface TVCrew {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  job: string;
  department: string;
  genre_ids: number[];
  media_type: string;
}

export interface Credits {
  cast: Cast[];
  crew: Crew[];
}

export interface Cast {
  id: number;
  name: string;
  profile_path: string | null;
  character: string;
  order: number;
  known_for_department: string;
}

export interface Crew {
  id: number;
  name: string;
  profile_path: string | null;
  job: string;
  department: string;
  known_for_department: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Collection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface Creator {
  id: number;
  name: string;
  profile_path: string | null;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_count: number;
  air_date: string;
  poster_path: string | null;
}

export interface VideoResponse {
  results: Video[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface ImageResponse {
  backdrops: Image[];
  posters: Image[];
  profiles: Image[];
}

export interface Image {
  aspect_ratio: number;
  file_path: string;
  height: number;
  width: number;
  vote_average: number;
  vote_count: number;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface TVResponse {
  page: number;
  results: TVShow[];
  total_pages: number;
  total_results: number;
}

export interface PersonResponse {
  page: number;
  results: Person[];
  total_pages: number;
  total_results: number;
}

export interface SearchMultiResponse {
  page: number;
  results: (Movie | TVShow | Person)[];
  total_pages: number;
  total_results: number;
}

export interface GenreResponse {
  genres: Genre[];
}
