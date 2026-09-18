import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Box, Text, Pressable } from '../../src/components/ui/gluestack';
import { useTrendingMovies, useTrendingTV, usePopularMovies, useTopRatedMovies, useUpcomingMovies, usePopularTV, useAiringTodayTV, useTopRatedTV, useMovieGenres, useTVGenres } from '../../src/hooks/useTMDB';
import { MovieCard } from '../../src/components/MovieCard';
import { TVCard } from '../../src/components/TVCard';
import { Section, HorizontalList, GenreTag, LoadingSpinner, EmptyState } from '../../src/components/UI';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icons } from '../../src/components/Icons';

type TabType = 'movies' | 'tv';
type CategoryType = 'trending' | 'popular' | 'top_rated' | 'upcoming' | 'genres';

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('movies');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('trending');

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

  const tabs: { key: TabType; label: string; IconComponent: React.ComponentType<any> }[] = [
    { key: 'movies', label: 'Movies', IconComponent: Icons.Film },
    { key: 'tv', label: 'TV Shows', IconComponent: Icons.Tv },
  ];

  const movieCategories: { key: CategoryType; label: string; IconComponent?: React.ComponentType<any> }[] = [
    { key: 'trending', label: 'Trending', IconComponent: Icons.TrendingUp },
    { key: 'popular', label: 'Popular', IconComponent: Icons.Star },
    { key: 'top_rated', label: 'Top Rated', IconComponent: Icons.Award },
    { key: 'upcoming', label: 'Upcoming', IconComponent: Icons.Calendar },
    { key: 'genres', label: 'Genres', IconComponent: Icons.Sparkles },
  ];

  const tvCategories: { key: CategoryType; label: string; IconComponent?: React.ComponentType<any> }[] = [
    { key: 'trending', label: 'Trending', IconComponent: Icons.TrendingUp },
    { key: 'popular', label: 'Popular', IconComponent: Icons.Star },
    { key: 'top_rated', label: 'Top Rated', IconComponent: Icons.Award },
    { key: 'upcoming', label: 'Airing Today', IconComponent: Icons.Calendar },
    { key: 'genres', label: 'Genres', IconComponent: Icons.Sparkles },
  ];

  const categories = activeTab === 'movies' ? movieCategories : tvCategories;

  const renderContent = () => {
    if (activeTab === 'movies') {
      switch (activeCategory) {
        case 'trending':
          return (
            <HorizontalList>
              {(trendingMovies.data?.results || []).map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </HorizontalList>
          );
        case 'popular':
          return (
            <HorizontalList>
              {(popularMovies.data?.results || []).map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </HorizontalList>
          );
        case 'top_rated':
          return (
            <HorizontalList>
              {(topRatedMovies.data?.results || []).map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </HorizontalList>
          );
        case 'upcoming':
          return (
            <HorizontalList>
              {(upcomingMovies.data?.results || []).map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </HorizontalList>
          );
        case 'genres':
          return (
            <Box className="px-4 flex-row flex-wrap">
              {(movieGenres.data?.genres || []).map((g) => (
                <GenreTag key={g.id} name={g.name} />
              ))}
            </Box>
          );
      }
    } else {
      switch (activeCategory) {
        case 'trending':
          return (
            <HorizontalList>
              {(trendingTV.data?.results || []).map((s) => (
                <TVCard key={s.id} show={s} />
              ))}
            </HorizontalList>
          );
        case 'popular':
          return (
            <HorizontalList>
              {(popularTV.data?.results || []).map((s) => (
                <TVCard key={s.id} show={s} />
              ))}
            </HorizontalList>
          );
        case 'top_rated':
          return (
            <HorizontalList>
              {(topRatedTV.data?.results || []).map((s) => (
                <TVCard key={s.id} show={s} />
              ))}
            </HorizontalList>
          );
        case 'upcoming':
          return (
            <HorizontalList>
              {(airingTodayTV.data?.results || []).map((s) => (
                <TVCard key={s.id} show={s} />
              ))}
            </HorizontalList>
          );
        case 'genres':
          return (
            <Box className="px-4 flex-row flex-wrap">
              {(tvGenres.data?.genres || []).map((g) => (
                <GenreTag key={g.id} name={g.name} />
              ))}
            </Box>
          );
      }
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background-900"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 100 }}
    >
      <Text className="text-typography-50 text-2xl font-bold px-4 mb-4">Discover</Text>

      {/* Tab Selector */}
      <Box className="flex-row mx-4 mb-4 bg-background-800 rounded-xl p-1">
        {tabs.map((tab) => {
          const TabIcon = tab.IconComponent;
          return (
            <Pressable
              key={tab.key}
              onPress={() => {
                setActiveTab(tab.key);
                setActiveCategory('trending');
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

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        className="mb-4"
      >
        {categories.map((cat) => {
          const CatIcon = cat.IconComponent;
          return (
            <Pressable
              key={cat.key}
              onPress={() => setActiveCategory(cat.key)}
              className={`mr-2 px-4 py-2 rounded-full flex-row items-center gap-1 ${
                activeCategory === cat.key ? 'bg-primary-500' : 'bg-background-800/50'
              }`}
            >
              {CatIcon && (
                <CatIcon
                  size={12}
                  color={activeCategory === cat.key ? '#ffffff' : '#64748b'}
                />
              )}
              <Text
                className={`text-xs font-semibold ${
                  activeCategory === cat.key ? 'text-white' : 'text-typography-400'
                }`}
              >
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Content */}
      {renderContent()}
    </ScrollView>
  );
}
