import React from 'react';
import { ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Box,
  Text,
  HStack,
  VStack,
  Pressable,
} from '../src/components/ui/gluestack';
import { useTheme, ThemeMode } from '../src/theme/ThemeContext';
import { useSettings } from '../src/context/SettingsContext';
import { useAuth } from '../src/context/AuthContext';
import { AccountSettings } from '../src/components/AccountSettings';
import { WebFooter } from '../src/components/WebFooter';
import { Icons } from '../src/components/Icons';

function Toggle({ on, onPress, label }: { on: boolean; onPress: () => void; label: string }) {
  return (
    <Pressable
      onPress={onPress}
      className={`w-12 h-7 rounded-full justify-center ${on ? 'bg-primary-500' : 'bg-background-700'}`}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: on }}
    >
      <Box
        className={`w-5 h-5 rounded-full bg-white mx-1 ${on ? 'self-end' : 'self-start'}`}
      />
    </Pressable>
  );
}

const APPEARANCE_OPTIONS: { value: ThemeMode; label: string; description: string }[] = [
  { value: 'light', label: 'Light', description: 'Bright theme for daytime' },
  { value: 'dark', label: 'Dark', description: 'Easy on the eyes at night' },
  { value: 'system', label: 'System', description: 'Follow your device theme' },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { mode, setMode } = useTheme();
  const { autoplayTrailers, setAutoplayTrailers } = useSettings();
  const { user } = useAuth();

  return (
    <ScrollView
      className="flex-1 bg-background-900"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 32 }}
    >
      <VStack className="w-full max-w-[640px] self-center px-4 gap-6">
        {/* Header */}
        <HStack className="items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            className="bg-background-800 rounded-full p-2"
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Icons.ChevronLeft size={20} color="#a1a1aa" />
          </Pressable>
          <Text className="text-typography-50 text-2xl font-bold">Settings</Text>
        </HStack>

        {/* Appearance */}
        <VStack className="bg-background-800 rounded-2xl p-4 gap-1">
          <Text className="text-typography-50 text-base font-bold mb-2">Appearance</Text>
          {APPEARANCE_OPTIONS.map((option, index) => {
            const selected = mode === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => setMode(option.value)}
                className={`flex-row items-center p-3 rounded-xl ${
                  index > 0 ? 'mt-1' : ''
                } ${selected ? 'bg-primary-500/15 border border-primary-500/40' : 'border border-transparent'}`}
                accessibilityRole="radio"
                accessibilityLabel={option.label}
                accessibilityState={{ selected }}
              >
                <Box className="flex-1">
                  <Text
                    className={`text-sm font-semibold ${
                      selected ? 'text-primary-500' : 'text-typography-50'
                    }`}
                  >
                    {option.label}
                  </Text>
                  <Text className="text-typography-400 text-xs mt-0.5">
                    {option.description}
                  </Text>
                </Box>
                <Box
                  className={`w-6 h-6 rounded-full items-center justify-center border-2 ${
                    selected ? 'bg-primary-500 border-primary-500' : 'border-background-600'
                  }`}
                >
                  {selected && (
                    <Box className="w-2 h-2 rounded-full bg-white" />
                  )}
                </Box>
              </Pressable>
            );
          })}
        </VStack>

        {/* Playback */}
        <VStack className="bg-background-800 rounded-2xl p-4 gap-3">
          <Text className="text-typography-50 text-base font-bold">Playback</Text>
          <HStack className="items-center justify-between gap-3">
            <Box className="flex-1">
              <Text className="text-typography-50 text-sm font-semibold">
                Autoplay trailers
              </Text>
              <Text className="text-typography-400 text-xs mt-0.5">
                Play the trailer automatically in the backdrop on movie and show pages
              </Text>
            </Box>
            <Toggle
              on={autoplayTrailers}
              onPress={() => setAutoplayTrailers(!autoplayTrailers)}
              label="Autoplay trailers"
            />
          </HStack>
        </VStack>

        {/* Account */}
        {user ? (
          <AccountSettings />
        ) : (
          <Box className="bg-background-800 rounded-2xl p-5 items-center">
            <Text className="text-typography-50 text-base font-bold text-center">Account</Text>
            <Text className="text-typography-400 text-sm mt-1 mb-4 text-center">
              Log in to manage your account and sync your library.
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
      </VStack>
      <Box className="mt-8">
        <WebFooter />
      </Box>
    </ScrollView>
  );
}
