import { getToken, setUser } from './AuthService.ts';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    role: string;
    department: string;
    position: string;
    employee_id: string;
    created_at?: string;
    updated_at?: string;
}

export interface UpdateUserRequest {
    name?: string;
    department?: string;
    position?: string;
    employee_id?: string;
}

export interface UserResponse {
    success: boolean;
    data?: UserProfile;
    message?: string;
    error?: string;
}

/**
 * Gọi API /me để lấy thông tin user hiện tại từ token
 */
export async function fetchCurrentUser(): Promise<UserResponse> {
    try {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                error: 'No authentication token found'
            };
        }

        const response = await fetch(`${BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                return {
                    success: false,
                    error: 'Token expired or invalid'
                };
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        return {
            success: true,
            data: result.data || result,
            message: result.message || 'User data fetched successfully'
        };
    } catch (error) {
        console.error('❌ fetchCurrentUser error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch user data'
        };
    }
}

/**
 * Cập nhật thông tin user
 */
export async function updateUserProfile(updates: UpdateUserRequest): Promise<UserResponse> {
    try {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                error: 'No authentication token found'
            };
        }

        const response = await fetch(`${BASE_URL}/auth/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            if (response.status === 401) {
                return {
                    success: false,
                    error: 'Token expired or invalid'
                };
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        return {
            success: true,
            data: result.data || result,
            message: result.message || 'User profile updated successfully'
        };
    } catch (error) {
        console.error('❌ updateUserProfile error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update user profile'
        };
    }
}

/**
 * Validate token bằng cách gọi API /me
 */
export async function validateToken(): Promise<boolean> {
    const result = await fetchCurrentUser();
    return result.success;
}

/**
 * Refresh user data từ server và lưu vào localStorage/sessionStorage
 */
export async function refreshUserData(): Promise<UserProfile | null> {
    const result = await fetchCurrentUser();
    
    if (result.success && result.data) {
        // Lưu data vào storage thông qua AuthService
        setUser(result.data);
        return result.data;
    }
    
    return null;
}