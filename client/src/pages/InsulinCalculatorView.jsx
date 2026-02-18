import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, AlertTriangle, Calculator, Info, RotateCcw } from 'lucide-react';

const InsulinCalculatorView = () => {
    const navigate = useNavigate();

    // States
    const [calcType, setCalcType] = useState('total');
    const [currentSugar, setCurrentSugar] = useState('');
    const [targetSugar, setTargetSugar] = useState('120');
    const [correctionFactor, setCorrectionFactor] = useState('50');
    const [carbsEaten, setCarbsEaten] = useState('');
    const [carbRatio, setCarbRatio] = useState('15');
    const [weightInput, setWeightInput] = useState('');
    const [result, setResult] = useState(null);

    const calcTypes = [
        { key: 'total', label: 'الإنسولين الإجمالية', emoji: '💉', desc: 'حساب الجرعة اليومية الكلية' },
        { key: 'long', label: 'طويل المفعول', emoji: '⏰', desc: 'الجرعة القاعدية (القاعدي)' },
        { key: 'carb', label: 'سريع المفعول', emoji: '⚡', desc: 'جرعة تغطية الوجبة' },
        { key: 'correction', label: 'الوحدات التصحيحية', emoji: '🎯', desc: 'لتعديل ارتفاع السكر' },
    ];

    const calculate = () => {
        if (calcType === 'total') {
            const weight = parseFloat(weightInput);
            if (!weight) return;
            const tdd = weight * 0.55;
            const basal = tdd * 0.5;
            const bolus = tdd * 0.5;
            setResult({
                totalDose: tdd.toFixed(1),
                roundedDose: Math.round(tdd * 2) / 2,
                basalDose: basal.toFixed(1),
                bolusDose: bolus.toFixed(1),
                type: 'total',
            });
            return;
        }

        if (calcType === 'long') {
            const weight = parseFloat(weightInput);
            if (!weight) return;
            const tdd = weight * 0.55;
            const basal = tdd * 0.5;
            setResult({
                totalDose: basal.toFixed(1),
                roundedDose: Math.round(basal * 2) / 2,
                type: 'long',
            });
            return;
        }

        if (calcType === 'correction') {
            const current = parseFloat(currentSugar);
            const target = parseFloat(targetSugar);
            const isf = parseFloat(correctionFactor);
            if (!current || !target || !isf) return;
            const dose = Math.max(0, (current - target) / isf);
            setResult({
                totalDose: dose.toFixed(1),
                roundedDose: Math.round(dose * 2) / 2,
                type: 'correction',
            });
            return;
        }

        if (calcType === 'carb') {
            const carbs = parseFloat(carbsEaten);
            const icr = parseFloat(carbRatio);
            if (!carbs || !icr) return;
            const dose = carbs / icr;
            setResult({
                totalDose: dose.toFixed(1),
                roundedDose: Math.round(dose * 2) / 2,
                type: 'carb',
            });
            return;
        }
    };

    const reset = () => {
        setCurrentSugar('');
        setTargetSugar('120');
        setCorrectionFactor('50');
        setCarbsEaten('');
        setCarbRatio('15');
        setWeightInput('');
        setResult(null);
    };

    return (
        <div className="space-y-5 pb-24">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-xl shadow-sm active:scale-90 transition">
                    <ChevronLeft className="w-5 h-5 text-gray-500 rtl:rotate-180" />
                </button>
                <h1 className="text-xl font-black text-primary-dark">حاسبة الإنسولين</h1>
                <ArrowRight className="w-4 h-4 text-gray-300 rtl:rotate-180" />
            </div>

            {/* Warning Banner */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-black text-amber-700 mb-1">⚠️ تنبيه طبي هام</p>
                        <p className="text-[10px] text-amber-600 leading-relaxed">
                            هذه الأدوات مبنية على معادلات حسابية إرشادية ولا تعد توصية طبية. تختلف الجرعات من شخص لآخر، لذلك ينصح بمراجعة طبيبك قبل أي تعديل.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Calc Type Selector */}
            <div>
                <label className="block text-sm font-black text-gray-500 mb-3">نوع الحساب</label>
                <div className="grid grid-cols-2 gap-2">
                    {calcTypes.map(ct => (
                        <button key={ct.key} onClick={() => { setCalcType(ct.key); setResult(null); }}
                            className={`p-3 rounded-2xl text-center transition-all
                            ${calcType === ct.key
                                    ? 'bg-gradient-to-b from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-200/50'
                                    : 'bg-white border border-gray-100 text-gray-500 shadow-sm'}`}>
                            <span className="text-xl block mb-1">{ct.emoji}</span>
                            <p className="text-[10px] font-black">{ct.label}</p>
                        </button>
                    ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center">
                    {calcTypes.find(c => c.key === calcType)?.desc}
                </p>
            </div>

            {/* Total / Long-Acting Inputs */}
            {(calcType === 'total' || calcType === 'long') && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 space-y-3">
                    <h3 className="font-black text-sm text-sky-600 flex items-center gap-2">
                        {calcType === 'total' ? '💉 حساب الجرعة اليومية الكلية' : '⏰ حساب جرعة الإنسولين القاعدي'}
                    </h3>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1.5">الوزن (كجم)</label>
                        <input type="number" value={weightInput} onChange={e => setWeightInput(e.target.value)}
                            placeholder="مثال: 70"
                            className="w-full bg-gray-50 p-3 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-sky-400 outline-none" />
                    </div>
                    <div className="bg-sky-50 p-2.5 rounded-xl">
                        <div className="flex items-start gap-1.5">
                            <Info className="w-3 h-3 text-sky-500 mt-0.5 flex-shrink-0" />
                            <p className="text-[9px] text-sky-600 leading-relaxed">
                                {calcType === 'total'
                                    ? 'يتم حساب الجرعة اليومية الكلية (TDD) = الوزن × 0.55 وحدة/يوم. تنقسم إلى 50% قاعدي و 50% سريع.'
                                    : 'الجرعة القاعدية = 50% من الجرعة اليومية الكلية. تؤخذ مرة واحدة يومياً.'}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Correction Fields */}
            {calcType === 'correction' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 space-y-3">
                    <h3 className="font-black text-sm text-sky-600 flex items-center gap-2">
                        🎯 بيانات التصحيح
                    </h3>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1.5">قراءة السكر الحالية (mg/dL)</label>
                        <input type="number" value={currentSugar} onChange={e => setCurrentSugar(e.target.value)}
                            placeholder="مثال: 250"
                            className="w-full bg-gray-50 p-3 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-sky-400 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1.5">السكر المستهدف</label>
                            <input type="number" value={targetSugar} onChange={e => setTargetSugar(e.target.value)}
                                placeholder="120"
                                className="w-full bg-gray-50 p-3 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-sky-400 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1.5">معامل التصحيح (ISF)</label>
                            <input type="number" value={correctionFactor} onChange={e => setCorrectionFactor(e.target.value)}
                                placeholder="50"
                                className="w-full bg-gray-50 p-3 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-sky-400 outline-none" />
                        </div>
                    </div>
                    <div className="bg-sky-50 p-2.5 rounded-xl">
                        <div className="flex items-start gap-1.5">
                            <Info className="w-3 h-3 text-sky-500 mt-0.5 flex-shrink-0" />
                            <p className="text-[9px] text-sky-600 leading-relaxed">
                                معامل التصحيح (ISF): كم ينخفض السكر بوحدة أنسولين واحدة. مثال: 50 يعني أن وحدة واحدة تخفض السكر 50 نقطة.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Carb/Rapid-Acting Fields */}
            {calcType === 'carb' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 space-y-3">
                    <h3 className="font-black text-sm text-orange-600 flex items-center gap-2">
                        ⚡ بيانات الوجبة
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1.5">كربوهيدرات الوجبة (جم)</label>
                            <input type="number" value={carbsEaten} onChange={e => setCarbsEaten(e.target.value)}
                                placeholder="60"
                                className="w-full bg-gray-50 p-3 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-orange-400 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1.5">نسبة الكربوهيدرات (ICR)</label>
                            <input type="number" value={carbRatio} onChange={e => setCarbRatio(e.target.value)}
                                placeholder="15"
                                className="w-full bg-gray-50 p-3 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-orange-400 outline-none" />
                        </div>
                    </div>
                    <div className="bg-orange-50 p-2.5 rounded-xl">
                        <div className="flex items-start gap-1.5">
                            <Info className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                            <p className="text-[9px] text-orange-600 leading-relaxed">
                                نسبة الكربوهيدرات (ICR): كم جرام كربوهيدرات تغطيها وحدة أنسولين واحدة. مثال: 15 يعني أن وحدة واحدة تغطي 15 جم.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Calculate & Reset Buttons */}
            <div className="flex gap-3">
                <button onClick={calculate}
                    className="flex-1 bg-gradient-to-l from-sky-500 to-blue-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-200/50 active:scale-[0.98] transition">
                    <Calculator className="w-5 h-5" /> احسب الجرعة
                </button>
                <button onClick={reset}
                    className="p-4 bg-gray-100 rounded-2xl active:scale-90 transition">
                    <RotateCcw className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Result */}
            <AnimatePresence>
                {result && (
                    <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
                        className="bg-gradient-to-br from-sky-50 to-blue-50 p-5 rounded-3xl border border-blue-100 space-y-4">
                        <h3 className="font-black text-center text-sky-700">💉 نتيجة الحساب</h3>

                        <div className="bg-white rounded-2xl p-5 text-center shadow-sm">
                            <p className="text-[10px] text-gray-400 font-bold mb-1">الجرعة المقترحة</p>
                            <p className="text-5xl font-black text-sky-600">{result.roundedDose}</p>
                            <p className="text-xs text-gray-500 font-bold mt-1">وحدة أنسولين</p>
                        </div>

                        {result.type === 'total' && (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/80 rounded-xl p-3 text-center">
                                    <p className="text-[9px] text-gray-400 font-bold">الجرعة القاعدية (50%)</p>
                                    <p className="font-black text-lg text-sky-500">{result.basalDose}</p>
                                    <p className="text-[8px] text-gray-400">وحدة</p>
                                </div>
                                <div className="bg-white/80 rounded-xl p-3 text-center">
                                    <p className="text-[9px] text-gray-400 font-bold">جرعة الوجبات (50%)</p>
                                    <p className="font-black text-lg text-orange-500">{result.bolusDose}</p>
                                    <p className="text-[8px] text-gray-400">وحدة</p>
                                </div>
                            </div>
                        )}

                        <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                            <p className="text-[10px] text-amber-700 font-bold text-center">
                                ⚠️ تأكد من مراجعة طبيبك قبل تعديل الجرعات
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InsulinCalculatorView;
