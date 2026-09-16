import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { useWatchlist } from '../../src/context/WatchlistContext';
import { EmptyState } from '../../src/components/UI';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Images } from '../../src/api/tmdb';

export default function WatchlistScreen() {
  const insets = useSafeAreaInsets();
  const { watchlist, favorites } = useWatchlist();
  const [tab, setTab] = React.useState<'watchlist' | 'favorites'>('watchlist');

  const items = tab === 'watchlist' ? watchlist : favorites;

  return (
    <ScrollView
      className="flex-1 bg-dark-950"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 100 }}
    >
      <Text className="text-white text-2xl font-bold px-4 mb-4">
        My {tab === 'watchlist' ? 'Watchlist' : 'Favorites'}
      </Text>

      {/* Tab Selector */}
      <View className="flex-row mx-4 mb-4 bg-dark-800 rounded-xl p-1">
        <TouchableOpacity
          onPress={() => setTab('watchlist')}
          className={`flex-1 py-3 rounded-lg items-center ${
            tab === 'watchlist' ? 'bg-primary-500' : ''
          }`}
        >
          <Text
            className={`text-sm font-bold ${
              tab === 'watchlist' ? 'text-white' : 'text-dark-400'
            }`}
          >
            📋 Watchlist ({watchlist.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab('favorites')}
          className={`flex-1 py-3 rounded-lg items-center ${
            tab === 'favorites' ? 'bg-primary-500' : ''
          }`}
        >
          <Text
            className={`text-sm font-bold ${
              tab === 'favorites' ? 'text-white' : 'text-dark-400'
            }`}
          >
            ❤️ Favorites ({favorites.length})
          </Text>
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <EmptyState
          icon={tab === 'watchlist' ? '📋' : '❤️'}
          title={`No ${tab === 'watchlist' ? 'watchlist' : 'favorites'} yet`}
          message={`Start adding ${tab === 'watchlist' ? 'movies and shows to your watchlist' : 'your favorites'}!`}
        />
      ) : (
        <View className="px-4">
          {items.map((item) => (
            <Link
              key={`${item.type}-${item.id}`}
              href={item.type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}
              asChild
            >
              <TouchableOpacity activeOpacity={0.7}>
                <View className="flex-row items-center gap-3 p-2 rounded-xl bg-dark-800/50 mb-2">
                  {item.poster_path ? (
                    <Image
                      source={{ uri: Images.poster(item.poster_path, 'w92') }}
                      className="w-12 h-[72px] rounded-lg"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-12 h-[72px] rounded-lg bg-dark-700 items-center justify-center">
                      <Text className="text-dark-400 text-[10px]">No</Text>
                    </View>
                  )}
                  <View className="flex-1">
                    <Text className="text-white text-sm font-semibold" numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text className="text-dark-400 text-xs mt-0.5 capitalize">
                      {item.type === 'movie' ? '🎬 Movie' : '📺 TV Show'}
                    </Text>
                  </View>
                  <Text className="text-dark-500 text-lg">›</Text>
                </View>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
