import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { Tabs } from 'expo-router';
import { Box } from '../../src/components/ui/gluestack';
import { TopMenuBar, SideRail, FloatingDock } from '../../src/components/Nav';

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const showTopBar = isWeb && width >= 1100;
  const showRail = !showTopBar && width >= 768;

  return (
    <Box className="flex-1 bg-background-900">
      {showTopBar && <TopMenuBar />}
      <Box className="flex-1" style={{ flexDirection: showRail ? 'row' : 'column' }}>
        {showRail && <SideRail />}
        <Box className="flex-1">
          <Tabs screenOptions={{ headerShown: false }} tabBar={() => null}>
            <Tabs.Screen name="index" options={{ title: 'Home' }} />
            <Tabs.Screen name="search" options={{ title: 'Search' }} />
            <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
            <Tabs.Screen name="watchlist" options={{ title: 'Watchlist' }} />
            <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
          </Tabs>
          {!showTopBar && !showRail && <FloatingDock />}
        </Box>
      </Box>
    </Box>
  );
}
