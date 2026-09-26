import React from 'react';
import { ScrollView } from 'react-native';
import { Link } from 'expo-router';
import {
  Box,
  Text,
  HStack,
  Pressable,
} from '../../src/components/ui/gluestack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWatchlist } from '../../src/context/WatchlistContext';
import { useAuth } from '../../src/context/AuthContext';
import { Icons } from '../../src/components/Icons';
import { LoadingSpinner } from '../../src/components/UI';
import { WebFooter } from '../../src/components/WebFooter';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, status } = useAuth();
  const { watchlist, favorites } = useWatchlist();

  if (status === 'loading') return <LoadingSpinner />;

  const stats = [
    { label: 'Watchlist', value: watchlist.length, IconComponent: Icons.Bookmark },
    { label: 'Favorites', value: favorites.length, IconComponent: Icons.Heart },
    { label: 'Movies', value: watchlist.filter(i => i.type === 'movie').length, IconComponent: Icons.Film },
    { label: 'TV Shows', value: watchlist.filter(i => i.type === 'tv').length, IconComponent: Icons.Tv },
  ];

  const menuItems = [
    { IconComponent: Icons.Settings, label: 'Settings', description: 'Appearance, playback, account', href: '/settings' as const },
    { IconComponent: Icons.Bell, label: 'Notifications', description: 'Manage notification preferences' },
    { IconComponent: Icons.Info, label: 'About', description: 'Version 1.1.0' },
    { IconComponent: Icons.Star, label: 'Rate CineCue', description: 'Rate us on the App Store' },
    { IconComponent: Icons.Share2, label: 'Share', description: 'Share CineCue with friends' },
  ];

  return (
    <ScrollView
      className="flex-1 bg-background-900"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 100 }}
    >
      {/* Profile Header */}
      <Box className="items-center px-4 mb-8">
        {user ? (
          <>
            <Box className="w-24 h-24 rounded-full bg-primary-500 items-center justify-center mb-3">
              <Text className="text-white text-4xl font-bold">
                {(user.name || user.email).charAt(0).toUpperCase()}
              </Text>
            </Box>
            <Text className="text-typography-50 text-xl font-bold">{user.name}</Text>
            <Text className="text-typography-400 text-sm mt-1">{user.email}</Text>
          </>
        ) : (
          <>
            <Box className="w-24 h-24 rounded-full bg-primary-500/20 items-center justify-center mb-3">
              <Icons.Clapperboard size={32} color="#ef4444" />
            </Box>
            <Text className="text-typography-50 text-xl font-bold">Movie Buff</Text>
            <Text className="text-typography-400 text-sm mt-1">CineCue Explorer</Text>
          </>
        )}
      </Box>

      {/* Guest CTA */}
      {!user && (
        <Box className="mx-4 mb-8 bg-background-800 rounded-2xl p-5 items-center">
          <Text className="text-typography-50 text-base font-bold text-center">
            Log in to track your library
          </Text>
          <Text className="text-typography-400 text-sm mt-1 mb-4 text-center">
            Your watchlist and favorites sync to your account on every device.
          </Text>
          <HStack className="gap-3 w-full">
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
          </HStack>
        </Box>
      )}

      {/* Stats */}
      <Box className="flex-row mx-4 mb-8 bg-background-800 rounded-2xl p-4">
        {stats.map((stat) => {
          const StatIcon = stat.IconComponent;
          return (
            <Box key={stat.label} className="flex-1 items-center">
              <StatIcon size={24} color="#ef4444" className="mb-1" />
              <Text className="text-typography-50 text-xl font-bold">{stat.value}</Text>
              <Text className="text-typography-400 text-2xs mt-1">{stat.label}</Text>
            </Box>
          );
        })}
      </Box>

      {/* Menu */}
      <Box className="mx-4 bg-background-800 rounded-2xl overflow-hidden">
        {menuItems.map((item, index) => {
          const MenuIcon = item.IconComponent;
          const row = (
            <Pressable
              className={`flex-row items-center p-4 active:opacity-70 ${
                index < menuItems.length - 1 ? 'border-b border-outline-700' : ''
              }`}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <MenuIcon size={20} color="#64748b" className="mr-3" />
              <Box className="flex-1">
                <Text className="text-typography-50 text-sm font-semibold">{item.label}</Text>
                <Text className="text-typography-400 text-xs mt-0.5">{item.description}</Text>
              </Box>
              <Icons.ChevronRight size={18} color="#64748b" />
            </Pressable>
          );
          return 'href' in item && item.href ? (
            <Link key={item.label} href={item.href} asChild>
              {row}
            </Link>
          ) : (
            <React.Fragment key={item.label}>{row}</React.Fragment>
          );
        })}
      </Box>

      {/* Footer */}
      <Box className="items-center mt-8 mb-6">
        <Text className="text-typography-400 text-xs">
          CineCue v1.1.0 • Powered by TMDB
        </Text>
      </Box>
      <WebFooter />
    </ScrollView>
  );
}
