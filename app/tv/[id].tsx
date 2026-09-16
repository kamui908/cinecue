import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTVDetail } from '../../src/hooks/useTMDB';
import { Images } from '../../src/api/tmdb';
import { CastList } from '../../src/components/CastList';
import { TVCard } from '../../src/components/TVCard';
import { Section, HorizontalList, GenreTag, StatItem, LoadingSpinner } from '../../src/components/UI';
import { useWatchlist } from '../../src/context/WatchlistContext';
import { formatDate, formatNumber, formatRuntime } from '../../src/utils/format';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TVDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tvId = Number(id);
  const { data: show, isLoading } = useTVDetail(tvId);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, addToFavorites, removeFromFavorites, isFavorite } = useWatchlist();
  const insets = useSafeAreaInsets();

  if (isLoading) return <LoadingSpinner />;
  if (!show) return null;

  const inWatchlist = isInWatchlist(show.id, 'tv');
  const isFav = isFavorite(show.id, 'tv');
  const trailer = show.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const crew = show.credits.crew.filter(c => ['Executive Producer', 'Producer', 'Creator'].includes(c.job));
  const creators = show.created_by || [];

  return (
    <ScrollView
      className="flex-1 bg-dark-950"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Backdrop */}
      <View className="relative" style={{ height: 280 }}>
        {show.backdrop_path ? (
          <Image
            source={{ uri: Images.backdrop(show.backdrop_path, 'original') }}
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
            onPress={() => isFav ? removeFromFavorites(show.id, 'tv') : addToFavorites({ id: show.id, name: show.name, poster_path: show.poster_path }, 'tv')}
            className="bg-dark-900/80 rounded-full p-2"
          >
            <Text className="text-lg">{isFav ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => inWatchlist ? removeFromWatchlist(show.id, 'tv') : addToWatchlist({ id: show.id, name: show.name, poster_path: show.poster_path }, 'tv')}
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
            <Text className="text-white text-2xl font-bold">{show.name}</Text>
            {show.tagline ? (
              <Text className="text-dark-400 text-sm italic mt-1">"{show.tagline}"</Text>
            ) : null}
          </View>
          <View className="bg-primary-500/20 rounded-full px-3 py-2 items-center">
            <Text className="text-primary-400 text-lg font-bold">★ {show.vote_average.toFixed(1)}</Text>
            <Text className="text-dark-400 text-[10px]">{formatNumber(show.vote_count)} votes</Text>
          </View>
        </View>

        {/* Genres */}
        <View className="flex-row flex-wrap mt-3">
          {show.genres.map(g => (
            <GenreTag key={g.id} name={g.name} />
          ))}
        </View>

        {/* Info Row */}
        <View className="flex-row items-center mt-3 gap-3 flex-wrap">
          <Text className="text-dark-400 text-sm">
            {formatDate(show.first_air_date)}
          </Text>
          <Text className="text-dark-400 text-sm">• {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}</Text>
          <Text className="text-dark-400 text-sm">• {show.status}</Text>
        </View>

        {/* Overview */}
        {show.overview ? (
          <View className="mt-4">
            <Text className="text-white text-base font-bold mb-2">Overview</Text>
            <Text className="text-dark-300 text-sm leading-5">{show.overview}</Text>
          </View>
        ) : null}

        {/* Creators + Stats */}
        <View className="flex-row mt-6 bg-dark-800 rounded-2xl p-4">
          {creators.length > 0 && (
            <StatItem label="Creator" value={creators[0].name} />
          )}
          {show.number_of_seasons > 0 && (
            <StatItem label="Seasons" value={String(show.number_of_seasons)} />
          )}
          {show.number_of_episodes > 0 && (
            <StatItem label="Episodes" value={String(show.number_of_episodes)} />
          )}
        </View>

        {/* Seasons */}
        {show.seasons.length > 0 && (
          <View className="mt-6">
            <Text className="text-white text-lg font-bold mb-3">Seasons</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {show.seasons.filter(s => s.season_number > 0).map((season) => (
                <View key={season.id} className="w-[120px] mr-3 items-center">
                  <View className="w-[120px] h-[180px] rounded-xl overflow-hidden bg-dark-800">
                    {season.poster_path ? (
                      <Image
                        source={{ uri: Images.poster(season.poster_path, 'w185') }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-full h-full bg-dark-700 items-center justify-center">
                        <Text className="text-dark-400 text-xs">No Image</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-white text-xs font-semibold mt-2" numberOfLines={1}>
                    {season.name}
                  </Text>
                  <Text className="text-dark-400 text-[10px] mt-0.5">
                    {season.episode_count} ep
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Cast */}
        {show.credits.cast.length > 0 && (
          <View className="mt-6">
            <CastList cast={show.credits.cast} />
          </View>
        )}

        {/* Similar Shows */}
        {show.similar.results.length > 0 && (
          <Section title="Similar Shows">
            <HorizontalList>
              {show.similar.results.map(s => (
                <TVCard key={s.id} show={s} />
              ))}
            </HorizontalList>
          </Section>
        )}

        {/* Recommendations */}
        {show.recommendations.results.length > 0 && (
          <Section title="Recommended">
            <HorizontalList>
              {show.recommendations.results.map(s => (
                <TVCard key={s.id} show={s} />
              ))}
            </HorizontalList>
          </Section>
        )}
      </View>
    </ScrollView>
  );
}
