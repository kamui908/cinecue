import React from 'react';
import { Linking, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTVDetail } from '../../src/hooks/useTMDB';
import { Images } from '../../src/api/tmdb';
import { CastList } from '../../src/components/CastList';
import { TVCard } from '../../src/components/TVCard';
import { Section, HorizontalList, GenreTag, StatItem, LoadingSpinner } from '../../src/components/UI';
import { useWatchlist } from '../../src/context/WatchlistContext';
import { formatDate, formatNumber, formatRuntime } from '../../src/utils/format';
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

export default function TVDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tvId = Number(id);
  const { resolved } = useTheme();
  const { data: show, isLoading } = useTVDetail(tvId);
  const {
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  } = useWatchlist();

  if (isLoading) return <LoadingSpinner />;
  if (!show) return null;

  const inWatchlist = isInWatchlist(show.id, 'tv');
  const isFav = isFavorite(show.id, 'tv');
  const trailer = show.videos.results.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );
  const crew = show.credits.crew.filter((c) =>
    ['Executive Producer', 'Producer', 'Creator'].includes(c.job)
  );
  const creators = show.created_by || [];

  return (
    <ScrollView
      className="flex-1 bg-background-950"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Backdrop */}
      <Box className="relative h-[280px]">
        {show.backdrop_path ? (
          <Image
            source={{ uri: Images.backdrop(show.backdrop_path, 'original') }}
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
                ? removeFromFavorites(show.id, 'tv')
                : addToFavorites(
                    {
                      id: show.id,
                      name: show.name,
                      poster_path: show.poster_path,
                    },
                    'tv'
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
                ? removeFromWatchlist(show.id, 'tv')
                : addToWatchlist(
                    {
                      id: show.id,
                      name: show.name,
                      poster_path: show.poster_path,
                    },
                    'tv'
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
              {show.name}
            </Text>
            {show.tagline ? (
              <Text className="text-typography-400 text-sm italic mt-1">
                &quot;{show.tagline}&quot;
              </Text>
            ) : null}
          </VStack>
          <Box className="bg-primary-500/20 rounded-full px-3 py-2 items-center">
            <HStack className="items-center gap-1">
              <Icons.Star size={14} color="#ef4444" />
              <Text className="text-primary-400 text-lg font-bold">
                {show.vote_average.toFixed(1)}
              </Text>
            </HStack>
            <Text className="text-typography-400 text-2xs">
              {formatNumber(show.vote_count)} votes
            </Text>
          </Box>
        </HStack>

        {/* Genres */}
        <HStack className="flex-wrap mt-3">
          {show.genres.map((g) => (
            <GenreTag key={g.id} name={g.name} />
          ))}
        </HStack>

        {/* Info Row */}
        <HStack className="items-center mt-3 gap-3 flex-wrap">
          <Text className="text-typography-400 text-sm">
            {formatDate(show.first_air_date)}
          </Text>
          <Text className="text-typography-400 text-sm">
            • {show.number_of_seasons} Season
            {show.number_of_seasons !== 1 ? 's' : ''}
          </Text>
          <Text className="text-typography-400 text-sm">
            • {show.status}
          </Text>
        </HStack>

        {/* Overview */}
        {show.overview ? (
          <VStack className="mt-4">
            <Text className="text-typography-50 text-base font-bold mb-2">
              Overview
            </Text>
            <Text className="text-typography-300 text-sm">
              {show.overview}
            </Text>
          </VStack>
        ) : null}

        {/* Creators + Stats */}
        <HStack className="mt-6 bg-background-800 rounded-2xl p-4">
          {creators.length > 0 && (
            <StatItem label="Creator" value={creators[0].name} />
          )}
          {show.number_of_seasons > 0 && (
            <StatItem
              label="Seasons"
              value={String(show.number_of_seasons)}
            />
          )}
          {show.number_of_episodes > 0 && (
            <StatItem
              label="Episodes"
              value={String(show.number_of_episodes)}
            />
          )}
        </HStack>

        {/* Seasons */}
        {show.seasons.length > 0 && (
          <VStack className="mt-6">
            <Text className="text-typography-50 text-lg font-bold mb-3">
              Seasons
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {show.seasons
                .filter((s) => s.season_number > 0)
                .map((season) => (
                  <Box key={season.id} className="w-[120px] mr-3 items-center">
                    <Box className="w-[120px] h-[180px] rounded-xl overflow-hidden bg-background-800">
                      {season.poster_path ? (
                        <Image
                          source={{
                            uri: Images.poster(season.poster_path, 'w185'),
                          }}
                          className="w-full h-full"
                          resizeMode="cover"
                          alt={season.name}
                        />
                      ) : (
                        <Center className="w-full h-full bg-background-700">
                          <Text className="text-typography-400 text-xs">
                            No Image
                          </Text>
                        </Center>
                      )}
                    </Box>
                    <Text
                      className="text-typography-50 text-xs font-semibold mt-2"
                      numberOfLines={1}
                    >
                      {season.name}
                    </Text>
                    <Text className="text-typography-400 text-2xs mt-0.5">
                      {season.episode_count} ep
                    </Text>
                  </Box>
                ))}
            </ScrollView>
          </VStack>
        )}

        {/* Cast */}
        {show.credits.cast.length > 0 && (
          <Box className="mt-6">
            <CastList cast={show.credits.cast} />
          </Box>
        )}

        {/* Similar Shows */}
        {show.similar.results.length > 0 && (
          <Section title="Similar Shows">
            <HorizontalList>
              {show.similar.results.map((s) => (
                <TVCard key={s.id} show={s} />
              ))}
            </HorizontalList>
          </Section>
        )}

        {/* Recommendations */}
        {show.recommendations.results.length > 0 && (
          <Section title="Recommended">
            <HorizontalList>
              {show.recommendations.results.map((s) => (
                <TVCard key={s.id} show={s} />
              ))}
            </HorizontalList>
          </Section>
        )}
      </VStack>
    </ScrollView>
  );
}
