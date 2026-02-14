/**
 * API Configuration
 * Supports Local Web, Mobile Emulator (Android), and Physical Devices
 */

const getBaseUrl = () => {
    const origin = window.location.origin;
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // In Capacitor, the origin is usually capacitor://localhost or http://localhost
    const isMobileApp = origin.startsWith('capacitor://') ||
        (isLocalhost && window.location.port === ''); // Capacitor webview often has no port shown

    // Detect Android Emulator vs Physical Device
    const isAndroidEmulator = /sdk_gphone|emulator|generic|google_sdk/i.test(navigator.userAgent);

    if (isMobileApp || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Android Emulator uses 10.0.2.2 to reach host machine
        // Physical devices use the actual network IP
        const hostIp = isAndroidEmulator ? '10.0.2.2' : window.location.hostname;
        return `http://${hostIp}:5000`;
    }

    // Default for local web development (Vite proxy will handle it if BASE_URL is empty)
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
