import { useQuery } from '@tanstack/react-query';
import * as tmdb from '../api/tmdb';

export function useTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
  return useQuery({
    queryKey: ['trending', 'movie', timeWindow],
    queryFn: () => tmdb.getTrendingMovies(timeWindow),
  });
}

export function usePopularMovies(page = 1) {
  return useQuery({
    queryKey: ['popular', 'movie', page],
    queryFn: () => tmdb.getPopularMovies(page),
  });
}

export function useNowPlayingMovies(page = 1) {
  return useQuery({
    queryKey: ['nowPlaying', 'movie', page],
    queryFn: () => tmdb.getNowPlayingMovies(page),
  });
}

export function useTopRatedMovies(page = 1) {
  return useQuery({
    queryKey: ['topRated', 'movie', page],
    queryFn: () => tmdb.getTopRatedMovies(page),
  });
}

export function useUpcomingMovies(page = 1) {
  return useQuery({
    queryKey: ['upcoming', 'movie', page],
    queryFn: () => tmdb.getUpcomingMovies(page),
  });
}

export function useMovieDetail(id: number) {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => tmdb.getMovieDetail(id),
    enabled: !!id,
  });
}

export function useTrendingTV(timeWindow: 'day' | 'week' = 'week') {
  return useQuery({
    queryKey: ['trending', 'tv', timeWindow],
    queryFn: () => tmdb.getTrendingTV(timeWindow),
  });
}

export function usePopularTV(page = 1) {
  return useQuery({
    queryKey: ['popular', 'tv', page],
    queryFn: () => tmdb.getPopularTV(page),
  });
}

export function useAiringTodayTV(page = 1) {
  return useQuery({
    queryKey: ['airingToday', 'tv', page],
    queryFn: () => tmdb.getAiringTodayTV(page),
  });
}

export function useTopRatedTV(page = 1) {
  return useQuery({
    queryKey: ['topRated', 'tv', page],
    queryFn: () => tmdb.getTopRatedTV(page),
  });
}

export function useOnTheAirTV(page = 1) {
  return useQuery({
    queryKey: ['onTheAir', 'tv', page],
    queryFn: () => tmdb.getOnTheAirTV(page),
  });
}

export function useTVDetail(id: number) {
  return useQuery({
    queryKey: ['tv', id],
    queryFn: () => tmdb.getTVDetail(id),
    enabled: !!id,
  });
}

export function useTrendingPeople(timeWindow: 'day' | 'week' = 'week') {
  return useQuery({
    queryKey: ['trending', 'person', timeWindow],
    queryFn: () => tmdb.getTrendingPeople(timeWindow),
  });
}

export function usePopularPeople(page = 1) {
  return useQuery({
    queryKey: ['popular', 'person', page],
    queryFn: () => tmdb.getPopularPeople(page),
  });
}

export function usePersonDetail(id: number) {
  return useQuery({
    queryKey: ['person', id],
    queryFn: () => tmdb.getPersonDetail(id),
    enabled: !!id,
  });
}

export function useSearchMulti(query: string, page = 1) {
  return useQuery({
    queryKey: ['search', 'multi', query, page],
    queryFn: () => tmdb.searchMulti(query, page),
    enabled: query.length > 0,
  });
}

export function useSearchMovies(query: string, page = 1) {
  return useQuery({
    queryKey: ['search', 'movie', query, page],
    queryFn: () => tmdb.searchMovies(query, page),
    enabled: query.length > 0,
  });
}

export function useSearchTV(query: string, page = 1) {
  return useQuery({
    queryKey: ['search', 'tv', query, page],
    queryFn: () => tmdb.searchTV(query, page),
    enabled: query.length > 0,
  });
}

export function useMovieGenres() {
  return useQuery({
    queryKey: ['genres', 'movie'],
    queryFn: () => tmdb.getMovieGenres(),
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useTVGenres() {
  return useQuery({
    queryKey: ['genres', 'tv'],
    queryFn: () => tmdb.getTVGenres(),
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useDiscoverMovies(params: Record<string, string> = {}) {
  return useQuery({
    queryKey: ['discover', 'movie', params],
    queryFn: () => tmdb.discoverMovies(params),
  });
}

export function useDiscoverTV(params: Record<string, string> = {}) {
  return useQuery({
    queryKey: ['discover', 'tv', params],
    queryFn: () => tmdb.discoverTV(params),
  });
}

export function useTrendingAll(timeWindow: 'day' | 'week' = 'week') {
  return useQuery({
    queryKey: ['trending', 'all', timeWindow],
    queryFn: () => tmdb.getTrendingAll(timeWindow),
  });
}

export function useTopRatedByGenre(mediaType: 'movie' | 'tv', genreId: number | null) {
  return useQuery({
    queryKey: ['topRatedByGenre', mediaType, genreId],
    queryFn: async () => {
      const params = {
        with_genres: String(genreId),
        sort_by: 'vote_average.desc',
        'vote_count.gte': '100',
      };
      const res = mediaType === 'movie' ? await tmdb.discoverMovies(params) : await tmdb.discoverTV(params);
      return res as { results: any[] };
    },
    enabled: genreId != null,
  });
}
