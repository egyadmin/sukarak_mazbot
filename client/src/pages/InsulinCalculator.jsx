import { useState } from 'react';
import { ArrowRight, Calculator, AlertTriangle, Info, ChevronDown, ChevronUp, User, Weight, Activity, Utensils, Droplets, Flame, Syringe, Clock, Zap, Target, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const formulaImg = null;

const CALORIE_TABLE = {
    male: {
        '2-3': { sedentary: [1000, 1200], light: [1000, 1400], active: [1000, 1400] },
        '4-8': { sedentary: [1200, 1400], light: [1400, 1600], active: [1600, 2000] },
        '9-13': { sedentary: [1600, 2000], light: [1800, 2200], active: [2000, 2600] },
        '14-18': { sedentary: [2000, 2400], light: [2400, 2800], active: [2800, 3200] },
    },
    female: {
        '2-3': { sedentary: [1000, 1000], light: [1000, 1200], active: [1000, 1400] },
        '4-8': { sedentary: [1200, 1400], light: [1400, 1600], active: [1400, 1800] },
        '9-13': { sedentary: [1400, 1600], light: [1600, 2000], active: [1800, 2200] },
        '14-18': { sedentary: [1800, 1800], light: [2000, 2000], active: [2400, 2400] },
    },
};

function getAgeGroup(age) {
    if (age >= 2 && age <= 3) return '2-3';
    if (age >= 4 && age <= 8) return '4-8';
    if (age >= 9 && age <= 13) return '9-13';
    if (age >= 14 && age <= 18) return '14-18';
    return null;
}

function getAdultCalories(age, gender, activity) {
    if (gender === 'male') {
        const bmr = 10 * 70 + 6.25 * 170 - 5 * age + 5;
        const factors = { sedentary: 1.2, light: 1.375, active: 1.55 };
        const cal = Math.round(bmr * (factors[activity] || 1.2));
        return [cal - 200, cal + 200];
    } else {
        const bmr = 10 * 60 + 6.25 * 160 - 5 * age - 161;
        const factors = { sedentary: 1.2, light: 1.375, active: 1.55 };
        const cal = Math.round(bmr * (factors[activity] || 1.2));
        return [cal - 200, cal + 200];
    }
}

const InsulinCalculator = () => {
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const lang = i18n.language === 'ar' ? 'ar' : 'en';
    const [activeCalc, setActiveCalc] = useState(null);
    const [showFormula, setShowFormula] = useState(false);

    const [compForm, setCompForm] = useState({
        age: '', gender: 'male', weight: '', diabetesType: '2',
        activityLevel: 'sedentary', meals: '3', currentReading: '',
    });
    const [compResult, setCompResult] = useState(null);

    const [weight, setWeight] = useState('');
    const [totalResult, setTotalResult] = useState(null);
    const [longWeight, setLongWeight] = useState('');
    const [longResult, setLongResult] = useState(null);
    const [carbGrams, setCarbGrams] = useState('');
    const [carbRatio, setCarbRatio] = useState('10');
    const [rapidResult, setRapidResult] = useState(null);
    const [currentSugar, setCurrentSugar] = useState('');
    const [targetSugar, setTargetSugar] = useState('120');
    const [corrFactor, setCorrFactor] = useState('50');
    const [corrResult, setCorrResult] = useState(null);

    const calculateComprehensive = () => {
        const age = parseInt(compForm.age);
        const w = parseFloat(compForm.weight);
        const meals = parseInt(compForm.meals) || 3;
        const reading = parseFloat(compForm.currentReading);
        if (!age || !w) return;

        let tddFactor;
        if (compForm.diabetesType === '1') {
            if (age <= 5) tddFactor = 0.5;
            else if (age <= 14) tddFactor = 0.7;
            else tddFactor = 0.75;
        } else {
            tddFactor = 0.55;
        }
        const tdd = Math.round(w * tddFactor * 10) / 10;
        const basal = Math.round(tdd * 0.5 * 10) / 10;
        const totalBolus = Math.round(tdd * 0.5 * 10) / 10;
        const bolusPerMeal = Math.round((totalBolus / meals) * 10) / 10;
        const isf = Math.round(1800 / tdd);
        const icr = Math.round(500 / tdd);

        let correctionDose = 0;
        if (reading && reading > 120) {
            correctionDose = Math.max(0, Math.round((reading - 120) / isf * 10) / 10);
        }

        let calories = null;
        const ageGroup = getAgeGroup(age);
        if (ageGroup) {
            const table = CALORIE_TABLE[compForm.gender];
            if (table && table[ageGroup]) {
                calories = table[ageGroup][compForm.activityLevel];
            }
        } else if (age > 18) {
            calories = getAdultCalories(age, compForm.gender, compForm.activityLevel);
        }

        setCompResult({
            tdd, basal, totalBolus, bolusPerMeal, isf, icr, correctionDose,
            meals, calories, tddFactor, reading: reading || null,
        });
    };

    const resetComp = () => {
        setCompForm({ age: '', gender: 'male', weight: '', diabetesType: '2', activityLevel: 'sedentary', meals: '3', currentReading: '' });
        setCompResult(null);
    };

    const calcTotal = () => {
        const w = parseFloat(weight);
        if (!w) return;
        const tdd = Math.round(w * 0.55 * 10) / 10;
        setTotalResult({ tdd, basal: Math.round(tdd * 0.5 * 10) / 10, bolus: Math.round(tdd * 0.5 * 10) / 10 });
    };

    const calcLong = () => {
        const w = parseFloat(longWeight);
        if (!w) return;
        const dose = Math.round(w * 0.25 * 10) / 10;
        setLongResult({ dose, range: `${Math.round(w * 0.2)} - ${Math.round(w * 0.3)}` });
    };

    const calcRapid = () => {
        const c = parseFloat(carbGrams);
        const r = parseFloat(carbRatio);
        if (!c || !r) return;
        setRapidResult({ dose: Math.round(c / r * 10) / 10 });
    };

    const calcCorrection = () => {
        const cur = parseFloat(currentSugar);
        const tar = parseFloat(targetSugar);
        const fac = parseFloat(corrFactor);
        if (!cur || !tar || !fac) return;
        const dose = Math.max(0, Math.round((cur - tar) / fac * 10) / 10);
        setCorrResult({ dose, diff: Math.round(cur - tar) });
    };

    const calculators = [
        { id: 'total', title: lang === 'ar' ? 'حاسبة الإنسولين الإجمالية' : 'Total Insulin Calculator', icon: Syringe, desc: lang === 'ar' ? 'حساب الجرعة اليومية بناءً على الوزن' : 'Daily dose based on weight', gradient: 'from-blue-500 to-indigo-600' },
        { id: 'long', title: lang === 'ar' ? 'حاسبة الإنسولين طويل المفعول' : 'Long-Acting Insulin', icon: Clock, desc: lang === 'ar' ? 'حساب جرعة الإنسولين القاعدي' : 'Basal insulin dose', gradient: 'from-emerald-500 to-teal-600' },
        { id: 'rapid', title: lang === 'ar' ? 'حاسبة الإنسولين سريع المفعول' : 'Rapid-Acting Insulin', icon: Zap, desc: lang === 'ar' ? 'حساب جرعة حسب الكربوهيدرات' : 'Dose based on carbs', gradient: 'from-orange-500 to-red-500' },
        { id: 'correction', title: lang === 'ar' ? 'حاسبة الوحدات التصحيحية' : 'Correction Dose', icon: Target, desc: lang === 'ar' ? 'جرعة لخفض السكر المرتفع' : 'Dose to lower high sugar', gradient: 'from-purple-500 to-violet-600' },
    ];

    const InputField = ({ label, value, onChange, placeholder, unit }) => (
        <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">{label}</label>
            <div className="flex items-center gap-2">
                <input type="number" value={value} onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 bg-white p-3.5 rounded-2xl border border-gray-200 text-sm font-bold outline-none focus:border-teal-400 transition text-center text-lg"
                    data-testid={`input-${label.replace(/\s/g, '-')}`} />
                {unit && <span className="text-xs text-gray-400 font-bold min-w-[40px]">{unit}</span>}
            </div>
        </div>
    );

    const ResultBox = ({ label, value, unit, color = 'text-teal-600' }) => (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 font-bold mb-1">{label}</p>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-[9px] text-gray-300">{unit}</p>
        </div>
    );

    const genderOptions = [
        { key: 'male', label: lang === 'ar' ? 'ذكر' : 'Male', icon: '♂' },
        { key: 'female', label: lang === 'ar' ? 'أنثى' : 'Female', icon: '♀' },
    ];
    const diabetesOptions = [
        { key: '1', label: lang === 'ar' ? 'النوع الأول' : 'Type 1' },
        { key: '2', label: lang === 'ar' ? 'النوع الثاني' : 'Type 2' },
    ];
    const activityOptions = [
        { key: 'sedentary', label: lang === 'ar' ? 'لا يوجد نشاط' : 'Sedentary', desc: lang === 'ar' ? 'جلوس معظم الوقت' : 'Mostly sitting' },
        { key: 'light', label: lang === 'ar' ? 'نشاط قليل' : 'Light Activity', desc: lang === 'ar' ? 'مشي خفيف' : 'Light walking' },
        { key: 'active', label: lang === 'ar' ? 'نشاط كبير' : 'Active', desc: lang === 'ar' ? 'رياضة منتظمة' : 'Regular exercise' },
    ];

    return (
        <div className="space-y-5 pb-4">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-xl shadow-sm" data-testid="button-back-calc">
                    <ArrowRight className="w-5 h-5 rtl:rotate-0 rotate-180 text-gray-500" />
                </button>
                <div>
                    <h2 className="text-2xl font-black text-primary-dark">{lang === 'ar' ? 'حاسبة الإنسولين والسعرات' : 'Insulin & Calorie Calculator'}</h2>
                    <p className="text-[10px] text-gray-400">{lang === 'ar' ? 'أدوات حسابية إرشادية شاملة' : 'Comprehensive guidance tools'}</p>
                </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200">
                <div className="flex items-start gap-3">
                    <div className="bg-amber-100 p-2 rounded-xl flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-amber-800 mb-1">{lang === 'ar' ? 'تنبيه طبي هام' : 'Important Medical Notice'}</p>
                        <p className="text-xs text-amber-700 leading-relaxed">
                            {lang === 'ar'
                                ? 'هذه المعادلات إرشادية وقد تختلف النتائج بناءً على الفروق الفردية. يُنصح بمراجعة طبيبك لتحديد المعامل الأنسب ومراقبة مستويات السكر والتشاور مع طبيبك المختص.'
                                : 'These formulas are guidelines only. Results may vary based on individual differences. Consult your doctor to determine the best parameters and monitor your sugar levels.'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-5 rounded-3xl shadow-xl text-white">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        <Calculator className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-black text-lg">{lang === 'ar' ? 'الحاسبة الشاملة' : 'Comprehensive Calculator'}</h3>
                        <p className="text-white/70 text-xs">{lang === 'ar' ? 'إجمالي الجرعة اليومية + السعرات + توزيع الوجبات' : 'Total daily dose + Calories + Meal distribution'}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-white/70 mb-1.5">{lang === 'ar' ? 'العمر (سنوات)' : 'Age (years)'}</label>
                            <input type="number" value={compForm.age} onChange={e => setCompForm(f => ({ ...f, age: e.target.value }))}
                                placeholder={lang === 'ar' ? 'مثال: 25' : 'e.g. 25'}
                                className="w-full bg-white/10 backdrop-blur-sm p-3 rounded-xl text-white text-sm font-bold outline-none border border-white/20 focus:border-white/50 placeholder:text-white/30 text-center"
                                data-testid="input-comp-age" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-white/70 mb-1.5">{lang === 'ar' ? 'الوزن (كجم)' : 'Weight (kg)'}</label>
                            <input type="number" value={compForm.weight} onChange={e => setCompForm(f => ({ ...f, weight: e.target.value }))}
                                placeholder={lang === 'ar' ? 'مثال: 70' : 'e.g. 70'}
                                className="w-full bg-white/10 backdrop-blur-sm p-3 rounded-xl text-white text-sm font-bold outline-none border border-white/20 focus:border-white/50 placeholder:text-white/30 text-center"
                                data-testid="input-comp-weight" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-white/70 mb-1.5">{lang === 'ar' ? 'الجنس' : 'Gender'}</label>
                        <div className="grid grid-cols-2 gap-2">
                            {genderOptions.map(g => (
                                <button key={g.key} onClick={() => setCompForm(f => ({ ...f, gender: g.key }))}
                                    className={`p-3 rounded-xl text-sm font-bold transition border ${compForm.gender === g.key ? 'bg-white text-teal-700 border-white' : 'bg-white/10 text-white/80 border-white/20'}`}
                                    data-testid={`button-gender-${g.key}`}>
                                    {g.icon} {g.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-white/70 mb-1.5">{lang === 'ar' ? 'نوع السكري' : 'Diabetes Type'}</label>
                        <div className="grid grid-cols-2 gap-2">
                            {diabetesOptions.map(d => (
                                <button key={d.key} onClick={() => setCompForm(f => ({ ...f, diabetesType: d.key }))}
                                    className={`p-3 rounded-xl text-sm font-bold transition border ${compForm.diabetesType === d.key ? 'bg-white text-teal-700 border-white' : 'bg-white/10 text-white/80 border-white/20'}`}
                                    data-testid={`button-diabetes-type-${d.key}`}>
                                    {d.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-white/70 mb-1.5">{lang === 'ar' ? 'مستوى النشاط البدني' : 'Activity Level'}</label>
                        <div className="grid grid-cols-3 gap-2">
                            {activityOptions.map(a => (
                                <button key={a.key} onClick={() => setCompForm(f => ({ ...f, activityLevel: a.key }))}
                                    className={`p-2.5 rounded-xl text-center transition border ${compForm.activityLevel === a.key ? 'bg-white text-teal-700 border-white' : 'bg-white/10 text-white/80 border-white/20'}`}
                                    data-testid={`button-activity-${a.key}`}>
                                    <p className="text-[10px] font-black">{a.label}</p>
                                    <p className="text-[8px] opacity-60">{a.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-white/70 mb-1.5">{lang === 'ar' ? 'عدد الوجبات' : 'Meals/day'}</label>
                            <div className="flex gap-1.5">
                                {['2', '3', '4', '5'].map(m => (
                                    <button key={m} onClick={() => setCompForm(f => ({ ...f, meals: m }))}
                                        className={`flex-1 p-2.5 rounded-xl text-sm font-black transition border ${compForm.meals === m ? 'bg-white text-teal-700 border-white' : 'bg-white/10 text-white/80 border-white/20'}`}
                                        data-testid={`button-meals-${m}`}>
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-white/70 mb-1.5">{lang === 'ar' ? 'القراءة الحالية' : 'Current Reading'}</label>
                            <input type="number" value={compForm.currentReading}
                                onChange={e => setCompForm(f => ({ ...f, currentReading: e.target.value }))}
                                placeholder="mg/dL"
                                className="w-full bg-white/10 backdrop-blur-sm p-2.5 rounded-xl text-white text-sm font-bold outline-none border border-white/20 focus:border-white/50 placeholder:text-white/30 text-center"
                                data-testid="input-comp-reading" />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={calculateComprehensive}
                            className="flex-1 bg-white text-teal-700 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition"
                            data-testid="button-calc-comprehensive">
                            <Calculator className="w-5 h-5" /> {lang === 'ar' ? 'احسب الآن' : 'Calculate'}
                        </button>
                        <button onClick={resetComp} className="p-3.5 bg-white/10 rounded-2xl active:scale-90 transition border border-white/20" data-testid="button-reset-comp">
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {compResult && (
                    <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
                        className="space-y-4">

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-3xl border border-blue-100">
                            <h3 className="font-black text-sm text-blue-700 mb-3 flex items-center gap-2">
                                <Syringe className="w-4 h-4" /> {lang === 'ar' ? 'إجمالي جرعة الإنسولين اليومية' : 'Total Daily Insulin Dose'}
                            </h3>
                            <div className="bg-white rounded-2xl p-5 text-center shadow-sm mb-3">
                                <p className="text-[10px] text-gray-400 font-bold mb-1">{lang === 'ar' ? 'الجرعة الإجمالية اليومية (TDD)' : 'Total Daily Dose (TDD)'}</p>
                                <p className="text-5xl font-black text-blue-600" data-testid="text-tdd">{compResult.tdd}</p>
                                <p className="text-xs text-gray-500 font-bold mt-1">{lang === 'ar' ? 'وحدة / يوم' : 'units/day'}</p>
                                <p className="text-[9px] text-gray-300 mt-1">{lang === 'ar' ? `المعامل المستخدم: ${compResult.tddFactor} وحدة/كجم` : `Factor used: ${compResult.tddFactor} units/kg`}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/80 rounded-xl p-3 text-center">
                                    <p className="text-[9px] text-gray-400 font-bold">{lang === 'ar' ? 'إنسولين قاعدي (طويل)' : 'Basal (Long-acting)'}</p>
                                    <p className="font-black text-lg text-emerald-600" data-testid="text-basal">{compResult.basal}</p>
                                    <p className="text-[8px] text-gray-400">{lang === 'ar' ? '50% من الإجمالي' : '50% of TDD'}</p>
                                </div>
                                <div className="bg-white/80 rounded-xl p-3 text-center">
                                    <p className="text-[9px] text-gray-400 font-bold">{lang === 'ar' ? 'إنسولين وجبات (سريع)' : 'Bolus (Rapid-acting)'}</p>
                                    <p className="font-black text-lg text-orange-600" data-testid="text-bolus">{compResult.totalBolus}</p>
                                    <p className="text-[8px] text-gray-400">{lang === 'ar' ? '50% من الإجمالي' : '50% of TDD'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-3xl border border-orange-100">
                            <h3 className="font-black text-sm text-orange-700 mb-3 flex items-center gap-2">
                                <Utensils className="w-4 h-4" /> {lang === 'ar' ? 'توزيع الجرعات على الوجبات' : 'Dose Distribution Per Meal'}
                            </h3>
                            <div className="bg-white rounded-2xl p-5 text-center shadow-sm mb-3">
                                <p className="text-[10px] text-gray-400 font-bold mb-1">{lang === 'ar' ? `جرعة كل وجبة (${compResult.meals} وجبات)` : `Per meal dose (${compResult.meals} meals)`}</p>
                                <p className="text-4xl font-black text-orange-600" data-testid="text-per-meal">{compResult.bolusPerMeal}</p>
                                <p className="text-xs text-gray-500 font-bold mt-1">{lang === 'ar' ? 'وحدة / وجبة' : 'units/meal'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/80 rounded-xl p-3 text-center">
                                    <p className="text-[9px] text-gray-400 font-bold">{lang === 'ar' ? 'معامل التصحيح (ISF)' : 'Correction Factor (ISF)'}</p>
                                    <p className="font-black text-lg text-purple-600" data-testid="text-isf">{compResult.isf}</p>
                                    <p className="text-[8px] text-gray-400">mg/dL</p>
                                </div>
                                <div className="bg-white/80 rounded-xl p-3 text-center">
                                    <p className="text-[9px] text-gray-400 font-bold">{lang === 'ar' ? 'نسبة الكربوهيدرات (ICR)' : 'Carb Ratio (ICR)'}</p>
                                    <p className="font-black text-lg text-sky-600" data-testid="text-icr">{compResult.icr}</p>
                                    <p className="text-[8px] text-gray-400">{lang === 'ar' ? 'جم/وحدة' : 'g/unit'}</p>
                                </div>
                            </div>
                        </div>

                        {compResult.reading && compResult.correctionDose > 0 && (
                            <div className="bg-gradient-to-br from-red-50 to-rose-50 p-5 rounded-3xl border border-red-100">
                                <h3 className="font-black text-sm text-red-700 mb-3 flex items-center gap-2">
                                    <Droplets className="w-4 h-4" /> {lang === 'ar' ? 'جرعة التصحيح' : 'Correction Dose'}
                                </h3>
                                <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
                                    <p className="text-[10px] text-gray-400 font-bold mb-1">{lang === 'ar' ? `قراءتك: ${compResult.reading} → المستهدف: 120 mg/dL` : `Your reading: ${compResult.reading} → Target: 120 mg/dL`}</p>
                                    <p className="text-3xl font-black text-red-600" data-testid="text-correction">{compResult.correctionDose}</p>
                                    <p className="text-xs text-gray-500 font-bold">{lang === 'ar' ? 'وحدة تصحيحية مطلوبة' : 'correction units needed'}</p>
                                </div>
                            </div>
                        )}

                        {compResult.calories && (
                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-5 rounded-3xl border border-emerald-100">
                                <h3 className="font-black text-sm text-emerald-700 mb-3 flex items-center gap-2">
                                    <Flame className="w-4 h-4" /> {lang === 'ar' ? 'السعرات الحرارية اليومية المطلوبة' : 'Daily Calorie Needs'}
                                </h3>
                                <div className="bg-white rounded-2xl p-5 text-center shadow-sm">
                                    <p className="text-[10px] text-gray-400 font-bold mb-1">{lang === 'ar' ? 'النطاق اليومي المقترح' : 'Suggested Daily Range'}</p>
                                    <p className="text-3xl font-black text-emerald-600" data-testid="text-calories">
                                        {compResult.calories[0] === compResult.calories[1]
                                            ? `${compResult.calories[0]}`
                                            : `${compResult.calories[0]} - ${compResult.calories[1]}`}
                                    </p>
                                    <p className="text-xs text-gray-500 font-bold mt-1">{lang === 'ar' ? 'سعرة حرارية / يوم' : 'calories/day'}</p>
                                </div>
                                <div className="mt-3 bg-emerald-100/50 p-3 rounded-xl">
                                    <p className="text-[10px] text-emerald-700 text-center font-bold">
                                        {lang === 'ar'
                                            ? `بناءً على: ${compForm.gender === 'male' ? 'ذكر' : 'أنثى'} • ${compForm.age} سنة • ${activityOptions.find(a => a.key === compForm.activityLevel)?.label}`
                                            : `Based on: ${compForm.gender === 'male' ? 'Male' : 'Female'} • ${compForm.age} yrs • ${activityOptions.find(a => a.key === compForm.activityLevel)?.label}`}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                                        {lang === 'ar'
                                            ? 'هذه المعادلات تعتبر إرشادية حيث يجب مراعاة بعض العوامل المختلفة مثل النشاط البدني، الأمراض المصاحبة، والأدوية الأخرى. قد تختلف الاحتياجات الفردية لذا ينصح بمراقبة مستويات السكر والتشاور مع طبيبك المختص.'
                                            : 'These formulas are guidelines. Consider factors like physical activity, accompanying diseases, and other medications. Individual needs may vary - monitor sugar levels and consult your specialist.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button onClick={() => setShowFormula(!showFormula)}
                            className="w-full bg-white p-3 rounded-2xl border border-gray-100 flex items-center justify-between text-sm font-bold text-gray-500"
                            data-testid="button-show-formula">
                            <span className="flex items-center gap-2"><Info className="w-4 h-4" /> {lang === 'ar' ? 'عرض جدول المعادلات' : 'Show formula table'}</span>
                            {showFormula ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <AnimatePresence>
                            {showFormula && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                    {formulaImg ? <img src={formulaImg} alt="Formula Table" className="w-full rounded-2xl border border-gray-200 shadow-sm" /> : <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 text-sm font-bold">Formula Table</div>}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-6">
                <h3 className="text-sm font-black text-gray-500 mb-3">{lang === 'ar' ? 'حاسبات فردية' : 'Individual Calculators'}</h3>
                <div className="space-y-3">
                    {calculators.map((calc) => {
                        const Icon = calc.icon;
                        return (
                            <div key={calc.id} className="overflow-hidden rounded-3xl shadow-sm border border-gray-100">
                                <button onClick={() => setActiveCalc(activeCalc === calc.id ? null : calc.id)}
                                    className={`w-full p-5 flex items-center gap-4 transition-all ${activeCalc === calc.id ? `bg-gradient-to-l ${calc.gradient} text-white` : 'bg-white text-gray-800'}`}
                                    data-testid={`button-calc-${calc.id}`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeCalc === calc.id ? 'bg-white/20' : 'bg-gray-100'}`}>
                                        <Icon className={`w-5 h-5 ${activeCalc === calc.id ? 'text-white' : 'text-gray-500'}`} />
                                    </div>
                                    <div className="flex-1 text-right">
                                        <p className="font-bold text-sm">{calc.title}</p>
                                        <p className={`text-[10px] ${activeCalc === calc.id ? 'text-white/70' : 'text-gray-400'}`}>{calc.desc}</p>
                                    </div>
                                    {activeCalc === calc.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5 text-gray-300" />}
                                </button>

                                <AnimatePresence>
                                    {activeCalc === calc.id && (
                                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                            <div className="p-5 bg-gray-50 space-y-4">
                                                {calc.id === 'total' && (<>
                                                    <InputField label={lang === 'ar' ? 'الوزن' : 'Weight'} value={weight} onChange={setWeight} placeholder="70" unit={lang === 'ar' ? 'كجم' : 'kg'} />
                                                    <button onClick={calcTotal}
                                                        className="w-full bg-gradient-to-l from-blue-600 to-indigo-500 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg"
                                                        data-testid="button-calc-total-submit">
                                                        <Calculator className="w-5 h-5" /> {lang === 'ar' ? 'احسب الجرعة' : 'Calculate'}
                                                    </button>
                                                    {totalResult && (
                                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-3">
                                                            <ResultBox label={lang === 'ar' ? 'الإجمالي اليومي' : 'Daily Total'} value={totalResult.tdd} unit={lang === 'ar' ? 'وحدة/يوم' : 'units/day'} color="text-blue-600" />
                                                            <ResultBox label={lang === 'ar' ? 'طويل المفعول' : 'Long-acting'} value={totalResult.basal} unit={lang === 'ar' ? 'وحدة' : 'units'} color="text-emerald-600" />
                                                            <ResultBox label={lang === 'ar' ? 'سريع المفعول' : 'Rapid-acting'} value={totalResult.bolus} unit={lang === 'ar' ? 'وحدة' : 'units'} color="text-orange-600" />
                                                        </motion.div>
                                                    )}
                                                </>)}

                                                {calc.id === 'long' && (<>
                                                    <InputField label={lang === 'ar' ? 'الوزن' : 'Weight'} value={longWeight} onChange={setLongWeight} placeholder="70" unit={lang === 'ar' ? 'كجم' : 'kg'} />
                                                    <button onClick={calcLong}
                                                        className="w-full bg-gradient-to-l from-emerald-600 to-teal-500 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg"
                                                        data-testid="button-calc-long-submit">
                                                        <Calculator className="w-5 h-5" /> {lang === 'ar' ? 'احسب الجرعة' : 'Calculate'}
                                                    </button>
                                                    {longResult && (
                                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
                                                            <ResultBox label={lang === 'ar' ? 'الجرعة المقترحة' : 'Suggested Dose'} value={longResult.dose} unit={lang === 'ar' ? 'وحدة' : 'units'} color="text-emerald-600" />
                                                            <ResultBox label={lang === 'ar' ? 'المدى الطبيعي' : 'Normal Range'} value={longResult.range} unit={lang === 'ar' ? 'وحدة' : 'units'} color="text-teal-600" />
                                                        </motion.div>
                                                    )}
                                                </>)}

                                                {calc.id === 'rapid' && (<>
                                                    <InputField label={lang === 'ar' ? 'كمية الكربوهيدرات' : 'Carbs Amount'} value={carbGrams} onChange={setCarbGrams} placeholder="60" unit={lang === 'ar' ? 'جرام' : 'grams'} />
                                                    <InputField label={lang === 'ar' ? 'نسبة الكربوهيدرات' : 'Carb Ratio'} value={carbRatio} onChange={setCarbRatio} placeholder="10" unit={lang === 'ar' ? 'جم/وحدة' : 'g/unit'} />
                                                    <button onClick={calcRapid}
                                                        className="w-full bg-gradient-to-l from-orange-600 to-red-500 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg"
                                                        data-testid="button-calc-rapid-submit">
                                                        <Calculator className="w-5 h-5" /> {lang === 'ar' ? 'احسب الجرعة' : 'Calculate'}
                                                    </button>
                                                    {rapidResult && (
                                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                                            <ResultBox label={lang === 'ar' ? 'جرعة الإنسولين السريع' : 'Rapid Insulin Dose'} value={rapidResult.dose} unit={lang === 'ar' ? 'وحدة' : 'units'} color="text-orange-600" />
                                                        </motion.div>
                                                    )}
                                                </>)}

                                                {calc.id === 'correction' && (<>
                                                    <InputField label={lang === 'ar' ? 'قراءة السكر الحالية' : 'Current Sugar Reading'} value={currentSugar} onChange={setCurrentSugar} placeholder="250" unit="mg/dL" />
                                                    <InputField label={lang === 'ar' ? 'المستوى المستهدف' : 'Target Level'} value={targetSugar} onChange={setTargetSugar} placeholder="120" unit="mg/dL" />
                                                    <InputField label={lang === 'ar' ? 'معامل التصحيح (ISF)' : 'Correction Factor (ISF)'} value={corrFactor} onChange={setCorrFactor} placeholder="50" unit="mg/dL" />
                                                    <button onClick={calcCorrection}
                                                        className="w-full bg-gradient-to-l from-purple-600 to-violet-500 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg"
                                                        data-testid="button-calc-correction-submit">
                                                        <Calculator className="w-5 h-5" /> {lang === 'ar' ? 'احسب الجرعة التصحيحية' : 'Calculate Correction'}
                                                    </button>
                                                    {corrResult && (
                                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
                                                            <ResultBox label={lang === 'ar' ? 'الجرعة التصحيحية' : 'Correction Dose'} value={corrResult.dose} unit={lang === 'ar' ? 'وحدة' : 'units'} color="text-purple-600" />
                                                            <ResultBox label={lang === 'ar' ? 'الفرق' : 'Difference'} value={corrResult.diff} unit="mg/dL" color="text-red-500" />
                                                        </motion.div>
                                                    )}
                                                </>)}

                                                <div className="flex items-start gap-2 bg-white/70 p-3 rounded-xl">
                                                    <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                                    <p className="text-[10px] text-gray-400 leading-relaxed">
                                                        {lang === 'ar' ? 'النتائج تقريبية وقد تختلف حسب حالتك. استشر طبيبك المعالج دائماً.' : 'Results are approximate. Always consult your doctor.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default InsulinCalculator;
