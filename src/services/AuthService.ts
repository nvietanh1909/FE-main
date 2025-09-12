export function getToken() {
    return sessionStorage.getItem('islogined') || localStorage.getItem('islogined');
}

export function isAuthenticated() {
    return getToken() === 'true';
}

export function logout() {
    sessionStorage.removeItem('islogined');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('isRemember');
    localStorage.removeItem('token');
    localStorage.removeItem('islogined');
    localStorage.removeItem('isRemember');
}

export function getUser() {
    const user = sessionStorage.getItem('user') || localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}