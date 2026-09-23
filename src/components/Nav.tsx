import React from 'react';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box, Text, HStack, VStack, Pressable } from './ui/gluestack';
import { Icons } from './Icons';
import { useTheme } from '../theme/ThemeContext';

export type NavRoute = '/' | '/search' | '/discover' | '/watchlist' | '/profile';

const NAV_ITEMS: { path: NavRoute; label: string; Icon: React.ComponentType<any> }[] = [
  { path: '/', label: 'Home', Icon: Icons.Home },
  { path: '/search', label: 'Search', Icon: Icons.Search },
  { path: '/discover', label: 'Discover', Icon: Icons.Compass },
  { path: '/watchlist', label: 'Watchlist', Icon: Icons.List },
  { path: '/profile', label: 'Profile', Icon: Icons.User },
];

function useNav() {
  const pathname = usePathname();
  const router = useRouter();
  const go = (path: NavRoute) => {
    if (pathname !== path) {
      router.push(path);
    }
  };
  return { pathname, go };
}

function ThemeToggleButton({ size = 18 }: { size?: number }) {
  const { resolved, toggle } = useTheme();
  return (
    <Pressable
      onPress={toggle}
      className="w-10 h-10 rounded-full bg-background-800 items-center justify-center"
      hitSlop={8}
      accessibilityLabel="Toggle theme"
      accessibilityRole="button"
    >
      {resolved === 'dark' ? (
        <Icons.Sun size={size} color="#fbbf24" />
      ) : (
        <Icons.Moon size={size} color="#52525b" />
      )}
    </Pressable>
  );
}

/** Widescreen web menu bar. Sits above content so the hero carousel stays full-bleed. */
export function TopMenuBar() {
  const { pathname, go } = useNav();
  return (
    <Box className="flex-row items-center justify-between px-6 bg-background-900 border-b border-background-800 z-10" style={{ height: 64 }}>
      <HStack className="items-center gap-8">
        <Pressable onPress={() => go('/')} accessibilityLabel="CineCue home" accessibilityRole="button">
          <Text className="font-heading text-2xl text-typography-50">
            Cine<Text className="text-primary-500 font-heading">Cue</Text>
          </Text>
        </Pressable>
        <HStack className="items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.path;
            return (
              <Pressable
                key={item.path}
                onPress={() => go(item.path)}
                className={`px-4 py-2 rounded-full ${active ? 'bg-primary-500/15' : ''}`}
                accessibilityLabel={item.label}
                accessibilityRole="button"
              >
                <Text className={`text-sm font-semibold ${active ? 'text-primary-500' : 'text-typography-400'}`}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </HStack>
      </HStack>
      <ThemeToggleButton />
    </Box>
  );
}

/** Collapsed icon rail for medium widths (tablets, narrow desktop). */
export function SideRail() {
  const { pathname, go } = useNav();
  const insets = useSafeAreaInsets();
  return (
    <Box
      className="bg-background-900 border-r border-background-800 items-center justify-between py-4"
      style={{ width: 72, paddingTop: insets.top + 16 }}
    >
      <VStack className="items-center gap-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.path;
          const Icon = item.Icon;
          return (
            <Pressable
              key={item.path}
              onPress={() => go(item.path)}
              className={`w-12 h-12 rounded-2xl items-center justify-center ${active ? 'bg-primary-500/20' : ''}`}
              accessibilityLabel={item.label}
              accessibilityRole="button"
            >
              <Icon size={22} color={active ? '#ef4444' : '#64748b'} strokeWidth={active ? 2.5 : 2} />
            </Pressable>
          );
        })}
      </VStack>
      <ThemeToggleButton />
    </Box>
  );
}

/** Floating dock tab bar for mobile. Rendered as an overlay below the tab navigator. */
export function FloatingDock() {
  const { pathname, go } = useNav();
  const insets = useSafeAreaInsets();
  return (
    <Box className="absolute left-5 right-5" style={{ bottom: insets.bottom + 12 }}>
      <HStack
        className="bg-background-900/95 border border-background-800 rounded-full px-2 py-2 items-center"
        style={{
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.path;
          const Icon = item.Icon;
          return (
            <Pressable
              key={item.path}
              onPress={() => go(item.path)}
              className="flex-1 items-center"
              accessibilityLabel={item.label}
              accessibilityRole="button"
            >
              <Box className={`w-11 h-11 rounded-full items-center justify-center ${active ? 'bg-primary-500/20' : ''}`}>
                <Icon size={22} color={active ? '#ef4444' : '#64748b'} strokeWidth={active ? 2.5 : 2} />
              </Box>
            </Pressable>
          );
        })}
      </HStack>
    </Box>
  );
}
