export function getToken() {
    return sessionStorage.getItem('token') || localStorage.getItem('token');
}

export function isAuthenticated() {
    return getToken() === 'true';
}

export function logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('isRemember');
    localStorage.removeItem('token');
    localStorage.removeItem('isRemember');
}

export function getUser() {
    const user = sessionStorage.getItem('user') || localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}