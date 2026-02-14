import React, { useState } from 'react';
import { ArrowRight, Calculator, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const InsulinCalculator = () => {
    const navigate = useNavigate();
    const [activeCalc, setActiveCalc] = useState(null);

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
        { id: 'total', title: 'حاسبة الإنسولين الإجمالية', icon: '💉', desc: 'حساب الجرعة اليومية الإجمالية بناءً على الوزن', gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-200/50' },
        { id: 'long', title: 'حاسبة الإنسولين طويل المفعول', icon: '🕐', desc: 'حساب جرعة الإنسولين القاعدي (Basal)', gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-200/50' },
        { id: 'rapid', title: 'حاسبة الإنسولين سريع المفعول', icon: '⚡', desc: 'حساب جرعة الإنسولين حسب الكربوهيدرات', gradient: 'from-orange-500 to-red-500', shadow: 'shadow-orange-200/50' },
        { id: 'correction', title: 'حاسبة الوحدات التصحيحية', icon: '🎯', desc: 'حساب جرعة التصحيح لخفض السكر المرتفع', gradient: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-200/50' },
    ];

    const InputField = ({ label, value, onChange, placeholder, unit }) => (
        <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">{label}</label>
            <div className="flex items-center gap-2">
                <input type="number" value={value} onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 bg-white p-3.5 rounded-2xl border border-gray-200 text-sm font-bold outline-none focus:border-teal-400 transition text-center text-lg" />
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

    return (
        <div className="space-y-5 pb-4">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-xl shadow-sm">
                    <ArrowRight className="w-5 h-5 rtl:rotate-0 rotate-180 text-gray-500" />
                </button>
                <div>
                    <h2 className="text-2xl font-black text-primary-dark">حاسبة الإنسولين</h2>
                    <p className="text-[10px] text-gray-400">أدوات حسابية إرشادية</p>
                </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200">
                <div className="flex items-start gap-3">
                    <div className="bg-amber-100 p-2 rounded-xl flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-amber-800 mb-1">تنبيه طبي هام</p>
                        <p className="text-xs text-amber-700 leading-relaxed">هذه الأدوات إرشادية مبنية على معادلات حسابية ولا تُعد توصية طبية. تختلف الجرعات من شخص لآخر، لذلك يُنصح بمراجعة طبيبك قبل أي تعديل.</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {calculators.map((calc) => (
                    <div key={calc.id} className="overflow-hidden rounded-3xl shadow-sm border border-gray-100">
                        <button onClick={() => setActiveCalc(activeCalc === calc.id ? null : calc.id)}
                            className={`w-full p-5 flex items-center gap-4 transition-all ${activeCalc === calc.id ? `bg-gradient-to-l ${calc.gradient} text-white` : 'bg-white text-gray-800'}`}>
                            <span className="text-3xl">{calc.icon}</span>
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
                                            <InputField label="الوزن" value={weight} onChange={setWeight} placeholder="70" unit="كجم" />
                                            <button onClick={calcTotal}
                                                className="w-full bg-gradient-to-l from-blue-600 to-indigo-500 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg">
                                                <Calculator className="w-5 h-5" /> احسب الجرعة
                                            </button>
                                            {totalResult && (
                                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-3">
                                                    <ResultBox label="الإجمالي اليومي" value={totalResult.tdd} unit="وحدة/يوم" color="text-blue-600" />
                                                    <ResultBox label="طويل المفعول" value={totalResult.basal} unit="وحدة" color="text-emerald-600" />
                                                    <ResultBox label="سريع المفعول" value={totalResult.bolus} unit="وحدة" color="text-orange-600" />
                                                </motion.div>
                                            )}
                                        </>)}

                                        {calc.id === 'long' && (<>
                                            <InputField label="الوزن" value={longWeight} onChange={setLongWeight} placeholder="70" unit="كجم" />
                                            <button onClick={calcLong}
                                                className="w-full bg-gradient-to-l from-emerald-600 to-teal-500 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg">
                                                <Calculator className="w-5 h-5" /> احسب الجرعة
                                            </button>
                                            {longResult && (
                                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
                                                    <ResultBox label="الجرعة المقترحة" value={longResult.dose} unit="وحدة" color="text-emerald-600" />
                                                    <ResultBox label="المدى الطبيعي" value={longResult.range} unit="وحدة" color="text-teal-600" />
                                                </motion.div>
                                            )}
                                        </>)}

                                        {calc.id === 'rapid' && (<>
                                            <InputField label="كمية الكربوهيدرات" value={carbGrams} onChange={setCarbGrams} placeholder="60" unit="جرام" />
                                            <InputField label="نسبة الكربوهيدرات" value={carbRatio} onChange={setCarbRatio} placeholder="10" unit="جم/وحدة" />
                                            <button onClick={calcRapid}
                                                className="w-full bg-gradient-to-l from-orange-600 to-red-500 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg">
                                                <Calculator className="w-5 h-5" /> احسب الجرعة
                                            </button>
                                            {rapidResult && (
                                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                                    <ResultBox label="جرعة الإنسولين السريع" value={rapidResult.dose} unit="وحدة" color="text-orange-600" />
                                                </motion.div>
                                            )}
                                        </>)}

                                        {calc.id === 'correction' && (<>
                                            <InputField label="قراءة السكر الحالية" value={currentSugar} onChange={setCurrentSugar} placeholder="250" unit="mg/dL" />
                                            <InputField label="المستوى المستهدف" value={targetSugar} onChange={setTargetSugar} placeholder="120" unit="mg/dL" />
                                            <InputField label="معامل التصحيح (ISF)" value={corrFactor} onChange={setCorrFactor} placeholder="50" unit="mg/dL" />
                                            <button onClick={calcCorrection}
                                                className="w-full bg-gradient-to-l from-purple-600 to-violet-500 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg">
                                                <Calculator className="w-5 h-5" /> احسب الجرعة التصحيحية
                                            </button>
                                            {corrResult && (
                                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
                                                    <ResultBox label="الجرعة التصحيحية" value={corrResult.dose} unit="وحدة" color="text-purple-600" />
                                                    <ResultBox label="الفرق" value={corrResult.diff} unit="mg/dL" color="text-red-500" />
                                                </motion.div>
                                            )}
                                        </>)}

                                        <div className="flex items-start gap-2 bg-white/70 p-3 rounded-xl">
                                            <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-gray-400 leading-relaxed">
                                                النتائج تقريبية وقد تختلف حسب حالتك. استشر طبيبك المعالج دائماً.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InsulinCalculator;
