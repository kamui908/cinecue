import React from 'react';
import { Linking, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTVDetail } from '../../src/hooks/useTMDB';
import { Images } from '../../src/api/tmdb';
import { CastList } from '../../src/components/CastList';
import { TVCard } from '../../src/components/TVCard';
import { Section, HorizontalList, GenreTag, StatItem, LoadingSpinner } from '../../src/components/UI';
import { useWatchlist } from '../../src/context/WatchlistContext';
import { useRequireAccount } from '../../src/hooks/useRequireAccount';
import { useSettings } from '../../src/context/SettingsContext';
import { TrailerBackdrop } from '../../src/components/TrailerBackdrop';
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
import { WebFooter } from '../../src/components/WebFooter';
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
  const requireAccount = useRequireAccount();
  const { autoplayTrailers, settingsReady } = useSettings();

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
      {/* Backdrop — autoplaying trailer when enabled, still otherwise */}
      <Box className="relative h-[280px]">
        <TrailerBackdrop
          backdropPath={show.backdrop_path}
          trailerKey={trailer?.key ?? null}
          title={show.name}
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
                removeFromFavorites(show.id, 'tv');
                return;
              }
              if (
                !requireAccount({
                  list: 'favorites',
                  mediaType: 'tv',
                  item: {
                    id: show.id,
                    name: show.name,
                    poster_path: show.poster_path,
                  },
                })
              )
                return;
              addToFavorites(
                {
                  id: show.id,
                  name: show.name,
                  poster_path: show.poster_path,
                },
                'tv'
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
                removeFromWatchlist(show.id, 'tv');
                return;
              }
              if (
                !requireAccount({
                  list: 'watchlist',
                  mediaType: 'tv',
                  item: {
                    id: show.id,
                    name: show.name,
                    poster_path: show.poster_path,
                  },
                })
              )
                return;
              addToWatchlist(
                {
                  id: show.id,
                  name: show.name,
                  poster_path: show.poster_path,
                },
                'tv'
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
            {show.poster_path ? (
              <Image
                source={{ uri: Images.poster(show.poster_path, 'w500') }}
                className="w-full h-full"
                resizeMode="cover"
                alt={show.name}
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
              <Text className="text-typography-50 text-4xl font-bold leading-tight text-center md:text-left">
                {show.name}
              </Text>
              {show.tagline ? (
                <Text className="text-typography-400 text-sm italic mt-1 text-center md:text-left">
                  &quot;{show.tagline}&quot;
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
                      {show.vote_average.toFixed(1)}
                    </Text>
                    <Text className="text-typography-400 text-sm font-semibold">/ 10</Text>
                  </HStack>
                  <HStack className="items-center gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const filled = i < Math.round(show.vote_average / 2);
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
                      {show.vote_average >= 7.5
                        ? 'Excellent'
                        : show.vote_average >= 5
                          ? 'Good'
                          : show.vote_average > 0
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
                  style={{ width: `${Math.min(100, (show.vote_average / 10) * 100)}%` }}
                />
              </Box>

              <HStack className="items-center justify-between mt-2.5">
                <HStack className="items-center gap-1.5">
                  <Icons.Users size={13} color="#a1a1aa" />
                  <Text className="text-typography-300 text-xs font-semibold">
                    {formatNumber(show.vote_count)} votes
                  </Text>
                </HStack>
                <HStack className="items-center gap-1.5">
                  <Icons.TrendingUp size={13} color="#a1a1aa" />
                  <Text className="text-typography-400 text-xs">
                    {show.popularity != null ? formatNumber(Math.round(show.popularity)) : '—'} popularity
                  </Text>
                </HStack>
              </HStack>
            </VStack>

            {/* Genres */}
            <HStack className="flex-wrap justify-center md:justify-start mt-4">
              {show.genres.map((g) => (
                <GenreTag key={g.id} name={g.name} />
              ))}
            </HStack>
          </VStack>
        </Box>

        {/* Info cards — First air / Seasons / Status */}
        <HStack className="mt-4 gap-2.5">
          <Box className="flex-1 bg-info-500/10 border border-info-500/25 rounded-2xl p-3">
            <Center className="w-9 h-9 rounded-full bg-info-500/20 mb-2 self-start">
              <Icons.Calendar size={16} color="#22d3ee" />
            </Center>
            <Text className="text-info-500 text-2xs font-bold uppercase tracking-widest">
              First Air
            </Text>
            <Text className="text-typography-50 text-sm font-bold mt-0.5" numberOfLines={1}>
              {formatDate(show.first_air_date)}
            </Text>
            <Text className="text-typography-400 text-2xs mt-0.5">
              {show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'TBA'}
            </Text>
          </Box>

          <Box className="flex-1 bg-success-500/10 border border-success-500/25 rounded-2xl p-3">
            <Center className="w-9 h-9 rounded-full bg-success-500/20 mb-2 self-start">
              <Icons.Tv size={16} color="#22c55e" />
            </Center>
            <Text className="text-success-500 text-2xs font-bold uppercase tracking-widest">
              Seasons
            </Text>
            <Text className="text-typography-50 text-sm font-bold mt-0.5" numberOfLines={1}>
              {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}
            </Text>
            <Text className="text-typography-400 text-2xs mt-0.5">
              {show.number_of_episodes} Episode{show.number_of_episodes !== 1 ? 's' : ''}
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
                  show.status === 'Returning Series' ? 'bg-success-500' : 'bg-warning-500'
                }`}
              />
              <Text className="text-typography-50 text-sm font-bold" numberOfLines={1}>
                {show.status || '—'}
              </Text>
            </HStack>
            <Text className="text-typography-400 text-2xs mt-0.5" numberOfLines={1}>
              {show.adult ? '18+ Adult' : 'All audiences'}
            </Text>
          </Box>
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

        {/* Creators + Stats — 2-col grid on mobile, 3-col on desktop */}
        <HStack className="mt-6 bg-background-800 rounded-2xl p-2 flex-wrap">
          {creators.length > 0 && (
            <StatItem label="Creator" value={creators[0].name} className="w-1/2 md:w-1/3" />
          )}
          {show.number_of_seasons > 0 && (
            <StatItem
              label="Seasons"
              value={String(show.number_of_seasons)}
              className="w-1/2 md:w-1/3"
            />
          )}
          {show.number_of_episodes > 0 && (
            <StatItem
              label="Episodes"
              value={String(show.number_of_episodes)}
              className="w-1/2 md:w-1/3"
            />
          )}
        </HStack>

        {/* Details — other basic info from the API */}
        <VStack className="mt-4 bg-background-800 rounded-2xl p-4 gap-0">
          <Text className="text-typography-50 text-base font-bold mb-1">
            Details
          </Text>

          <HStack className="items-start justify-between py-2.5">
            <Text className="text-typography-400 text-xs flex-1">Original Name</Text>
            <Text className="text-typography-50 text-xs font-semibold flex-1 text-right" numberOfLines={2}>
              {show.original_name || '—'}
            </Text>
          </HStack>
          <Divider className="bg-background-700" />

          <HStack className="items-center justify-between py-2.5">
            <Text className="text-typography-400 text-xs">Original Language</Text>
            <Box className="bg-background-700 rounded-full px-2.5 py-1">
              <Text className="text-typography-50 text-2xs font-bold">
                {(show.original_language || '—').toUpperCase()}
              </Text>
            </Box>
          </HStack>
          <Divider className="bg-background-700" />

          <HStack className="items-start justify-between py-2.5">
            <Text className="text-typography-400 text-xs flex-1">Spoken Languages</Text>
            <Text className="text-typography-50 text-xs font-semibold flex-1 text-right" numberOfLines={2}>
              {show.spoken_languages?.length
                ? show.spoken_languages.map((l) => l.english_name).join(', ')
                : '—'}
            </Text>
          </HStack>
          <Divider className="bg-background-700" />

          <HStack className="items-start justify-between py-2.5">
            <Text className="text-typography-400 text-xs flex-1">Production Countries</Text>
            <Text className="text-typography-50 text-xs font-semibold flex-1 text-right" numberOfLines={2}>
              {show.production_countries?.length
                ? show.production_countries.map((c) => c.name).join(', ')
                : '—'}
            </Text>
          </HStack>
          <Divider className="bg-background-700" />

          <HStack className="items-center justify-between py-2.5">
            <Text className="text-typography-400 text-xs">Origin Country</Text>
            <Text className="text-typography-50 text-xs font-semibold text-right">
              {show.origin_country?.length ? show.origin_country.join(', ') : '—'}
            </Text>
          </HStack>
          <Divider className="bg-background-700" />

          <HStack className="items-start justify-between py-2.5">
            <Text className="text-typography-400 text-xs flex-1">First Air Date</Text>
            <Text className="text-typography-50 text-xs font-semibold flex-1 text-right">
              {formatDate(show.first_air_date)}
            </Text>
          </HStack>
          <Divider className="bg-background-700" />

          <HStack className="items-start justify-between py-2.5">
            <Text className="text-typography-400 text-xs flex-1">Last Air Date</Text>
            <Text className="text-typography-50 text-xs font-semibold flex-1 text-right">
              {show.last_air_date ? formatDate(show.last_air_date) : '—'}
            </Text>
          </HStack>
          <Divider className="bg-background-700" />

          <HStack className="items-center justify-between py-2.5">
            <Text className="text-typography-400 text-xs">Episode Runtime</Text>
            <Text className="text-typography-50 text-xs font-semibold text-right">
              {show.episode_run_time?.length && show.episode_run_time[0] > 0
                ? formatRuntime(show.episode_run_time[0])
                : '—'}
            </Text>
          </HStack>
          <Divider className="bg-background-700" />

          <HStack className="items-center justify-between py-2.5">
            <Text className="text-typography-400 text-xs">Type</Text>
            <Text className="text-typography-50 text-xs font-semibold text-right">
              {show.type || '—'}
            </Text>
          </HStack>
          <Divider className="bg-background-700" />

          <HStack className="items-center justify-between py-2.5">
            <Text className="text-typography-400 text-xs">In Production</Text>
            <Box
              className={`rounded-full px-2.5 py-1 ${
                show.in_production ? 'bg-success-500/20' : 'bg-background-700'
              }`}
            >
              <Text
                className={`text-2xs font-bold ${
                  show.in_production ? 'text-success-500' : 'text-typography-400'
                }`}
              >
                {show.in_production ? 'Yes' : 'No'}
              </Text>
            </Box>
          </HStack>
          <Divider className="bg-background-700" />

          <HStack className="items-center justify-between py-2.5">
            <Text className="text-typography-400 text-xs">Popularity</Text>
            <HStack className="items-center gap-1.5">
              <Icons.TrendingUp size={13} color="#22d3ee" />
              <Text className="text-typography-50 text-xs font-semibold">
                {show.popularity != null ? Number(show.popularity).toFixed(1) : '—'}
              </Text>
            </HStack>
          </HStack>
          <Divider className="bg-background-700" />

          <HStack className="items-center justify-between py-2.5">
            <Text className="text-typography-400 text-xs">Adult</Text>
            <Box
              className={`rounded-full px-2.5 py-1 ${
                show.adult ? 'bg-error-500/20' : 'bg-success-500/20'
              }`}
            >
              <Text
                className={`text-2xs font-bold ${
                  show.adult ? 'text-error-500' : 'text-success-500'
                }`}
              >
                {show.adult ? '18+ Yes' : 'No'}
              </Text>
            </Box>
          </HStack>

          {show.homepage ? (
            <>
              <Divider className="bg-background-700" />
              <Pressable
                onPress={() => Linking.openURL(show.homepage as string)}
                className="mt-3 bg-info-500/15 border border-info-500/30 rounded-xl px-4 py-3 flex-row items-center justify-center gap-2"
              >
                <Icons.ExternalLink size={14} color="#22d3ee" />
                <Text className="text-info-500 text-sm font-bold">Visit Homepage</Text>
              </Pressable>
            </>
          ) : null}
        </VStack>

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

        {/* Production Companies */}
        {show.production_companies.length > 0 && (
          <VStack className="mt-6">
            <Text className="text-typography-50 text-lg font-bold mb-3">
              Production
            </Text>
            <HStack className="flex-wrap gap-3">
              {show.production_companies.map((c) => (
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
      <WebFooter />
    </ScrollView>
  );
}
