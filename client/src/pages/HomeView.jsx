import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Activity, Plus, Heart, Bell, Stethoscope, Apple, Calendar,
    TrendingUp, TrendingDown, Minus, ChevronLeft, TestTube, Syringe,
    ShoppingBag, Dumbbell, Utensils, Pill, Calculator, FileBarChart,
    Sparkles, ArrowUpRight, Clock, Zap, Newspaper, Microscope, AlarmClock, HeartHandshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DataService from '../services/DataService';

// Translation map for test types
const typeLabels = {
    ar: { fasting: 'صائم', after_meal: 'بعد الأكل', random: 'عشوائي', before_meal: 'قبل الأكل' },
    en: { fasting: 'Fasting', after_meal: 'After Meal', random: 'Random', before_meal: 'Before Meal' },
};

// Mini sparkline chart component
const MiniChart = ({ data, color = '#10b981' }) => {
    if (!data || data.length < 2) return null;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const h = 40;
    const w = 120;
    const step = w / (data.length - 1);

    const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(' ');
    const areaPoints = `0,${h} ${points} ${(data.length - 1) * step},${h}`;

    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
            <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={areaPoints} fill="url(#chartGrad)" />
            <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {data.length > 0 && (
                <circle cx={(data.length - 1) * step} cy={h - ((data[data.length - 1] - min) / range) * h}
                    r="3" fill={color} stroke="white" strokeWidth="1.5" />
            )}
        </svg>
    );
};

// Bar chart component
const BarChart = ({ data, labels, lang }) => {
    if (!data || data.length < 2) return null;
    const max = Math.max(...data, 200);
    const h = 80;
    const barW = 28;
    const gap = 8;
    const totalW = data.length * (barW + gap) - gap;

    return (
        <svg width="100%" height={h + 20} viewBox={`0 0 ${totalW} ${h + 20}`} className="overflow-visible">
            {/* Reference lines */}
            <line x1="0" y1={h - (70 / max) * h} x2={totalW} y2={h - (70 / max) * h} stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="4" opacity="0.5" />
            <line x1="0" y1={h - (140 / max) * h} x2={totalW} y2={h - (140 / max) * h} stroke="#ef4444" strokeWidth="0.5" strokeDasharray="4" opacity="0.5" />
            {data.map((val, i) => {
                const barH = (val / max) * h;
                const x = i * (barW + gap);
                const isHigh = val > 140;
                const isLow = val < 70;
                const fill = isHigh ? '#ef4444' : isLow ? '#fbbf24' : '#10b981';
                return (
                    <g key={i}>
                        <rect x={x} y={h - barH} width={barW} height={barH} rx="6" fill={fill} opacity="0.85" />
                        <text x={x + barW / 2} y={h - barH - 4} textAnchor="middle" fontSize="8" fontWeight="bold" fill={fill}>{val}</text>
                        {labels && labels[i] && (
                            <text x={x + barW / 2} y={h + 14} textAnchor="middle" fontSize="8" fill="#999">{labels[i]}</text>
                        )}
                    </g>
                );
            })}
        </svg>
    );
};

