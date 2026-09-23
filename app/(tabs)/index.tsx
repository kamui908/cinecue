import React from 'react';
import { RefreshControl, ScrollView, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Box, Text, Pressable, Image, HStack, VStack } from '../../src/components/ui/gluestack';
import { Link } from 'expo-router';
import { useTrendingMovies, useTrendingTV, useNowPlayingMovies, usePopularMovies, useTrendingPeople } from '../../src/hooks/useTMDB';
import { MovieCard } from '../../src/components/MovieCard';
import { TVCard } from '../../src/components/TVCard';
import { PersonCard } from '../../src/components/PersonCard';
import { Section, HorizontalList, LoadingSpinner } from '../../src/components/UI';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icons } from '../../src/components/Icons';
import { Images } from '../../src/api/tmdb';
import { useTheme } from '../../src/theme/ThemeContext';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const { resolved, toggle } = useTheme();
  const pageBg = resolved === 'dark' ? '#121212' : '#F7F7F7';
  const trendingMovies = useTrendingMovies('week');
  const trendingTV = useTrendingTV('week');
  const nowPlaying = useNowPlayingMovies();
  const popularMovies = usePopularMovies();
  const trendingPeople = useTrendingPeople('week');

  const isLoading = trendingMovies.isLoading && trendingTV.isLoading;
  const [refreshing, setRefreshing] = React.useState(false);

  const heroItems = (trendingMovies.data?.results || []).slice(0, 8);
  const [heroIndex, setHeroIndex] = React.useState(0);
  const [heroWidth, setHeroWidth] = React.useState(windowWidth);
  const heroRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    if (heroItems.length <= 1) return;
    const timer = setTimeout(() => {
      const next = (heroIndex + 1) % heroItems.length;
      heroRef.current?.scrollTo({ x: next * heroWidth, animated: true });
      setHeroIndex(next);
    }, 5000);
    return () => clearTimeout(timer);
  }, [heroIndex, heroItems.length, heroWidth]);

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
        tintColor="#ef4444"
        colors={['#ef4444']}
      />

      {/* Header */}
      <Box className="px-4 mb-6 flex-row items-center justify-between">
        <Box>
          <Text className="text-typography-400 text-[11px] uppercase tracking-[3px]">
            Welcome back
          </Text>
          <Text className="text-typography-50 font-heading text-4xl mt-1">
            Cine<Text className="text-primary-500 font-heading">Cue</Text>
          </Text>
        </Box>
        <Pressable
          onPress={toggle}
          className="w-10 h-10 rounded-full bg-background-800 items-center justify-center"
          hitSlop={8}
          accessibilityLabel="Toggle theme"
        >
          {resolved === 'dark' ? (
            <Icons.Sun size={20} color="#fbbf24" />
          ) : (
            <Icons.Moon size={20} color="#52525b" />
          )}
        </Pressable>
      </Box>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Hero */}
          {heroItems.length > 0 && (
            <Box
              className="relative mb-8"
              onLayout={(e: any) => {
                const w = e.nativeEvent.layout.width;
                if (w > 0 && Math.abs(w - heroWidth) > 1) {
                  setHeroWidth(w);
                }
              }}
            >
              <ScrollView
                ref={heroRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={heroWidth}
                decelerationRate="fast"
                onScroll={(e) => {
                  const idx = Math.round(e.nativeEvent.contentOffset.x / heroWidth);
                  if (idx !== heroIndex && idx >= 0 && idx < heroItems.length) {
                    setHeroIndex(idx);
                  }
                }}
                scrollEventThrottle={200}
              >
                {heroItems.map((movie) => (
                  <Link key={movie.id} href={`/movie/${movie.id}`} asChild>
                    <Pressable
                      className="relative h-[560px] overflow-hidden bg-background-800"
                      style={{ width: heroWidth }}
                    >
                      {movie.backdrop_path ? (
                        <Image
                          source={{ uri: Images.backdrop(movie.backdrop_path, 'w1280') }}
                          className="absolute inset-0 w-full h-full"
                          resizeMode="cover"
                          alt={movie.title}
                        />
                      ) : null}
                      <Box className="absolute inset-0 bg-black/25" />
                      <LinearGradient
                        colors={['transparent', pageBg]}
                        locations={[0.25, 1]}
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: 0,
                          height: 420,
                        }}
                      />
                      <VStack className="absolute bottom-0 left-0 right-0 px-5 pb-6">
                        <Text className="text-primary-500 text-xs font-bold uppercase tracking-widest mb-2">
                          Featured
                        </Text>
                        <Text className="text-typography-0 text-4xl font-bold leading-tight">
                          {movie.title}
                        </Text>
                        <HStack className="items-center gap-3 mt-2">
                          <Text className="text-typography-300 text-sm font-semibold">
                            {movie.release_date ? new Date(movie.release_date).getFullYear() : '—'}
                          </Text>
                          <HStack className="items-center gap-1">
                            <Icons.Star size={13} color="#ef4444" fill="#ef4444" />
                            <Text className="text-typography-300 text-sm">
                              {movie.vote_average?.toFixed(1)}
                            </Text>
                          </HStack>
                        </HStack>
                        <Text className="text-typography-400 text-sm mt-2" numberOfLines={3}>
                          {movie.overview}
                        </Text>
                        <HStack className="items-center gap-3 mt-4">
                          <HStack className="items-center gap-1.5 bg-primary-500 rounded-lg px-4 py-2.5">
                            <Icons.Play size={16} color="#ffffff" fill="#ffffff" />
                            <Text className="text-white text-sm font-bold">Watch Now</Text>
                          </HStack>
                          <HStack className="items-center gap-1.5 bg-background-800 rounded-lg px-4 py-2.5">
                            <Text className="text-typography-0 text-sm font-bold">More Info</Text>
                          </HStack>
                        </HStack>
                      </VStack>
                    </Pressable>
                  </Link>
                ))}
              </ScrollView>

              {/* Dots */}
              <HStack className="absolute top-3 right-4 gap-1.5 bg-black/30 rounded-full px-2.5 py-1.5">
                {heroItems.map((m, i) => (
                  <Box
                    key={m.id}
                    className={`h-1.5 rounded-full ${i === heroIndex ? 'w-5 bg-primary-500' : 'w-1.5 bg-typography-600'}`}
                  />
                ))}
              </HStack>
            </Box>
          )}

          {/* Trending Movies */}
          <Section
            title="Trending Movies"
            subtitle="This week"
            action={
              <Box className="bg-primary-500/20 rounded-full px-3 py-1 flex-row items-center gap-1">
                <Icons.Zap size={12} color="#ef4444" />
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
