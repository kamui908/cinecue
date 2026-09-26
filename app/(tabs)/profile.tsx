import React from 'react';
import { ScrollView } from 'react-native';
import { Link } from 'expo-router';
import {
  Box,
  Text,
  HStack,
  VStack,
  Pressable,
  Input,
  InputField,
  Spinner,
} from '../../src/components/ui/gluestack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWatchlist } from '../../src/context/WatchlistContext';
import { useAuth } from '../../src/context/AuthContext';
import { Icons } from '../../src/components/Icons';
import { LoadingSpinner } from '../../src/components/UI';
import { WebFooter } from '../../src/components/WebFooter';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, status, logout, changePassword, deleteAccount } = useAuth();
  const { watchlist, favorites } = useWatchlist();

  const [showPasswordForm, setShowPasswordForm] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [pwMessage, setPwMessage] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [pwBusy, setPwBusy] = React.useState(false);

  const [showDeleteForm, setShowDeleteForm] = React.useState(false);
  const [deletePassword, setDeletePassword] = React.useState('');
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  const [deleteBusy, setDeleteBusy] = React.useState(false);
  const [logoutBusy, setLogoutBusy] = React.useState(false);

  if (status === 'loading') return <LoadingSpinner />;

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
    { IconComponent: Icons.Info, label: 'About', description: 'Version 1.1.0' },
    { IconComponent: Icons.Star, label: 'Rate CineCue', description: 'Rate us on the App Store' },
    { IconComponent: Icons.Share2, label: 'Share', description: 'Share CineCue with friends' },
  ];

  const onChangePassword = async () => {
    if (pwBusy) return;
    setPwMessage(null);
    if (newPassword !== confirmPassword) {
      setPwMessage({ ok: false, text: 'New passwords do not match.' });
      return;
    }
    setPwBusy(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPwMessage({ ok: true, text: 'Password updated.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      setPwMessage({ ok: false, text: e instanceof Error ? e.message : 'Could not update password.' });
    } finally {
      setPwBusy(false);
    }
  };

  const onDeleteAccount = async () => {
    if (deleteBusy) return;
    setDeleteError(null);
    setDeleteBusy(true);
    try {
      await deleteAccount(deletePassword);
      setDeletePassword('');
      setShowDeleteForm(false);
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Could not delete your account.');
    } finally {
      setDeleteBusy(false);
    }
  };

  const onLogout = async () => {
    if (logoutBusy) return;
    setLogoutBusy(true);
    try {
      await logout();
    } finally {
      setLogoutBusy(false);
    }
  };

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

      {/* Account */}
      {user && (
        <VStack className="mx-4 mb-8 bg-background-800 rounded-2xl p-4 gap-3">
          <Text className="text-typography-50 text-base font-bold">Account</Text>

          <Pressable
            onPress={onLogout}
            disabled={logoutBusy}
            className="rounded-xl py-3 items-center flex-row justify-center gap-2 border border-outline-700"
            accessibilityRole="button"
            accessibilityLabel="Log out"
          >
            {logoutBusy ? (
              <Spinner size="small" />
            ) : (
              <>
                <Icons.LogOut size={16} color="#a1a1aa" />
                <Text className="text-typography-50 text-sm font-bold">Log Out</Text>
              </>
            )}
          </Pressable>

          <Pressable
            onPress={() => setShowPasswordForm((v) => !v)}
            className="rounded-xl py-3 items-center"
            accessibilityRole="button"
            accessibilityLabel="Change password"
          >
            <Text className="text-primary-500 text-sm font-bold">
              {showPasswordForm ? 'Hide password form' : 'Change password'}
            </Text>
          </Pressable>

          {showPasswordForm && (
            <VStack className="gap-3">
              <VStack className="gap-1.5">
                <Text className="text-typography-400 text-xs font-bold uppercase tracking-widest">
                  Current password
                </Text>
                <Input>
                  <InputField
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="••••••••"
                    secureTextEntry
                    textContentType="password"
                  />
                </Input>
              </VStack>
              <VStack className="gap-1.5">
                <Text className="text-typography-400 text-xs font-bold uppercase tracking-widest">
                  New password
                </Text>
                <Input>
                  <InputField
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="At least 6 characters"
                    secureTextEntry
                    textContentType="newPassword"
                  />
                </Input>
              </VStack>
              <VStack className="gap-1.5">
                <Text className="text-typography-400 text-xs font-bold uppercase tracking-widest">
                  Confirm new password
                </Text>
                <Input>
                  <InputField
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Repeat new password"
                    secureTextEntry
                    textContentType="newPassword"
                  />
                </Input>
              </VStack>
              {pwMessage && (
                <Box
                  className={`rounded-xl px-4 py-3 ${
                    pwMessage.ok
                      ? 'bg-success-500/10 border border-success-500/30'
                      : 'bg-error-500/10 border border-error-500/30'
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      pwMessage.ok ? 'text-success-500' : 'text-error-500'
                    }`}
                  >
                    {pwMessage.text}
                  </Text>
                </Box>
              )}
              <Pressable
                onPress={onChangePassword}
                disabled={pwBusy}
                className={`rounded-xl py-3 items-center ${pwBusy ? 'bg-primary-500/60' : 'bg-primary-500'}`}
                accessibilityRole="button"
                accessibilityLabel="Update password"
              >
                {pwBusy ? (
                  <Spinner size="small" color="#ffffff" />
                ) : (
                  <Text className="text-white text-sm font-bold">Update Password</Text>
                )}
              </Pressable>
            </VStack>
          )}

          <Pressable
            onPress={() => setShowDeleteForm((v) => !v)}
            className="rounded-xl py-3 items-center"
            accessibilityRole="button"
            accessibilityLabel="Delete account"
          >
            <Text className="text-error-500 text-sm font-bold">
              {showDeleteForm ? 'Cancel deletion' : 'Delete account'}
            </Text>
          </Pressable>

          {showDeleteForm && (
            <VStack className="gap-3">
              <Text className="text-typography-400 text-xs">
                This permanently deletes your account, watchlist, and favorites. Enter your
                password to confirm.
              </Text>
              <Input>
                <InputField
                  value={deletePassword}
                  onChangeText={setDeletePassword}
                  placeholder="Your password"
                  secureTextEntry
                  textContentType="password"
                />
              </Input>
              {deleteError && (
                <Box className="rounded-xl px-4 py-3 bg-error-500/10 border border-error-500/30">
                  <Text className="text-error-500 text-sm font-semibold">{deleteError}</Text>
                </Box>
              )}
              <Pressable
                onPress={onDeleteAccount}
                disabled={deleteBusy}
                className={`rounded-xl py-3 items-center ${deleteBusy ? 'bg-error-500/60' : 'bg-error-500'}`}
                accessibilityRole="button"
                accessibilityLabel="Confirm delete account"
              >
                {deleteBusy ? (
                  <Spinner size="small" color="#ffffff" />
                ) : (
                  <Text className="text-white text-sm font-bold">Yes, Delete Everything</Text>
                )}
              </Pressable>
            </VStack>
          )}
        </VStack>
      )}

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
      <Box className="items-center mt-8 mb-6">
        <Text className="text-typography-400 text-xs">
          CineCue v1.1.0 • Powered by TMDB
        </Text>
      </Box>
      <WebFooter />
    </ScrollView>
  );
}
