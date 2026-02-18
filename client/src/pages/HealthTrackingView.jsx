import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, Plus, History, ArrowRight, Save, Clock, Droplets, Dumbbell, Utensils, TrendingUp, TrendingDown, AlertTriangle, Pill, Trash2, BookOpen, Search, X, ChevronDown, CheckCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '../api/config';

/* ─── Circular Slider Component ─── */
const CircularSlider = ({ value = 0, onChange, min = 0, max = 600, isCumulative = false }) => {
    const svgRef = useRef(null);
    const isDragging = useRef(false);
    const size = 220;
    const strokeWidth = 16;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2 - 8;
    const startAngle = 135;
    const endAngle = 405;
    const totalAngle = endAngle - startAngle;

    const getColor = (val) => {
        if (isCumulative) {
            if (val < 5.7) return { main: '#3b82f6', glow: '#93c5fd', label: 'طبيعي' };
            if (val < 6.5) return { main: '#10b981', glow: '#6ee7b7', label: 'جيد' };
            if (val < 7.0) return { main: '#f59e0b', glow: '#fcd34d', label: 'مرتفع قليلاً' };
            return { main: '#ef4444', glow: '#fca5a5', label: 'مرتفع' };
        }
        if (val < 70) return { main: '#3b82f6', glow: '#93c5fd', label: 'منخفض' };
        if (val <= 140) return { main: '#10b981', glow: '#6ee7b7', label: 'طبيعي' };
        if (val <= 200) return { main: '#f59e0b', glow: '#fcd34d', label: 'مرتفع قليلاً' };
        return { main: '#ef4444', glow: '#fca5a5', label: 'مرتفع' };
    };

    const clampedValue = Math.max(min, Math.min(max, value));
    const ratio = (clampedValue - min) / (max - min);
    const currentAngle = startAngle + ratio * totalAngle;
    const colorInfo = getColor(clampedValue);

    const polarToCartesian = (angle) => {
        const rad = ((angle - 90) * Math.PI) / 180;
        return { x: center + radius * Math.cos(rad), y: center + radius * Math.sin(rad) };
    };

    const describeArc = (start, end) => {
        const s = polarToCartesian(start);
        const e = polarToCartesian(end);
        const largeArc = end - start > 180 ? 1 : 0;
        return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${largeArc} 1 ${e.x} ${e.y}`;
    };

    const angleFromEvent = useCallback((e) => {
        if (!svgRef.current) return null;
        const rect = svgRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left - center;
        const y = clientY - rect.top - center;
        let angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
        if (angle < 0) angle += 360;
        if (angle < startAngle && angle < 90) angle += 360;
        if (angle < startAngle) angle = startAngle;
        if (angle > endAngle) angle = endAngle;
        const r = (angle - startAngle) / totalAngle;
        const step = isCumulative ? 0.1 : 1;
        let newVal = min + r * (max - min);
        newVal = Math.round(newVal / step) * step;
        return Math.max(min, Math.min(max, newVal));
    }, [center, min, max, isCumulative, startAngle, endAngle, totalAngle]);

    const handleStart = (e) => { isDragging.current = true; const v = angleFromEvent(e); if (v !== null) onChange(v); };
    const handleMove = useCallback((e) => { if (!isDragging.current) return; e.preventDefault(); const v = angleFromEvent(e); if (v !== null) onChange(v); }, [angleFromEvent, onChange]);
    const handleEnd = () => { isDragging.current = false; };

    useEffect(() => {
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchmove', handleMove, { passive: false });
        window.addEventListener('touchend', handleEnd);
        return () => { window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleEnd); window.removeEventListener('touchmove', handleMove); window.removeEventListener('touchend', handleEnd); };
    }, [handleMove]);

    const thumbPos = polarToCartesian(currentAngle);
    const displayValue = isCumulative ? clampedValue.toFixed(1) : Math.round(clampedValue);

    return (
        <div className="flex flex-col items-center select-none">
            <svg ref={svgRef} width={size} height={size} className="cursor-pointer" onMouseDown={handleStart} onTouchStart={handleStart} style={{ touchAction: 'none' }}>
                <defs>
                    <linearGradient id="sliderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={colorInfo.main} />
                        <stop offset="100%" stopColor={colorInfo.glow} />
                    </linearGradient>
                    <filter id="glowFilter"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                {/* Background track */}
                <path d={describeArc(startAngle, endAngle)} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} strokeLinecap="round" />
                {/* Active arc */}
                {clampedValue > min && <path d={describeArc(startAngle, currentAngle)} fill="none" stroke="url(#sliderGrad)" strokeWidth={strokeWidth} strokeLinecap="round" filter="url(#glowFilter)" />}
                {/* Thumb */}
                <circle cx={thumbPos.x} cy={thumbPos.y} r={14} fill="white" stroke={colorInfo.main} strokeWidth={3} filter="url(#glowFilter)" style={{ transition: 'stroke 0.3s' }} />
                <circle cx={thumbPos.x} cy={thumbPos.y} r={6} fill={colorInfo.main} style={{ transition: 'fill 0.3s' }} />
                {/* Center text */}
                <text x={center} y={center - 12} textAnchor="middle" className="text-4xl font-black" fill={colorInfo.main} style={{ fontSize: '36px', fontWeight: 900, transition: 'fill 0.3s' }}>{displayValue}</text>
                <text x={center} y={center + 16} textAnchor="middle" fill="#9ca3af" style={{ fontSize: '12px', fontWeight: 700 }}>{isCumulative ? '%' : 'mg/dL'}</text>
                <text x={center} y={center + 36} textAnchor="middle" fill={colorInfo.main} style={{ fontSize: '11px', fontWeight: 800, transition: 'fill 0.3s' }}>{colorInfo.label}</text>
            </svg>
        </div>
    );
};

// Translation map
const typeLabels = {
    ar: { fasting: 'صائم', after_meal: 'بعد الأكل', random: 'عشوائي', before_meal: 'قبل الأكل', cumulative: 'تراكمي (HbA1c)', Walking: 'مشي', Running: 'جري', Swimming: 'سباحة', Cycling: 'دراجة', Yoga: 'يوغا', Resistance: 'مقاومة' },
    en: { fasting: 'Fasting', after_meal: 'After Meal', random: 'Random', before_meal: 'Before Meal', cumulative: 'Cumulative (HbA1c)', Walking: 'Walking', Running: 'Running', Swimming: 'Swimming', Cycling: 'Cycling', Yoga: 'Yoga', Resistance: 'Resistance' },
};

const mealTypeLabels = {
    ar: { breakfast: 'إفطار', lunch: 'غداء', dinner: 'عشاء', snack: 'سناك' },
    en: { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack' },
};

const mealAssociations = {
    ar: ['قبل الإفطار', 'بعد الإفطار', 'قبل الغداء', 'بعد الغداء', 'قبل العشاء', 'بعد العشاء', 'قبل النوم'],
    en: ['Before Breakfast', 'After Breakfast', 'Before Lunch', 'After Lunch', 'Before Dinner', 'After Dinner', 'Before Sleep'],
};

const HealthTrackingView = () => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language === 'ar' ? 'ar' : 'en';
    const getTypeLabel = (key) => typeLabels[lang]?.[key] || typeLabels['ar']?.[key] || key;
    const getMealLabel = (key) => mealTypeLabels[lang]?.[key] || mealTypeLabels['ar']?.[key] || key;

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // States
    const [reading, setReading] = useState('');
    const [sliderValue, setSliderValue] = useState(0);
    const [useSlider, setUseSlider] = useState(true);
    const [mealAssociation, setMealAssociation] = useState('قبل الإفطار');
    const [testType, setTestType] = useState('fasting');
    const [sugarUnit, setSugarUnit] = useState('mg/dl');
    const [recentReadings, setRecentReadings] = useState([]);

    const [drugName, setDrugName] = useState('');
    const [drugForm, setDrugForm] = useState('أقراص');
    const [drugFrequency, setDrugFrequency] = useState('مرة يومياً');
    const [drugServing, setDrugServing] = useState('');
    const [drugDosageUnit, setDrugDosageUnit] = useState('mg');
    const [drugConcentration, setDrugConcentration] = useState('');
    const [drugConcentrationUnit, setDrugConcentrationUnit] = useState('mg/ml');
    const [recentDrugs, setRecentDrugs] = useState([]);

    const [exerciseType, setExerciseType] = useState('Walking');
    const [exerciseDuration, setExerciseDuration] = useState('');
    const [recentExercises, setRecentExercises] = useState([]);

    const [mealType, setMealType] = useState('breakfast');
    const [mealContents, setMealContents] = useState('');
    const [mealCalories, setMealCalories] = useState('');
    const [recentMeals, setRecentMeals] = useState([]);
    const [mealInputMode, setMealInputMode] = useState('detailed');
    const [mealItems, setMealItems] = useState([]);
    const [newItemName, setNewItemName] = useState('');
    const [newItemQty, setNewItemQty] = useState('');
    const [newItemUnit, setNewItemUnit] = useState('جرام');

    const [showFoodGuide, setShowFoodGuide] = useState(false);
    const [foodGuideItems, setFoodGuideItems] = useState([]);
    const [foodGuideSearch, setFoodGuideSearch] = useState('');
    const [foodGuideCategory, setFoodGuideCategory] = useState('');
    const [foodCategories, setFoodCategories] = useState([]);
    const [loadingFoods, setLoadingFoods] = useState(false);

    const [measureDate, setMeasureDate] = useState(new Date().toISOString().split('T')[0]);
    const [measureTime, setMeasureTime] = useState(new Date().toTimeString().slice(0, 5));

    const categories = [
        { id: 'sugar', title: lang === 'ar' ? 'متابعة قياساتك' : 'Sugar Readings', icon: Droplets, color: 'from-red-500 to-rose-500', lightColor: 'bg-red-50 text-red-600' },
        { id: 'insulin', title: lang === 'ar' ? 'سجل أدويتك' : 'Medications', icon: Pill, color: 'from-blue-500 to-cyan-500', lightColor: 'bg-blue-50 text-blue-600' },
        { id: 'exercise', title: lang === 'ar' ? 'سجل رياضتك' : 'Exercises', icon: Dumbbell, color: 'from-orange-500 to-amber-500', lightColor: 'bg-orange-50 text-orange-600' },
        { id: 'meals', title: lang === 'ar' ? 'سجل وجباتك' : 'Meals Tracking', icon: Utensils, color: 'from-emerald-500 to-teal-500', lightColor: 'bg-emerald-50 text-emerald-600' },
    ];

    useEffect(() => { loadSugarReadings(); }, []);
    useEffect(() => {
        if (selectedCategory === 'insulin') loadDrugs();
        if (selectedCategory === 'exercise') loadExercises();
        if (selectedCategory === 'meals') loadMeals();
    }, [selectedCategory]);

    const loadSugarReadings = () => {
        fetch(`${API_BASE}/health/sugar`).then(r => r.json()).then(d => setRecentReadings(Array.isArray(d) ? d.slice(0, 10).reverse() : [])).catch(() => { });
    };
    const loadDrugs = () => {
        fetch(`${API_BASE}/health/drugs`).then(r => r.json()).then(d => setRecentDrugs(Array.isArray(d) ? [...d].reverse() : [])).catch(() => { });
    };
    const loadExercises = () => {
        fetch(`${API_BASE}/health/exercise`).then(r => r.json()).then(d => setRecentExercises(Array.isArray(d) ? [...d].reverse() : [])).catch(() => { });
    };
    const loadMeals = () => {
        fetch(`${API_BASE}/health/meals`).then(r => r.json()).then(d => setRecentMeals(Array.isArray(d) ? [...d].reverse() : [])).catch(() => { });
    };

    const loadFoodGuide = () => {
        if (foodGuideItems.length > 0) return;
        setLoadingFoods(true);
        Promise.all([
            fetch(`${API_BASE}/health/foods`).then(r => r.json()).catch(() => []),
            fetch(`${API_BASE}/health/foods/categories`).then(r => r.json()).catch(() => []),
        ]).then(([foods, cats]) => {
            setFoodGuideItems(Array.isArray(foods) ? foods : []);
            setFoodCategories(Array.isArray(cats) ? cats : []);
            setLoadingFoods(false);
        });
    };

    const handleSaveSugar = async () => {
        const val = useSlider ? sliderValue : parseFloat(reading);
        if ((!val && val !== 0) || val === 0 || isSaving) return;
        setIsSaving(true);
        try {
            const res = await fetch(`${API_BASE}/health/sugar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reading: val, test_type: testType, unit: sugarUnit, period: mealAssociation, measured_at: `${measureDate}T${measureTime}:00` }),
            });
            if (res.ok) { setShowSuccess(true); setTimeout(() => setShowSuccess(false), 2000); setReading(''); setSliderValue(0); loadSugarReadings(); }
        } catch (e) { }
        setIsSaving(false);
    };

    const getSugarLevel = (val) => {
        if (val < 70) return { label: 'منخفض', color: 'text-amber-500', bg: 'bg-amber-50', icon: TrendingDown };
        if (val <= 140) return { label: 'طبيعي', color: 'text-emerald-500', bg: 'bg-emerald-50', icon: TrendingUp };
        if (val <= 200) return { label: 'مرتفع قليلاً', color: 'text-orange-500', bg: 'bg-orange-50', icon: AlertTriangle };
        return { label: 'مرتفع', color: 'text-red-500', bg: 'bg-red-50', icon: AlertTriangle };
    };

    return (
        <div className="space-y-5 pb-24 font-cairo" dir="rtl">
            <h2 className="text-2xl font-black text-primary-dark">{lang === 'ar' ? 'تابع صحتك' : 'Health Tracking'}</h2>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="fixed top-20 right-4 left-4 z-[1100] bg-emerald-500 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-bold">{lang === 'ar' ? 'تم الحفظ بنجاح' : 'Saved Success'}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {!selectedCategory ? (
                <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => (
                        <motion.div key={cat.id} whileTap={{ scale: 0.96 }}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`bg-gradient-to-br ${cat.color} p-5 rounded-3xl shadow-lg cursor-pointer text-white flex flex-col gap-3 min-h-[130px]`}>
                            <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <cat.icon className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-sm tracking-tight">{cat.title}</span>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-6 rounded-[32px] shadow-lg border border-gray-50 space-y-5">
                    <div className="flex justify-between items-center">
                        <button onClick={() => setSelectedCategory(null)} className="p-2.5 bg-gray-100 rounded-xl"><ArrowRight className="w-5 h-5 rtl:rotate-0 rotate-180" /></button>
                        <h3 className="text-lg font-black text-primary-dark">{categories.find(c => c.id === selectedCategory)?.title}</h3>
                        <div className="w-10"></div>
                    </div>
                    {selectedCategory === 'sugar' && (
                        <div className="space-y-4">
                            {/* Toggle: Slider vs Text */}
                            <div className="flex gap-2 justify-center">
                                <button onClick={() => setUseSlider(true)} className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${useSlider ? 'bg-primary-dark text-white' : 'bg-gray-50 text-gray-400'}`}>
                                    🎯 {lang === 'ar' ? 'سلايدر' : 'Slider'}
                                </button>
                                <button onClick={() => setUseSlider(false)} className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${!useSlider ? 'bg-primary-dark text-white' : 'bg-gray-50 text-gray-400'}`}>
                                    ⌨️ {lang === 'ar' ? 'إدخال يدوي' : 'Manual'}
                                </button>
                            </div>
                            {/* Circular Slider or Text Input */}
                            {useSlider ? (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center py-2">
                                    <CircularSlider
                                        value={sliderValue}
                                        onChange={setSliderValue}
                                        min={0}
                                        max={testType === 'cumulative' ? 20 : 600}
                                        isCumulative={testType === 'cumulative'}
                                    />
                                </motion.div>
                            ) : (
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">{lang === 'ar' ? 'القيمة' : 'Value'} ({testType === 'cumulative' ? '%' : 'mg/dL'})</label>
                                    <input type="number" value={reading} onChange={(e) => setReading(e.target.value)} placeholder="0.0" className="w-full bg-gray-50 p-4 rounded-2xl text-4xl font-black text-center border-2 border-transparent focus:border-primary-emerald outline-none transition-all" />
                                </div>
                            )}
                            {/* Test Type */}
                            <div className="flex gap-2 flex-wrap">
                                {['fasting', 'after_meal', 'random', 'before_meal', 'cumulative'].map((type) => (
                                    <button key={type} onClick={() => { setTestType(type); setSliderValue(0); setReading(''); if (type === 'cumulative') setSugarUnit('percent'); else setSugarUnit('mg/dl'); }} className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${testType === type ? 'bg-primary-dark text-white' : 'bg-gray-50 text-gray-400'}`}>{getTypeLabel(type)}</button>
                                ))}
                            </div>
                            {/* Meal Association */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2">{lang === 'ar' ? 'توقيت القياس' : 'Measurement Timing'}</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(mealAssociations[lang] || mealAssociations.ar).map((meal) => (
                                        <button key={meal} onClick={() => setMealAssociation(meal)}
                                            className={`py-2.5 px-3 rounded-xl font-bold text-[11px] transition-all ${mealAssociation === meal ? 'bg-rose-500 text-white shadow-md' : 'bg-gray-50 text-gray-400'}`}>
                                            {meal}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Date & Time */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">{lang === 'ar' ? 'التاريخ' : 'Date'}</label>
                                    <input type="date" value={measureDate} onChange={(e) => setMeasureDate(e.target.value)} className="w-full bg-gray-50 p-3 rounded-xl text-sm font-bold border-2 border-transparent focus:border-primary-emerald outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">{lang === 'ar' ? 'الوقت' : 'Time'}</label>
                                    <input type="time" value={measureTime} onChange={(e) => setMeasureTime(e.target.value)} className="w-full bg-gray-50 p-3 rounded-xl text-sm font-bold border-2 border-transparent focus:border-primary-emerald outline-none" />
                                </div>
                            </div>
                            {testType === 'cumulative' && (
                                <div className="bg-amber-50 p-3 rounded-xl">
                                    <p className="text-xs font-bold text-amber-600">{lang === 'ar' ? 'قياس السكر التراكمي (HbA1c) - الوحدة: %' : 'Cumulative glucose (HbA1c) - Unit: %'}</p>
                                </div>
                            )}
                            <button onClick={handleSaveSugar} disabled={((useSlider ? sliderValue === 0 : !reading)) || isSaving} className="w-full bg-primary-emerald text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 active:scale-[0.98] transition">
                                <Save className="w-5 h-5" /> {lang === 'ar' ? 'حفظ القياس' : 'Save Reading'}
                            </button>
                            {recentReadings.length > 0 && (
                                <div className="pt-2 space-y-2">
                                    <p className="text-xs font-bold text-gray-400">{lang === 'ar' ? 'آخر القراءات' : 'Recent Readings'}</p>
                                    {recentReadings.slice(0, 3).map((r, i) => {
                                        const level = getSugarLevel(r.reading);
                                        return (
                                            <div key={i} className="bg-gray-50 p-3 rounded-xl flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-500">{getTypeLabel(r.test_type)}</span>
                                                <span className={`font-black ${level.color}`}>{r.reading}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {selectedCategory === 'insulin' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2">اسم الدواء</label>
                                <input type="text" value={drugName} onChange={(e) => setDrugName(e.target.value)} placeholder="مثال: ميتفورمين" className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-blue-400 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2">نوع الدواء</label>
                                <div className="flex gap-2 flex-wrap">
                                    {['أقراص', 'حقن', 'شراب', 'كبسولات', 'أقلام'].map((form) => (
                                        <button key={form} onClick={() => setDrugForm(form)} className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all ${drugForm === form ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-400'}`}>{form}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2">التكرار</label>
                                <div className="flex gap-2 flex-wrap">
                                    {['مرة يومياً', 'مرتين يومياً', '3 مرات يومياً', 'أسبوعياً'].map((freq) => (
                                        <button key={freq} onClick={() => setDrugFrequency(freq)} className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all ${drugFrequency === freq ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-400'}`}>{freq}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">الجرعة</label>
                                    <input type="text" value={drugServing} onChange={(e) => setDrugServing(e.target.value)} placeholder="500" className="w-full bg-gray-50 p-3 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-blue-400 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">وحدة الجرعة</label>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {['mg', 'ml', 'وحدات', 'قرص'].map((u) => (
                                            <button key={u} onClick={() => setDrugDosageUnit(u)} className={`py-2 px-2.5 rounded-lg font-bold text-[10px] transition-all ${drugDosageUnit === u ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-400'}`}>{u}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">التركيز</label>
                                    <input type="text" value={drugConcentration} onChange={(e) => setDrugConcentration(e.target.value)} placeholder="500" className="w-full bg-gray-50 p-3 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-blue-400 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">وحدة التركيز</label>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {['mg/ml', '%', 'IU/ml'].map((u) => (
                                            <button key={u} onClick={() => setDrugConcentrationUnit(u)} className={`py-2 px-2.5 rounded-lg font-bold text-[10px] transition-all ${drugConcentrationUnit === u ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-400'}`}>{u}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button onClick={async () => {
                                if (!drugName) return;
                                setIsSaving(true);
                                try {
                                    const token = localStorage.getItem('token');
                                    await fetch(`${API_BASE}/health/drugs`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ name: drugName, form: drugForm, frequency: drugFrequency, serving: drugServing, dosage_unit: drugDosageUnit, concentration: drugConcentration, concentration_unit: drugConcentrationUnit }) });
                                    setDrugName(''); setDrugServing(''); setDrugConcentration('');
                                    loadDrugs();
                                    setShowSuccess(true); setTimeout(() => setShowSuccess(false), 2000);
                                } catch (e) { console.error(e); } finally { setIsSaving(false); }
                            }} disabled={!drugName || isSaving} className="w-full bg-gradient-to-l from-blue-500 to-cyan-500 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 active:scale-[0.98] transition">
                                <Save className="w-5 h-5" /> {lang === 'ar' ? 'حفظ الدواء' : 'Save Medication'}
                            </button>
                            {recentDrugs.length > 0 && (
                                <div className="pt-2 space-y-2">
                                    <p className="text-xs font-bold text-gray-400">الأدوية المسجلة</p>
                                    {recentDrugs.slice(0, 5).map((d, i) => (
                                        <div key={i} className="bg-blue-50 p-3 rounded-xl flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-black text-blue-700">{d.name}</p>
                                                <p className="text-[10px] text-blue-400">{d.form} · {d.frequency} · {d.serving}{d.dosage_unit ? ` ${d.dosage_unit}` : ''}</p>
                                            </div>
                                            <Pill className="w-4 h-4 text-blue-400" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {selectedCategory === 'exercise' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2">نوع التمرين</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { key: 'Walking', label: '🚶 مشي', emoji: '🚶' },
                                        { key: 'Running', label: '🏃 جري', emoji: '🏃' },
                                        { key: 'Cycling', label: '🚴 دراجة', emoji: '🚴' },
                                        { key: 'Swimming', label: '🏊 سباحة', emoji: '🏊' },
                                        { key: 'Weights', label: '🏋️ أوزان', emoji: '🏋️' },
                                        { key: 'Yoga', label: '🧘 يوجا', emoji: '🧘' },
                                    ].map((ex) => (
                                        <button key={ex.key} onClick={() => setExerciseType(ex.key)}
                                            className={`py-3 rounded-xl font-bold text-xs transition-all text-center ${exerciseType === ex.key ? 'bg-gradient-to-b from-orange-400 to-amber-500 text-white shadow-lg' : 'bg-gray-50 text-gray-500'}`}>
                                            {ex.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2">المدة (دقيقة)</label>
                                <input type="number" value={exerciseDuration} onChange={(e) => setExerciseDuration(e.target.value)} placeholder="30" className="w-full bg-gray-50 p-4 rounded-2xl text-3xl font-black text-center border-2 border-transparent focus:border-orange-400 outline-none" />
                            </div>
                            <button onClick={async () => {
                                if (!exerciseDuration) return;
                                setIsSaving(true);
                                try {
                                    const token = localStorage.getItem('token');
                                    await fetch(`${API_BASE}/health/exercises`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ exercise_type: exerciseType, duration: parseInt(exerciseDuration) }) });
                                    setExerciseDuration('');
                                    loadExercises();
                                    setShowSuccess(true); setTimeout(() => setShowSuccess(false), 2000);
                                } catch (e) { console.error(e); } finally { setIsSaving(false); }
                            }} disabled={!exerciseDuration || isSaving} className="w-full bg-gradient-to-l from-orange-500 to-amber-500 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 active:scale-[0.98] transition">
                                <Save className="w-5 h-5" /> {lang === 'ar' ? 'حفظ التمرين' : 'Save Exercise'}
                            </button>
                            {recentExercises.length > 0 && (
                                <div className="pt-2 space-y-2">
                                    <p className="text-xs font-bold text-gray-400">آخر التمارين</p>
                                    {recentExercises.slice(0, 5).map((ex, i) => (
                                        <div key={i} className="bg-orange-50 p-3 rounded-xl flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-black text-orange-700">{getTypeLabel(ex.exercise_type || ex.type)}</p>
                                            </div>
                                            <span className="font-black text-orange-600">{ex.duration} {lang === 'ar' ? 'دقيقة' : 'min'}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {selectedCategory === 'meals' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2">نوع الوجبة</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { key: 'breakfast', label: '🌅 إفطار' },
                                        { key: 'lunch', label: '☀️ غداء' },
                                        { key: 'dinner', label: '🌙 عشاء' },
                                        { key: 'snack', label: '🍎 سناك' },
                                    ].map((meal) => (
                                        <button key={meal.key} onClick={() => setMealType(meal.key)}
                                            className={`py-3 rounded-xl font-bold text-xs transition-all text-center ${mealType === meal.key ? 'bg-gradient-to-b from-emerald-400 to-teal-500 text-white shadow-lg' : 'bg-gray-50 text-gray-500'}`}>
                                            {meal.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Toggle Input Mode */}
                            <div className="flex bg-gray-100 p-1 rounded-2xl">
                                <button onClick={() => setMealInputMode('detailed')}
                                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${mealInputMode === 'detailed' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}>
                                    📋 {lang === 'ar' ? 'إدخال مفصل' : 'Detailed'}
                                </button>
                                <button onClick={() => setMealInputMode('free')}
                                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${mealInputMode === 'free' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}>
                                    ✏️ {lang === 'ar' ? 'إدخال حر' : 'Free Text'}
                                </button>
                            </div>

                            {mealInputMode === 'detailed' ? (
                                <div className="space-y-3">
                                    {/* Current Items List */}
                                    {mealItems.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-gray-400">🧾 {lang === 'ar' ? 'الأصناف المضافة' : 'Added items'}:</p>
                                            {mealItems.map((item, idx) => (
                                                <div key={idx} className="bg-emerald-50 p-3 rounded-xl flex items-center justify-between">
                                                    <div>
                                                        <span className="font-bold text-sm text-emerald-700">{item.name}</span>
                                                        <span className="text-[10px] text-emerald-500 mr-2">{item.qty} {item.unit}</span>
                                                        {item.calories > 0 && <span className="text-[10px] text-orange-500 font-bold"> • {item.calories} سعرة</span>}
                                                    </div>
                                                    <button onClick={() => setMealItems(prev => prev.filter((_, i) => i !== idx))} className="p-1.5 bg-red-100 rounded-lg">
                                                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                                    </button>
                                                </div>
                                            ))}
                                            {mealItems.some(i => i.calories > 0) && (
                                                <div className="bg-orange-50 p-2.5 rounded-xl text-center">
                                                    <span className="text-xs font-black text-orange-600">🔥 {lang === 'ar' ? 'إجمالي السعرات' : 'Total'}: {mealItems.reduce((s, i) => s + (i.calories || 0), 0)} {lang === 'ar' ? 'سعرة' : 'cal'}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {/* Add New Item Form */}
                                    <div className="bg-gray-50 p-3.5 rounded-2xl space-y-2.5">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">➕ {lang === 'ar' ? 'إضافة صنف' : 'Add Item'}</p>
                                        <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)}
                                            placeholder={lang === 'ar' ? 'اسم الصنف (مثلاً: أرز)' : 'Item name'}
                                            className="w-full bg-white p-3 rounded-xl text-sm font-bold border border-gray-100 outline-none focus:border-emerald-300" />
                                        <div className="flex gap-2">
                                            <input type="number" value={newItemQty} onChange={(e) => setNewItemQty(e.target.value)}
                                                placeholder={lang === 'ar' ? 'الكمية' : 'Qty'}
                                                className="flex-1 bg-white p-3 rounded-xl text-sm font-bold border border-gray-100 outline-none focus:border-emerald-300" />
                                            <div className="flex bg-white border border-gray-100 rounded-xl overflow-hidden">
                                                {['جرام', 'حبة', 'كوب', 'ملعقة'].map(u => (
                                                    <button key={u} onClick={() => setNewItemUnit(u)}
                                                        className={`px-2.5 py-2 text-[10px] font-bold transition-all ${newItemUnit === u ? 'bg-emerald-500 text-white' : 'text-gray-400'}`}>
                                                        {u}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <button onClick={() => {
                                            if (!newItemName.trim()) return;
                                            const matchedFood = foodGuideItems.find(f => f.name === newItemName);
                                            setMealItems(prev => [...prev, {
                                                name: newItemName, qty: newItemQty || '1', unit: newItemUnit,
                                                calories: matchedFood ? Math.round(matchedFood.calories * (parseFloat(newItemQty || 1) / 100)) : 0
                                            }]);
                                            setNewItemName(''); setNewItemQty('');
                                        }} disabled={!newItemName.trim()}
                                            className="w-full bg-emerald-100 text-emerald-700 py-2.5 rounded-xl font-black text-xs disabled:opacity-30 active:scale-[0.98] transition">
                                            + {lang === 'ar' ? 'أضف للقائمة' : 'Add to list'}
                                        </button>
                                        <button onClick={() => { setShowFoodGuide(true); loadFoodGuide(); }} className="w-full bg-teal-50 text-teal-600 py-2 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1">
                                            <BookOpen className="w-3.5 h-3.5" /> {lang === 'ar' ? 'اختر من دليل الأطعمة' : 'Choose from food guide'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-2">محتوى الوجبة</label>
                                        <textarea value={mealContents} onChange={(e) => setMealContents(e.target.value)} placeholder="مثال: أرز، دجاج مشوي، سلطة..." rows={3} className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-emerald-400 outline-none resize-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-2">السعرات الحرارية (اختياري)</label>
                                        <input type="number" value={mealCalories} onChange={(e) => setMealCalories(e.target.value)} placeholder="500" className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-emerald-400 outline-none" />
                                    </div>
                                </>
                            )}

                            <button onClick={async () => {
                                const contents = mealInputMode === 'detailed'
                                    ? mealItems.map(i => `${i.name} (${i.qty} ${i.unit})`).join('، ')
                                    : mealContents;
                                const calories = mealInputMode === 'detailed'
                                    ? mealItems.reduce((s, i) => s + (i.calories || 0), 0) || null
                                    : (mealCalories ? parseInt(mealCalories) : null);
                                if (!contents) return;
                                setIsSaving(true);
                                try {
                                    const token = localStorage.getItem('token');
                                    await fetch(`${API_BASE}/health/meals`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ meal_type: mealType, contents, calories }) });
                                    setMealContents(''); setMealCalories(''); setMealItems([]);
                                    loadMeals();
                                    setShowSuccess(true); setTimeout(() => setShowSuccess(false), 2000);
                                } catch (e) { console.error(e); } finally { setIsSaving(false); }
                            }} disabled={(mealInputMode === 'detailed' ? mealItems.length === 0 : !mealContents) || isSaving} className="w-full bg-gradient-to-l from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 active:scale-[0.98] transition">
                                <Save className="w-5 h-5" /> {lang === 'ar' ? 'حفظ الوجبة' : 'Save Meal'}
                            </button>
                            {recentMeals.length > 0 && (
                                <div className="pt-2 space-y-2">
                                    <p className="text-xs font-bold text-gray-400">آخر الوجبات</p>
                                    {recentMeals.slice(0, 5).map((m, i) => (
                                        <div key={i} className="bg-emerald-50 p-3 rounded-xl">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-black text-emerald-700">{getMealLabel(m.meal_type)}</p>
                                                {m.calories && <span className="text-xs font-bold text-emerald-500">{m.calories} سعرة</span>}
                                            </div>
                                            <p className="text-[10px] text-emerald-400 mt-1">{m.contents}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}


            {/* ═══════ FOOD GUIDE MODAL ═══════ */}
            <AnimatePresence>
                {showFoodGuide && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm" onClick={() => setShowFoodGuide(false)}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col"
                            onClick={e => e.stopPropagation()}>

                            {/* Header */}
                            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-gray-100 flex justify-between items-center z-10">
                                <h3 className="text-lg font-black text-primary-dark flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-teal-500" />
                                    {lang === 'ar' ? 'دليل الأطعمة' : 'Food Guide'}
                                </h3>
                                <button onClick={() => setShowFoodGuide(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Search */}
                            <div className="px-5 pt-3 pb-2 space-y-2">
                                <div className="relative">
                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <input type="text" value={foodGuideSearch} onChange={e => setFoodGuideSearch(e.target.value)}
                                        placeholder={lang === 'ar' ? 'ابحث عن طعام...' : 'Search food...'}
                                        className="w-full bg-gray-50 pr-10 pl-4 py-3 rounded-xl text-sm font-bold border-2 border-transparent focus:border-teal-400 outline-none" />
                                </div>

                                {/* Category Filter */}
                                {foodCategories.length > 0 && (
                                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                                        <button onClick={() => setFoodGuideCategory('')}
                                            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex-shrink-0 ${!foodGuideCategory ? 'bg-teal-500 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                                            {lang === 'ar' ? 'الكل' : 'All'}
                                        </button>
                                        {foodCategories.map(cat => (
                                            <button key={cat} onClick={() => setFoodGuideCategory(cat)}
                                                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex-shrink-0 ${foodGuideCategory === cat ? 'bg-teal-500 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Food List */}
                            <div className="flex-1 overflow-y-auto px-5 pb-6">
                                {loadingFoods ? (
                                    <div className="space-y-2 py-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="bg-gray-50 p-4 rounded-xl animate-pulse">
                                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                                                <div className="h-3 bg-gray-100 rounded w-1/3" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (() => {
                                    const filtered = foodGuideItems.filter(f => {
                                        const matchSearch = !foodGuideSearch || f.name?.includes(foodGuideSearch) || f.name_en?.toLowerCase().includes(foodGuideSearch.toLowerCase());
                                        const matchCat = !foodGuideCategory || f.category === foodGuideCategory;
                                        return matchSearch && matchCat;
                                    });
                                    return filtered.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Search className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                                            <p className="text-gray-400 font-bold text-sm">{lang === 'ar' ? 'لم يتم العثور على أطعمة' : 'No foods found'}</p>
                                            <p className="text-gray-300 text-xs mt-1">{lang === 'ar' ? 'جرّب كلمة بحث أخرى' : 'Try a different search'}</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-1.5 py-2">
                                            {filtered.slice(0, 50).map((food, i) => (
                                                <motion.button key={food.id || i}
                                                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                                                    onClick={() => {
                                                        setNewItemName(food.name);
                                                        if (food.calories) {
                                                            const matchedItem = { name: food.name, qty: '100', unit: 'جرام', calories: Math.round(food.calories) };
                                                            setMealItems(prev => [...prev, matchedItem]);
                                                        } else {
                                                            setNewItemName(food.name);
                                                        }
                                                        setShowFoodGuide(false);
                                                        setFoodGuideSearch('');
                                                        setFoodGuideCategory('');
                                                    }}
                                                    className="w-full bg-gray-50 hover:bg-teal-50 p-3 rounded-xl flex items-center justify-between transition-all active:scale-[0.98] text-right">
                                                    <div className="flex-1">
                                                        <p className="font-bold text-sm text-gray-700">{food.name}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            {food.category && <span className="text-[9px] bg-teal-100 text-teal-600 px-1.5 py-0.5 rounded-full font-bold">{food.category}</span>}
                                                            {food.glycemic_index && <span className="text-[9px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full font-bold">GI: {food.glycemic_index}</span>}
                                                        </div>
                                                    </div>
                                                    {food.calories && (
                                                        <div className="text-left flex-shrink-0 mr-3">
                                                            <p className="text-xs font-black text-teal-600">{food.calories}</p>
                                                            <p className="text-[8px] text-gray-400">{lang === 'ar' ? 'سعرة/100جم' : 'cal/100g'}</p>
                                                        </div>
                                                    )}
                                                    <Plus className="w-4 h-4 text-teal-400 flex-shrink-0" />
                                                </motion.button>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default HealthTrackingView;
