import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    User, Settings, CreditCard, Bell, Shield, LogOut, Camera, ChevronLeft,
    Edit3, Save, X, Activity, Pill, Calendar, Loader2, Check, Lock, Package,
    Eye, EyeOff, Gift, Wallet, KeyRound, Smartphone, Globe,
    Heart, FileText, RotateCcw, Crown, Cigarette, Dumbbell, Utensils, Paperclip, Trash2, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '../api/config';

const ProfileView = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const lang = i18n.language === 'ar' ? 'ar' : 'en';
    const fileInputRef = useRef(null);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editData, setEditData] = useState({});
    const [showSaved, setShowSaved] = useState(false);
    const [activePanel, setActivePanel] = useState(null); // 'wallet', 'privacy', 'edit', 'medical', 'favorites', 'returns'
    const [uploading, setUploading] = useState(false);
    const [privacySection, setPrivacySection] = useState(null);
    const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
    const [showOldPass, setShowOldPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [hideHealthData, setHideHealthData] = useState(false);
    const [savingPrivacy, setSavingPrivacy] = useState(false);
    const [privacySaved, setPrivacySaved] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [medicalFile, setMedicalFile] = useState({
        smoker: false, daily_sport: false, medications: '', meals_count: 3, attachments: [],
        diabetes_type: '', diagnosis_date: '', blood_type: '', hba1c: '', insulin_type: '',
        allergies: '', chronic_diseases: '', height: '', emergency_contact: '', notes: ''
    });
    const medicalFileRef = useRef(null);
    const [favorites, setFavorites] = useState([]);
    const [returns, setReturns] = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        // Load favorites from localStorage (same source as MarketView)
        const savedFavIds = JSON.parse(localStorage.getItem('sukarak_favs') || '[]').map(Number);
        if (savedFavIds.length > 0) {
            fetch(`${API_BASE}/market/products`)
                .then(r => r.ok ? r.json() : [])
                .then(data => {
                    // Handle both array and {data: [...]} formats
                    const products = Array.isArray(data) ? data : (data?.data || data?.products || []);
                    const favProducts = products.filter(p => savedFavIds.includes(Number(p.id)));
                    setFavorites(favProducts.map(p => ({
                        id: p.id,
                        name: p.title || p.name,
                        product_name: p.title || p.name,
                        price: p.offer_price || p.price,
                        image: p.img_url || p.image
                    })));
                })
                .catch(() => { });
        }
        fetch(`${API_BASE}/membership/medical-profile`).then(r => r.ok ? r.json() : null).then(d => { if (d) setMedicalFile(d); }).catch(() => { });
    }, [activePanel]);

    useEffect(() => { loadProfile(); }, []);

    const getUserId = () => localStorage.getItem('sukarak_user_id') || '';

    const loadProfile = async () => {
        try {
            const uid = getUserId();
            const res = await fetch(`${API_BASE}/health/profile?user_id=${uid}`);
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setEditData({ name: data.name, phone: data.phone, age: data.age || '', weight: data.weight || '', country: data.country || '' });
            }
        } catch (err) { console.error('Profile load error:', err); }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const uid = getUserId();
            await fetch(`${API_BASE}/health/profile?user_id=${uid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData),
            });
            setProfile(prev => ({ ...prev, ...editData }));
            setActivePanel(null);
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 2000);
        } catch (err) { console.error('Save error:', err); }
        setSaving(false);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const uid = getUserId();
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch(`${API_BASE}/health/profile/image?user_id=${uid}`, {
                method: 'POST', body: formData
            });
            const data = await res.json();
            if (data.image_url) {
                setProfile(prev => ({ ...prev, profile_image: data.image_url }));
                setShowSaved(true);
                setTimeout(() => setShowSaved(false), 2000);
            }
        } catch (err) { console.error('Upload error:', err); }
        setUploading(false);
    };

    const menuItems = [
        { icon: Package, label: lang === 'ar' ? 'طلباتي وفواتيري' : 'My Orders & Invoices', color: 'text-primary-emerald', bg: 'bg-emerald-50', action: () => navigate('/my-orders') },
        { icon: RotateCcw, label: lang === 'ar' ? 'المرتجعـات' : 'Returns', color: 'text-orange-500', bg: 'bg-orange-50', action: () => setActivePanel('returns') },
        { icon: Heart, label: lang === 'ar' ? 'المفضلة' : 'Favorites', color: 'text-red-500', bg: 'bg-red-50', action: () => setActivePanel('favorites') },
        { icon: FileText, label: lang === 'ar' ? 'الملف الطبي' : 'Medical File', color: 'text-teal-500', bg: 'bg-teal-50', action: () => setActivePanel('medical') },
        { icon: Crown, label: lang === 'ar' ? 'العضوية' : 'Membership', color: 'text-amber-500', bg: 'bg-amber-50', action: () => navigate('/membership') },
        { icon: CreditCard, label: lang === 'ar' ? 'بطاقات الهدايا / المحفظة' : 'Gift Cards / Wallet', color: 'text-purple-500', bg: 'bg-purple-50', action: () => setActivePanel('wallet') },
        { icon: Bell, label: lang === 'ar' ? 'التنبيهات' : 'Notifications', color: 'text-blue-500', bg: 'bg-blue-50', action: () => navigate('/notifications') },
        { icon: Settings, label: lang === 'ar' ? 'إعدادات الحساب' : 'Account Settings', color: 'text-gray-500', bg: 'bg-gray-100', action: () => setActivePanel('edit') },
        { icon: Shield, label: lang === 'ar' ? 'الخصوصية والأمان' : 'Privacy & Security', color: 'text-green-500', bg: 'bg-green-50', action: () => setActivePanel('privacy') },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-emerald" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-32 overflow-x-hidden">
            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />

            <AnimatePresence>
                {showSaved && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="fixed top-20 right-4 left-4 z-[1100] bg-emerald-500 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
                        <Check className="w-5 h-5" />
                        <span className="font-bold">{lang === 'ar' ? 'تم الحفظ بنجاح' : 'Saved Success'}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col items-center pt-2">
                <div className="relative">
                    <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-primary-dark/10 to-primary-emerald/10 flex items-center justify-center">
                        {profile?.profile_image ? (
                            <img src={profile.profile_image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-14 h-14 text-primary-emerald/40" />
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                        )}
                    </div>
                    <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                        className="absolute bottom-0 right-0 bg-primary-emerald text-white p-2 rounded-full shadow-lg border-3 border-white active:scale-90 transition">
                        <Camera className="w-4 h-4" />
                    </button>
                </div>
                <h2 className="mt-3 text-2xl font-black text-primary-dark">{profile?.name || '--'}</h2>
                {(() => {
                    const role = localStorage.getItem('sukarak_user_role') || 'user';
                    const roleMap = {
                        admin: { label: lang === 'ar' ? '🛡️ مسؤول النظام' : '🛡️ Admin', color: 'bg-red-100 text-red-700', link: '/admin' },
                        doctor: { label: lang === 'ar' ? '👨‍⚕️ طبيب' : '👨‍⚕️ Doctor', color: 'bg-blue-100 text-blue-700', link: '/doctor' },
                        seller: { label: lang === 'ar' ? '🏪 بائع' : '🏪 Seller', color: 'bg-amber-100 text-amber-700', link: '/seller' },
                        nurse: { label: lang === 'ar' ? '👩‍⚕️ ممرض/ة' : '👩‍⚕️ Nurse', color: 'bg-pink-100 text-pink-700', link: '/nursing-admin' },
                        lab: { label: lang === 'ar' ? '🧪 فني مختبر' : '🧪 Lab Tech', color: 'bg-indigo-100 text-indigo-700', link: '/lab-admin' },
                        user: { label: lang === 'ar' ? '👤 مستخدم' : '👤 User', color: 'bg-gray-100 text-gray-600', link: null },
                    };
                    const r = roleMap[role] || roleMap.user;
                    return (
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`px-3 py-1 rounded-full text-[11px] font-black ${r.color}`}>{r.label}</span>
                            {r.link && <button onClick={() => navigate(r.link)} className="text-[10px] text-primary-emerald font-bold underline">
                                {lang === 'ar' ? 'لوحة التحكم ←' : 'Dashboard →'}
                            </button>}
                        </div>
                    );
                })()}
                <p className="text-gray-400 text-sm">{profile?.email}</p>
                <p className="text-gray-300 text-xs mt-0.5">
                    {lang === 'ar' ? 'عضو منذ' : 'Member since'} {profile?.created_at ? new Date(profile.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long' }) : '--'}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 text-center">
                    <p className="text-xs text-gray-400 mb-1">{lang === 'ar' ? 'الرصيد في المحفظة' : 'Wallet Balance'}</p>
                    <p className="text-xl font-black text-primary-emerald">{profile?.wallet_balance?.toFixed(2) || '0.00'} <span className="text-xs">SAR</span></p>
                </div>
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 text-center">
                    <p className="text-xs text-gray-400 mb-1">{lang === 'ar' ? 'نقاط الولاء' : 'Loyalty Points'}</p>
                    <p className="text-xl font-black text-primary-dark">{profile?.loyalty_points || 0} <span className="text-xs text-gray-300">{lang === 'ar' ? 'نقطة' : 'pts'}</span></p>
                </div>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden">
                {menuItems.map((item, idx) => (
                    <button key={idx} onClick={item.action}
                        className="w-full flex justify-between items-center p-5 hover:bg-gray-50 transition-all border-b border-gray-50 last:border-0 active:scale-[0.99]">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-gray-700">{item.label}</span>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-gray-300 rtl:rotate-0 ltr:rotate-180" />
                    </button>
                ))}
            </div>

            <button onClick={() => {
                localStorage.clear();
                window.location.href = '/';
                window.location.reload();
            }} className="w-full flex items-center justify-center gap-2 p-5 bg-red-50 text-red-500 rounded-3xl font-bold transition-all hover:bg-red-100 active:scale-[0.98]">
                <LogOut className="w-5 h-5" />
                {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
            </button>

            {/* Panel Overlays */}
            <AnimatePresence>
                {activePanel && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm" onClick={() => setActivePanel(null)}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}>

                            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-5 pb-3 border-b border-gray-100">
                                <h2 className="font-black text-lg text-gray-800">
                                    {activePanel === 'returns' && (lang === 'ar' ? 'المرتجعات' : 'Returns')}
                                    {activePanel === 'favorites' && (lang === 'ar' ? 'المفضلة' : 'Favorites')}
                                    {activePanel === 'medical' && (lang === 'ar' ? 'الملف الطبي' : 'Medical File')}
                                    {activePanel === 'wallet' && (lang === 'ar' ? 'بطاقات الهدايا / المحفظة' : 'Gift Cards / Wallet')}
                                    {activePanel === 'edit' && (lang === 'ar' ? 'إعدادات الحساب' : 'Account Settings')}
                                    {activePanel === 'privacy' && (lang === 'ar' ? 'الخصوصية والأمان' : 'Privacy & Security')}
                                </h2>
                                <button onClick={() => setActivePanel(null)} className="p-2 bg-gray-100 rounded-xl">
                                    <Settings className="w-4 h-4 text-gray-400" style={{ display: 'none' }} />
                                    <span className="text-gray-400 font-bold text-sm">✕</span>
                                </button>
                            </div>

                            <div className="p-5 space-y-4">
                                {/* Returns Panel */}
                                {activePanel === 'returns' && (
                                    returns.length > 0 ? returns.map((r, i) => (
                                        <div key={i} className="bg-orange-50 p-4 rounded-2xl">
                                            <p className="font-black text-orange-700">{r.product_name || `طلب #${r.id}`}</p>
                                            <p className="text-xs text-orange-400">{r.status || 'قيد المراجعة'}</p>
                                        </div>
                                    )) : (
                                        <div className="text-center py-12">
                                            <RotateCcw className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                            <p className="text-gray-400 font-bold">{lang === 'ar' ? 'لا توجد مرتجعات حالياً' : 'No returns yet'}</p>
                                        </div>
                                    )
                                )}

                                {/* Favorites Panel */}
                                {activePanel === 'favorites' && (
                                    favorites.length > 0 ? favorites.map((f, i) => (
                                        <div key={i} className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-3" onClick={() => { setActivePanel(null); navigate('/market'); }}>
                                            {f.image && <img src={f.image} className="w-14 h-14 rounded-xl object-cover" alt="" />}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-black text-sm text-gray-700 truncate">{f.name || f.product_name}</p>
                                                <p className="text-xs text-primary-emerald font-bold">{f.price ? `${f.price} SAR` : ''}</p>
                                            </div>
                                            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                                        </div>
                                    )) : (
                                        <div className="text-center py-12">
                                            <Heart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                            <p className="text-gray-400 font-bold">{lang === 'ar' ? 'لا توجد منتجات مفضلة' : 'No favorites yet'}</p>
                                            <button onClick={() => { setActivePanel(null); navigate('/market'); }} className="mt-3 text-primary-emerald font-bold text-sm">{lang === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}</button>
                                        </div>
                                    )
                                )}

                                {/* Medical File Panel */}
                                {activePanel === 'medical' && (
                                    <>
                                        <input type="file" ref={medicalFileRef} accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const reader = new FileReader();
                                            reader.onload = () => {
                                                setMedicalFile(p => ({ ...p, attachments: [...(p.attachments || []), { name: file.name, size: file.size, type: file.type, preview: reader.result, date: new Date().toISOString() }] }));
                                            };
                                            reader.readAsDataURL(file);
                                        }} />
                                        <div className="space-y-4">
                                            {/* Diabetes Type */}
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 mb-2 block">{lang === 'ar' ? 'نوع السكري' : 'Diabetes Type'}</label>
                                                <div className="flex gap-2">
                                                    {[
                                                        { key: 'type1', label: lang === 'ar' ? 'النوع الأول' : 'Type 1' },
                                                        { key: 'type2', label: lang === 'ar' ? 'النوع الثاني' : 'Type 2' },
                                                        { key: 'gestational', label: lang === 'ar' ? 'سكري الحمل' : 'Gestational' },
                                                    ].map(t => (
                                                        <button key={t.key} onClick={() => setMedicalFile(p => ({ ...p, diabetes_type: t.key }))}
                                                            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${medicalFile.diabetes_type === t.key ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-400'}`}>{t.label}</button>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Diagnosis Date */}
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 mb-2 block">{lang === 'ar' ? 'تاريخ التشخيص' : 'Diagnosis Date'}</label>
                                                <input type="date" value={medicalFile.diagnosis_date || ''} onChange={e => setMedicalFile(p => ({ ...p, diagnosis_date: e.target.value }))}
                                                    className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-teal-400 outline-none" />
                                            </div>
                                            {/* Blood Type */}
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 mb-2 block">{lang === 'ar' ? 'فصيلة الدم' : 'Blood Type'}</label>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bt => (
                                                        <button key={bt} onClick={() => setMedicalFile(p => ({ ...p, blood_type: bt }))}
                                                            className={`py-2 rounded-xl font-bold text-xs transition-all ${medicalFile.blood_type === bt ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'}`}>{bt}</button>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* HbA1c & Height */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 mb-2 block">{lang === 'ar' ? 'آخر سكر تراكمي (HbA1c)' : 'Last HbA1c'}</label>
                                                    <input type="number" step="0.1" value={medicalFile.hba1c || ''} onChange={e => setMedicalFile(p => ({ ...p, hba1c: e.target.value }))}
                                                        placeholder="6.5%" className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-teal-400 outline-none" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 mb-2 block">{lang === 'ar' ? 'الطول (سم)' : 'Height (cm)'}</label>
                                                    <input type="number" value={medicalFile.height || ''} onChange={e => setMedicalFile(p => ({ ...p, height: e.target.value }))}
                                                        placeholder="170" className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-teal-400 outline-none" />
                                                </div>
                                            </div>
                                            {/* Insulin Type */}
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 mb-2 block">{lang === 'ar' ? 'نوع الأنسولين المستخدم' : 'Insulin Type Used'}</label>
                                                <input type="text" value={medicalFile.insulin_type || ''} onChange={e => setMedicalFile(p => ({ ...p, insulin_type: e.target.value }))}
                                                    placeholder={lang === 'ar' ? 'مثال: لانتوس، نوفورابيد...' : 'e.g., Lantus, NovoRapid...'}
                                                    className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-teal-400 outline-none" />
                                            </div>
                                            {/* Smoker & Daily Sport toggles */}
                                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                                                <div className="flex items-center gap-3">
                                                    <Cigarette className="w-5 h-5 text-gray-400" />
                                                    <span className="font-bold text-sm">{lang === 'ar' ? 'مدخن' : 'Smoker'}</span>
                                                </div>
                                                <button onClick={() => setMedicalFile(p => ({ ...p, smoker: !p.smoker }))}
                                                    className={`w-12 h-7 rounded-full transition-all ${medicalFile.smoker ? 'bg-red-500' : 'bg-gray-300'} relative`}>
                                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${medicalFile.smoker ? 'right-1' : 'left-1'}`} />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                                                <div className="flex items-center gap-3">
                                                    <Dumbbell className="w-5 h-5 text-gray-400" />
                                                    <span className="font-bold text-sm">{lang === 'ar' ? 'رياضة يومية' : 'Daily Exercise'}</span>
                                                </div>
                                                <button onClick={() => setMedicalFile(p => ({ ...p, daily_sport: !p.daily_sport }))}
                                                    className={`w-12 h-7 rounded-full transition-all ${medicalFile.daily_sport ? 'bg-emerald-500' : 'bg-gray-300'} relative`}>
                                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${medicalFile.daily_sport ? 'right-1' : 'left-1'}`} />
                                                </button>
                                            </div>
                                            {/* Allergies */}
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 mb-2 block">{lang === 'ar' ? 'الحساسية' : 'Allergies'}</label>
                                                <textarea value={medicalFile.allergies || ''} onChange={e => setMedicalFile(p => ({ ...p, allergies: e.target.value }))}
                                                    placeholder={lang === 'ar' ? 'أي حساسية من أدوية أو أطعمة...' : 'Any allergies to medications or food...'}
                                                    rows={2} className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-teal-400 outline-none resize-none" />
                                            </div>
                                            {/* Chronic Diseases */}
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 mb-2 block">{lang === 'ar' ? 'الأمراض المزمنة الأخرى' : 'Other Chronic Diseases'}</label>
                                                <textarea value={medicalFile.chronic_diseases || ''} onChange={e => setMedicalFile(p => ({ ...p, chronic_diseases: e.target.value }))}
                                                    placeholder={lang === 'ar' ? 'ضغط، كوليسترول، قلب...' : 'Hypertension, cholesterol, heart...'}
                                                    rows={2} className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-teal-400 outline-none resize-none" />
                                            </div>
                                            {/* Current Medications */}
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 mb-2 block">{lang === 'ar' ? 'الأدوية الحالية' : 'Current Medications'}</label>
                                                <textarea value={medicalFile.medications || ''} onChange={e => setMedicalFile(p => ({ ...p, medications: e.target.value }))}
                                                    placeholder={lang === 'ar' ? 'اكتب أدويتك الحالية...' : 'List your medications...'}
                                                    rows={3} className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-teal-400 outline-none resize-none" />
                                            </div>
                                            {/* Daily Meals */}
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 mb-2 block">{lang === 'ar' ? 'عدد الوجبات اليومية' : 'Daily Meals'}</label>
                                                <div className="flex gap-2">
                                                    {[2, 3, 4, 5, 6].map(n => (
                                                        <button key={n} onClick={() => setMedicalFile(p => ({ ...p, meals_count: n }))}
                                                            className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${medicalFile.meals_count === n ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-400'}`}>{n}</button>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Emergency Contact */}
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 mb-2 block">{lang === 'ar' ? 'رقم الطوارئ (قريب)' : 'Emergency Contact'}</label>
                                                <input type="tel" value={medicalFile.emergency_contact || ''} onChange={e => setMedicalFile(p => ({ ...p, emergency_contact: e.target.value }))}
                                                    placeholder={lang === 'ar' ? 'رقم هاتف شخص قريب...' : 'Emergency phone number...'}
                                                    className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-teal-400 outline-none" />
                                            </div>
                                            {/* Notes */}
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 mb-2 block">{lang === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}</label>
                                                <textarea value={medicalFile.notes || ''} onChange={e => setMedicalFile(p => ({ ...p, notes: e.target.value }))}
                                                    placeholder={lang === 'ar' ? 'أي ملاحظات أخرى ترغب بإضافتها...' : 'Any other notes...'}
                                                    rows={2} className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-teal-400 outline-none resize-none" />
                                            </div>
                                            {/* Attachments Section */}
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 mb-2 block">{lang === 'ar' ? 'المرفقات (تقارير، تحاليل، صور)' : 'Attachments (reports, tests, images)'}</label>
                                                <button onClick={() => medicalFileRef.current?.click()}
                                                    className="w-full border-2 border-dashed border-teal-300 bg-teal-50/50 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-teal-50 transition active:scale-[0.98]">
                                                    <Paperclip className="w-6 h-6 text-teal-400" />
                                                    <span className="text-xs font-bold text-teal-600">{lang === 'ar' ? 'اضغط لإرفاق ملف أو صورة' : 'Click to attach file or image'}</span>
                                                    <span className="text-[10px] text-gray-400">{lang === 'ar' ? 'PDF, صور, مستندات' : 'PDF, Images, Documents'}</span>
                                                </button>
                                                {medicalFile.attachments?.length > 0 && (
                                                    <div className="mt-3 space-y-2">
                                                        {medicalFile.attachments.map((att, i) => (
                                                            <div key={i} className="bg-gray-50 p-3 rounded-xl flex items-center justify-between">
                                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                                    {att.type?.startsWith('image/') && att.preview ? (
                                                                        <img src={att.preview} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                                                    ) : (
                                                                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                                                            <FileText className="w-5 h-5 text-teal-500" />
                                                                        </div>
                                                                    )}
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="text-xs font-bold text-gray-700 truncate">{att.name}</p>
                                                                        <p className="text-[10px] text-gray-400">{(att.size / 1024).toFixed(1)} KB</p>
                                                                    </div>
                                                                </div>
                                                                <button onClick={() => setMedicalFile(p => ({ ...p, attachments: p.attachments.filter((_, idx) => idx !== i) }))}
                                                                    className="p-1.5 hover:bg-red-100 rounded-lg transition">
                                                                    <X className="w-4 h-4 text-red-400" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button onClick={async () => {
                                            try {
                                                await fetch(`${API_BASE}/membership/medical-profile`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(medicalFile) });
                                                setShowSaved(true); setTimeout(() => setShowSaved(false), 2000);
                                            } catch (e) { console.error(e); }
                                        }} className="w-full bg-gradient-to-l from-teal-500 to-emerald-500 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition">
                                            <Save className="w-5 h-5" /> {lang === 'ar' ? 'حفظ الملف الطبي' : 'Save Medical File'}
                                        </button>
                                    </>
                                )}

                                {/* Wallet Panel */}
                                {activePanel === 'wallet' && (
                                    <>
                                        <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-6 rounded-3xl text-white text-center">
                                            <p className="text-xs opacity-80 mb-1">{lang === 'ar' ? 'رصيد المحفظة' : 'Wallet Balance'}</p>
                                            <p className="text-4xl font-black">{profile?.wallet_balance?.toFixed(2) || '0.00'} <span className="text-sm">SAR</span></p>
                                        </div>
                                        <div className="bg-amber-50 p-4 rounded-2xl text-center">
                                            <p className="text-xs text-amber-600 mb-1">{lang === 'ar' ? 'نقاط الولاء' : 'Loyalty Points'}</p>
                                            <p className="text-2xl font-black text-amber-600">{profile?.loyalty_points || 0} <span className="text-xs text-amber-400">{lang === 'ar' ? 'نقطة' : 'pts'}</span></p>
                                        </div>
                                        <div className="text-center py-6">
                                            <CreditCard className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                            <p className="text-gray-400 font-bold text-sm">{lang === 'ar' ? 'لا توجد بطاقات هدايا مضافة' : 'No gift cards added'}</p>
                                        </div>
                                    </>
                                )}

                                {/* Account Settings Panel */}
                                {activePanel === 'edit' && (
                                    <>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 mb-2 block">{lang === 'ar' ? 'الاسم' : 'Name'}</label>
                                            <input type="text" value={editData.name ?? profile?.name ?? ''} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))}
                                                className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-primary-emerald outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 mb-2 block">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                                            <input type="email" value={editData.email ?? profile?.email ?? ''} onChange={e => setEditData(p => ({ ...p, email: e.target.value }))}
                                                className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-primary-emerald outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 mb-2 block">{lang === 'ar' ? 'الهاتف' : 'Phone'}</label>
                                            <input type="tel" value={editData.phone ?? profile?.phone ?? ''} onChange={e => setEditData(p => ({ ...p, phone: e.target.value }))}
                                                className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-primary-emerald outline-none" />
                                        </div>
                                        {/* Age */}
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 mb-2 block">{lang === 'ar' ? 'العمر' : 'Age'}</label>
                                            <input type="number" min="1" max="120" value={editData.age ?? profile?.age ?? ''} onChange={e => setEditData(p => ({ ...p, age: e.target.value }))}
                                                placeholder={lang === 'ar' ? 'العمر بالسنوات' : 'Age in years'}
                                                className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-primary-emerald outline-none" />
                                        </div>
                                        {/* Gender */}
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 mb-2 block">{lang === 'ar' ? 'الجنس' : 'Gender'}</label>
                                            <div className="flex gap-2">
                                                {[
                                                    { key: 'male', label: lang === 'ar' ? '👨 ذكر' : '👨 Male', color: 'bg-blue-500' },
                                                    { key: 'female', label: lang === 'ar' ? '👩 أنثى' : '👩 Female', color: 'bg-pink-500' },
                                                ].map(g => (
                                                    <button key={g.key} onClick={() => setEditData(p => ({ ...p, gender: g.key }))}
                                                        className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${(editData.gender ?? profile?.gender) === g.key ? `${g.color} text-white shadow-lg` : 'bg-gray-100 text-gray-400'}`}>
                                                        {g.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Body Shape */}
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 mb-2 block">{lang === 'ar' ? 'شكل الجسم' : 'Body Shape'}</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {[
                                                    { key: 'thin', emoji: '🧍', label: lang === 'ar' ? 'نحيف' : 'Thin', color: 'bg-sky-500' },
                                                    { key: 'normal', emoji: '🧑', label: lang === 'ar' ? 'طبيعي' : 'Normal', color: 'bg-emerald-500' },
                                                    { key: 'overweight', emoji: '🏋️', label: lang === 'ar' ? 'زائد الوزن' : 'Overweight', color: 'bg-amber-500' },
                                                    { key: 'obese', emoji: '⚖️', label: lang === 'ar' ? 'سمنة' : 'Obese', color: 'bg-red-500' },
                                                ].map(bs => (
                                                    <button key={bs.key} onClick={() => setEditData(p => ({ ...p, body_shape: bs.key }))}
                                                        className={`flex flex-col items-center gap-1 py-3 rounded-2xl font-bold text-[10px] transition-all ${(editData.body_shape ?? profile?.body_shape) === bs.key ? `${bs.color} text-white shadow-lg` : 'bg-gray-100 text-gray-400'}`}>
                                                        <span className="text-2xl">{bs.emoji}</span>
                                                        <span>{bs.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <button onClick={async () => {
                                            setSaving(true);
                                            try {
                                                await handleSave();
                                                setActivePanel(null);
                                            } finally { setSaving(false); }
                                        }} disabled={saving} className="w-full bg-primary-emerald text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 active:scale-[0.98] transition">
                                            <Save className="w-5 h-5" /> {lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
                                        </button>
                                    </>
                                )}

                                {/* Privacy & Security Panel */}
                                {activePanel === 'privacy' && (
                                    <>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                                                <span className="font-bold text-sm">{lang === 'ar' ? 'التحقق الثنائي' : 'Two-Factor Authentication'}</span>
                                                <button onClick={() => setTwoFAEnabled(p => !p)}
                                                    className={`w-12 h-7 rounded-full transition-all ${twoFAEnabled ? 'bg-primary-emerald' : 'bg-gray-300'} relative`}>
                                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${twoFAEnabled ? 'right-1' : 'left-1'}`} />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                                                <span className="font-bold text-sm">{lang === 'ar' ? 'إخفاء البيانات الصحية' : 'Hide Health Data'}</span>
                                                <button onClick={() => setHideHealthData(p => !p)}
                                                    className={`w-12 h-7 rounded-full transition-all ${hideHealthData ? 'bg-primary-emerald' : 'bg-gray-300'} relative`}>
                                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${hideHealthData ? 'right-1' : 'left-1'}`} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="pt-2">
                                            <h3 className="font-black text-sm text-gray-700 mb-3">{lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}</h3>
                                            <div className="space-y-3">
                                                <input type="password" value={passwordForm.current} onChange={e => setPasswordForm(p => ({ ...p, current: e.target.value }))}
                                                    placeholder={lang === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}
                                                    className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-green-400 outline-none" />
                                                <input type="password" value={passwordForm.newPass} onChange={e => setPasswordForm(p => ({ ...p, newPass: e.target.value }))}
                                                    placeholder={lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                                                    className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-green-400 outline-none" />
                                                <input type="password" value={passwordForm.confirm} onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
                                                    placeholder={lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                                                    className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-green-400 outline-none" />
                                            </div>
                                        </div>
                                        <button onClick={async () => {
                                            if (passwordForm.newPass !== passwordForm.confirm) { alert(lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match'); return; }
                                            setSavingPrivacy(true);
                                            try {
                                                await fetch(`${API_BASE}/auth/change-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ current_password: passwordForm.current, new_password: passwordForm.newPass }) });
                                                setPasswordForm({ current: '', newPass: '', confirm: '' });
                                                setShowSaved(true); setTimeout(() => setShowSaved(false), 2000);
                                            } catch (e) { console.error(e); } finally { setSavingPrivacy(false); }
                                        }} disabled={!passwordForm.current || !passwordForm.newPass || savingPrivacy}
                                            className="w-full bg-gradient-to-l from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 active:scale-[0.98] transition">
                                            <Shield className="w-5 h-5" /> {lang === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}
                                        </button>

                                        {/* Delete Account Section */}
                                        <div className="mt-6 pt-4 border-t-2 border-red-100">
                                            <div className="bg-red-50 p-4 rounded-2xl">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-red-100 rounded-xl">
                                                        <Trash2 className="w-5 h-5 text-red-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-sm text-red-600">{lang === 'ar' ? 'إلغاء الحساب' : 'Delete Account'}</h4>
                                                        <p className="text-[10px] text-red-400">{lang === 'ar' ? 'هذا الإجراء لا يمكن التراجع عنه' : 'This action cannot be undone'}</p>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-red-400 mb-3 leading-relaxed">
                                                    {lang === 'ar'
                                                        ? 'عند إلغاء حسابك، سيتم تعطيل حسابك نهائياً ولن تتمكن من تسجيل الدخول مرة أخرى. سيتم حذف جميع بياناتك الشخصية.'
                                                        : 'When you delete your account, it will be permanently deactivated. You will not be able to log in again. All your personal data will be removed.'}
                                                </p>
                                                <button onClick={() => setShowDeleteConfirm(true)}
                                                    className="w-full bg-red-500 text-white py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition hover:bg-red-600">
                                                    <Trash2 className="w-4 h-4" />
                                                    {lang === 'ar' ? 'إلغاء حسابي نهائياً' : 'Permanently Delete My Account'}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Account Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setShowDeleteConfirm(false)}>
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>

                            <div className="text-center mb-5">
                                <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-3">
                                    <AlertTriangle className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="font-black text-lg text-gray-800">
                                    {lang === 'ar' ? 'تأكيد إلغاء الحساب' : 'Confirm Account Deletion'}
                                </h3>
                                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                                    {lang === 'ar'
                                        ? 'هل أنت متأكد أنك تريد إلغاء حسابك؟ سيتم تعطيل حسابك ولن تتمكن من الوصول إلى بياناتك أو طلباتك السابقة.'
                                        : 'Are you sure you want to delete your account? Your account will be deactivated and you will lose access to all your data and orders.'}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <button onClick={async () => {
                                    setDeleting(true);
                                    try {
                                        const userId = profile?.id || localStorage.getItem('sukarak_user_id');
                                        if (!userId) { alert('User not found'); return; }
                                        const res = await fetch(`${API_BASE}/auth/delete-account/${userId}`, { method: 'DELETE' });
                                        if (res.ok) {
                                            localStorage.clear();
                                            window.location.href = '/';
                                        } else {
                                            const data = await res.json().catch(() => ({}));
                                            alert(data.detail || (lang === 'ar' ? 'حدث خطأ' : 'Error occurred'));
                                        }
                                    } catch (err) {
                                        console.error('Delete account error:', err);
                                        alert(lang === 'ar' ? 'خطأ في الاتصال' : 'Connection error');
                                    } finally { setDeleting(false); }
                                }} disabled={deleting}
                                    className="w-full bg-red-500 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition hover:bg-red-600">
                                    {deleting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <><Trash2 className="w-5 h-5" /> {lang === 'ar' ? 'نعم، إلغاء حسابي' : 'Yes, Delete My Account'}</>
                                    )}
                                </button>
                                <button onClick={() => setShowDeleteConfirm(false)}
                                    className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2 active:scale-[0.98] transition hover:bg-gray-200">
                                    {lang === 'ar' ? 'لا، الاحتفاظ بحسابي' : 'No, Keep My Account'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileView;
