import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe, Languages, Info, FileText, Shield, RotateCcw,
    MessageSquare, Star, ChevronLeft, ArrowRight, Check,
    ExternalLink, Mail, Phone, MapPin, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MoreView = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const lang = i18n.language === 'ar' ? 'ar' : 'en';
    const isRTL = lang === 'ar';

    const [showCountryModal, setShowCountryModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);

    const [selectedCountry, setSelectedCountry] = useState(() => {
        return localStorage.getItem('sukarak_country') || 'مصر';
    });
    const [selectedLanguage, setSelectedLanguage] = useState(lang === 'ar' ? 'العربية' : 'English');

    const countries = [
        { name: 'مصر', nameEn: 'Egypt', flag: '🇪🇬', currency: 'EGP' },
        { name: 'السعودية', nameEn: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR' },
        { name: 'الإمارات', nameEn: 'UAE', flag: '🇦🇪', currency: 'AED' },
        { name: 'الكويت', nameEn: 'Kuwait', flag: '🇰🇼', currency: 'KWD' },
        { name: 'قطر', nameEn: 'Qatar', flag: '🇶🇦', currency: 'QAR' },
        { name: 'البحرين', nameEn: 'Bahrain', flag: '🇧🇭', currency: 'BHD' },
        { name: 'عمان', nameEn: 'Oman', flag: '🇴🇲', currency: 'OMR' },
        { name: 'الأردن', nameEn: 'Jordan', flag: '🇯🇴', currency: 'JOD' },
        { name: 'العراق', nameEn: 'Iraq', flag: '🇮🇶', currency: 'IQD' },
        { name: 'ليبيا', nameEn: 'Libya', flag: '🇱🇾', currency: 'LYD' },
        { name: 'السودان', nameEn: 'Sudan', flag: '🇸🇩', currency: 'SDG' },
    ];

    const languages = [
        { name: 'العربية', code: 'ar', flag: '🇪🇬' },
        { name: 'English', code: 'en', flag: '🇬🇧' },
    ];

    const handleCountrySelect = (country) => {
        setSelectedCountry(isRTL ? country.name : country.nameEn);
        localStorage.setItem('sukarak_country', isRTL ? country.name : country.nameEn);
        localStorage.setItem('sukarak_currency', country.currency);
        setShowCountryModal(false);
    };

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language.name);
        i18n.changeLanguage(language.code);
        localStorage.setItem('i18nextLng', language.code);
        setShowLanguageModal(false);
    };

    const handleRateApp = () => {
        // Try to open store links
        const isAndroid = /Android/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isAndroid) {
            window.open('https://play.google.com/store/apps/details?id=com.sukarak.mazboot', '_blank');
        } else if (isIOS) {
            window.open('https://apps.apple.com/app/sukarak-mazboot/id1234567890', '_blank');
        } else {
            alert(isRTL ? 'شكراً لتقييمك! 💚' : 'Thanks for your rating! 💚');
        }
    };

    // ── Modal Component ──
    const Modal = ({ show, onClose, title, children }) => (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/40 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        className="w-full max-w-lg bg-white rounded-t-3xl overflow-hidden max-h-[85vh]"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-black text-gray-800">{title}</h3>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        {/* Modal Body */}
                        <div className="overflow-y-auto max-h-[70vh] p-6">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // ── Settings Item Component ──
    const SettingsItem = ({ icon: Icon, iconColor, iconBg, label, value, onClick }) => (
        <motion.button
            onClick={onClick}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-4 px-5 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
        >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <span className="flex-1 text-right text-[15px] font-bold text-gray-700 group-hover:text-gray-900 transition">
                {label}
            </span>
            {value && (
                <span className="text-sm text-gray-400 font-medium">{value}</span>
            )}
            <ChevronLeft className="w-4 h-4 text-gray-300 rtl:rotate-0 ltr:rotate-180" />
        </motion.button>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#f8fafc] pb-28" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
                <div className="max-w-lg mx-auto flex items-center justify-between px-5 py-4">
                    <h1 className="text-xl font-black text-gray-800">
                        {isRTL ? 'المزيد' : 'More'}
                    </h1>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-emerald-600" />
                    </div>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-5 py-6 space-y-8">

                {/* ═══════════════════════════════════════ */}
                {/* General Settings Section */}
                {/* ═══════════════════════════════════════ */}
                <div className="space-y-3">
                    <SettingsItem
                        icon={Globe}
                        iconColor="text-blue-500"
                        iconBg="bg-blue-50"
                        label={isRTL ? 'البلد' : 'Country'}
                        value={selectedCountry}
                        onClick={() => setShowCountryModal(true)}
                    />
                    <SettingsItem
                        icon={Languages}
                        iconColor="text-purple-500"
                        iconBg="bg-purple-50"
                        label={isRTL ? 'اللغة' : 'Language'}
                        value={selectedLanguage}
                        onClick={() => setShowLanguageModal(true)}
                    />
                </div>

                {/* ═══════════════════════════════════════ */}
                {/* About Section */}
                {/* ═══════════════════════════════════════ */}
                <div>
                    <h2 className="text-[15px] font-black text-gray-800 mb-3 px-1">
                        {isRTL ? 'عن التطبيق' : 'About the App'}
                    </h2>
                    <div className="space-y-3">
                        <SettingsItem
                            icon={Info}
                            iconColor="text-emerald-500"
                            iconBg="bg-emerald-50"
                            label={isRTL ? 'من نحن' : 'About Us'}
                            onClick={() => navigate('/about-us')}
                        />
                        <SettingsItem
                            icon={FileText}
                            iconColor="text-indigo-500"
                            iconBg="bg-indigo-50"
                            label={isRTL ? 'الشروط والأحكام' : 'Terms & Conditions'}
                            onClick={() => navigate('/terms')}
                        />
                        <SettingsItem
                            icon={Shield}
                            iconColor="text-teal-500"
                            iconBg="bg-teal-50"
                            label={isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
                            onClick={() => navigate('/privacy-policy')}
                        />
                        <SettingsItem
                            icon={RotateCcw}
                            iconColor="text-rose-500"
                            iconBg="bg-rose-50"
                            label={isRTL ? 'سياسة الاسترجاع' : 'Refund Policy'}
                            onClick={() => navigate('/refund-policy')}
                        />
                    </div>
                </div>

                {/* ═══════════════════════════════════════ */}
                {/* Contact Section */}
                {/* ═══════════════════════════════════════ */}
                <div>
                    <h2 className="text-[15px] font-black text-gray-800 mb-3 px-1">
                        {isRTL ? 'تواصل معنا' : 'Contact Us'}
                    </h2>
                    <div className="space-y-3">
                        <SettingsItem
                            icon={MessageSquare}
                            iconColor="text-sky-500"
                            iconBg="bg-sky-50"
                            label={isRTL ? 'تواصل معنا' : 'Contact Us'}
                            onClick={() => setShowContactModal(true)}
                        />
                        <SettingsItem
                            icon={Star}
                            iconColor="text-amber-500"
                            iconBg="bg-amber-50"
                            label={isRTL ? 'تقييم التطبيق' : 'Rate the App'}
                            onClick={handleRateApp}
                        />
                    </div>
                </div>

                {/* ═══════════════════════════════════════ */}
                {/* App Version */}
                {/* ═══════════════════════════════════════ */}
                <div className="text-center pt-4">
                    <p className="text-xs text-gray-300 font-bold">
                        {isRTL ? 'سُكّرك مظبوط' : 'Sukarak Mazboot'} v3.0
                    </p>
                    <p className="text-[10px] text-gray-200 mt-1">
                        © {new Date().getFullYear()} {isRTL ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'}
                    </p>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════ */}
            {/* MODALS */}
            {/* ═══════════════════════════════════════════════ */}

            {/* Country Modal */}
            <Modal show={showCountryModal} onClose={() => setShowCountryModal(false)} title={isRTL ? 'اختر البلد' : 'Select Country'}>
                <div className="space-y-2">
                    {countries.map((country, idx) => (
                        <motion.button
                            key={idx}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleCountrySelect(country)}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all border ${(isRTL ? country.name : country.nameEn) === selectedCountry
                                ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                                : 'bg-white border-gray-100 hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-2xl">{country.flag}</span>
                            <span className="flex-1 text-right font-bold text-gray-700 text-sm">
                                {isRTL ? country.name : country.nameEn}
                            </span>
                            <span className="text-xs text-gray-400">{country.currency}</span>
                            {(isRTL ? country.name : country.nameEn) === selectedCountry && (
                                <Check className="w-5 h-5 text-emerald-500" />
                            )}
                        </motion.button>
                    ))}
                </div>
            </Modal>

            {/* Language Modal */}
            <Modal show={showLanguageModal} onClose={() => setShowLanguageModal(false)} title={isRTL ? 'اختر اللغة' : 'Select Language'}>
                <div className="space-y-3">
                    {languages.map((language, idx) => (
                        <motion.button
                            key={idx}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleLanguageSelect(language)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all border ${language.name === selectedLanguage
                                ? 'bg-purple-50 border-purple-200 shadow-sm'
                                : 'bg-white border-gray-100 hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-2xl">{language.flag}</span>
                            <span className="flex-1 text-right font-bold text-gray-700">{language.name}</span>
                            {language.name === selectedLanguage && (
                                <Check className="w-5 h-5 text-purple-500" />
                            )}
                        </motion.button>
                    ))}
                </div>
            </Modal>



            {/* Contact Us Modal */}
            <Modal show={showContactModal} onClose={() => setShowContactModal(false)} title={isRTL ? 'تواصل معنا' : 'Contact Us'}>
                <div className="space-y-4">
                    <div className="text-center mb-4">
                        <p className="text-sm text-gray-500">
                            {isRTL ? 'يسعدنا تواصلك معنا! اختر وسيلة التواصل المناسبة' : 'We\'d love to hear from you! Choose a suitable contact method'}
                        </p>
                    </div>

                    <a href="mailto:support@sukarak-mazboot.com" className="flex items-center gap-4 px-5 py-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition group">
                        <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition">
                            <Mail className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-gray-700 text-sm">{isRTL ? 'البريد الإلكتروني' : 'Email'}</p>
                            <p className="text-xs text-gray-400">support@sukarak-mazboot.com</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-300" />
                    </a>

                    <a href="https://wa.me/201234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 px-5 py-4 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 transition group">
                        <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition">
                            <MessageSquare className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-gray-700 text-sm">{isRTL ? 'واتساب' : 'WhatsApp'}</p>
                            <p className="text-xs text-gray-400" dir="ltr">+20 123 456 7890</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-300" />
                    </a>

                    <button
                        onClick={() => { setShowContactModal(false); navigate('/support'); }}
                        className="w-full flex items-center gap-4 px-5 py-4 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 transition group"
                    >
                        <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition">
                            <Phone className="w-5 h-5 text-purple-500" />
                        </div>
                        <div className="flex-1 text-right">
                            <p className="font-bold text-gray-700 text-sm">{isRTL ? 'الدعم الفني' : 'Technical Support'}</p>
                            <p className="text-xs text-gray-400">{isRTL ? 'تذاكر الدعم' : 'Support Tickets'}</p>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-gray-300 rtl:rotate-0 ltr:rotate-180" />
                    </button>
                </div>
            </Modal>

        </div>
    );
};

export default MoreView;
