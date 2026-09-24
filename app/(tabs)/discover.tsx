import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Box, Text, Pressable } from '../../src/components/ui/gluestack';
import {
  useTrendingMovies,
  useTrendingTV,
  usePopularMovies,
  useTopRatedMovies,
  useUpcomingMovies,
  usePopularTV,
  useAiringTodayTV,
  useTopRatedTV,
  useMovieGenres,
  useTVGenres,
  useTopRatedByGenre,
} from '../../src/hooks/useTMDB';
import { MovieCard } from '../../src/components/MovieCard';
import { TVCard } from '../../src/components/TVCard';
import {
  Section,
  HorizontalList,
  GenreTag,
  LoadingSpinner,
  EmptyState,
} from '../../src/components/UI';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icons } from '../../src/components/Icons';

type TabType = 'movies' | 'tv';

interface Row {
  key: string;
  title: string;
  subtitle?: string;
  data: any[];
  loading: boolean;
}

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('movies');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const isMovies = activeTab === 'movies';

  const trendingMovies = useTrendingMovies('week');
  const popularMovies = usePopularMovies();
  const topRatedMovies = useTopRatedMovies();
  const upcomingMovies = useUpcomingMovies();
  const movieGenres = useMovieGenres();

  const trendingTV = useTrendingTV('week');
  const popularTV = usePopularTV();
  const topRatedTV = useTopRatedTV();
  const airingTodayTV = useAiringTodayTV();
  const tvGenres = useTVGenres();

  const genreResults = useTopRatedByGenre(isMovies ? 'movie' : 'tv', selectedGenre);

  const genres = ((isMovies ? movieGenres : tvGenres).data?.genres || []) as {
    id: number;
    name: string;
  }[];
  const genreName =
    genres.find((g) => g.id === selectedGenre)?.name || 'Genre';

  const tabs: { key: TabType; label: string; IconComponent: React.ComponentType<any> }[] = [
    { key: 'movies', label: 'Movies', IconComponent: Icons.Film },
    { key: 'tv', label: 'TV Shows', IconComponent: Icons.Tv },
  ];

  const rows: Row[] = isMovies
    ? [
        {
          key: 'trending',
          title: 'Trending',
          subtitle: 'This week',
          data: (trendingMovies.data?.results || []) as any[],
          loading: trendingMovies.isLoading,
        },
        {
          key: 'popular',
          title: 'Popular',
          data: (popularMovies.data?.results || []) as any[],
          loading: popularMovies.isLoading,
        },
        {
          key: 'top_rated',
          title: 'Top Rated',
          data: (topRatedMovies.data?.results || []) as any[],
          loading: topRatedMovies.isLoading,
        },
        {
          key: 'upcoming',
          title: 'Upcoming',
          subtitle: 'In theaters soon',
          data: (upcomingMovies.data?.results || []) as any[],
          loading: upcomingMovies.isLoading,
        },
      ]
    : [
        {
          key: 'trending',
          title: 'Trending',
          subtitle: 'This week',
          data: (trendingTV.data?.results || []) as any[],
          loading: trendingTV.isLoading,
        },
        {
          key: 'popular',
          title: 'Popular',
          data: (popularTV.data?.results || []) as any[],
          loading: popularTV.isLoading,
        },
        {
          key: 'top_rated',
          title: 'Top Rated',
          data: (topRatedTV.data?.results || []) as any[],
          loading: topRatedTV.isLoading,
        },
        {
          key: 'airing',
          title: 'Airing Today',
          data: (airingTodayTV.data?.results || []) as any[],
          loading: airingTodayTV.isLoading,
        },
      ];

  const genreItems = (genreResults.data?.results || []) as any[];

  return (
    <ScrollView
      className="flex-1 bg-background-900"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 100 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-typography-50 text-2xl font-bold px-4 mb-4">Discover</Text>

      {/* Movies / TV Selector */}
      <Box className="flex-row mx-4 mb-4 bg-background-800 rounded-xl p-1">
        {tabs.map((tab) => {
          const TabIcon = tab.IconComponent;
          return (
            <Pressable
              key={tab.key}
              onPress={() => {
                setActiveTab(tab.key);
                setSelectedGenre(null);
              }}
              className={`flex-1 py-3 rounded-lg items-center flex-row justify-center gap-2 ${
                activeTab === tab.key ? 'bg-primary-500' : ''
              }`}
            >
              <TabIcon
                size={16}
                color={activeTab === tab.key ? '#ffffff' : '#64748b'}
              />
              <Text
                className={`text-sm font-bold ${
                  activeTab === tab.key ? 'text-white' : 'text-typography-400'
                }`}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </Box>

      {/* Trending / Popular / Top Rated / Upcoming — all on one page */}
      {rows.map((row) => {
        if (!row.data.length && row.loading) {
          return (
            <Box key={row.key}>
              <LoadingSpinner />
            </Box>
          );
        }
        if (!row.data.length) return null;
        return (
          <Section key={row.key} title={row.title} subtitle={row.subtitle}>
            <HorizontalList>
              {row.data.map((item) =>
                isMovies ? (
                  <MovieCard key={item.id} movie={item} />
                ) : (
                  <TVCard key={item.id} show={item} />
                )
              )}
            </HorizontalList>
          </Section>
        );
      })}

      {/* Genres — the only selectable category */}
      <Section title="Genres" subtitle="Select a genre to see its top-rated titles">
        <Box className="px-4 flex-row flex-wrap">
          {genres.map((g) => (
            <GenreTag
              key={g.id}
              name={g.name}
              selected={selectedGenre === g.id}
              onPress={() =>
                setSelectedGenre((cur) => (cur === g.id ? null : g.id))
              }
            />
          ))}
        </Box>
      </Section>

      {selectedGenre != null && (
        <Section
          title={`Top Rated · ${genreName}`}
          subtitle="Highest rated in this genre"
        >
          {genreResults.isLoading ? (
            <LoadingSpinner />
          ) : genreItems.length > 0 ? (
            <HorizontalList>
              {genreItems.map((item) =>
                isMovies ? (
                  <MovieCard key={item.id} movie={item} />
                ) : (
                  <TVCard key={item.id} show={item} />
                )
              )}
            </HorizontalList>
          ) : (
            <EmptyState
              title="No titles found"
              message={`Nothing top-rated for ${genreName} yet`}
            />
          )}
        </Section>
      )}
    </ScrollView>
  );
}
