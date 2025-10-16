import { useState, useEffect } from 'react';
import { getCurrentUser, isUserLoggedIn, UserData, logout } from '../services/AuthService.ts';
import { fetchCurrentUser, refreshUserData } from '../services/UserService.ts';

export function useAuth() {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        setIsLoading(true);
        
        try {
            // Kiểm tra user từ localStorage/sessionStorage trước
            const localUser = getCurrentUser();
            const loggedIn = isUserLoggedIn();
            
            if (localUser && loggedIn) {
                setUser(localUser);
                setIsAuthenticated(true);
                
                // Validate và refresh user data từ server
                const refreshedUser = await refreshUserData();
                if (refreshedUser) {
                    setUser(refreshedUser);
                } else {
                    // Token không hợp lệ, clear local data
                    handleLogout();
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error('Auth initialization error:', error);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (userData: UserData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const refreshUser = async () => {
        try {
            const refreshedUser = await refreshUserData();
            if (refreshedUser) {
                setUser(refreshedUser);
                return refreshedUser;
            }
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
        return null;
    };

    return {
        user,
        isLoading,
        isAuthenticated,
        login: handleLogin,
        logout: handleLogout,
        refreshUser,
        initializeAuth
    };
}

export function useUser() {
    const [user, setUser] = useState<UserData | null>(getCurrentUser());

    useEffect(() => {
        // Listen for storage changes to sync across tabs
        const handleStorageChange = () => {
            setUser(getCurrentUser());
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const updateUser = async () => {
        const refreshedUser = await refreshUserData();
        if (refreshedUser) {
            setUser(refreshedUser);
        }
        return refreshedUser;
    };

    return {
        user,
        updateUser,
        isLoggedIn: isUserLoggedIn()
    };
}