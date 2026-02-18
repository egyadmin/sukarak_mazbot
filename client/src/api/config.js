/**
 * API Configuration
 * Supports Local Web, Mobile Emulator (Android), and Physical Devices
 */

const getBaseUrl = () => {
    const origin = window.location.origin;
    const hostname = window.location.hostname;
    const port = window.location.port;

    // If running through Vite dev server (web OR Capacitor live reload), 
    // keep empty — Vite proxy handles /api and /media
    if (port === '5173') return '';

    // Production Capacitor app (no Vite proxy)
    const isMobileApp = origin.startsWith('capacitor://') ||
        (hostname === 'localhost' && port === '');
    const isAndroidEmulator = /sdk_gphone|emulator|generic|google_sdk/i.test(navigator.userAgent);

    if (isMobileApp) {
        const hostIp = isAndroidEmulator ? '10.0.2.2' : '192.168.3.37';
        return `http://${hostIp}:8001`;
    }

    // Default for web (Vite proxy)
    return '';
};

export const BASE_URL = getBaseUrl();
export const API_BASE = '/api/v1';
export const MEDIA_BASE = '/media';

console.log('API Configuration Loaded:', {
    origin: window.location.origin,
    hostname: window.location.hostname,
    BASE_URL,
    userAgent: navigator.userAgent
});
