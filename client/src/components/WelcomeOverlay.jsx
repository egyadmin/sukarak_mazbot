import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, TestTube, Stethoscope, ShoppingBag, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WelcomeOverlay = () => {
    const [show, setShow] = useState(false);
    const [step, setStep] = useState(0);
    const navigate = useNavigate();
    const userName = localStorage.getItem('sukarak_user_name') || '';

    useEffect(() => {
        const shouldShow = localStorage.getItem('sukarak_show_welcome');
        if (shouldShow === 'true') {
            setTimeout(() => setShow(true), 800);
        }
    }, []);

    const dismiss = () => {
        setShow(false);
        localStorage.removeItem('sukarak_show_welcome');
    };

    const features = [
        {
            icon: '📊',
            title: 'إدارة السكري الذكية',
            desc: 'تابع قراءات السكر وتمارينك وأدويتك يومياً',
            color: 'from-emerald-400 to-teal-500',
            action: () => { dismiss(); navigate('/health-tracking'); },
        },
        {
            icon: '🧪',
            title: 'التحاليل الطبية المنزلية',
            desc: 'احجز تحاليلك من البيت بأسعار مميزة',
            color: 'from-blue-400 to-indigo-500',
            action: () => { dismiss(); navigate('/medical-tests'); },
        },
        {
            icon: '👩‍⚕️',
            title: 'استشارات طبية متخصصة',
            desc: 'تواصل مع أطباء متخصصين في السكري',
            color: 'from-purple-400 to-violet-500',
            action: () => { dismiss(); navigate('/appointments'); },
        },
        {
            icon: '🏥',
            title: 'تمريض منزلي احترافي',
            desc: 'خدمات تمريضية عالية الجودة في منزلك',
            color: 'from-pink-400 to-rose-500',
            action: () => { dismiss(); navigate('/nursing'); },
        },
        {
            icon: '🛒',
            title: 'متجر مستلزمات السكري',
            desc: 'أجهزة قياس وأدوية ومنتجات صحية',
            color: 'from-amber-400 to-orange-500',
            action: () => { dismiss(); navigate('/market'); },
        },
    ];

    if (!show) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-md flex items-center justify-center p-4"
                onClick={dismiss}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 40 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                    className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
                    style={{ direction: 'rtl' }}
                    onClick={e => e.stopPropagation()}
                >
                    <AnimatePresence mode="wait">
                        {step === 0 ? (
                            <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -50 }}>
                                {/* Hero */}
                                <div className="relative bg-gradient-to-br from-teal-500 via-emerald-500 to-green-600 p-8 text-center text-white overflow-hidden">
                                    <div className="absolute inset-0 overflow-hidden">
                                        {[...Array(6)].map((_, i) => (
                                            <motion.div key={i}
                                                animate={{ y: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }}
                                                transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
                                                className="absolute w-32 h-32 rounded-full bg-white/10"
                                                style={{ top: `${20 + i * 15}%`, left: `${10 + i * 15}%` }}
                                            />
                                        ))}
                                    </div>
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="relative"
                                    >
                                        <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                                            <span className="text-4xl">🎉</span>
                                        </div>
                                    </motion.div>
                                    <h1 className="text-2xl font-black mb-2 relative">مرحباً {userName}!</h1>
                                    <p className="text-sm text-white/80 relative">أهلاً بك في عائلة سكرك مضبوط</p>
                                    <p className="text-xs text-white/60 mt-1 relative">صحتك تهمنا.. معاً نحو حياة أفضل</p>
                                </div>

                                {/* Promo */}
                                <div className="p-5 space-y-4">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-gradient-to-l from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg">
                                                🎁
                                            </div>
                                            <div>
                                                <p className="font-black text-amber-800 text-sm">هدية الترحيب!</p>
                                                <p className="text-xs text-amber-600">استخدم كود <span className="font-black bg-amber-200 px-2 py-0.5 rounded-lg mx-1">WELCOME10</span> لخصم 10%</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <button onClick={() => setStep(1)}
                                        className="w-full bg-gradient-to-l from-teal-500 to-emerald-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-200/50 active:scale-[0.98] transition">
                                        <Sparkles className="w-5 h-5" />
                                        اكتشف خدماتنا
                                    </button>

                                    <button onClick={dismiss}
                                        className="w-full text-gray-400 text-xs font-bold hover:text-gray-500 transition py-2">
                                        تخطي
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="features" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-5">
                                        <button onClick={() => setStep(0)} className="p-2 text-gray-400 hover:text-gray-600">
                                            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                                        </button>
                                        <h3 className="font-black text-lg text-gray-800">خدماتنا المميزة</h3>
                                        <button onClick={dismiss} className="p-2 text-gray-400 hover:text-red-500">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {features.map((f, i) => (
                                            <motion.button
                                                key={i}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.08 }}
                                                onClick={f.action}
                                                className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition active:scale-[0.98] text-right"
                                            >
                                                <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center text-xl shadow-lg flex-shrink-0`}>
                                                    {f.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-black text-sm text-gray-800">{f.title}</p>
                                                    <p className="text-[11px] text-gray-400">{f.desc}</p>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>

                                    <button onClick={dismiss}
                                        className="w-full mt-4 bg-gradient-to-l from-teal-500 to-emerald-600 text-white py-4 rounded-2xl font-black text-sm shadow-lg active:scale-[0.98] transition">
                                        ابدأ الآن 🚀
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default WelcomeOverlay;
