import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useTrendingMovies, useTrendingTV, useNowPlayingMovies, usePopularMovies, useTrendingPeople } from '../../src/hooks/useTMDB';
import { MovieCard } from '../../src/components/MovieCard';
import { TVCard } from '../../src/components/TVCard';
import { PersonCard } from '../../src/components/PersonCard';
import { Section, HorizontalList, LoadingSpinner } from '../../src/components/UI';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
      className="flex-1 bg-dark-950"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 100 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#ec4899"
          colors={['#ec4899']}
        />
      }
    >
      {/* Header */}
      <View className="px-4 mb-6">
        <Text className="text-dark-400 text-sm">Welcome back</Text>
        <Text className="text-white text-2xl font-bold mt-1">
          Cine<span className="text-primary-500">Cue</span>
        </Text>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Trending Movies */}
          <Section
            title="Trending Movies"
            subtitle="This week"
            action={
              <View className="bg-primary-500/20 rounded-full px-3 py-1">
                <Text className="text-primary-400 text-xs font-semibold">🔥 Hot</Text>
              </View>
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
              <View className="bg-accent-cyan/20 rounded-full px-3 py-1">
                <Text className="text-accent-cyan text-xs font-semibold">📺 Trending</Text>
              </View>
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
