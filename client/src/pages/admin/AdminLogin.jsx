import React, { useState, useEffect } from 'react';
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { API_BASE } from '../../api/config';

const AdminLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => setMounted(true), 100);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'خطأ في تسجيل الدخول');
            const role = data.user?.role;
            // Save token for all users
            localStorage.setItem('sukarak_token', data.access_token);
            localStorage.setItem('sukarak_user_id', data.user.id);
            localStorage.setItem('sukarak_user_name', data.user.name);
            localStorage.setItem('sukarak_user_email', data.user.email);
            localStorage.setItem('sukarak_user_role', data.user.role || 'user');
            
            localStorage.setItem('admin_token', data.access_token);
            localStorage.setItem('admin_user', JSON.stringify(data.user));

            if (role === 'user' || !['admin', 'admin_master', 'seller', 'doctor', 'nurse'].includes(role)) {
                // Regular user → redirect to main app
                window.location.href = '/';
                return;
            }
            if (role === 'doctor') {
                window.location.href = '/doctor';
            } else if (role === 'seller') {
                window.location.href = '/seller';
            } else if (role === 'nurse') {
                window.location.href = '/nursing-admin';
            } else if (onLogin) {
                onLogin(data.user);
            } else {
                window.location.href = '/admin';
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden font-cairo" dir="rtl">
            {/* === Animated Gradient Background === */}
            <div className="absolute inset-0" style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0f172a 50%, #1a2332 75%, #0f172a 100%)',
            }} />

            {/* === Floating Orbs (matching logo colors) === */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Red orb */}
                <div className="absolute top-[10%] right-[15%] w-72 h-72 rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, #e53e3e 0%, transparent 70%)', filter: 'blur(60px)', animation: 'float1 8s ease-in-out infinite' }} />
                {/* Blue orb */}
                <div className="absolute top-[30%] left-[10%] w-80 h-80 rounded-full opacity-15"
                    style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', filter: 'blur(70px)', animation: 'float2 10s ease-in-out infinite' }} />
                {/* Green orb */}
                <div className="absolute bottom-[20%] right-[20%] w-64 h-64 rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)', filter: 'blur(50px)', animation: 'float3 7s ease-in-out infinite' }} />
                {/* Purple orb */}
                <div className="absolute bottom-[10%] left-[25%] w-56 h-56 rounded-full opacity-15"
                    style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)', filter: 'blur(55px)', animation: 'float1 9s ease-in-out infinite reverse' }} />
                {/* Orange orb */}
                <div className="absolute top-[60%] right-[50%] w-48 h-48 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)', filter: 'blur(45px)', animation: 'float2 6s ease-in-out infinite reverse' }} />
            </div>

            {/* === Grid Pattern Overlay === */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                backgroundSize: '60px 60px'
            }} />

            {/* === Main Content === */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className={`w-full max-w-[440px] transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                    {/* === Login Card === */}
                    <div className="relative">
                        {/* Card Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-blue-500/20 to-green-500/20 rounded-[36px] blur-xl opacity-60" />

                        <div className="relative bg-white/[0.06] backdrop-blur-2xl border border-white/[0.08] rounded-[32px] p-10 shadow-2xl shadow-black/40">
                            {/* === Logo === */}
                            <div className="text-center mb-8">
                                <div className={`relative mx-auto w-28 h-28 mb-6 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                                    {/* Logo Glow */}
                                    <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl scale-150" />
                                    <img
                                        src="/logo.png"
                                        alt="سكرك مظبوط"
                                        className="relative w-28 h-28 object-contain drop-shadow-2xl"
                                        style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.15))' }}
                                    />
                                </div>
                                <h1 className={`text-3xl font-black text-white mb-2 transition-all duration-700 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                                    سكرك مظبوط
                                </h1>
                                <div className={`flex items-center justify-center gap-2 transition-all duration-700 delay-400 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/20" />
                                    <p className="text-white/30 text-sm font-bold tracking-wider">لوحة تحكم الإدارة</p>
                                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/20" />
                                </div>
                            </div>

                            {/* === Error Message === */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm px-5 py-3.5 rounded-2xl mb-6 font-bold text-center backdrop-blur-sm">
                                    <span className="inline-block mr-2">⚠️</span>{error}
                                </div>
                            )}

                            {/* === Form === */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email */}
                                <div className={`relative group transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/0 via-blue-500/0 to-green-500/0 rounded-2xl opacity-0 group-focus-within:opacity-100 group-focus-within:from-red-500/20 group-focus-within:via-blue-500/20 group-focus-within:to-green-500/20 transition-all duration-500 blur-sm" />
                                    <div className="relative flex items-center">
                                        <Mail className="absolute right-4 w-5 h-5 text-white/25 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            placeholder="البريد الإلكتروني"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl pr-12 pl-4 py-4 text-white text-sm font-bold outline-none focus:border-blue-400/40 focus:bg-white/[0.08] transition-all duration-300 placeholder:text-white/15"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className={`relative group transition-all duration-700 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/0 via-purple-500/0 to-green-500/0 rounded-2xl opacity-0 group-focus-within:opacity-100 group-focus-within:from-red-500/20 group-focus-within:via-purple-500/20 group-focus-within:to-green-500/20 transition-all duration-500 blur-sm" />
                                    <div className="relative flex items-center">
                                        <Lock className="absolute right-4 w-5 h-5 text-white/25 group-focus-within:text-purple-400 transition-colors" />
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            required
                                            placeholder="كلمة المرور"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl pr-12 pl-12 py-4 text-white text-sm font-bold outline-none focus:border-purple-400/40 focus:bg-white/[0.08] transition-all duration-300 placeholder:text-white/15"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPass(!showPass)}
                                            className="absolute left-4 text-white/20 hover:text-white/50 transition-colors"
                                        >
                                            {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className={`pt-2 transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="relative w-full group overflow-hidden"
                                    >
                                        {/* Button Gradient Border */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-blue-500 to-green-500 rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-[2px] bg-[#1a2332] rounded-[14px]" />
                                        <div className="relative px-6 py-4 flex items-center justify-center gap-2 text-white font-black text-base">
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    <span>جاري الدخول...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>تسجيل دخول الإدارة</span>
                                                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </form>

                            {/* === Divider === */}
                            <div className="flex items-center gap-4 my-6">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
                                <span className="text-white/15 text-xs font-bold">ADMIN PANEL</span>
                                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
                            </div>

                            {/* === Security Badge === */}
                            <div className="flex items-center justify-center gap-2 text-white/20 text-xs">
                                <Lock className="w-3.5 h-3.5" />
                                <span className="font-bold">اتصال آمن ومشفر</span>
                            </div>
                        </div>
                    </div>

                    {/* === Footer === */}
                    <div className={`text-center mt-8 transition-all duration-700 delay-[800ms] ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                        <p className="text-white/15 text-xs font-bold tracking-wider">
                            Sukarak Mazboot v3.0
                        </p>
                        <p className="text-white/10 text-[10px] mt-1 font-bold">
                            Powered by PharmStars &copy; {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </div>

            {/* === CSS Animations === */}
            <style>{`
                @keyframes float1 {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    33% { transform: translateY(-20px) translateX(10px); }
                    66% { transform: translateY(10px) translateX(-15px); }
                }
                @keyframes float2 {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    33% { transform: translateY(15px) translateX(-10px); }
                    66% { transform: translateY(-25px) translateX(20px); }
                }
                @keyframes float3 {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(-15px) translateX(-10px); }
                }
            `}</style>
        </div>
    );
};

export default AdminLogin;
