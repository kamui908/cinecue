import React from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { Box, Text, Spinner } from '../../src/components/ui/gluestack';
import { useTrendingMovies, useTrendingTV, useNowPlayingMovies, usePopularMovies, useTrendingPeople } from '../../src/hooks/useTMDB';
import { MovieCard } from '../../src/components/MovieCard';
import { TVCard } from '../../src/components/TVCard';
import { PersonCard } from '../../src/components/PersonCard';
import { Section, HorizontalList, LoadingSpinner } from '../../src/components/UI';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icons } from '../../src/components/Icons';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const trendingMovies = useTrendingMovies('week');
  const trendingTV = useTrendingTV('week');
  const nowPlaying = useNowPlayingMovies();
  const popularMovies = usePopularMovies();
  const trendingPeople = useTrendingPeople('week');

  const isLoading = trendingMovies.isLoading && trendingTV.isLoading;
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      trendingMovies.refetch(),
      trendingTV.refetch(),
      nowPlaying.refetch(),
      popularMovies.refetch(),
      trendingPeople.refetch(),
    ]);
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-background-900"
      contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 16, paddingBottom: 100 }}
    >
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor="#ec4899"
        colors={['#ec4899']}
      />

      {/* Header */}
      <Box className="px-4 mb-6">
        <Text className="text-typography-400 text-sm">Welcome back</Text>
        <Text className="text-typography-50 text-2xl font-bold mt-1">
          Cine<Text className="text-primary-500">Cue</Text>
        </Text>
      </Box>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Trending Movies */}
          <Section
            title="Trending Movies"
            subtitle="This week"
            action={
              <Box className="bg-primary-500/20 rounded-full px-3 py-1 flex-row items-center gap-1">
                <Icons.Zap size={12} color="#ec4899" />
                <Text className="text-primary-500 text-xs font-semibold">Hot</Text>
              </Box>
            }
          >
            <HorizontalList>
              {(trendingMovies.data?.results || []).map((movie) => (
                <MovieCard key={movie.id} movie={movie} variant="backdrop" />
              ))}
            </HorizontalList>
          </Section>

          {/* Now Playing */}
          <Section title="Now Playing" subtitle="In theaters">
            <HorizontalList>
              {(nowPlaying.data?.results || []).slice(0, 15).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </HorizontalList>
          </Section>

          {/* Popular Movies */}
          <Section title="Popular Movies">
            <HorizontalList>
              {(popularMovies.data?.results || []).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </HorizontalList>
          </Section>

          {/* Trending TV */}
          <Section
            title="Trending TV"
            subtitle="This week"
            action={
              <Box className="bg-info-500/20 rounded-full px-3 py-1 flex-row items-center gap-1">
                <Icons.TrendingUp size={12} color="#22d3ee" />
                <Text className="text-info-500 text-xs font-semibold">Trending</Text>
              </Box>
            }
          >
            <HorizontalList>
              {(trendingTV.data?.results || []).map((show) => (
                <TVCard key={show.id} show={show} variant="backdrop" />
              ))}
            </HorizontalList>
          </Section>

          {/* Trending People */}
          <Section title="Trending People" subtitle="This week">
            <HorizontalList>
              {(trendingPeople.data?.results || []).map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </HorizontalList>
          </Section>
        </>
      )}
    </ScrollView>
  );
}
