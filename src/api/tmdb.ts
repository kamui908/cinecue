import { MovieResponse, TVResponse, PersonResponse, SearchMultiResponse, MovieDetail, TVDetail, PersonDetail, GenreResponse } from '../types/tmdb';

const API_KEY = '2dca580c2a14b55200e784d157207b4d';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

export const Images = {
  poster: (path: string, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500') =>
    `${IMG_BASE}/${size}${path}`,
  backdrop: (path: string, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280') =>
    `${IMG_BASE}/${size}${path}`,
  profile: (path: string, size: 'w45' | 'w185' | 'h632' | 'original' = 'w185') =>
    `${IMG_BASE}/${size}${path}`,
  logo: (path: string, size: 'w45' | 'w92' | 'w154' | 'w185' | 'h632' | 'original' = 'w154') =>
    `${IMG_BASE}/${size}${path}`,
  backdropBlurhash: (path: string) => `${IMG_BASE}/w300${path}`,
};

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const searchParams = new URLSearchParams({
    api_key: API_KEY,
    language: 'en-US',
    ...params,
  });
  const url = `${BASE_URL}${endpoint}?${searchParams.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }
  return response.json();
}

// Movies
export const getTrendingMovies = (timeWindow: 'day' | 'week' = 'week') =>
  fetchTMDB<MovieResponse>(`/trending/movie/${timeWindow}`);

export const getPopularMovies = (page = 1) =>
  fetchTMDB<MovieResponse>('/movie/popular', { page: String(page) });

export const getNowPlayingMovies = (page = 1) =>
  fetchTMDB<MovieResponse>('/movie/now_playing', { page: String(page) });

export const getTopRatedMovies = (page = 1) =>
  fetchTMDB<MovieResponse>('/movie/top_rated', { page: String(page) });

export const getUpcomingMovies = (page = 1) =>
  fetchTMDB<MovieResponse>('/movie/upcoming', { page: String(page) });

export const getMovieDetail = (id: number) =>
  fetchTMDB<MovieDetail>(`/movie/${id}`, { append_to_response: 'credits,videos,similar,recommendations,images' });

// TV Shows
export const getTrendingTV = (timeWindow: 'day' | 'week' = 'week') =>
  fetchTMDB<TVResponse>(`/trending/tv/${timeWindow}`);

export const getPopularTV = (page = 1) =>
  fetchTMDB<TVResponse>('/tv/popular', { page: String(page) });

export const getAiringTodayTV = (page = 1) =>
  fetchTMDB<TVResponse>('/tv/airing_today', { page: String(page) });

export const getTopRatedTV = (page = 1) =>
  fetchTMDB<TVResponse>('/tv/top_rated', { page: String(page) });

export const getOnTheAirTV = (page = 1) =>
  fetchTMDB<TVResponse>('/tv/on_the_air', { page: String(page) });

export const getTVDetail = (id: number) =>
  fetchTMDB<TVDetail>(`/tv/${id}`, { append_to_response: 'credits,videos,similar,recommendations,images' });

// People
export const getTrendingPeople = (timeWindow: 'day' | 'week' = 'week') =>
  fetchTMDB<PersonResponse>(`/trending/person/${timeWindow}`);

export const getPopularPeople = (page = 1) =>
  fetchTMDB<PersonResponse>('/person/popular', { page: String(page) });

export const getPersonDetail = (id: number) =>
  fetchTMDB<PersonDetail>(`/person/${id}`, { append_to_response: 'combined_credits,images' });

// Search
export const searchMulti = (query: string, page = 1) =>
  fetchTMDB<SearchMultiResponse>('/search/multi', { query, page: String(page) });

export const searchMovies = (query: string, page = 1) =>
  fetchTMDB<MovieResponse>('/search/movie', { query, page: String(page) });

export const searchTV = (query: string, page = 1) =>
  fetchTMDB<TVResponse>('/search/tv', { query, page: String(page) });

export const searchPeople = (query: string, page = 1) =>
  fetchTMDB<PersonResponse>('/search/person', { query, page: String(page) });

// Genres
export const getMovieGenres = () =>
  fetchTMDB<GenreResponse>('/genre/movie/list');

export const getTVGenres = () =>
  fetchTMDB<GenreResponse>('/genre/tv/list');

// Discover
export const discoverMovies = (params: Record<string, string> = {}) =>
  fetchTMDB<MovieResponse>('/discover/movie', { sort_by: 'popularity.desc', ...params });

export const discoverTV = (params: Record<string, string> = {}) =>
  fetchTMDB<TVResponse>('/discover/tv', { sort_by: 'popularity.desc', ...params });

// Lists
export const getMovieWatchProviders = (id: number) =>
  fetchTMDB<{ results: Record<string, { flatrate?: { provider_id: number; provider_name: string }[]; rent?: { provider_id: number; provider_name: string }[]; buy?: { provider_id: number; provider_name: string }[] }> }>(`/movie/${id}/watch/providers`);
