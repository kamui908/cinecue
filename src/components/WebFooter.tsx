import React from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Box, Text, HStack, VStack, Pressable } from './ui/gluestack';
import { Icons } from './Icons';

const EXPLORE_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Search', href: '/search' },
  { label: 'Discover', href: '/discover' },
] as const;

const LIBRARY_LINKS = [
  { label: 'Watchlist', href: '/watchlist' },
  { label: 'Favorites', href: '/watchlist' },
  { label: 'Profile', href: '/profile' },
] as const;

/** Site footer rendered on web only, at the end of each page's scroll content. */
export function WebFooter() {
  const router = useRouter();
  if (Platform.OS !== 'web') return null;

  const go = (href: string) => router.push(href as any);

  return (
    <Box className="bg-background-950 border-t border-background-800 px-6 md:px-10 pt-8 pb-6">
      <Box className="flex-col md:flex-row gap-8 md:gap-6">
        {/* Explore */}
        <VStack className="gap-1 min-w-[140px]">
          <Text className="text-typography-50 text-sm font-bold uppercase tracking-widest mb-1">
            Explore
          </Text>
          {EXPLORE_LINKS.map((link) => (
            <Pressable
              key={link.label}
              onPress={() => go(link.href)}
              accessibilityRole="button"
              accessibilityLabel={link.label}
              className="py-1"
            >
              <Text className="text-typography-400 text-sm">{link.label}</Text>
            </Pressable>
          ))}
        </VStack>

        {/* Library */}
        <VStack className="gap-1 min-w-[140px]">
          <Text className="text-typography-50 text-sm font-bold uppercase tracking-widest mb-1">
            Library
          </Text>
          {LIBRARY_LINKS.map((link) => (
            <Pressable
              key={link.label}
              onPress={() => go(link.href)}
              accessibilityRole="button"
              accessibilityLabel={link.label}
              className="py-1"
            >
              <Text className="text-typography-400 text-sm">{link.label}</Text>
            </Pressable>
          ))}
        </VStack>

        {/* About */}
        <VStack className="gap-1 flex-1">
          <Text className="text-typography-50 text-sm font-bold uppercase tracking-widest mb-1">
            About
          </Text>
          <Text className="text-typography-400 text-sm max-w-[320px]">
            Movie and TV data provided by TMDB. This product uses the TMDB API
            but is not endorsed or certified by TMDB.
          </Text>
        </VStack>

        {/* Brand */}
        <VStack className="flex-1 gap-2">
          <Text className="font-heading text-2xl text-typography-50">
            Cine<Text className="text-primary-500 font-heading">Cue</Text>
          </Text>
          <Text className="text-typography-400 text-sm max-w-[320px]">
            Track what you watch. Discover movies and shows, build your
            watchlist, and keep your favorites close.
          </Text>
          <HStack className="items-center gap-1.5 mt-1">
            <Icons.Clapperboard size={14} color="#64748b" />
            <Text className="text-typography-400 text-xs">CineCue v1.1.0</Text>
          </HStack>
        </VStack>
      </Box>

      <Box className="border-t border-background-800 mt-6 pt-4 flex-col md:flex-row items-center justify-between gap-2">
        <Text className="text-typography-400 text-xs">
          © 2026 CineCue. All rights reserved.
        </Text>
        <Text className="text-typography-400 text-xs">
          Powered by TMDB • Made for movie lovers
        </Text>
      </Box>
    </Box>
  );
}
