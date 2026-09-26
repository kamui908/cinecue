import React from 'react';
import {
  Box,
  Text,
  VStack,
  Pressable,
  Input,
  InputField,
  Spinner,
} from './ui/gluestack';
import { useAuth } from '../context/AuthContext';
import { Icons } from './Icons';

/** Log out / change password / delete account card. Used on the settings page. */
export function AccountSettings() {
  const { logout, changePassword, deleteAccount } = useAuth();

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
    <VStack className="bg-background-800 rounded-2xl p-4 gap-3">
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
  );
}
