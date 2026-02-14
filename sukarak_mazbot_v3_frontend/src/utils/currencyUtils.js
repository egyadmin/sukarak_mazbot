/**
 * Currency Conversion Utility
 * Converts prices based on user's selected country
 * Base currency: SAR (Saudi Riyal)
 */

// Exchange rates relative to 1 SAR
const EXCHANGE_RATES = {
    SAR: 1,        // السعودية - ريال سعودي
    EGP: 13.25,    // مصر - جنيه مصري
    AED: 0.98,     // الإمارات - درهم إماراتي
    KWD: 0.082,    // الكويت - دينار كويتي
    QAR: 0.97,     // قطر - ريال قطري
    BHD: 0.10,     // البحرين - دينار بحريني
    OMR: 0.103,    // عُمان - ريال عُماني
    JOD: 0.19,     // الأردن - دينار أردني
    IQD: 349.5,    // العراق - دينار عراقي
    LYD: 1.29,     // ليبيا - دينار ليبي
    SDG: 160.2,    // السودان - جنيه سوداني
};

// Currency symbols in Arabic
const CURRENCY_SYMBOLS = {
    SAR: { ar: 'ر.س', en: 'SAR', symbol: '﷼' },
    EGP: { ar: 'ج.م', en: 'EGP', symbol: 'E£' },
    AED: { ar: 'د.إ', en: 'AED', symbol: 'د.إ' },
    KWD: { ar: 'د.ك', en: 'KWD', symbol: 'د.ك' },
    QAR: { ar: 'ر.ق', en: 'QAR', symbol: 'ر.ق' },
    BHD: { ar: 'د.ب', en: 'BHD', symbol: 'د.ب' },
    OMR: { ar: 'ر.ع', en: 'OMR', symbol: 'ر.ع' },
    JOD: { ar: 'د.أ', en: 'JOD', symbol: 'د.أ' },
    IQD: { ar: 'د.ع', en: 'IQD', symbol: 'د.ع' },
    LYD: { ar: 'د.ل', en: 'LYD', symbol: 'د.ل' },
    SDG: { ar: 'ج.س', en: 'SDG', symbol: 'ج.س' },
};

/**
 * Get the user's selected currency from localStorage
 * @returns {string} Currency code (e.g. "EGP", "SAR")
 */
export const getUserCurrency = () => {
    return localStorage.getItem('sukarak_currency') || 'SAR';
};

/**
 * Convert price from SAR to target currency
 * @param {number} priceInSAR - Price in Saudi Riyals
 * @param {string} [targetCurrency] - Target currency code (auto-detected from localStorage if not provided)
 * @returns {number} Converted price
 */
export const convertPrice = (priceInSAR, targetCurrency) => {
    const currency = targetCurrency || getUserCurrency();
    const rate = EXCHANGE_RATES[currency] || 1;
    return Number(priceInSAR) * rate;
};

/**
 * Format price with currency symbol
 * @param {number} priceInSAR - Price in SAR (base currency)
 * @param {string} [lang] - Language ('ar' or 'en')
 * @param {string} [targetCurrency] - Target currency code
 * @param {boolean} [showDecimals] - Whether to show decimal places (default: true for most, false for IQD/SDG)
 * @returns {string} Formatted price string (e.g. "132.50 ج.م")
 */
export const formatPrice = (priceInSAR, lang = 'ar', targetCurrency, showDecimals) => {
    const currency = targetCurrency || getUserCurrency();
    const converted = convertPrice(priceInSAR, currency);
    const sym = CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS.SAR;

    // For very large currencies (IQD, SDG), don't show decimals
    const useDecimals = showDecimals !== undefined ? showDecimals : !['IQD', 'SDG'].includes(currency);
    const formatted = useDecimals ? converted.toFixed(2) : Math.round(converted).toLocaleString();

    return `${formatted} ${sym[lang] || sym.ar}`;
};

/**
 * Get currency symbol for the current user
 * @param {string} [lang] - Language ('ar' or 'en')
 * @param {string} [targetCurrency] - Target currency code
 * @returns {string} Currency symbol (e.g. "ج.م")
 */
export const getCurrencySymbol = (lang = 'ar', targetCurrency) => {
    const currency = targetCurrency || getUserCurrency();
    const sym = CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS.SAR;
    return sym[lang] || sym.ar;
};

/**
 * Get the exchange rate for a currency
 * @param {string} [currency] - Currency code
 * @returns {number} Exchange rate relative to SAR
 */
export const getExchangeRate = (currency) => {
    return EXCHANGE_RATES[currency || getUserCurrency()] || 1;
};

export default {
    convertPrice,
    formatPrice,
    getUserCurrency,
    getCurrencySymbol,
    getExchangeRate,
    EXCHANGE_RATES,
    CURRENCY_SYMBOLS,
};
