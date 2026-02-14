import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ArrowRight, Activity, Pill, Utensils, Syringe,
    Dumbbell, Calendar, TrendingUp, TrendingDown, Loader2, Filter
} from 'lucide-react';
import DataService from '../services/DataService';

const typeLabels = {
    fasting: 'صائم', after_meal: 'بعد الأكل', random: 'عشوائي', before_meal: 'قبل الأكل',
};
const getTypeLabel = (key) => typeLabels[key] || key;

const mealTypeLabels = {
    breakfast: 'إفطار', lunch: 'غداء', dinner: 'عشاء', snack: 'سناك',
};
const getMealLabel = (key) => mealTypeLabels[key] || key;

const HealthRecordView = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('sugar');
    const [loading, setLoading] = useState(true);
    const [sugarData, setSugarData] = useState([]);
    const [insulinData, setInsulinData] = useState([]);
    const [mealData, setMealData] = useState([]);
    const [exerciseData, setExerciseData] = useState([]);
    const [drugsData, setDrugsData] = useState([]);

    const tabs = [
        { key: 'sugar', label: 'السكر', icon: Activity, color: 'from-emerald-500 to-teal-500', emoji: '🩸' },
        { key: 'insulin', label: 'الأنسولين', icon: Syringe, color: 'from-blue-500 to-indigo-500', emoji: '💉' },
        { key: 'meals', label: 'الوجبات', icon: Utensils, color: 'from-orange-400 to-amber-500', emoji: '🍽️' },
        { key: 'exercise', label: 'الرياضة', icon: Dumbbell, color: 'from-violet-500 to-purple-500', emoji: '🏃' },
        { key: 'drugs', label: 'الأدوية', icon: Pill, color: 'from-rose-500 to-pink-500', emoji: '💊' },
    ];

    useEffect(() => { loadAllData(); }, []);

    const loadAllData = async () => {
        setLoading(true);
        try {
            const [sugar, insulin, meals, exercise, drugs] = await Promise.allSettled([
                DataService.getSugarReadings(),
                DataService.getInsulinRecords(),
                DataService.getMealRecords(),
                DataService.getExerciseRecords(),
                DataService.getDrugRecords(),
            ]);
            if (sugar.status === 'fulfilled') setSugarData(sugar.value.data || []);
            if (insulin.status === 'fulfilled') setInsulinData(insulin.value.data || []);
            if (meals.status === 'fulfilled') setMealData(meals.value.data || []);
            if (exercise.status === 'fulfilled') setExerciseData(exercise.value.data || []);
            if (drugs.status === 'fulfilled') setDrugsData(drugs.value.data || []);
        } catch { }
        setLoading(false);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getSugarColor = (val) => {
        if (val < 70) return 'text-amber-500';
        if (val <= 140) return 'text-emerald-500';
        if (val <= 200) return 'text-orange-500';
        return 'text-red-500';
    };
    const getSugarBg = (val) => {
        if (val < 70) return 'bg-amber-50 border-amber-100';
        if (val <= 140) return 'bg-emerald-50 border-emerald-100';
        if (val <= 200) return 'bg-orange-50 border-orange-100';
        return 'bg-red-50 border-red-100';
    };

    const sugarStats = useMemo(() => {
        if (!sugarData.length) return null;
        const vals = sugarData.map(r => r.reading);
        return {
            avg: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
            min: Math.min(...vals),
            max: Math.max(...vals),
            total: vals.length,
            inRange: vals.filter(v => v >= 70 && v <= 140).length,
        };
    }, [sugarData]);

    const activeData = { sugar: sugarData, insulin: insulinData, meals: mealData, exercise: exerciseData, drugs: drugsData };

    return (
        <div className="space-y-5 pb-24">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-xl shadow-sm active:scale-90 transition">
                    <ChevronLeft className="w-5 h-5 text-gray-500 rtl:rotate-180" />
                </button>
                <h1 className="text-xl font-black text-primary-dark">السجل الصحي</h1>
                <ArrowRight className="w-4 h-4 text-gray-300 rtl:rotate-180" />
            </div>

            {activeTab === 'sugar' && sugarStats && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-emerald-500 to-teal-600 p-5 rounded-3xl text-white relative overflow-hidden">
                    <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="relative z-10">
                        <p className="text-white/80 text-xs font-bold mb-3">📊 ملخص قراءات السكر</p>
                        <div className="grid grid-cols-4 gap-3 text-center">
                            <div>
                                <p className="text-2xl font-black">{sugarStats.avg}</p>
                                <p className="text-[9px] text-white/70">المتوسط</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black">{sugarStats.min}</p>
                                <p className="text-[9px] text-white/70">الأقل</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black">{sugarStats.max}</p>
                                <p className="text-[9px] text-white/70">الأعلى</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black">{Math.round((sugarStats.inRange / sugarStats.total) * 100)}%</p>
                                <p className="text-[9px] text-white/70">في النطاق</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
                {tabs.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl whitespace-nowrap transition-all flex-shrink-0
                        ${activeTab === tab.key
                                ? `bg-gradient-to-b ${tab.color} text-white shadow-md font-black text-xs`
                                : 'bg-white border border-gray-100 text-gray-500 text-xs font-bold shadow-sm'}`}>
                        <span className="text-sm">{tab.emoji}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
                </div>
            )}

            {!loading && (activeData[activeTab]?.length === 0) && (
                <div className="text-center py-12">
                    <p className="text-4xl mb-3">{tabs.find(t => t.key === activeTab)?.emoji}</p>
                    <p className="text-sm font-bold text-gray-400">لا توجد بيانات مسجلة بعد</p>
                    <p className="text-[10px] text-gray-300 mt-1">سجل بياناتك من صفحة "تابع صحتك"</p>
                </div>
            )}

            {!loading && activeTab === 'sugar' && sugarData.length > 0 && (
                <div className="space-y-2">
                    {sugarData.map((r, i) => (
                        <motion.div key={r.id || i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                            className={`p-3.5 rounded-xl border ${getSugarBg(r.reading)} flex items-center justify-between`}>
                            <div className="flex items-center gap-3">
                                <div className={`text-2xl font-black ${getSugarColor(r.reading)}`}>{r.reading}</div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold">{getTypeLabel(r.test_type) || 'قراءة'}</p>
                                    <p className="text-[9px] text-gray-300">{formatDate(r.created_at)}</p>
                                </div>
                            </div>
                            {r.reading <= 140 && r.reading >= 70
                                ? <TrendingUp className="w-4 h-4 text-emerald-400" />
                                : <TrendingDown className="w-4 h-4 text-red-400" />
                            }
                        </motion.div>
                    ))}
                </div>
            )}

            {!loading && activeTab === 'insulin' && insulinData.length > 0 && (
                <div className="space-y-2">
                    {insulinData.map((r, i) => (
                        <motion.div key={r.id || i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                            className="bg-blue-50 border border-blue-100 p-3.5 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Syringe className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="font-black text-sm text-gray-700">{r.insulin_type || 'أنسولين'}</p>
                                    <p className="text-[9px] text-gray-400">{formatDate(r.created_at)}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-lg text-blue-600">{r.units}</p>
                                <p className="text-[9px] text-gray-400">وحدة</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {!loading && activeTab === 'meals' && mealData.length > 0 && (
                <div className="space-y-2">
                    {mealData.map((r, i) => (
                        <motion.div key={r.id || i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                            className="bg-orange-50 border border-orange-100 p-3.5 rounded-xl">
                            <div className="flex items-center justify-between mb-1">
                                <p className="font-black text-sm text-gray-700">🍽️ {getMealLabel(r.type) || 'وجبة'}</p>
                                <p className="text-[9px] text-gray-400">{formatDate(r.created_at)}</p>
                            </div>
                            {r.contents && <p className="text-xs text-gray-500">{r.contents}</p>}
                            {r.calories > 0 && (
                                <p className="text-xs font-bold text-orange-500 mt-1">🔥 {r.calories} سعرة</p>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {!loading && activeTab === 'exercise' && exerciseData.length > 0 && (
                <div className="space-y-2">
                    {exerciseData.map((r, i) => (
                        <motion.div key={r.id || i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                            className="bg-violet-50 border border-violet-100 p-3.5 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                                    <Dumbbell className="w-5 h-5 text-violet-500" />
                                </div>
                                <div>
                                    <p className="font-black text-sm text-gray-700">{r.exercise_type || 'تمرين'}</p>
                                    <p className="text-[9px] text-gray-400">{formatDate(r.created_at)}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-lg text-violet-600">{r.duration_minutes || '—'}</p>
                                <p className="text-[9px] text-gray-400">دقيقة</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {!loading && activeTab === 'drugs' && drugsData.length > 0 && (
                <div className="space-y-2">
                    {drugsData.map((r, i) => (
                        <motion.div key={r.id || i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                            className="bg-rose-50 border border-rose-100 p-3.5 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                                    <Pill className="w-5 h-5 text-rose-500" />
                                </div>
                                <div>
                                    <p className="font-black text-sm text-gray-700">{r.name || 'دواء'}</p>
                                    <p className="text-[9px] text-gray-400">{r.dose} {r.form ? `• ${r.form}` : ''}</p>
                                    <p className="text-[9px] text-gray-300">{formatDate(r.created_at)}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HealthRecordView;
