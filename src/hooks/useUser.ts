import { useState, useEffect } from 'react';
import { getUser, setUser, getToken, isAuthenticated } from '@/services/AuthService';
import { fetchCurrentUser, UserProfile, initializeUserData } from '@/services/UserService';

export interface UseUserReturn {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

/**
 * Custom hook để quản lý thông tin user
 * Tự động load từ API /me khi có token
 */
export const useUser = (): UseUserReturn => {
  const [user, setUserState] = useState<UserProfile | null>(getUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = async () => {
    if (!isAuthenticated()) {
      setUserState(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchCurrentUser();
      
      if (result.success && result.data) {
        setUser(result.data); // Lưu vào storage
        setUserState(result.data); // Update state
        console.log('✅ User data refreshed:', result.data.fullname);
      } else {
        setError(result.error || 'Failed to fetch user data');
        console.error('❌ Failed to fetch user:', result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('❌ Error refreshing user:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-load user data khi hook được mount
  useEffect(() => {
    const token = getToken();
    if (token && !user) {
      refreshUser();
    }
  }, []);

  // Listen for storage changes (khi user login/logout ở tab khác)
  useEffect(() => {
    const handleStorageChange = () => {
      const currentUser = getUser();
      setUserState(currentUser);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    user,
    loading,
    error,
    refreshUser
  };
};

export default useUser;