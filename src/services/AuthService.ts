export function getToken() {
    return sessionStorage.getItem('token') || localStorage.getItem('token');
}

export function isAuthenticated() {
    const token = getToken();
    return token && token !== 'true' && token.length > 0;
}

export function logout() {
    // Remove authentication status
    sessionStorage.removeItem('islogined');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('isRemember');
    localStorage.removeItem('token');
    localStorage.removeItem('islogined');
    localStorage.removeItem('isRemember');
    
    // Remove user data
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userEmail');
}
export function setToken(token: string) {
    sessionStorage.setItem('token', token);
    localStorage.setItem('token', token);
}

export function setUser(userData: any) {
    const user = {
        id: userData.id,
        fullname: userData.fullname || userData.name,  // Use fullname from API, fallback to name
        email: userData.email,
        role: userData.role || 'user',
        department: userData.department || '',
        position: userData.position || '',
        employee_id: userData.employee_id || '',
        organization: userData.organization || ''
    };
    
    sessionStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('user', JSON.stringify(user));
    
    // Giữ lại các field riêng lẻ để tương thích ngược
    sessionStorage.setItem('userName', userData.fullname || userData.name || '');
    sessionStorage.setItem('userEmail', userData.email || '');
}

export function getUser() {
    const user = sessionStorage.getItem('user') || localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

export function getUserName() {
    const user = getUser();
    return user?.fullname || sessionStorage.getItem('userName') || '';
}

export function getUserEmail() {
    const user = getUser();
    return user?.email || sessionStorage.getItem('userEmail') || '';
}

export interface UserData {
    id: number;
    fullname: string;
    email: string;
    role: string;
    department: string;
    position: string;
    employee_id: string;
    organization: string;
}

export function getCurrentUser(): UserData | null {
    return getUser();
}

export function isUserLoggedIn(): boolean {
    const token = getToken();
    const user = getUser();
    const isLoggedIn = sessionStorage.getItem('islogined') === 'true' || 
                      localStorage.getItem('islogined') === 'true';
    
    return !!(token && user && isLoggedIn);
}