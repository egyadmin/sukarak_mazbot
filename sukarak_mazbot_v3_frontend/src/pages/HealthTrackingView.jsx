import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, Plus, History, ArrowRight, Save, Clock, Droplets, Dumbbell, Utensils, TrendingUp, TrendingDown, AlertTriangle, Pill, Trash2, BookOpen, Search, X, ChevronDown, CheckCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '../api/config';

// Translation map
const typeLabels = {
    ar: { fasting: 'صائم', after_meal: 'بعد الأكل', random: 'عشوائي', before_meal: 'قبل الأكل', Walking: 'مشي', Running: 'جري', Swimming: 'سباحة', Cycling: 'دراجة', Yoga: 'يوغا', Resistance: 'مقاومة' },
    en: { fasting: 'Fasting', after_meal: 'After Meal', random: 'Random', before_meal: 'Before Meal', Walking: 'Walking', Running: 'Running', Swimming: 'Swimming', Cycling: 'Cycling', Yoga: 'Yoga', Resistance: 'Resistance' },
};

const mealTypeLabels = {
    ar: { breakfast: 'إفطار', lunch: 'غداء', dinner: 'عشاء', snack: 'سناك' },
    en: { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack' },
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
    const [testType, setTestType] = useState('fasting');
    const [recentReadings, setRecentReadings] = useState([]);

    const [drugName, setDrugName] = useState('');
    const [drugForm, setDrugForm] = useState('أقراص');
    const [drugFrequency, setDrugFrequency] = useState('مرة يومياً');
    const [drugServing, setDrugServing] = useState('');
    const [drugConcentration, setDrugConcentration] = useState('');
    const [recentDrugs, setRecentDrugs] = useState([]);

    const [exerciseType, setExerciseType] = useState('Walking');
    const [exerciseDuration, setExerciseDuration] = useState('');
    const [recentExercises, setRecentExercises] = useState([]);

    const [mealType, setMealType] = useState('breakfast');
    const [mealContents, setMealContents] = useState('');
    const [mealCalories, setMealCalories] = useState('');
    const [recentMeals, setRecentMeals] = useState([]);

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
        { id: 'insulin', title: lang === 'ar' ? 'سجل أدوياك' : 'Medications', icon: Pill, color: 'from-blue-500 to-cyan-500', lightColor: 'bg-blue-50 text-blue-600' },
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

    const handleSaveSugar = async () => {
        if (!reading || isSaving) return;
        setIsSaving(true);
        try {
            const res = await fetch(`${API_BASE}/health/sugar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reading: parseFloat(reading), test_type: testType, measured_at: `${measureDate}T${measureTime}:00` }),
            });
            if (res.ok) { setShowSuccess(true); setTimeout(() => setShowSuccess(false), 2000); setReading(''); loadSugarReadings(); }
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
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2">القيمة (mg/dL)</label>
                                <input type="number" value={reading} onChange={(e) => setReading(e.target.value)} placeholder="0.0" className="w-full bg-gray-50 p-4 rounded-2xl text-4xl font-black text-center border-2 border-transparent focus:border-primary-emerald outline-none transition-all" />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {['fasting', 'after_meal', 'random', 'before_meal'].map((type) => (
                                    <button key={type} onClick={() => setTestType(type)} className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${testType === type ? 'bg-primary-dark text-white' : 'bg-gray-50 text-gray-400'}`}>{getTypeLabel(type)}</button>
                                ))}
                            </div>
                            <button onClick={handleSaveSugar} disabled={!reading || isSaving} className="w-full bg-primary-emerald text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 active:scale-[0.98] transition">
                                <Save className="w-5 h-5" /> {lang === 'ar' ? 'حفظ القياس' : 'Save Reading'}
                            </button>
                            {recentReadings.length > 0 && (
                                <div className="pt-2 space-y-2">
                                    <p className="text-xs font-bold text-gray-400">آخر القراءات</p>
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
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">الشكل الدوائي</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {['أقراص', 'حقن', 'شراب'].map((form) => (
                                            <button key={form} onClick={() => setDrugForm(form)} className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${drugForm === form ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-400'}`}>{form}</button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">التركيز</label>
                                    <input type="text" value={drugConcentration} onChange={(e) => setDrugConcentration(e.target.value)} placeholder="500mg" className="w-full bg-gray-50 p-3 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-blue-400 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2">الجرعة</label>
                                <input type="text" value={drugServing} onChange={(e) => setDrugServing(e.target.value)} placeholder="قرص واحد" className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-blue-400 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2">التكرار</label>
                                <div className="flex gap-2 flex-wrap">
                                    {['مرة يومياً', 'مرتين يومياً', '3 مرات يومياً', 'أسبوعياً'].map((freq) => (
                                        <button key={freq} onClick={() => setDrugFrequency(freq)} className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all ${drugFrequency === freq ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-400'}`}>{freq}</button>
                                    ))}
                                </div>
                            </div>
                            <button onClick={async () => {
                                if (!drugName) return;
                                setIsSaving(true);
                                try {
                                    const token = localStorage.getItem('token');
                                    await fetch(`${API_BASE}/health/drugs`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ name: drugName, form: drugForm, frequency: drugFrequency, serving: drugServing, concentration: drugConcentration }) });
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
                                                <p className="text-[10px] text-blue-400">{d.form} · {d.frequency}</p>
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
                                                <p className="text-sm font-black text-orange-700">{ex.exercise_type}</p>
                                                <p className="text-[10px] text-orange-400">{new Date(ex.created_at).toLocaleString('ar-EG')}</p>
                                            </div>
                                            <span className="font-black text-orange-600">{ex.duration} د</span>
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
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2">محتوى الوجبة</label>
                                <textarea value={mealContents} onChange={(e) => setMealContents(e.target.value)} placeholder="مثال: أرز، دجاج مشوي، سلطة..." rows={3} className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-emerald-400 outline-none resize-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2">السعرات الحرارية (اختياري)</label>
                                <input type="number" value={mealCalories} onChange={(e) => setMealCalories(e.target.value)} placeholder="500" className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-emerald-400 outline-none" />
                            </div>
                            <button onClick={async () => {
                                if (!mealContents) return;
                                setIsSaving(true);
                                try {
                                    const token = localStorage.getItem('token');
                                    await fetch(`${API_BASE}/health/meals`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ meal_type: mealType, contents: mealContents, calories: mealCalories ? parseInt(mealCalories) : null }) });
                                    setMealContents(''); setMealCalories('');
                                    loadMeals();
                                    setShowSuccess(true); setTimeout(() => setShowSuccess(false), 2000);
                                } catch (e) { console.error(e); } finally { setIsSaving(false); }
                            }} disabled={!mealContents || isSaving} className="w-full bg-gradient-to-l from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 active:scale-[0.98] transition">
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

            <div className="pt-4">
                <div className="flex items-center gap-2 mb-4">
                    <History className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-black text-gray-500">{lang === 'ar' ? 'آخر النشاطات' : 'Recent Activities'}</span>
                </div>
                <div className="space-y-3">
                    {recentReadings.map((r, i) => {
                        const level = getSugarLevel(r.reading);
                        return (
                            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl ${level.bg} flex items-center justify-center`}><level.icon className={`w-5 h-5 ${level.color}`} /></div>
                                    <div>
                                        <p className="font-bold text-sm text-primary-dark">{getTypeLabel(r.test_type)}</p>
                                        <p className="text-[10px] text-gray-400">{new Date(r.created_at).toLocaleString('ar-EG')}</p>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <p className={`font-black text-lg ${level.color}`}>{r.reading}</p>
                                    <p className={`text-[9px] font-bold ${level.color}`}>{level.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HealthTrackingView;
