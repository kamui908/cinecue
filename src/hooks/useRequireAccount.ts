import { useRouter } from 'expo-router';
import { useAuth, PendingTrackAction } from '../context/AuthContext';

/**
 * Gate for tracking taps (favorite / watchlist). Returns true when the user
 * is logged in; otherwise stashes the intended action and sends them to the
 * login screen — the action completes automatically right after login.
 */
export function useRequireAccount() {
  const { user, setPendingAction } = useAuth();
  const router = useRouter();

  return (action: PendingTrackAction): boolean => {
    if (user) return true;
    setPendingAction(action);
    router.push('/auth/login');
    return false;
  };
}