const HomeView = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const lang = i18n.language === 'ar' ? 'ar' : 'en';
    const getTypeLabel = (key) => typeLabels[lang]?.[key] || typeLabels['ar']?.[key] || key;


    const [banners, setBanners] = useState([]);
    const [currentBanner, setCurrentBanner] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [appSettings, setAppSettings] = useState({});
    const bannerInterval = useRef(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const { data: b } = await DataService.getBanners('homepage');
            setBanners(b.filter(x => x.active));
        } catch { }
        try {
            const { data: n } = await DataService.getNotifications();
            setNotifications(n.filter(x => x.active).slice(0, 3));
        } catch { }
        try {
            const { data: s } = await DataService.getAppSettings();
            if (s) setAppSettings(s);
        } catch { }
    };

    useEffect(() => {
        if (banners.length > 1) {
            bannerInterval.current = setInterval(() => setCurrentBanner(prev => (prev + 1) % banners.length), 4000);
            return () => clearInterval(bannerInterval.current);
        }
    }, [banners]);



    // Helper to check if a section is enabled by admin
    const isEnabled = (key) => appSettings[key] !== 'false';

    // All sections with premium icons (filtered by admin settings)
    const allSections = [
        { title: lang === 'ar' ? 'تابع صحتك' : 'Health', icon: Activity, path: '/health-tracking', gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-200/60', settingKey: null },
        { title: lang === 'ar' ? 'الأطعمة' : 'Foods', icon: Utensils, path: '/foods', gradient: 'from-orange-400 to-amber-500', shadow: 'shadow-orange-200/60', settingKey: null },
        { title: lang === 'ar' ? 'الرياضة' : 'Sports', icon: Dumbbell, path: '/sports', gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-200/60', settingKey: null },
        { title: lang === 'ar' ? 'منبه الدواء' : 'Med Reminder', icon: AlarmClock, path: '/medicine-reminder', gradient: 'from-rose-500 to-red-500', shadow: 'shadow-rose-200/60', settingKey: null },
        { title: lang === 'ar' ? 'المواعيد' : 'Appointments', icon: Calendar, path: '/appointments', gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-200/60', settingKey: 'show_appointments_section' },
        { title: lang === 'ar' ? 'التقارير' : 'Reports', icon: FileBarChart, path: '/reports', gradient: 'from-cyan-500 to-teal-500', shadow: 'shadow-cyan-200/60', settingKey: 'show_reports_section' },
    ];
    const sections = allSections.filter(s => !s.settingKey || isEnabled(s.settingKey));

    const allQuickActions = [
        { label: lang === 'ar' ? 'احجز موعد' : 'Book Appt', icon: Calendar, path: '/appointments', color: 'bg-gradient-to-br from-teal-500 to-emerald-600', settingKey: 'show_appointments_section' },
        { label: lang === 'ar' ? 'العناية بالسكري' : 'Diabetes Care', icon: ShoppingBag, path: '/market', color: 'bg-gradient-to-br from-sky-400 to-cyan-500', settingKey: 'show_market_section' },
        { label: lang === 'ar' ? 'التحاليل الطبية' : 'Medical Tests', icon: TestTube, path: '/medical-tests', color: 'bg-gradient-to-br from-sky-500 to-cyan-600', settingKey: 'show_lab_section' },
        { label: lang === 'ar' ? 'التمريض المنزلي' : 'Home Nursing', icon: Heart, path: '/nursing', color: 'bg-gradient-to-br from-rose-500 to-pink-600', settingKey: 'show_nursing_section' },
    ];
    const quickActions = allQuickActions.filter(a => isEnabled(a.settingKey));

    return (
        <div className="space-y-5 pb-8">

            {/* ═══════ BANNER SLIDER (PREMIUM) ═══════ */}
            {banners.length > 0 && isEnabled('show_banner_slider') && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-[1.8rem] overflow-hidden shadow-2xl shadow-gray-300/50 bg-white">
                    <AnimatePresence mode="wait">
                        <motion.div key={currentBanner}
                            initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                            className="w-full"
                        >
                            <img src={banners[currentBanner]?.image_url} alt={banners[currentBanner]?.title || ''}
                                className="w-full h-auto block rounded-[1.8rem]"
                                onError={e => {
                                    e.target.src = `https://images.unsplash.com/photo-1505751172107-573225a91200?w=800&q=80`;
                                }} />
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            )}

            {/* ═══════ QUICK ACTIONS ═══════ */}
            <div className="flex gap-3">
                {quickActions.map((action, idx) => (
                    <motion.button key={idx}
                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + idx * 0.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(action.path)}
                        className={`flex-1 ${action.color} p-4 rounded-2xl text-white text-center shadow-lg active:shadow-md transition-all`}
                    >
                        <action.icon className="w-6 h-6 mx-auto mb-2 drop-shadow" />
                        <span className="text-[11px] font-black">{action.label}</span>
                    </motion.button>
                ))}
            </div>



            {/* ═══════ SECTIONS GRID ═══════ */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-primary-dark flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        {lang === 'ar' ? 'الخدمات' : 'Services'}
                    </h3>
                </div>
                <motion.div
                    initial="hidden" animate="show"
                    variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } }}
                    className="grid grid-cols-3 gap-4"
                >
                    {sections.map((section, idx) => (
                        <motion.div key={idx}
                            variants={{ hidden: { y: 15, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate(section.path)}
                            className="flex flex-col items-center cursor-pointer group"
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${section.gradient} shadow-lg ${section.shadow} flex items-center justify-center mb-2 group-active:scale-90 transition-all duration-200`}>
                                <section.icon className="w-6 h-6 text-white drop-shadow" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-600 text-center leading-tight">
                                {section.title}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>


            {/* ═══════ APPOINTMENT CTA ═══════ */}
            <motion.div
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                onClick={() => navigate('/market')}
                className="relative overflow-hidden bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-500 p-5 rounded-[1.6rem] text-white shadow-xl shadow-sky-300/30 cursor-pointer active:scale-[0.98] transition-all"
            >
                <div className="absolute top-[-30px] right-[-30px] w-48 h-48 bg-white/5 rounded-full blur-2xl" />
                <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-cyan-300/10 rounded-full blur-xl" />
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-white/15 p-2 rounded-xl backdrop-blur">
                                <Stethoscope className="w-5 h-5" />
                            </div>
                            <h3 className="font-black text-lg">{lang === 'ar' ? 'منتجات العناية بالسكري' : 'Diabetes Care Products'}</h3>
                        </div>
                    </div>
                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                        <ArrowUpRight className="w-6 h-6" />
                    </div>
                </div>
            </motion.div>

            {/* ═══════ خدماتنا الطبية - Section Title + 2×2 Grid ═══════ */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-primary-dark flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-emerald-500" />
                        {lang === 'ar' ? 'خدماتنا الطبية' : 'Medical Services'}
                    </h3>
                    <button onClick={() => navigate('/medical-services')} className="text-xs text-primary-emerald font-bold flex items-center gap-0.5">
                        {lang === 'ar' ? 'عرض الكل' : 'View All'} <ArrowUpRight className="w-3 h-3" />
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: lang === 'ar' ? 'مساعدك الشخصي' : 'My Assistant', IconComp: HeartHandshake, path: '/personal-assistant', gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-200/50' },
                        { label: lang === 'ar' ? 'حاسبة الإنسولين' : 'Insulin Calc', IconComp: Calculator, path: '/insulin-calculator', gradient: 'from-sky-500 to-blue-600', shadow: 'shadow-sky-200/50' },
                        { label: lang === 'ar' ? 'بطاقات العضوية' : 'Membership', IconComp: Sparkles, path: '/membership', gradient: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-200/50' },
                        { label: lang === 'ar' ? 'السجل الصحي' : 'Health Record', IconComp: FileBarChart, path: '/health-record', gradient: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-200/50' },
                    ].map((card, idx) => (
                        <motion.button key={idx}
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.06 }}
                            onClick={() => navigate(card.path)}
                            className={`bg-white rounded-2xl shadow-md ${card.shadow} border border-gray-50 p-4 flex flex-col items-center text-center active:scale-95 transition-all`}
                        >
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-2.5 shadow-lg`}>
                                <card.IconComp className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="font-black text-xs text-gray-700">{card.label}</h4>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* ═══════ MEMBERSHIP CARDS BANNER ═══════ */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                onClick={() => navigate('/membership')}
                className="bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 p-5 rounded-3xl text-white relative overflow-hidden cursor-pointer active:scale-[0.98] transition-all shadow-lg shadow-amber-200/40"
            >
                <div className="absolute top-[-30px] right-[-30px] w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-[-20px] left-[-20px] w-28 h-28 bg-white/5 rounded-full blur-xl" />
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-white/80 text-[10px] font-bold mb-1">⭐ {lang === 'ar' ? 'عضوية حصرية' : 'Exclusive Membership'}</p>
                        <h3 className="text-base font-black mb-0.5">{lang === 'ar' ? 'بطاقات العضوية المميزة' : 'Premium Membership Cards'}</h3>
                        <p className="text-[10px] text-white/70">{lang === 'ar' ? 'فضية • ذهبية • بلاتينية - خصومات تصل إلى 15%' : 'Silver • Gold • Platinum - Up to 15% discount'}</p>
                    </div>
                    <div className="text-4xl">🏆</div>
                </div>
            </motion.div>

            {/* ═══════ DIABETES EDUCATION BANNER ═══════ */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                onClick={() => navigate('/diabetes-education')}
                className="bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-500 p-5 rounded-3xl text-white relative overflow-hidden cursor-pointer active:scale-[0.98] transition-all shadow-lg shadow-sky-200/40"
            >
                <div className="absolute top-[-30px] right-[-30px] w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-[-20px] left-[-20px] w-28 h-28 bg-white/5 rounded-full blur-xl" />
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-white/80 text-[10px] font-bold mb-1">📖 {lang === 'ar' ? 'مدونة' : 'Blog'}</p>
                        <h3 className="text-base font-black mb-0.5">{lang === 'ar' ? 'تثقيف السكري' : 'Diabetes Education'}</h3>
                        <p className="text-[10px] text-white/70">{lang === 'ar' ? 'كورسات تثقيفية · إدارة الوزن · تغذية رياضية' : 'Education · Weight Mgmt · Sports Nutrition'}</p>
                    </div>
                    <div className="text-4xl">🎓</div>
                </div>
            </motion.div>



            {/* ═══════ DIABETES GUIDE BOOK ═══════ */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                onClick={() => navigate('/diabetes-education')}
                className="bg-gradient-to-br from-emerald-500 to-teal-600 p-5 rounded-3xl text-white relative overflow-hidden cursor-pointer active:scale-[0.98] transition-all shadow-lg shadow-emerald-200/40"
            >
                <div className="absolute top-[-20px] left-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-white/80 text-[10px] font-bold mb-1">📝 {lang === 'ar' ? 'مدونة' : 'Blog'}</p>
                        <h3 className="text-base font-black mb-0.5">{lang === 'ar' ? 'مدونة السكري' : 'Diabetes Blog'}</h3>
                        <p className="text-[10px] text-white/70">{lang === 'ar' ? 'كورسات · دورات تعليمية · الدليل الشامل · كتب ومطبوعات' : 'Courses · Training · Comprehensive Guide · Books'}</p>
                    </div>
                    <div className="text-4xl">📚</div>
                </div>
            </motion.div>

            {/* ═══════ NOTIFICATIONS ═══════ */}
            {notifications.length > 0 && (
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-base font-black text-primary-dark flex items-center gap-2">
                            <Bell className="w-4.5 h-4.5 text-amber-500" /> {lang === 'ar' ? 'الإشعارات' : 'Notifications'}
                        </h3>
                        <button onClick={() => navigate('/notifications')} className="text-primary-emerald text-xs font-bold flex items-center gap-0.5">
                            {lang === 'ar' ? 'المزيد' : 'More'} <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {notifications.map((n, i) => (
                            <motion.div key={n.id} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                onClick={() => navigate('/notifications')}
                                className="premium-card p-4 flex items-start gap-3 cursor-pointer"
                            >
                                <div className="bg-gradient-to-br from-amber-100 to-orange-50 p-2.5 rounded-xl flex-shrink-0">
                                    <Bell className="w-4 h-4 text-amber-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-sm text-primary-dark">{n.title}</p>
                                    <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{n.details}</p>
                                </div>
                                <Clock className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-1" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}


        </div>
    );
};

export default HomeView;
