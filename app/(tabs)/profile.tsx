import React from 'react';
import { ScrollView } from 'react-native';
import { Box, Text, Pressable } from '../../src/components/ui/gluestack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWatchlist } from '../../src/context/WatchlistContext';
import { Icons } from '../../src/components/Icons';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { watchlist, favorites } = useWatchlist();

  const stats = [
    { label: 'Watchlist', value: watchlist.length, IconComponent: Icons.Bookmark },
    { label: 'Favorites', value: favorites.length, IconComponent: Icons.Heart },
    { label: 'Movies', value: watchlist.filter(i => i.type === 'movie').length, IconComponent: Icons.Film },
    { label: 'TV Shows', value: watchlist.filter(i => i.type === 'tv').length, IconComponent: Icons.Tv },
  ];

  const menuItems = [
    { IconComponent: Icons.Settings, label: 'Settings', description: 'App preferences and settings' },
    { IconComponent: Icons.Bell, label: 'Notifications', description: 'Manage notification preferences' },
    { IconComponent: Icons.Moon, label: 'Appearance', description: 'Dark mode is always on' },
    { IconComponent: Icons.Info, label: 'About', description: 'Version 1.0.0' },
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
        <Box className="w-24 h-24 rounded-full bg-primary-500/20 items-center justify-center mb-3">
          <Icons.Clapperboard size={32} color="#ef4444" />
        </Box>
        <Text className="text-typography-50 text-xl font-bold">Movie Buff</Text>
        <Text className="text-typography-400 text-sm mt-1">CineCue Explorer</Text>
      </Box>

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
          return (
            <Pressable
              key={item.label}
              className={`flex-row items-center p-4 active:opacity-70 ${
                index < menuItems.length - 1 ? 'border-b border-outline-700' : ''
              }`}
            >
              <MenuIcon size={20} color="#64748b" className="mr-3" />
              <Box className="flex-1">
                <Text className="text-typography-50 text-sm font-semibold">{item.label}</Text>
                <Text className="text-typography-400 text-xs mt-0.5">{item.description}</Text>
              </Box>
              <Icons.ChevronRight size={18} color="#64748b" />
            </Pressable>
          );
        })}
      </Box>

      {/* Footer */}
      <Box className="items-center mt-8">
        <Text className="text-typography-400 text-xs">
          CineCue v1.0.0 • Powered by TMDB
        </Text>
      </Box>
    </ScrollView>
  );
}
