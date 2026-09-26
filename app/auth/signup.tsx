import React from 'react';
import { ScrollView } from 'react-native';
import { Link, Redirect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { useAuth } from '../../src/context/AuthContext';
import { Icons } from '../../src/components/Icons';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, status, signup, pendingAction } = useAuth();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  if (status === 'authed' && user) return <Redirect href="/" />;

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const onSubmit = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await signup(name, email, password);
      goBack();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create your account.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background-950"
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: insets.top + 16,
        paddingBottom: 32,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      keyboardShouldPersistTaps="handled"
    >
      <VStack className="w-full max-w-[420px] px-6">
        <Pressable
          onPress={() => router.back()}
          className="self-start bg-background-800 rounded-full p-2 mb-6"
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Icons.ChevronLeft size={20} color="#a1a1aa" />
        </Pressable>

        <Text className="text-typography-50 font-heading text-4xl">
          Cine<Text className="text-primary-500 font-heading">Cue</Text>
        </Text>
        <Text className="text-typography-50 text-2xl font-bold mt-4">Create an account</Text>
        <Text className="text-typography-400 text-sm mt-1">
          Save watchlists and favorites that follow you everywhere.
        </Text>

        {pendingAction && (
          <HStack className="mt-4 bg-info-500/10 border border-info-500/30 rounded-xl px-4 py-3 gap-2 items-start">
            <Icons.Info size={16} color="#22d3ee" />
            <Text className="text-info-500 text-sm flex-1">
              Create an account to save that title — we&apos;ll add it right after.
            </Text>
          </HStack>
        )}

        {error && (
          <Box className="mt-4 bg-error-500/10 border border-error-500/30 rounded-xl px-4 py-3">
            <Text className="text-error-500 text-sm font-semibold">{error}</Text>
          </Box>
        )}

        <VStack className="mt-6 gap-3">
          <VStack className="gap-1.5">
            <Text className="text-typography-400 text-xs font-bold uppercase tracking-widest">
              Name
            </Text>
            <Input>
              <InputField
                value={name}
                onChangeText={setName}
                placeholder="Jane Doe"
                autoCapitalize="words"
                autoCorrect={false}
                textContentType="name"
                returnKeyType="next"
              />
            </Input>
          </VStack>

          <VStack className="gap-1.5">
            <Text className="text-typography-400 text-xs font-bold uppercase tracking-widest">
              Email
            </Text>
            <Input>
              <InputField
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                returnKeyType="next"
              />
            </Input>
          </VStack>

          <VStack className="gap-1.5">
            <Text className="text-typography-400 text-xs font-bold uppercase tracking-widest">
              Password
            </Text>
            <Input>
              <InputField
                value={password}
                onChangeText={setPassword}
                placeholder="At least 6 characters"
                secureTextEntry
                textContentType="newPassword"
                onSubmitEditing={onSubmit}
                returnKeyType="go"
              />
            </Input>
          </VStack>

          <Pressable
            onPress={onSubmit}
            disabled={busy || status === 'loading'}
            className={`mt-2 rounded-xl py-3.5 items-center flex-row justify-center gap-2 ${
              busy ? 'bg-primary-500/60' : 'bg-primary-500'
            }`}
            accessibilityRole="button"
            accessibilityLabel="Create account"
          >
            {busy ? (
              <Spinner size="small" color="#ffffff" />
            ) : (
              <Text className="text-white text-base font-bold">Create Account</Text>
            )}
          </Pressable>
        </VStack>

        <HStack className="mt-6 items-center justify-center gap-1.5">
          <Text className="text-typography-400 text-sm">Already have an account?</Text>
          <Link href="/auth/login" asChild>
            <Pressable accessibilityRole="button" accessibilityLabel="Log in">
              <Text className="text-primary-500 text-sm font-bold">Log in</Text>
            </Pressable>
          </Link>
        </HStack>
      </VStack>
    </ScrollView>
  );
}
