export function getToken() {
    return sessionStorage.getItem('token') || localStorage.getItem('token');
}

export function isAuthenticated() {
    const token = getToken();
    return token && token !== 'true' && token.length > 0;
}

export function logout() {
    sessionStorage.removeItem('islogined');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('isRemember');
    localStorage.removeItem('token');
    localStorage.removeItem('islogined');
    localStorage.removeItem('isRemember');
}
export function setToken(token: string) {
    sessionStorage.setItem('token', token);
    localStorage.setItem('token', token);
}

export function getUser() {
    const user = sessionStorage.getItem('user') || localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}