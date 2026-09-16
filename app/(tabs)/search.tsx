import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { useSearchMulti, useSearchMovies, useSearchTV } from '../../src/hooks/useTMDB';
import { MovieCard } from '../../src/components/MovieCard';
import { TVCard } from '../../src/components/TVCard';
import { PersonCard } from '../../src/components/PersonCard';
import { EmptyState, LoadingSpinner } from '../../src/components/UI';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Movie, TVShow, Person } from '../../src/types/tmdb';

type FilterType = 'multi' | 'movie' | 'tv' | 'person';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('multi');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const multiSearch = useSearchMulti(debouncedQuery);
  const movieSearch = useSearchMovies(debouncedQuery);
  const tvSearch = useSearchTV(debouncedQuery);

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
        <View className="px-4 mb-2">
          <MovieCard movie={item as Movie} variant="compact" />
        </View>
      );
    }
    if ('name' in item && 'known_for_department' in item) {
      return (
        <View className="px-4 mb-2">
          <PersonCard person={item as Person} />
        </View>
      );
    }
    if ('name' in item) {
      return (
        <View className="px-4 mb-2">
          <TVCard show={item as TVShow} variant="compact" />
        </View>
      );
    }
    return null;
  };

  return (
    <View className="flex-1 bg-dark-950" style={{ paddingTop: insets.top }}>
      {/* Search Header */}
      <View className="px-4 pb-3">
        <Text className="text-white text-2xl font-bold mb-3">Search</Text>
        <View className="flex-row items-center bg-dark-800 rounded-xl px-4 py-3">
          <Text className="text-dark-400 text-lg mr-2">🔍</Text>
          <TextInput
            className="flex-1 text-white text-base"
            placeholder="Search movies, TV shows, people..."
            placeholderTextColor="#64748b"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <Text className="text-dark-400 text-lg ml-2">✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
          {filters.map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
              className={`mr-2 px-4 py-2 rounded-full ${
                filter === f.key ? 'bg-primary-500' : 'bg-dark-800'
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  filter === f.key ? 'text-white' : 'text-dark-400'
                }`}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results */}
      {isLoading ? (
        <LoadingSpinner />
      ) : !debouncedQuery ? (
        <EmptyState
          icon="🔍"
          title="Search CineCue"
          message="Find your favorite movies, TV shows, and celebrities"
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon="😅"
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
    </View>
  );
}
