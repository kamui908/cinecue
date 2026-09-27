import React from 'react';
import { Linking, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useMovieDetail } from '../../src/hooks/useTMDB';
import { Images } from '../../src/api/tmdb';
import { CastList } from '../../src/components/CastList';
import { MovieCard } from '../../src/components/MovieCard';
import { Section, HorizontalList, GenreTag, StatItem, LoadingSpinner } from '../../src/components/UI';
import { useWatchlist } from '../../src/context/WatchlistContext';
import { useRequireAccount } from '../../src/hooks/useRequireAccount';
import { useSettings } from '../../src/context/SettingsContext';
import { TrailerBackdrop } from '../../src/components/TrailerBackdrop';
import { formatCurrency, formatRuntime, formatDate, formatNumber } from '../../src/utils/format';
import {
  Box,
  Text,
  HStack,
  VStack,
  Pressable,
  Image,
  Badge,
  Divider,
  Center,
} from '../../src/components/ui/gluestack';
import { Icons } from '../../src/components/Icons';
import { WebFooter } from '../../src/components/WebFooter';
import { useTheme } from '../../src/theme/ThemeContext';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = Number(id);
  const { resolved } = useTheme();
  const { data: movie, isLoading } = useMovieDetail(movieId);
  const {
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  } = useWatchlist();
  const requireAccount = useRequireAccount();
  const { autoplayTrailers, settingsReady } = useSettings();

  if (isLoading) return <LoadingSpinner />;
  if (!movie) return null;

  const inWatchlist = isInWatchlist(movie.id, 'movie');
  const isFav = isFavorite(movie.id, 'movie');
  const trailer = movie.videos.results.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );
  const crew = movie.credits.crew.filter((c) =>
    ['Director', 'Screenplay', 'Writer', 'Story', 'Characters'].includes(c.job)
  );
  const directors = crew.filter((c) => c.job === 'Director');
  const writers = crew.filter((c) =>
    ['Screenplay', 'Writer', 'Story', 'Characters'].includes(c.job)
  );

  return (
    <ScrollView
      className="flex-1 bg-background-950"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Backdrop — autoplaying trailer when enabled, still otherwise */}
      <Box className="relative h-[280px]">
        <TrailerBackdrop
          backdropPath={movie.backdrop_path}
          trailerKey={trailer?.key ?? null}
          title={movie.title}
          autoplay={settingsReady && autoplayTrailers}
        />
        <Box className="absolute inset-0 bg-gradient-to-t from-background-950 via-background-950/50 to-transparent" pointerEvents="none" />

        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          className="absolute top-12 left-4 bg-background-900/80 rounded-full p-2"
        >
          <Icons.ChevronLeft size={20} color={resolved === 'dark' ? '#f5f5f5' : '#18181b'} />
        </Pressable>

        {/* Actions */}
        <HStack className="absolute top-12 right-4 gap-2">
          <Pressable
            onPress={() => {
              if (isFav) {
                removeFromFavorites(movie.id, 'movie');
                return;
              }
              if (
                !requireAccount({
                  list: 'favorites',
                  mediaType: 'movie',
                  item: {
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                  },
                })
              )
                return;
              addToFavorites(
                {
                  id: movie.id,
                  title: movie.title,
                  poster_path: movie.poster_path,
                },
                'movie'
              );
            }}
            className="bg-background-900/80 rounded-full p-2"
          >
            {isFav ? (
              <Icons.Heart size={20} color="#ef4444" fill="#ef4444" />
            ) : (
              <Icons.Heart size={20} color="#8c8c8c" />
            )}
          </Pressable>
          <Pressable
            onPress={() => {
              if (inWatchlist) {
                removeFromWatchlist(movie.id, 'movie');
                return;
              }
              if (
                !requireAccount({
                  list: 'watchlist',
                  mediaType: 'movie',
                  item: {
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                  },
                })
              )
                return;
              addToWatchlist(
                {
                  id: movie.id,
                  title: movie.title,
                  poster_path: movie.poster_path,
                },
                'movie'
              );
            }}
            className="bg-background-900/80 rounded-full p-2"
          >
            {inWatchlist ? (
              <Icons.Bookmark size={20} color="#22c55e" fill="#22c55e" />
            ) : (
              <Icons.Bookmark size={20} color="#8c8c8c" />
            )}
          </Pressable>
        </HStack>

      </Box>

      {/* Content */}
      <VStack className="px-4">
        {/* Poster + Title/Rating/Genres header:
            mobile = poster centered on top, desktop (md:) = poster left beside title→genres */}
        <Box className="flex flex-col md:flex-row w-full gap-5 items-center md:items-end -mt-24">
          {/* Vertical poster */}
          <Box className="w-[160px] h-[240px] md:w-[200px] md:h-[300px] rounded-2xl overflow-hidden border border-background-700 bg-background-800 shrink-0 shadow-lg">
            {movie.poster_path ? (
              <Image
                source={{ uri: Images.poster(movie.poster_path, 'w500') }}
                className="w-full h-full"
                resizeMode="cover"
                alt={movie.title}
              />
            ) : (
              <Center className="w-full h-full bg-background-700">
                <Text className="text-typography-400 text-xs">No Poster</Text>
              </Center>
            )}
          </Box>

          <VStack className="flex-1 w-full items-center md:items-start">
            {/* Title */}
            <VStack className="items-center md:items-start w-full">
              <Text className="text-typography-50 text-2xl md:text-4xl font-bold leading-tight text-center md:text-left">
                {movie.title}
              </Text>
              {movie.tagline ? (
                <Text className="text-typography-400 text-sm italic mt-1 text-center md:text-left">
                  &quot;{movie.tagline}&quot;
                </Text>
              ) : null}
            </VStack>

            {/* Rating — redesigned, left aligned */}
            <VStack className="mt-4 self-center md:self-start w-full max-w-[360px] bg-background-800 rounded-2xl p-4 border border-warning-500/25">
          <HStack className="items-center gap-3">
            <Center className="w-14 h-14 rounded-full bg-warning-500/20 border border-warning-500/40">
              <Icons.Star size={26} color="#fbbf24" fill="#fbbf24" />
            </Center>
            <VStack className="flex-1">
              <HStack className="items-baseline gap-1">
                <Text className="text-typography-50 text-3xl font-bold">
                  {movie.vote_average.toFixed(1)}
                </Text>
                <Text className="text-typography-400 text-sm font-semibold">/ 10</Text>
              </HStack>
              <HStack className="items-center gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const filled = i < Math.round(movie.vote_average / 2);
                  return (
                    <Icons.Star
                      key={i}
                      size={14}
                      color={filled ? '#fbbf24' : '#52525b'}
                      fill={filled ? '#fbbf24' : 'transparent'}
                    />
                  );
                })}
              </HStack>
            </VStack>
            <VStack className="items-end">
              <Box className="bg-warning-500 rounded-full px-2.5 py-1">
                <Text className="text-white text-2xs font-bold">
                  {movie.vote_average >= 7.5
                    ? 'Excellent'
                    : movie.vote_average >= 5
                      ? 'Good'
                      : movie.vote_average > 0
                        ? 'Mixed'
                        : 'Unrated'}
                </Text>
              </Box>
              <Text className="text-typography-400 text-2xs mt-1.5">
                TMDB score
              </Text>
            </VStack>
          </HStack>

          {/* Progress bar */}
          <Box className="h-2 rounded-full bg-background-700 overflow-hidden mt-3">
            <Box
              className="h-2 rounded-full bg-warning-500"
              style={{ width: `${Math.min(100, (movie.vote_average / 10) * 100)}%` }}
            />
          </Box>

          <HStack className="items-center justify-between mt-2.5">
            <HStack className="items-center gap-1.5">
              <Icons.Users size={13} color="#a1a1aa" />
              <Text className="text-typography-300 text-xs font-semibold">
                {formatNumber(movie.vote_count)} votes
              </Text>
            </HStack>
            <HStack className="items-center gap-1.5">
              <Icons.TrendingUp size={13} color="#a1a1aa" />
              <Text className="text-typography-400 text-xs">
                {movie.popularity != null ? formatNumber(Math.round(movie.popularity)) : '—'} popularity
              </Text>
            </HStack>
          </HStack>
        </VStack>

            {/* Genres */}
            <HStack className="flex-wrap justify-center md:justify-start mt-4">
              {movie.genres.map((g) => (
                <GenreTag key={g.id} name={g.name} />
              ))}
            </HStack>
          </VStack>
        </Box>

        {/* Info cards — Release date / Duration / Status */}
        <HStack className="mt-4 gap-2.5">
          <Box className="flex-1 bg-info-500/10 border border-info-500/25 rounded-2xl p-3">
            <Center className="w-9 h-9 rounded-full bg-info-500/20 mb-2 self-start">
              <Icons.Calendar size={16} color="#22d3ee" />
            </Center>
            <Text className="text-info-500 text-2xs font-bold uppercase tracking-widest">
              Release
            </Text>
            <Text className="text-typography-50 text-sm font-bold mt-0.5" numberOfLines={1}>
              {formatDate(movie.release_date)}
            </Text>
            <Text className="text-typography-400 text-2xs mt-0.5">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
            </Text>
          </Box>

          <Box className="flex-1 bg-success-500/10 border border-success-500/25 rounded-2xl p-3">
            <Center className="w-9 h-9 rounded-full bg-success-500/20 mb-2 self-start">
              <Icons.Clock size={16} color="#22c55e" />
            </Center>
            <Text className="text-success-500 text-2xs font-bold uppercase tracking-widest">
              Duration
            </Text>
            <Text className="text-typography-50 text-sm font-bold mt-0.5" numberOfLines={1}>
              {movie.runtime > 0 ? formatRuntime(movie.runtime) : '—'}
            </Text>
            <Text className="text-typography-400 text-2xs mt-0.5">
              {movie.runtime > 0 ? `${movie.runtime} min` : 'TBA'}
            </Text>
          </Box>

          <Box className="flex-1 bg-primary-500/10 border border-primary-500/25 rounded-2xl p-3">
            <Center className="w-9 h-9 rounded-full bg-primary-500/20 mb-2 self-start">
              <Icons.Info size={16} color="#ef4444" />
            </Center>
            <Text className="text-primary-500 text-2xs font-bold uppercase tracking-widest">
              Status
            </Text>
            <HStack className="items-center gap-1.5 mt-1">
              <Box
                className={`w-2 h-2 rounded-full ${
                  movie.status === 'Released' ? 'bg-success-500' : 'bg-warning-500'
                }`}
              />
              <Text className="text-typography-50 text-sm font-bold" numberOfLines={1}>
                {movie.status || '—'}
              </Text>
            </HStack>
            <Text className="text-typography-400 text-2xs mt-0.5" numberOfLines={1}>
              {movie.adult ? '18+ Adult' : 'All audiences'}
            </Text>
          </Box>
        </HStack>

        {/* Overview */}
        {movie.overview ? (
          <VStack className="mt-4">
            <Text className="text-typography-50 text-base font-bold mb-2">
              Overview
            </Text>
            <Text className="text-typography-300 text-sm">
              {movie.overview}
            </Text>
          </VStack>
        ) : null}

        {/* Stats — 2-col grid on mobile, 4-col on desktop */}
        <HStack className="mt-6 bg-background-800 rounded-2xl p-2 flex-wrap">
          {directors.length > 0 && (
            <StatItem label="Director" value={directors[0].name} />
          )}
          {writers.length > 0 && (
            <StatItem label="Writer" value={writers[0].name} />
          )}
          {movie.budget > 0 && (
            <StatItem label="Budget" value={formatCurrency(movie.budget)} />
          )}
          {movie.revenue > 0 && (
            <StatItem label="Revenue" value={formatCurrency(movie.revenue)} />
          )}
        </HStack>

        {/* Details — other basic info from the API */}
        <VStack className="mt-4 bg-background-800 rounded-2xl p-4 gap-0">
          <Text className="text-typography-50 text-base font-bold mb-1">
            Details
          </Text>

          <HStack className="items-start justify-between py-2.5">
            <Text className="text-typography-400 text-xs flex-1">Original Title</Text>
            <Text className="text-typography-50 text-xs font-semibold flex-1 text-right" numberOfLines={2}>
              {movie.original_title || '—'}
            </Text>
          </HStack>
          <Divider className="bg-background-700" />

          <HStack className="items-center justify-between py-2.5">
            <Text className="text-typography-400 text-xs">Original Language</Text>
            <Box className="bg-background-700 rounded-full px-2.5 py-1">
              <Text className="text-typography-50 text-2xs font-bold">
                {(movie.original_language || '—').toUpperCase()}
              </Text>
            </Box>
          </HStack>
          <Divider className="bg-background-700" />

          <HStack className="items-start justify-between py-2.5">
            <Text className="text-typography-400 text-xs flex-1">Spoken Languages</Text>
            <Text className="text-typography-50 text-xs font-semibold flex-1 text-right" numberOfLines={2}>
              {movie.spoken_languages?.length
                ? movie.spoken_languages.map((l) => l.english_name).join(', ')
                : '—'}
            </Text>
          </HStack>
          <Divider className="bg-background-700" />

          <HStack className="items-start justify-between py-2.5">
            <Text className="text-typography-400 text-xs flex-1">Production Countries</Text>
            <Text className="text-typography-50 text-xs font-semibold flex-1 text-right" numberOfLines={2}>
              {(movie as any).production_countries?.length
                ? (movie as any).production_countries.map((c: any) => c.name).join(', ')
                : '—'}
            </Text>
          </HStack>
          <Divider className="bg-background-700" />

          <HStack className="items-center justify-between py-2.5">
            <Text className="text-typography-400 text-xs">Origin Country</Text>
            <Text className="text-typography-50 text-xs font-semibold text-right">
              {(movie as any).origin_country?.length
                ? (movie as any).origin_country.join(', ')
                : '—'}
            </Text>
          </HStack>
          <Divider className="bg-background-700" />

          <HStack className="items-center justify-between py-2.5">
            <Text className="text-typography-400 text-xs">Popularity</Text>
            <HStack className="items-center gap-1.5">
              <Icons.TrendingUp size={13} color="#22d3ee" />
              <Text className="text-typography-50 text-xs font-semibold">
                {(movie as any).popularity != null ? Number((movie as any).popularity).toFixed(1) : '—'}
              </Text>
            </HStack>
          </HStack>
          <Divider className="bg-background-700" />

          <HStack className="items-center justify-between py-2.5">
            <Text className="text-typography-400 text-xs">Adult</Text>
            <Box
              className={`rounded-full px-2.5 py-1 ${
                (movie as any).adult ? 'bg-error-500/20' : 'bg-success-500/20'
              }`}
            >
              <Text
                className={`text-2xs font-bold ${
                  (movie as any).adult ? 'text-error-500' : 'text-success-500'
                }`}
              >
                {(movie as any).adult ? '18+ Yes' : 'No'}
              </Text>
            </Box>
          </HStack>
          <Divider className="bg-background-700" />

          {movie.belongs_to_collection && (
            <>
              <HStack className="items-start justify-between py-2.5">
                <Text className="text-typography-400 text-xs flex-1">Collection</Text>
                <Text className="text-typography-50 text-xs font-semibold flex-1 text-right" numberOfLines={2}>
                  {movie.belongs_to_collection.name}
                </Text>
              </HStack>
              <Divider className="bg-background-700" />
            </>
          )}

          <HStack className="items-center justify-between py-2.5">
            <Text className="text-typography-400 text-xs">IMDb ID</Text>
            {(movie as any).imdb_id ? (
              <Pressable
                onPress={() =>
                  Linking.openURL(`https://www.imdb.com/title/${(movie as any).imdb_id}`)
                }
                className="flex-row items-center gap-1"
              >
                <Text className="text-warning-500 text-xs font-semibold">
                  {(movie as any).imdb_id}
                </Text>
                <Icons.ExternalLink size={12} color="#f59e0b" />
              </Pressable>
            ) : (
              <Text className="text-typography-50 text-xs font-semibold">—</Text>
            )}
          </HStack>

          {(movie as any).homepage ? (
            <>
              <Divider className="bg-background-700" />
              <Pressable
                onPress={() => Linking.openURL((movie as any).homepage)}
                className="mt-3 bg-info-500/15 border border-info-500/30 rounded-xl px-4 py-3 flex-row items-center justify-center gap-2"
              >
                <Icons.ExternalLink size={14} color="#22d3ee" />
                <Text className="text-info-500 text-sm font-bold">Visit Homepage</Text>
              </Pressable>
            </>
          ) : null}
        </VStack>

        {/* Cast */}
        {movie.credits.cast.length > 0 && (
          <Box className="mt-6">
            <CastList cast={movie.credits.cast} />
          </Box>
        )}

        {/* Production Companies */}
        {movie.production_companies.length > 0 && (
          <VStack className="mt-6">
            <Text className="text-typography-50 text-lg font-bold mb-3">
              Production
            </Text>
            <HStack className="flex-wrap gap-3">
              {movie.production_companies.map((c) => (
                <Box
                  key={c.id}
                  className="bg-background-800 rounded-xl px-4 py-3 items-center"
                >
                  {c.logo_path ? (
                    <Image
                      source={{ uri: Images.logo(c.logo_path) }}
                      className="w-16 h-8 mb-1"
                      resizeMode="contain"
                      alt={c.name}
                    />
                  ) : (
                    <Text
                      className="text-typography-50 text-xs font-semibold text-center"
                      numberOfLines={2}
                    >
                      {c.name}
                    </Text>
                  )}
                </Box>
              ))}
            </HStack>
          </VStack>
        )}

        {/* Similar Movies */}
        {movie.similar.results.length > 0 && (
          <Section title="Similar Movies">
            <HorizontalList>
              {movie.similar.results.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </HorizontalList>
          </Section>
        )}

        {/* Recommendations */}
        {movie.recommendations.results.length > 0 && (
          <Section title="Recommended">
            <HorizontalList>
              {movie.recommendations.results.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </HorizontalList>
          </Section>
        )}
      </VStack>
      <WebFooter />
    </ScrollView>
  );
}
