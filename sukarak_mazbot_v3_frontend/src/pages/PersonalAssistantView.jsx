import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, Flame, Scale, Activity, Calculator, Wheat,
    X, Check, ArrowRight, Sparkles, Info
} from 'lucide-react';

const PersonalAssistantView = () => {
    const navigate = useNavigate();
    const [activeTool, setActiveTool] = useState(null);

    const [calAge, setCalAge] = useState('');
    const [calWeight, setCalWeight] = useState('');
    const [calHeight, setCalHeight] = useState('');
    const [calGender, setCalGender] = useState('male');
    const [calActivity, setCalActivity] = useState('moderate');
    const [calResult, setCalResult] = useState(null);

    const [bmiWeight, setBmiWeight] = useState('');
    const [bmiHeight, setBmiHeight] = useState('');
    const [bmiResult, setBmiResult] = useState(null);

    const [iwHeight, setIwHeight] = useState('');
    const [iwGender, setIwGender] = useState('male');
    const [iwResult, setIwResult] = useState(null);

    const [cfTotalCarbs, setCfTotalCarbs] = useState('');
    const [cfTotalInsulin, setCfTotalInsulin] = useState('');
    const [cfResult, setCfResult] = useState(null);

    const tools = [
        { id: 'calories', title: 'حاسبة السعرات الحرارية', icon: '🔥', iconComponent: Flame, color: 'from-orange-400 to-red-500', lightBg: 'bg-orange-50', description: 'احسب احتياجك اليومي من السعرات', full: true },
        { id: 'bmi', title: 'مؤشر كتلة الجسم', icon: '⚖️', iconComponent: Scale, color: 'from-sky-400 to-blue-500', lightBg: 'bg-sky-50', description: 'BMI - هل وزنك مثالي؟' },
        { id: 'ideal-weight', title: 'الوزن المثالي', icon: '🏋️', iconComponent: Activity, color: 'from-emerald-400 to-teal-500', lightBg: 'bg-emerald-50', description: 'اعرف وزنك المثالي' },
        { id: 'carb-factor', title: 'معامل الكربوهيدرات', icon: '🍞', iconComponent: Wheat, color: 'from-amber-400 to-yellow-500', lightBg: 'bg-amber-50', description: 'نسبة الأنسولين للكربوهيدرات' },
    ];

    const calculateCalories = () => {
        const w = parseFloat(calWeight), h = parseFloat(calHeight), a = parseFloat(calAge);
        if (!w || !h || !a) return;
        let bmr = calGender === 'male' ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
        const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };
        const tdee = Math.round(bmr * (multipliers[calActivity] || 1.55));
        setCalResult({ maintain: tdee, lose: Math.round(tdee - 500), gain: Math.round(tdee + 500), bmr: Math.round(bmr) });
    };

    const calculateBMI = () => {
        const w = parseFloat(bmiWeight), h = parseFloat(bmiHeight) / 100;
        if (!w || !h) return;
        const bmi = (w / (h * h)).toFixed(1);
        let category, color, emoji;
        if (bmi < 18.5) { category = 'نقص في الوزن'; color = 'text-amber-500'; emoji = '⚠️'; }
        else if (bmi < 25) { category = 'وزن طبيعي'; color = 'text-emerald-500'; emoji = '✅'; }
        else if (bmi < 30) { category = 'وزن زائد'; color = 'text-orange-500'; emoji = '⚡'; }
        else { category = 'سمنة'; color = 'text-red-500'; emoji = '🔴'; }
        setBmiResult({ bmi, category, color, emoji });
    };

    const calculateIdealWeight = () => {
        const h = parseFloat(iwHeight);
        if (!h) return;
        const ideal = iwGender === 'male' ? 50 + 0.91 * (h - 152.4) : 45.5 + 0.91 * (h - 152.4);
        setIwResult({ ideal: Math.round(ideal), rangeMin: Math.round(ideal - 5), rangeMax: Math.round(ideal + 5) });
    };

    const calculateCarbFactor = () => {
        const carbs = parseFloat(cfTotalCarbs), insulin = parseFloat(cfTotalInsulin);
        if (!carbs || !insulin) return;
        const factor = (carbs / insulin).toFixed(1);
        setCfResult({ factor, explanation: `كل ${factor} جرام كربوهيدرات تحتاج وحدة واحدة أنسولين` });
    };

    const activityLevels = [
        { key: 'sedentary', label: 'خامل', emoji: '🛋️' },
        { key: 'light', label: 'خفيف', emoji: '🚶' },
        { key: 'moderate', label: 'معتدل', emoji: '🏃' },
        { key: 'active', label: 'نشيط', emoji: '💪' },
        { key: 'veryActive', label: 'رياضي', emoji: '🏆' },
    ];

    const closeTool = () => { setActiveTool(null); setCalResult(null); setBmiResult(null); setIwResult(null); setCfResult(null); };

    return (
        <div className="space-y-5 pb-24">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-xl shadow-sm active:scale-90 transition">
                    <ChevronLeft className="w-5 h-5 text-gray-500 rtl:rotate-180" />
                </button>
                <h1 className="text-xl font-black text-primary-dark">مساعدك الشخصي</h1>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-violet-50 to-purple-50 p-5 rounded-3xl border border-violet-100">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-200/50">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <Check className="w-4 h-4 text-violet-500" />
                            <p className="text-xs font-bold text-gray-600">مجموعة من الأدوات للمساعدة في متابعة حالتك الصحية</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-violet-500" />
                            <p className="text-xs font-bold text-gray-600">تابع وقيّم نتائجك بشكل مستمر لحياة أكثر صحة</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="space-y-3">
                {tools.map((tool, idx) => (
                    <motion.button key={tool.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
                        onClick={() => setActiveTool(tool.id)}
                        className="w-full bg-white rounded-2xl shadow-sm border border-gray-50 p-4 flex items-center gap-4 active:scale-[0.98] transition-all text-right">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            <span className="text-2xl">{tool.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-black text-sm text-gray-700">{tool.title}</h3>
                            <p className="text-[10px] text-gray-400 mt-0.5">{tool.description}</p>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-gray-300" />
                    </motion.button>
                ))}
            </div>

            <AnimatePresence>
                {activeTool && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1100] flex flex-col justify-end"
                        onClick={(e) => e.target === e.currentTarget && closeTool()}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="bg-white rounded-t-3xl w-full max-w-md mx-auto flex flex-col" style={{ maxHeight: '85vh' }}>

                            <div className="flex items-center justify-between p-6 pb-3 flex-shrink-0">
                                <h2 className="font-black text-lg text-primary-dark">{tools.find(t => t.id === activeTool)?.title}</h2>
                                <button onClick={closeTool} className="p-2 bg-gray-100 rounded-xl"><X className="w-4 h-4 text-gray-400" /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-4">
                                {activeTool === 'calories' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 mb-1.5">العمر</label>
                                                <input type="number" value={calAge} onChange={e => setCalAge(e.target.value)} placeholder="30" className="w-full bg-gray-50 p-3 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-orange-400 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 mb-1.5">الوزن (كجم)</label>
                                                <input type="number" value={calWeight} onChange={e => setCalWeight(e.target.value)} placeholder="75" className="w-full bg-gray-50 p-3 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-orange-400 outline-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-1.5">الطول (سم)</label>
                                            <input type="number" value={calHeight} onChange={e => setCalHeight(e.target.value)} placeholder="170" className="w-full bg-gray-50 p-3 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-orange-400 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-1.5">الجنس</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[{ k: 'male', l: '👨 ذكر' }, { k: 'female', l: '👩 أنثى' }].map(g => (
                                                    <button key={g.k} onClick={() => setCalGender(g.k)}
                                                        className={`py-3 rounded-2xl font-black text-xs transition-all ${calGender === g.k ? 'bg-gradient-to-b from-orange-400 to-red-500 text-white shadow-lg shadow-orange-200' : 'bg-gray-100 text-gray-500'}`}>
                                                        {g.l}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-1.5">مستوى النشاط</label>
                                            <div className="grid grid-cols-5 gap-1">
                                                {activityLevels.map(a => (
                                                    <button key={a.key} onClick={() => setCalActivity(a.key)}
                                                        className={`flex flex-col items-center py-2 rounded-xl text-center transition-all ${calActivity === a.key ? 'bg-gradient-to-b from-orange-400 to-red-500 text-white shadow-md' : 'bg-gray-50 text-gray-500'}`}>
                                                        <span className="text-sm">{a.emoji}</span>
                                                        <span className="text-[8px] font-bold mt-0.5">{a.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {calResult && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-2xl border border-orange-100 space-y-3">
                                                <p className="text-xs font-bold text-gray-500 text-center">معدل الأيض الأساسي: <span className="text-orange-600 font-black">{calResult.bmr}</span> سعرة</p>
                                                <div className="grid grid-cols-3 gap-2 text-center">
                                                    <div className="bg-white/80 p-3 rounded-xl">
                                                        <p className="text-[9px] text-gray-400 font-bold">خسارة</p>
                                                        <p className="font-black text-red-500 text-lg">{calResult.lose}</p>
                                                        <p className="text-[8px] text-gray-400">سعرة/يوم</p>
                                                    </div>
                                                    <div className="bg-white/80 p-3 rounded-xl ring-2 ring-emerald-200">
                                                        <p className="text-[9px] text-gray-400 font-bold">ثبات</p>
                                                        <p className="font-black text-emerald-500 text-lg">{calResult.maintain}</p>
                                                        <p className="text-[8px] text-gray-400">سعرة/يوم</p>
                                                    </div>
                                                    <div className="bg-white/80 p-3 rounded-xl">
                                                        <p className="text-[9px] text-gray-400 font-bold">زيادة</p>
                                                        <p className="font-black text-blue-500 text-lg">{calResult.gain}</p>
                                                        <p className="text-[8px] text-gray-400">سعرة/يوم</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </>
                                )}

                                {activeTool === 'bmi' && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-1.5">الوزن (كجم)</label>
                                            <input type="number" value={bmiWeight} onChange={e => setBmiWeight(e.target.value)} placeholder="75" className="w-full bg-gray-50 p-3 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-blue-400 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-1.5">الطول (سم)</label>
                                            <input type="number" value={bmiHeight} onChange={e => setBmiHeight(e.target.value)} placeholder="170" className="w-full bg-gray-50 p-3 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-blue-400 outline-none" />
                                        </div>
                                        {bmiResult && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                className="bg-gradient-to-br from-sky-50 to-blue-50 p-5 rounded-2xl border border-blue-100 text-center space-y-3">
                                                <p className="text-4xl font-black">{bmiResult.emoji}</p>
                                                <p className="text-3xl font-black text-gray-700">{bmiResult.bmi}</p>
                                                <p className={`font-black text-lg ${bmiResult.color}`}>{bmiResult.category}</p>
                                                <div className="flex justify-center gap-2 text-[9px]">
                                                    <span className="bg-amber-100 text-amber-600 px-2 py-1 rounded-lg font-bold">&lt;18.5 نقص</span>
                                                    <span className="bg-emerald-100 text-emerald-600 px-2 py-1 rounded-lg font-bold">18.5-25 طبيعي</span>
                                                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-lg font-bold">25-30 زائد</span>
                                                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-lg font-bold">&gt;30 سمنة</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </>
                                )}

                                {activeTool === 'ideal-weight' && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-1.5">الطول (سم)</label>
                                            <input type="number" value={iwHeight} onChange={e => setIwHeight(e.target.value)} placeholder="170" className="w-full bg-gray-50 p-3 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-emerald-400 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-1.5">الجنس</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[{ k: 'male', l: '👨 ذكر' }, { k: 'female', l: '👩 أنثى' }].map(g => (
                                                    <button key={g.k} onClick={() => setIwGender(g.k)}
                                                        className={`py-3 rounded-2xl font-black text-xs transition-all ${iwGender === g.k ? 'bg-gradient-to-b from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-200' : 'bg-gray-100 text-gray-500'}`}>
                                                        {g.l}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {iwResult && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-100 text-center space-y-3">
                                                <p className="text-3xl">🎯</p>
                                                <p className="text-3xl font-black text-emerald-600">{iwResult.ideal} <span className="text-base text-gray-400">كجم</span></p>
                                                <p className="text-xs font-bold text-gray-500">
                                                    النطاق الصحي: <span className="text-emerald-600 font-black">{iwResult.rangeMin} - {iwResult.rangeMax} كجم</span>
                                                </p>
                                            </motion.div>
                                        )}
                                    </>
                                )}

                                {activeTool === 'carb-factor' && (
                                    <>
                                        <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
                                            <div className="flex items-start gap-2">
                                                <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                                <p className="text-[11px] text-amber-700 font-bold leading-relaxed">
                                                    معامل الكربوهيدرات يحدد كمية الكربوهيدرات التي تحتاج وحدة واحدة من الأنسولين لتغطيتها
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-1.5">إجمالي الكربوهيدرات (جرام)</label>
                                            <input type="number" value={cfTotalCarbs} onChange={e => setCfTotalCarbs(e.target.value)} placeholder="60" className="w-full bg-gray-50 p-3 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-amber-400 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-1.5">جرعة الأنسولين (وحدة)</label>
                                            <input type="number" value={cfTotalInsulin} onChange={e => setCfTotalInsulin(e.target.value)} placeholder="4" className="w-full bg-gray-50 p-3 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-amber-400 outline-none" />
                                        </div>
                                        {cfResult && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                className="bg-gradient-to-br from-amber-50 to-yellow-50 p-5 rounded-2xl border border-amber-100 text-center space-y-3">
                                                <p className="text-3xl">🍞</p>
                                                <p className="text-3xl font-black text-amber-600">1 : {cfResult.factor}</p>
                                                <p className="text-xs font-bold text-gray-500">{cfResult.explanation}</p>
                                            </motion.div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="p-6 pt-3 flex-shrink-0 bg-white border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        if (activeTool === 'calories') calculateCalories();
                                        if (activeTool === 'bmi') calculateBMI();
                                        if (activeTool === 'ideal-weight') calculateIdealWeight();
                                        if (activeTool === 'carb-factor') calculateCarbFactor();
                                    }}
                                    className={`w-full bg-gradient-to-l ${tools.find(t => t.id === activeTool)?.color || 'from-violet-500 to-purple-600'} text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition`}>
                                    <Calculator className="w-5 h-5" /> احسب الآن
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PersonalAssistantView;
