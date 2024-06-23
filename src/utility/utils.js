import { destroyCookie, parseCookies, setCookie } from 'nookies';

export const clearTokenCookie = (key, options = {}) => {
    const defaultOptions = {
        path: '/', // Specify a common path for all cookies
    };
    destroyCookie(null, key, { ...defaultOptions, ...options });
};

export const createCookie = (key, value, options = {}) => {
    const defaultOptions = {
        path: '/', // Specify a common path for all cookies
    };
    setCookie(null, key, value, { ...defaultOptions, ...options });
};

export const getCookie = (key) => {
    const cookies = parseCookies();
    return cookies[key];
};