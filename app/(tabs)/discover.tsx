import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTrendingMovies, useTrendingTV, usePopularMovies, useTopRatedMovies, useUpcomingMovies, usePopularTV, useAiringTodayTV, useTopRatedTV, useMovieGenres, useTVGenres } from '../../src/hooks/useTMDB';
import { MovieCard } from '../../src/components/MovieCard';
import { TVCard } from '../../src/components/TVCard';
import { Section, HorizontalList, GenreTag, LoadingSpinner, EmptyState } from '../../src/components/UI';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'movies', label: 'Movies', icon: '🎬' },
    { key: 'tv', label: 'TV Shows', icon: '📺' },
  ];

  const movieCategories: { key: CategoryType; label: string }[] = [
    { key: 'trending', label: '🔥 Trending' },
    { key: 'popular', label: '⭐ Popular' },
    { key: 'top_rated', label: '🏆 Top Rated' },
    { key: 'upcoming', label: '📅 Upcoming' },
    { key: 'genres', label: '🎭 Genres' },
  ];

  const tvCategories: { key: CategoryType; label: string }[] = [
    { key: 'trending', label: '🔥 Trending' },
    { key: 'popular', label: '⭐ Popular' },
    { key: 'top_rated', label: '🏆 Top Rated' },
    { key: 'upcoming', label: '📡 Airing Today' },
    { key: 'genres', label: '🎭 Genres' },
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
            <View className="px-4 flex-row flex-wrap">
              {(movieGenres.data?.genres || []).map((g) => (
                <GenreTag key={g.id} name={g.name} />
              ))}
            </View>
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
            <View className="px-4 flex-row flex-wrap">
              {(tvGenres.data?.genres || []).map((g) => (
                <GenreTag key={g.id} name={g.name} />
              ))}
            </View>
          );
      }
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-dark-950"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 100 }}
    >
      <Text className="text-white text-2xl font-bold px-4 mb-4">Discover</Text>

      {/* Tab Selector */}
      <View className="flex-row mx-4 mb-4 bg-dark-800 rounded-xl p-1">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => {
              setActiveTab(tab.key);
              setActiveCategory('trending');
            }}
            className={`flex-1 py-3 rounded-lg items-center ${
              activeTab === tab.key ? 'bg-primary-500' : ''
            }`}
          >
            <Text
              className={`text-sm font-bold ${
                activeTab === tab.key ? 'text-white' : 'text-dark-400'
              }`}
            >
              {tab.icon} {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        className="mb-4"
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            onPress={() => setActiveCategory(cat.key)}
            className={`mr-2 px-4 py-2 rounded-full ${
              activeCategory === cat.key ? 'bg-dark-700' : 'bg-dark-800/50'
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                activeCategory === cat.key ? 'text-white' : 'text-dark-500'
              }`}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      {renderContent()}
    </ScrollView>
  );
}
