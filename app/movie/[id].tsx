import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useMovieDetail } from '../../src/hooks/useTMDB';
import { Images } from '../../src/api/tmdb';
import { CastList } from '../../src/components/CastList';
import { MovieCard } from '../../src/components/MovieCard';
import { Section, HorizontalList, GenreTag, StatItem, LoadingSpinner } from '../../src/components/UI';
import { useWatchlist } from '../../src/context/WatchlistContext';
import { formatCurrency, formatRuntime, formatDate, formatNumber } from '../../src/utils/format';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = Number(id);
  const { data: movie, isLoading } = useMovieDetail(movieId);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, addToFavorites, removeFromFavorites, isFavorite } = useWatchlist();
  const insets = useSafeAreaInsets();

  if (isLoading) return <LoadingSpinner />;
  if (!movie) return null;

  const inWatchlist = isInWatchlist(movie.id, 'movie');
  const isFav = isFavorite(movie.id, 'movie');
  const trailer = movie.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const crew = movie.credits.crew.filter(c => ['Director', 'Screenplay', 'Writer', 'Story', 'Characters'].includes(c.job));
  const directors = crew.filter(c => c.job === 'Director');
  const writers = crew.filter(c => ['Screenplay', 'Writer', 'Story', 'Characters'].includes(c.job));

  return (
    <ScrollView
      className="flex-1 bg-dark-950"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Backdrop */}
      <View className="relative" style={{ height: 280 }}>
        {movie.backdrop_path ? (
          <Image
            source={{ uri: Images.backdrop(movie.backdrop_path, 'original') }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-dark-800" />
        )}
        <View className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent" />

        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-12 left-4 bg-dark-900/80 rounded-full p-2"
        >
          <Text className="text-white text-lg">←</Text>
        </TouchableOpacity>

        {/* Actions */}
        <View className="absolute top-12 right-4 flex-row gap-2">
          <TouchableOpacity
            onPress={() => isFav ? removeFromFavorites(movie.id, 'movie') : addToFavorites({ id: movie.id, title: movie.title, poster_path: movie.poster_path }, 'movie')}
            className="bg-dark-900/80 rounded-full p-2"
          >
            <Text className="text-lg">{isFav ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => inWatchlist ? removeFromWatchlist(movie.id, 'movie') : addToWatchlist({ id: movie.id, title: movie.title, poster_path: movie.poster_path }, 'movie')}
            className="bg-dark-900/80 rounded-full p-2"
          >
            <Text className="text-lg">{inWatchlist ? '✅' : '➕'}</Text>
          </TouchableOpacity>
        </View>

        {/* Play Button */}
        {trailer && (
          <TouchableOpacity
            onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`)}
            className="absolute bottom-4 left-1/2 -ml-12 bg-primary-500 rounded-full px-8 py-3 flex-row items-center gap-2"
          >
            <Text className="text-white text-sm font-bold">▶ Watch Trailer</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <View className="px-4 mt-4">
        {/* Title + Rating */}
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-4">
            <Text className="text-white text-2xl font-bold">{movie.title}</Text>
            {movie.tagline ? (
              <Text className="text-dark-400 text-sm italic mt-1">"{movie.tagline}"</Text>
            ) : null}
          </View>
          <View className="bg-primary-500/20 rounded-full px-3 py-2 items-center">
            <Text className="text-primary-400 text-lg font-bold">★ {movie.vote_average.toFixed(1)}</Text>
            <Text className="text-dark-400 text-[10px]">{formatNumber(movie.vote_count)} votes</Text>
          </View>
        </View>

        {/* Genres */}
        <View className="flex-row flex-wrap mt-3">
          {movie.genres.map(g => (
            <GenreTag key={g.id} name={g.name} />
          ))}
        </View>

        {/* Info Row */}
        <View className="flex-row items-center mt-3 gap-3">
          <Text className="text-dark-400 text-sm">
            {formatDate(movie.release_date)}
          </Text>
          {movie.runtime > 0 && (
            <Text className="text-dark-400 text-sm">• {formatRuntime(movie.runtime)}</Text>
          )}
          <Text className="text-dark-400 text-sm">• {movie.status}</Text>
        </View>

        {/* Overview */}
        {movie.overview ? (
          <View className="mt-4">
            <Text className="text-white text-base font-bold mb-2">Overview</Text>
            <Text className="text-dark-300 text-sm leading-5">{movie.overview}</Text>
          </View>
        ) : null}

        {/* Stats */}
        <View className="flex-row mt-6 bg-dark-800 rounded-2xl p-4">
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
        </View>

        {/* Cast */}
        {movie.credits.cast.length > 0 && (
          <View className="mt-6">
            <CastList cast={movie.credits.cast} />
          </View>
        )}

        {/* Production Companies */}
        {movie.production_companies.length > 0 && (
          <View className="mt-6">
            <Text className="text-white text-lg font-bold mb-3">Production</Text>
            <View className="flex-row flex-wrap gap-3">
              {movie.production_companies.map(c => (
                <View key={c.id} className="bg-dark-800 rounded-xl px-4 py-3 items-center">
                  {c.logo_path ? (
                    <Image
                      source={{ uri: Images.logo(c.logo_path) }}
                      className="w-16 h-8 mb-1"
                      resizeMode="contain"
                    />
                  ) : (
                    <Text className="text-white text-xs font-semibold text-center" numberOfLines={2}>
                      {c.name}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Similar Movies */}
        {movie.similar.results.length > 0 && (
          <Section title="Similar Movies">
            <HorizontalList>
              {movie.similar.results.map(m => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </HorizontalList>
          </Section>
        )}

        {/* Recommendations */}
        {movie.recommendations.results.length > 0 && (
          <Section title="Recommended">
            <HorizontalList>
              {movie.recommendations.results.map(m => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </HorizontalList>
          </Section>
        )}
      </View>
    </ScrollView>
  );
}
