import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWatchlist } from '../../src/context/WatchlistContext';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { watchlist, favorites } = useWatchlist();

  const stats = [
    { label: 'Watchlist', value: watchlist.length, icon: '📋' },
    { label: 'Favorites', value: favorites.length, icon: '❤️' },
    { label: 'Movies', value: watchlist.filter(i => i.type === 'movie').length, icon: '🎬' },
    { label: 'TV Shows', value: watchlist.filter(i => i.type === 'tv').length, icon: '📺' },
  ];

  const menuItems = [
    { icon: '⚙️', label: 'Settings', description: 'App preferences and settings' },
    { icon: '🔔', label: 'Notifications', description: 'Manage notification preferences' },
    { icon: '🌙', label: 'Appearance', description: 'Dark mode is always on' },
    { icon: '📱', label: 'About', description: 'Version 1.0.0' },
    { icon: '⭐', label: 'Rate CineCue', description: 'Rate us on the App Store' },
    { icon: '💌', label: 'Share', description: 'Share CineCue with friends' },
  ];

  return (
    <ScrollView
      className="flex-1 bg-dark-950"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 100 }}
    >
      {/* Profile Header */}
      <View className="items-center px-4 mb-8">
        <View className="w-24 h-24 rounded-full bg-primary-500/20 items-center justify-center mb-3">
          <Text className="text-4xl">🎬</Text>
        </View>
        <Text className="text-white text-xl font-bold">Movie Buff</Text>
        <Text className="text-dark-400 text-sm mt-1">CineCue Explorer</Text>
      </View>

      {/* Stats */}
      <View className="flex-row mx-4 mb-8 bg-dark-800 rounded-2xl p-4">
        {stats.map((stat, index) => (
          <View key={stat.label} className="flex-1 items-center">
            <Text className="text-2xl mb-1">{stat.icon}</Text>
            <Text className="text-white text-xl font-bold">{stat.value}</Text>
            <Text className="text-dark-400 text-[10px] mt-1">{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Menu */}
      <View className="mx-4 bg-dark-800 rounded-2xl overflow-hidden">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            className={`flex-row items-center p-4 ${
              index < menuItems.length - 1 ? 'border-b border-dark-700' : ''
            }`}
            activeOpacity={0.7}
          >
            <Text className="text-xl mr-3">{item.icon}</Text>
            <View className="flex-1">
              <Text className="text-white text-sm font-semibold">{item.label}</Text>
              <Text className="text-dark-400 text-xs mt-0.5">{item.description}</Text>
            </View>
            <Text className="text-dark-500 text-lg">›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View className="items-center mt-8">
        <Text className="text-dark-600 text-xs">
          CineCue v1.0.0 • Powered by TMDB
        </Text>
      </View>
    </ScrollView>
  );
}
