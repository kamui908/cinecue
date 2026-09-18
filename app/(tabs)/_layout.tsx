import React from 'react';
import { Tabs } from 'expo-router';
import { Box, Text } from '../../src/components/ui/gluestack';
import { Icons } from '../../src/components/Icons';
import { NAV_COLORS } from '../../src/theme/palette';
import { useTheme } from '../../src/theme/ThemeContext';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const { resolved } = useTheme();
  const colors = NAV_COLORS[resolved];

  const iconMap: Record<string, React.ComponentType<any>> = {
    home: Icons.Home,
    search: Icons.Search,
    discover: Icons.Compass,
    watchlist: Icons.List,
    profile: Icons.User,
  };

  const Icon = iconMap[name] || Icons.Home;

  return (
    <Box className="items-center justify-center">
      <Icon
        size={24}
        color={focused ? '#ef4444' : colors.inactive}
        strokeWidth={focused ? 2.5 : 2}
      />
    </Box>
  );
}

export default function TabLayout() {
  const { resolved } = useTheme();
  const colors = NAV_COLORS[resolved];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 85,
          paddingTop: 8,
          paddingBottom: 28,
        },
        tabBarActiveTintColor: '#ef4444',
        tabBarInactiveTintColor: colors.inactive,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => <TabIcon name="search" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ focused }) => <TabIcon name="discover" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: 'Watchlist',
          tabBarIcon: ({ focused }) => <TabIcon name="watchlist" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
