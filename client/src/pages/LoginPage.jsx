import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight,
    Chrome, Shield, KeyRound, Phone, ChevronLeft
} from 'lucide-react';
import { API_BASE } from '../api/config';

const GOOGLE_CLIENT_ID = '929086350507-lb0vl2uv53tucm5n1irhbedm7ggs6j00.apps.googleusercontent.com';

const LoginPage = ({ onLogin }) => {
    const { i18n } = useTranslation();
    const lang = i18n.language === 'ar' ? 'ar' : 'en';
    const googleBtnRef = useRef(null);

    const [view, setView] = useState('login'); // login, register, otp
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false);

    // Login form
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPass, setLoginPass] = useState('');

    // Register form
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regPass, setRegPass] = useState('');

    // OTP
    const [otpCode, setOtpCode] = useState('');
    const [otpPreview, setOtpPreview] = useState('');

    const saveUser = (data) => {
        localStorage.setItem('sukarak_token', data.access_token);
        localStorage.setItem('sukarak_user_id', data.user.id);
        localStorage.setItem('sukarak_user_name', data.user.name);
        localStorage.setItem('sukarak_user_email', data.user.email);
        localStorage.setItem('sukarak_user_role', data.user.role || 'user');
        if (data.user.phone) localStorage.setItem('sukarak_user_phone', data.user.phone);
        if (data.user.profile_image) localStorage.setItem('sukarak_user_image', data.user.profile_image);
        onLogin(data.user);
    };

    const handleLogin = async () => {
        if (!loginEmail || !loginPass) {
            setError(lang === 'ar' ? 'الرجاء ملء جميع الحقول' : 'Please fill all fields');
            return;
        }
        setLoading(true); setError('');
        try {
            const formData = new URLSearchParams();
            formData.append('username', loginEmail);
            formData.append('password', loginPass);
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                saveUser(data);
            } else {
                setError(data.detail || (lang === 'ar' ? 'خطأ في البريد أو كلمة المرور' : 'Invalid email or password'));
            }
        } catch (e) {
            setError(lang === 'ar' ? 'خطأ في الاتصال بالسيرفر' : 'Server connection error');
        } finally { setLoading(false); }
    };

    const handleRegister = async () => {
        if (!regName || !regEmail || !regPass) {
            setError(lang === 'ar' ? 'الرجاء ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
            return;
        }
        setLoading(true); setError('');
        try {
            // Send OTP first
            const res = await fetch(`${API_BASE}/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: regEmail })
            });
            const data = await res.json();
            if (res.ok) {
                setOtpPreview(data.otp_preview || '');
                setView('otp');
            } else {
                setError(data.detail || (lang === 'ar' ? 'حدث خطأ' : 'Error occurred'));
            }
        } catch (e) {
            setError(lang === 'ar' ? 'خطأ في الاتصال' : 'Connection error');
        } finally { setLoading(false); }
    };

    const handleVerifyOTP = async () => {
        if (!otpCode) {
            setError(lang === 'ar' ? 'الرجاء إدخال رمز التحقق' : 'Please enter OTP code');
            return;
        }
        setLoading(true); setError('');
        try {
            const res = await fetch(`${API_BASE}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: regEmail,
                    code: otpCode,
                    name: regName,
                    password: regPass
                })
            });
            const data = await res.json();
            if (res.ok) {
                saveUser(data);
            } else {
                setError(data.detail || (lang === 'ar' ? 'رمز التحقق غير صحيح' : 'Invalid OTP'));
            }
        } catch (e) {
            setError(lang === 'ar' ? 'خطأ في الاتصال' : 'Connection error');
        } finally { setLoading(false); }
    };

    // Decode JWT token from Google
    const decodeJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(window.atob(base64));
        } catch { return null; }
    };

    // Handle Google credential response
    const handleGoogleCredentialResponse = async (response) => {
        setLoading(true); setError('');
        try {
            const decoded = decodeJwt(response.credential);
            if (!decoded || !decoded.email) {
                setError(lang === 'ar' ? 'فشل قراءة بيانات Google' : 'Failed to read Google data');
                setLoading(false);
                return;
            }
            const res = await fetch(`${API_BASE}/auth/google-auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: decoded.email,
                    name: decoded.name || decoded.email.split('@')[0],
                    google_id: decoded.sub || '',
                    photo: decoded.picture || ''
                })
            });
            const data = await res.json();
            if (res.ok) {
                saveUser(data);
            } else {
                setError(data.detail || (lang === 'ar' ? 'فشل تسجيل الدخول' : 'Login failed'));
            }
        } catch (e) {
            setError(lang === 'ar' ? 'خطأ في الاتصال' : 'Connection error');
        } finally { setLoading(false); }
    };

    const [googleReady, setGoogleReady] = useState(false);

    // Initialize Google Sign-In with renderButton (works inline on mobile)
    useEffect(() => {
        const initGoogle = () => {
            if (window.google && window.google.accounts) {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleGoogleCredentialResponse,
                    auto_select: false,
                });
                // Render buttons inline
                const loginBtn = document.getElementById('google-signin-login');
                const registerBtn = document.getElementById('google-signin-register');
                const opts = { theme: 'filled_black', size: 'large', width: 360, text: 'signin_with', shape: 'pill', locale: lang === 'ar' ? 'ar' : 'en' };
                if (loginBtn) window.google.accounts.id.renderButton(loginBtn, opts);
                if (registerBtn) window.google.accounts.id.renderButton(registerBtn, { ...opts, text: 'signup_with' });
                setGoogleReady(true);
            }
        };
        if (window.google && window.google.accounts) {
            initGoogle();
        } else {
            const interval = setInterval(() => {
                if (window.google && window.google.accounts) {
                    initGoogle();
                    clearInterval(interval);
                }
            }, 200);
            return () => clearInterval(interval);
        }
    }, [view]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #0f766e 60%, #134e4a 100%)'
        }}>
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-3xl" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute top-[30%] left-[20%] w-[200px] h-[200px] rounded-full bg-cyan-400/5 blur-2xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                {/* Logo Section - Animated & Glowing */}
                <div className="text-center mb-8">
                    <div className="relative w-32 h-32 mx-auto mb-5">
                        {/* Outer glow ring - slow rotate */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-[-12px] rounded-full"
                            style={{
                                background: 'conic-gradient(from 0deg, transparent, rgba(20,184,166,0.3), transparent, rgba(6,182,212,0.2), transparent)',
                                filter: 'blur(8px)',
                            }}
                        />
                        {/* Middle glow ring - counter rotate */}
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-[-6px] rounded-full"
                            style={{
                                background: 'conic-gradient(from 180deg, transparent, rgba(52,211,153,0.25), transparent, rgba(20,184,166,0.3), transparent)',
                                filter: 'blur(5px)',
                            }}
                        />
                        {/* Pulsing glow behind logo */}
                        <motion.div
                            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute inset-0 rounded-full bg-teal-400/20"
                            style={{ filter: 'blur(20px)' }}
                        />
                        {/* Inner bright ring */}
                        <motion.div
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                            className="absolute inset-[2px] rounded-full border-2 border-teal-400/30"
                        />
                        {/* Logo container with float animation */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0, y: [0, -6, 0] }}
                            transition={{
                                scale: { type: 'spring', delay: 0.2, stiffness: 200 },
                                rotate: { type: 'spring', delay: 0.2, stiffness: 200 },
                                y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }
                            }}
                            className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 shadow-2xl"
                            style={{
                                boxShadow: '0 0 40px rgba(20,184,166,0.3), 0 0 80px rgba(20,184,166,0.1), inset 0 0 20px rgba(255,255,255,0.05)',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,253,250,0.95))',
                            }}
                        >
                            <img src="/logo.png" alt="سكرك مضبوط" className="w-full h-full object-contain p-3" />
                        </motion.div>
                        {/* Sparkle dots */}
                        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                            <motion.div
                                key={i}
                                animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
                                className="absolute w-1.5 h-1.5 rounded-full bg-teal-300"
                                style={{
                                    top: `${50 + 52 * Math.sin(deg * Math.PI / 180)}%`,
                                    left: `${50 + 52 * Math.cos(deg * Math.PI / 180)}%`,
                                    transform: 'translate(-50%, -50%)',
                                    boxShadow: '0 0 6px rgba(20,184,166,0.8)',
                                }}
                            />
                        ))}
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-2xl font-black text-white mb-1"
                        style={{ textShadow: '0 0 20px rgba(20,184,166,0.3)' }}
                    >
                        {lang === 'ar' ? 'سكرك مضبوط' : 'Sukarak Mazbot'}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-sm text-teal-300/50 font-bold"
                    >
                        {lang === 'ar' ? 'تطبيق إدارة السكري الذكي' : 'Smart Diabetes Management'}
                    </motion.p>
                </div>

                {/* Main Card */}
                <div className="bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] rounded-3xl p-6 shadow-2xl">
                    <AnimatePresence mode="wait">
                        {/* ============ LOGIN VIEW ============ */}
                        {view === 'login' && (
                            <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <h2 className="text-lg font-black text-white mb-6 text-center">
                                    {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
                                </h2>

                                <div className="space-y-4">
                                    {/* Email */}
                                    <div className="relative">
                                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                        <input
                                            type="email"
                                            value={loginEmail}
                                            onChange={e => { setLoginEmail(e.target.value); setError(''); }}
                                            placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                                            className="w-full bg-white/[0.06] border border-white/10 rounded-2xl pr-11 pl-4 py-4 text-white text-sm font-bold outline-none focus:border-teal-400/50 placeholder:text-white/20 transition"
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="relative">
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            value={loginPass}
                                            onChange={e => { setLoginPass(e.target.value); setError(''); }}
                                            placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}
                                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
                                            className="w-full bg-white/[0.06] border border-white/10 rounded-2xl pr-11 pl-11 py-4 text-white text-sm font-bold outline-none focus:border-teal-400/50 placeholder:text-white/20 transition"
                                        />
                                        <button onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50">
                                            {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs font-bold text-center bg-red-500/10 py-2 rounded-xl">
                                            {error}
                                        </motion.p>
                                    )}

                                    {/* Login Button */}
                                    <button
                                        onClick={handleLogin}
                                        disabled={loading}
                                        className="w-full bg-gradient-to-l from-teal-500 to-emerald-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 disabled:opacity-50 active:scale-[0.98] transition hover:shadow-xl hover:shadow-teal-500/30"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>
                                            <ArrowRight className="w-5 h-5" />
                                            {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
                                        </>}
                                    </button>

                                    {/* Divider */}
                                    <div className="flex items-center gap-3 my-2">
                                        <div className="flex-1 h-px bg-white/10" />
                                        <span className="text-white/20 text-[10px] font-bold">{lang === 'ar' ? 'أو' : 'OR'}</span>
                                        <div className="flex-1 h-px bg-white/10" />
                                    </div>

                                    {/* Google Login - Embedded inline (works inside mobile app) */}
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="w-full flex justify-center rounded-2xl overflow-hidden" style={{ minHeight: 44 }}>
                                            <div id="google-signin-login" className="w-full" />
                                        </div>
                                    </div>
                                    {!googleReady && (
                                        <div className="w-full bg-white/[0.06] border border-white/10 text-white/30 py-4 rounded-2xl font-bold text-xs text-center">
                                            {lang === 'ar' ? 'جاري تحميل Google...' : 'Loading Google...'}
                                        </div>
                                    )}

                                    {/* Register Link */}
                                    <p className="text-center text-white/30 text-xs font-bold mt-4">
                                        {lang === 'ar' ? 'ليس لديك حساب؟ ' : "Don't have an account? "}
                                        <button onClick={() => { setView('register'); setError(''); }}
                                            className="text-teal-400 hover:text-teal-300 font-black transition">
                                            {lang === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
                                        </button>
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* ============ REGISTER VIEW ============ */}
                        {view === 'register' && (
                            <motion.div key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <div className="flex items-center gap-3 mb-6">
                                    <button onClick={() => { setView('login'); setError(''); }} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition">
                                        <ChevronLeft className="w-5 h-5 text-white/50 rtl:rotate-180" />
                                    </button>
                                    <h2 className="text-lg font-black text-white">
                                        {lang === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
                                    </h2>
                                </div>

                                <div className="space-y-3">
                                    <div className="relative">
                                        <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                        <input value={regName} onChange={e => { setRegName(e.target.value); setError(''); }}
                                            placeholder={lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                                            className="w-full bg-white/[0.06] border border-white/10 rounded-2xl pr-11 pl-4 py-4 text-white text-sm font-bold outline-none focus:border-teal-400/50 placeholder:text-white/20 transition" />
                                    </div>
                                    <div className="relative">
                                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                        <input type="email" value={regEmail} onChange={e => { setRegEmail(e.target.value); setError(''); }}
                                            placeholder={lang === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}
                                            className="w-full bg-white/[0.06] border border-white/10 rounded-2xl pr-11 pl-4 py-4 text-white text-sm font-bold outline-none focus:border-teal-400/50 placeholder:text-white/20 transition" />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                        <input value={regPhone} onChange={e => setRegPhone(e.target.value)}
                                            placeholder={lang === 'ar' ? 'رقم الهاتف (اختياري)' : 'Phone (optional)'}
                                            className="w-full bg-white/[0.06] border border-white/10 rounded-2xl pr-11 pl-4 py-4 text-white text-sm font-bold outline-none focus:border-teal-400/50 placeholder:text-white/20 transition" />
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                        <input type={showPass ? 'text' : 'password'} value={regPass} onChange={e => { setRegPass(e.target.value); setError(''); }}
                                            placeholder={lang === 'ar' ? 'كلمة المرور *' : 'Password *'}
                                            className="w-full bg-white/[0.06] border border-white/10 rounded-2xl pr-11 pl-11 py-4 text-white text-sm font-bold outline-none focus:border-teal-400/50 placeholder:text-white/20 transition" />
                                        <button onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50">
                                            {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    {error && (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs font-bold text-center bg-red-500/10 py-2 rounded-xl">
                                            {error}
                                        </motion.p>
                                    )}

                                    <button onClick={handleRegister} disabled={loading}
                                        className="w-full bg-gradient-to-l from-teal-500 to-emerald-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 disabled:opacity-50 active:scale-[0.98] transition">
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>
                                            <Shield className="w-5 h-5" />
                                            {lang === 'ar' ? 'إنشاء الحساب وإرسال رمز التحقق' : 'Create & Send OTP'}
                                        </>}
                                    </button>

                                    {/* Divider */}
                                    <div className="flex items-center gap-3 my-1">
                                        <div className="flex-1 h-px bg-white/10" />
                                        <span className="text-white/20 text-[10px] font-bold">{lang === 'ar' ? 'أو' : 'OR'}</span>
                                        <div className="flex-1 h-px bg-white/10" />
                                    </div>

                                    {/* Google Signup - Embedded inline */}
                                    <div className="w-full flex justify-center rounded-2xl overflow-hidden" style={{ minHeight: 44 }}>
                                        <div id="google-signin-register" className="w-full" />
                                    </div>
                                    {!googleReady && (
                                        <div className="w-full bg-white/[0.06] border border-white/10 text-white/30 py-4 rounded-2xl font-bold text-xs text-center">
                                            {lang === 'ar' ? 'جاري تحميل Google...' : 'Loading Google...'}
                                        </div>
                                    )}

                                    <p className="text-center text-white/30 text-xs font-bold">
                                        {lang === 'ar' ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
                                        <button onClick={() => { setView('login'); setError(''); }}
                                            className="text-teal-400 hover:text-teal-300 font-black transition">
                                            {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
                                        </button>
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* ============ OTP VIEW ============ */}
                        {view === 'otp' && (
                            <motion.div key="otp" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-400/20 to-emerald-500/20 border border-teal-400/20 flex items-center justify-center">
                                        <KeyRound className="w-8 h-8 text-teal-400" />
                                    </div>
                                    <h2 className="text-lg font-black text-white mb-2">
                                        {lang === 'ar' ? 'تحقق من بريدك الإلكتروني' : 'Verify Your Email'}
                                    </h2>
                                    <p className="text-white/30 text-xs font-bold">
                                        {lang === 'ar'
                                            ? `تم إرسال رمز تحقق مكون من 6 أرقام إلى ${regEmail}`
                                            : `A 6-digit code was sent to ${regEmail}`}
                                    </p>
                                    {otpPreview && (
                                        <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2">
                                            <p className="text-amber-400 text-xs font-bold">
                                                🧪 {lang === 'ar' ? 'رمز التحقق للتجربة:' : 'Test OTP:'} <span className="text-lg font-black tracking-widest">{otpPreview}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <input
                                        value={otpCode}
                                        onChange={e => { setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                                        placeholder="000000"
                                        maxLength={6}
                                        className="w-full bg-white/[0.06] border border-white/10 rounded-2xl px-4 py-5 text-white text-2xl font-black text-center tracking-[0.5em] outline-none focus:border-teal-400/50 placeholder:text-white/10 transition"
                                    />

                                    {error && (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs font-bold text-center bg-red-500/10 py-2 rounded-xl">
                                            {error}
                                        </motion.p>
                                    )}

                                    <button onClick={handleVerifyOTP} disabled={loading || otpCode.length < 6}
                                        className="w-full bg-gradient-to-l from-teal-500 to-emerald-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 disabled:opacity-50 active:scale-[0.98] transition">
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>
                                            <Shield className="w-5 h-5" />
                                            {lang === 'ar' ? 'تأكيد وإنشاء الحساب' : 'Verify & Create Account'}
                                        </>}
                                    </button>

                                    <div className="flex justify-between items-center">
                                        <button onClick={() => { setView('register'); setError(''); }}
                                            className="text-white/30 text-xs font-bold hover:text-white/50 flex items-center gap-1 transition">
                                            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                                            {lang === 'ar' ? 'رجوع' : 'Back'}
                                        </button>
                                        <button onClick={handleRegister} disabled={loading}
                                            className="text-teal-400 text-xs font-bold hover:text-teal-300 transition disabled:opacity-50">
                                            {lang === 'ar' ? 'إعادة إرسال الرمز' : 'Resend Code'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <p className="text-center text-white/15 text-[10px] font-bold mt-6">
                    © 2024 Sukarak Mazbot • {lang === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
