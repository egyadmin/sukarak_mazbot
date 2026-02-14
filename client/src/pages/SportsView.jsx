import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Dumbbell, Check, X, AlertTriangle, Search, ChevronDown, ChevronUp, Heart, Activity, Shield, Eye, Footprints, Timer, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../api/config';

const sportIcons = {
    'المشي السريع': '🚶',
    'السباحة': '🏊',
    'ركوب الدراجة': '🚴',
    'التمارين الهوائية': '💪',
    'اليوجا': '🧘',
    'تمارين المقاومة': '🏋️',
    'الرقص': '💃',
    'كرة السلة': '🏀',
    'كرة الطائرة': '🏐',
    'التنس': '🎾',
};

const guidelines = [
    { id: 1, title: 'استشارة الطبيب', subtitle: 'إرشادات ونصائح', icon: '🩺', color: 'from-teal-500 to-emerald-500', details: 'استشر طبيبك قبل البدء في أي برنامج رياضي جديد. تأكد من أن النشاط البدني المختار مناسب لحالتك الصحية ومستوى السكر لديك.' },
    { id: 2, title: 'مراقبة مستويات السكر', subtitle: 'إرشادات ونصائح', icon: '📊', color: 'from-blue-500 to-indigo-500', details: 'قم بقياس مستوى السكر قبل وأثناء وبعد التمرين. إذا كان مستوى السكر أقل من 100 أو أعلى من 250، تجنب ممارسة الرياضة.' },
    { id: 3, title: 'المعدات المناسبة', subtitle: 'إرشادات ونصائح', icon: '👟', color: 'from-purple-500 to-pink-500', details: 'ارتدِ أحذية رياضية مريحة ومناسبة لحماية قدميك. استخدم جوارب قطنية ناعمة وتجنب ممارسة الرياضة حافي القدمين.' },
];

const SportsView = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('guidelines'); // 'guidelines', 'exercises', 'calculator'

    return (
        <div className="space-y-6 pb-24 font-cairo" dir="rtl">
            <h2 className="text-2xl font-black text-primary-dark">الرياضة والنشاط البدني</h2>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button onClick={() => setActiveTab('guidelines')} className={`px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === 'guidelines' ? 'bg-primary-emerald text-white shadow-lg shadow-emerald-200' : 'bg-white text-gray-400 border border-gray-100'}`}>الإرشادات العامة</button>
                <button onClick={() => setActiveTab('exercises')} className={`px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === 'exercises' ? 'bg-primary-emerald text-white shadow-lg shadow-emerald-200' : 'bg-white text-gray-400 border border-gray-100'}`}>تمارين مقترحة</button>
            </div>

            {activeTab === 'guidelines' && (
                <div className="space-y-4">
                    {guidelines.map((g) => (
                        <motion.div key={g.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-50">
                            <div className="flex items-center gap-4 mb-3">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${g.color} flex items-center justify-center text-2xl shadow-lg`}>{g.icon}</div>
                                <div>
                                    <h4 className="font-black text-primary-dark">{g.title}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{g.subtitle}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">{g.details}</p>
                        </motion.div>
                    ))}
                </div>
            )}

            {activeTab === 'exercises' && (
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(sportIcons).map(([name, icon], i) => (
                        <motion.div key={i} whileTap={{ scale: 0.98 }} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex flex-col items-center gap-3 text-center">
                            <span className="text-4xl">{icon}</span>
                            <span className="font-black text-primary-dark text-sm">{name}</span>
                        </motion.div>
                    ))}
                </div>
            )}

            <button onClick={() => navigate('/health-tracking?tab=exercise')} className="w-full bg-primary-dark text-white py-4 rounded-3xl font-black flex items-center justify-center gap-3 shadow-xl shadow-primary-dark/20 active:scale-[0.98] transition">
                <Dumbbell className="w-6 h-6" /> سجل تمارينك الآن
            </button>
        </div>
    );
};

export default SportsView;
