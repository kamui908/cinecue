import React from 'react';
import { Linking, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useMovieDetail } from '../../src/hooks/useTMDB';
import { Images } from '../../src/api/tmdb';
import { CastList } from '../../src/components/CastList';
import { MovieCard } from '../../src/components/MovieCard';
import { Section, HorizontalList, GenreTag, StatItem, LoadingSpinner } from '../../src/components/UI';
import { useWatchlist } from '../../src/context/WatchlistContext';
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
      {/* Backdrop */}
      <Box className="relative h-[280px]">
        {movie.backdrop_path ? (
          <Image
            source={{ uri: Images.backdrop(movie.backdrop_path, 'original') }}
            className="w-full h-full"
            resizeMode="cover"
            alt="Backdrop"
          />
        ) : (
          <Box className="w-full h-full bg-background-800" />
        )}
        <Box className="absolute inset-0 bg-gradient-to-t from-background-950 via-background-950/50 to-transparent" />

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
            onPress={() =>
              isFav
                ? removeFromFavorites(movie.id, 'movie')
                : addToFavorites(
                    {
                      id: movie.id,
                      title: movie.title,
                      poster_path: movie.poster_path,
                    },
                    'movie'
                  )
            }
            className="bg-background-900/80 rounded-full p-2"
          >
            {isFav ? (
              <Icons.Heart size={20} color="#ef4444" fill="#ef4444" />
            ) : (
              <Icons.Heart size={20} color="#8c8c8c" />
            )}
          </Pressable>
          <Pressable
            onPress={() =>
              inWatchlist
                ? removeFromWatchlist(movie.id, 'movie')
                : addToWatchlist(
                    {
                      id: movie.id,
                      title: movie.title,
                      poster_path: movie.poster_path,
                    },
                    'movie'
                  )
            }
            className="bg-background-900/80 rounded-full p-2"
          >
            {inWatchlist ? (
              <Icons.Bookmark size={20} color="#22c55e" fill="#22c55e" />
            ) : (
              <Icons.Bookmark size={20} color="#8c8c8c" />
            )}
          </Pressable>
        </HStack>

        {/* Play Button */}
        {trailer && (
          <Pressable
            onPress={() =>
              Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`)
            }
            className="absolute bottom-4 left-1/2 -ml-24 bg-primary-500 rounded-full px-8 py-3 flex-row items-center gap-2"
          >
            <Icons.Play size={16} color="#ffffff" />
            <Text className="text-white text-sm font-bold">
              Watch Trailer
            </Text>
          </Pressable>
        )}
      </Box>

      {/* Content */}
      <VStack className="px-4 mt-4">
        {/* Title + Rating */}
        <HStack className="items-start justify-between">
          <VStack className="flex-1 mr-4">
            <Text className="text-typography-50 text-4xl font-bold leading-tight">
              {movie.title}
            </Text>
            {movie.tagline ? (
              <Text className="text-typography-400 text-sm italic mt-1">
                &quot;{movie.tagline}&quot;
              </Text>
            ) : null}
          </VStack>
          <Box className="bg-primary-500/20 rounded-full px-3 py-2 items-center">
            <HStack className="items-center gap-1">
              <Icons.Star size={14} color="#ef4444" />
              <Text className="text-primary-400 text-lg font-bold">
                {movie.vote_average.toFixed(1)}
              </Text>
            </HStack>
            <Text className="text-typography-400 text-2xs">
              {formatNumber(movie.vote_count)} votes
            </Text>
          </Box>
        </HStack>

        {/* Genres */}
        <HStack className="flex-wrap mt-3">
          {movie.genres.map((g) => (
            <GenreTag key={g.id} name={g.name} />
          ))}
        </HStack>

        {/* Info Row */}
        <HStack className="items-center mt-3 gap-3">
          <Text className="text-typography-400 text-sm">
            {formatDate(movie.release_date)}
          </Text>
          {movie.runtime > 0 && (
            <Text className="text-typography-400 text-sm">
              • {formatRuntime(movie.runtime)}
            </Text>
          )}
          <Text className="text-typography-400 text-sm">
            • {movie.status}
          </Text>
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

        {/* Stats */}
        <HStack className="mt-6 bg-background-800 rounded-2xl p-4 flex-wrap gap-y-4">
          {directors.length > 0 && (
            <StatItem label="Director" value={directors[0].name} className="min-w-[120px]" />
          )}
          {writers.length > 0 && (
            <StatItem label="Writer" value={writers[0].name} className="min-w-[120px]" />
          )}
          {movie.budget > 0 && (
            <StatItem label="Budget" value={formatCurrency(movie.budget)} className="min-w-[120px]" />
          )}
          {movie.revenue > 0 && (
            <StatItem label="Revenue" value={formatCurrency(movie.revenue)} className="min-w-[120px]" />
          )}
        </HStack>

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
    </ScrollView>
  );
}
