import React from 'react';
import { ScrollView } from 'react-native';
import { Box, Text, Pressable, Image } from '../../src/components/ui/gluestack';
import { Link } from 'expo-router';
import { useWatchlist } from '../../src/context/WatchlistContext';
import { useAuth } from '../../src/context/AuthContext';
import { EmptyState, LoadingSpinner } from '../../src/components/UI';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Images } from '../../src/api/tmdb';
import { Icons } from '../../src/components/Icons';
import { WebFooter } from '../../src/components/WebFooter';

export default function WatchlistScreen() {
  const insets = useSafeAreaInsets();
  const { user, status } = useAuth();
  const { watchlist, favorites, listsReady } = useWatchlist();
  const [tab, setTab] = React.useState<'watchlist' | 'favorites'>('watchlist');

  if (status === 'loading' || !listsReady) return <LoadingSpinner />;

  if (!user) {
    return (
      <ScrollView
        className="flex-1 bg-background-900"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 16,
          paddingBottom: 100,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box className="mx-6 bg-background-800 rounded-2xl p-6 items-center w-full max-w-[420px]">
          <Box className="w-16 h-16 rounded-full bg-primary-500/20 items-center justify-center mb-4">
            <Icons.Bookmark size={28} color="#ef4444" />
          </Box>
          <Text className="text-typography-50 text-lg font-bold text-center">
            Log in to track your library
          </Text>
          <Text className="text-typography-400 text-sm mt-2 mb-5 text-center">
            Create an account or log in to build your watchlist and favorites — they sync
            across all your devices.
          </Text>
          <Box className="flex-row gap-3 w-full">
            <Link href="/auth/login" asChild>
              <Pressable
                className="flex-1 rounded-xl py-3 items-center bg-primary-500"
                accessibilityRole="button"
                accessibilityLabel="Log in"
              >
                <Text className="text-white text-sm font-bold">Log In</Text>
              </Pressable>
            </Link>
            <Link href="/auth/signup" asChild>
              <Pressable
                className="flex-1 rounded-xl py-3 items-center border border-primary-500"
                accessibilityRole="button"
                accessibilityLabel="Create account"
              >
                <Text className="text-primary-500 text-sm font-bold">Sign Up</Text>
              </Pressable>
            </Link>
          </Box>
        </Box>
      </ScrollView>
    );
  }

  const items = tab === 'watchlist' ? watchlist : favorites;

  return (
    <ScrollView
      className="flex-1 bg-background-900"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 100 }}
    >
      <Text className="text-typography-50 text-2xl font-bold px-4 mb-4">
        My {tab === 'watchlist' ? 'Watchlist' : 'Favorites'}
      </Text>

      {/* Tab Selector */}
      <Box className="flex-row mx-4 mb-4 bg-background-800 rounded-xl p-1">
        <Pressable
          onPress={() => setTab('watchlist')}
          className={`flex-1 py-3 rounded-lg items-center flex-row justify-center gap-2 ${
            tab === 'watchlist' ? 'bg-primary-500' : ''
          }`}
        >
          <Icons.Bookmark
            size={14}
            color={tab === 'watchlist' ? '#ffffff' : '#64748b'}
          />
          <Text
            className={`text-sm font-bold ${
              tab === 'watchlist' ? 'text-white' : 'text-typography-400'
            }`}
          >
            Watchlist ({watchlist.length})
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab('favorites')}
          className={`flex-1 py-3 rounded-lg items-center flex-row justify-center gap-2 ${
            tab === 'favorites' ? 'bg-primary-500' : ''
          }`}
        >
          <Icons.Heart
            size={14}
            color={tab === 'favorites' ? '#ffffff' : '#64748b'}
            fill={tab === 'favorites' ? '#ffffff' : 'transparent'}
          />
          <Text
            className={`text-sm font-bold ${
              tab === 'favorites' ? 'text-white' : 'text-typography-400'
            }`}
          >
            Favorites ({favorites.length})
          </Text>
        </Pressable>
      </Box>

      {items.length === 0 ? (
        <EmptyState
          title={`No ${tab === 'watchlist' ? 'watchlist' : 'favorites'} yet`}
          message={`Start adding ${tab === 'watchlist' ? 'movies and shows to your watchlist' : 'your favorites'}!`}
        />
      ) : (
        <Box className="px-4">
          {items.map((item) => (
            <Link
              key={`${item.type}-${item.id}`}
              href={item.type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}
              asChild
            >
              <Pressable>
                <Box className="flex-row items-center gap-3 p-2 rounded-xl bg-background-800/50 mb-2">
                  {item.poster_path ? (
                    <Image
                      source={{ uri: Images.poster(item.poster_path, 'w92') }}
                      className="w-12 h-[72px] rounded-lg"
                      resizeMode="cover"
                      alt={item.title}
                    />
                  ) : (
                    <Box className="w-12 h-[72px] rounded-lg bg-background-800 items-center justify-center">
                      <Text className="text-typography-400 text-2xs">No</Text>
                    </Box>
                  )}
                  <Box className="flex-1">
                    <Text className="text-typography-50 text-sm font-semibold" numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Box className="flex-row items-center gap-1 mt-0.5">
                      {item.type === 'movie' ? (
                        <Icons.Film size={10} color="#64748b" />
                      ) : (
                        <Icons.Tv size={10} color="#64748b" />
                      )}
                      <Text className="text-typography-400 text-xs capitalize">
                        {item.type === 'movie' ? 'Movie' : 'TV Show'}
                      </Text>
                    </Box>
                  </Box>
                  <Icons.ChevronRight size={18} color="#64748b" />
                </Box>
              </Pressable>
            </Link>
          ))}
        </Box>
      )}
      <WebFooter />
    </ScrollView>
  );
}
