import React, { useState, useCallback } from 'react';
import { Keyboard, FlatList, ScrollView } from 'react-native';
import { Box, Text, Pressable, Input, InputField } from '../../src/components/ui/gluestack';
import { useSearchMulti, useSearchMovies, useSearchTV, useTrendingMovies, usePopularMovies, usePopularTV } from '../../src/hooks/useTMDB';
import { MovieCard } from '../../src/components/MovieCard';
import { TVCard } from '../../src/components/TVCard';
import { PersonCard } from '../../src/components/PersonCard';
import { EmptyState, LoadingSpinner, Section, HorizontalList } from '../../src/components/UI';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Movie, TVShow, Person } from '../../src/types/tmdb';
import { Icons } from '../../src/components/Icons';

type FilterType = 'multi' | 'movie' | 'tv' | 'person';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('multi');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const multiSearch = useSearchMulti(debouncedQuery);
  const movieSearch = useSearchMovies(debouncedQuery);
  const tvSearch = useSearchTV(debouncedQuery);

  const trendingDay = useTrendingMovies('day');
  const popularMovies = usePopularMovies();
  const popularTV = usePopularTV();
  const recsLoading =
    trendingDay.isLoading && popularMovies.isLoading && popularTV.isLoading;

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
  };

  const filters: { key: FilterType; label: string }[] = [
    { key: 'multi', label: 'All' },
    { key: 'movie', label: 'Movies' },
    { key: 'tv', label: 'TV Shows' },
    { key: 'person', label: 'People' },
  ];

  const getResults = () => {
    switch (filter) {
      case 'movie':
        return movieSearch.data?.results || [];
      case 'tv':
        return tvSearch.data?.results || [];
      default:
        return multiSearch.data?.results || [];
    }
  };

  const results = getResults();
  const isLoading = multiSearch.isLoading || movieSearch.isLoading || tvSearch.isLoading;

  const renderResultItem = ({ item }: { item: any }) => {
    if ('title' in item && !('name' in item && 'known_for_department' in item)) {
      return (
        <Box className="px-4 mb-2">
          <MovieCard movie={item as Movie} variant="compact" />
        </Box>
      );
    }
    if ('name' in item && 'known_for_department' in item) {
      return (
        <Box className="px-4 mb-2">
          <PersonCard person={item as Person} />
        </Box>
      );
    }
    if ('name' in item) {
      return (
        <Box className="px-4 mb-2">
          <TVCard show={item as TVShow} variant="compact" />
        </Box>
      );
    }
    return null;
  };

  return (
    <Box className="flex-1 bg-background-900" style={{ paddingTop: insets.top }}>
      {/* Search Header */}
      <Box className="px-4 pb-3">
        <Text className="text-typography-50 text-2xl font-bold mb-3">Search</Text>
        <Box className="flex-row items-center bg-background-800 rounded-xl px-4 py-3">
          <Icons.Search size={20} color="#64748b" className="mr-2" />
          <Input className="flex-1 bg-transparent border-0">
            <InputField
              placeholder="Search movies, TV shows, people..."
              placeholderTextColor="#64748b"
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              onSubmitEditing={() => Keyboard.dismiss()}
              className="text-typography-50"
            />
          </Input>
          {query.length > 0 && (
            <Pressable onPress={handleClear} className="ml-2">
              <Icons.X size={20} color="#64748b" />
            </Pressable>
          )}
        </Box>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
          {filters.map((f) => (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              className={`mr-2 px-4 py-2 rounded-full ${
                filter === f.key ? 'bg-primary-500' : 'bg-background-800'
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  filter === f.key ? 'text-white' : 'text-typography-400'
                }`}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </Box>

      {/* Results */}
      {isLoading ? (
        <LoadingSpinner />
      ) : !debouncedQuery ? (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {recsLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {(trendingDay.data?.results || []).length > 0 && (
                <Section title="Trending Now" subtitle="What's hot today">
                  <HorizontalList>
                    {(trendingDay.data?.results || [])
                      .filter((m: any) => m.media_type !== 'person')
                      .map((m: any) =>
                        m.media_type === 'tv' || (!m.title && m.name) ? (
                          <TVCard key={`t-${m.id}`} show={m} variant="backdrop" />
                        ) : (
                          <MovieCard key={`m-${m.id}`} movie={m} variant="backdrop" />
                        )
                      )}
                  </HorizontalList>
                </Section>
              )}
              {(popularMovies.data?.results || []).length > 0 && (
                <Section title="Popular Movies">
                  <HorizontalList>
                    {(popularMovies.data?.results || []).map((m) => (
                      <MovieCard key={m.id} movie={m} />
                    ))}
                  </HorizontalList>
                </Section>
              )}
              {(popularTV.data?.results || []).length > 0 && (
                <Section title="Popular TV Shows">
                  <HorizontalList>
                    {(popularTV.data?.results || []).map((s) => (
                      <TVCard key={s.id} show={s} />
                    ))}
                  </HorizontalList>
                </Section>
              )}
              {!recsLoading &&
                !(trendingDay.data?.results || []).length &&
                !(popularMovies.data?.results || []).length && (
                  <EmptyState
                    title="Search CineCue"
                    message="Find your favorite movies, TV shows, and celebrities"
                  />
                )}
            </>
          )}
        </ScrollView>
      ) : results.length === 0 ? (
        <EmptyState
          title="No results found"
          message={`No results for "${debouncedQuery}"`}
        />
      ) : (
        <FlatList
          data={results}
          renderItem={renderResultItem}
          keyExtractor={(item) => `${item.id}-${Math.random()}`}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={() => Keyboard.dismiss()}
        />
      )}
    </Box>
  );
}
