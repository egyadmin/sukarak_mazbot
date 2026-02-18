import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, AlertTriangle, Calculator, Info, RotateCcw } from 'lucide-react';

const InsulinCalculatorView = () => {
    const navigate = useNavigate();

    // States
    const [calcType, setCalcType] = useState('correction'); // correction | carb | both
    const [currentSugar, setCurrentSugar] = useState('');
    const [targetSugar, setTargetSugar] = useState('120');
    const [correctionFactor, setCorrectionFactor] = useState('50'); // ISF - how much 1 unit drops sugar
    const [carbsEaten, setCarbsEaten] = useState('');
    const [carbRatio, setCarbRatio] = useState('15'); // ICR - grams per unit
    const [result, setResult] = useState(null);

    const calcTypes = [
        { key: 'correction', label: 'جرعة التصحيح', emoji: '🎯', desc: 'لتعديل ارتفاع السكر' },
        { key: 'carb', label: 'جرعة الوجبة', emoji: '🍽️', desc: 'لتغطية الكربوهيدرات' },
        { key: 'both', label: 'الجرعة الكاملة', emoji: '💉', desc: 'تصحيح + وجبة معاً' },
    ];

    const calculate = () => {
        let correctionDose = 0;
        let carbDose = 0;

        if (calcType === 'correction' || calcType === 'both') {
            const current = parseFloat(currentSugar);
            const target = parseFloat(targetSugar);
            const isf = parseFloat(correctionFactor);
            if (current && target && isf) {
                correctionDose = Math.max(0, (current - target) / isf);
            }
        }

        if (calcType === 'carb' || calcType === 'both') {
            const carbs = parseFloat(carbsEaten);
            const icr = parseFloat(carbRatio);
            if (carbs && icr) {
                carbDose = carbs / icr;
            }
        }

        const totalDose = correctionDose + carbDose;

        setResult({
            correctionDose: correctionDose.toFixed(1),
            carbDose: carbDose.toFixed(1),
            totalDose: totalDose.toFixed(1),
            roundedDose: Math.round(totalDose * 2) / 2, // Round to nearest 0.5
        });
    };

    const reset = () => {
        setCurrentSugar('');
        setTargetSugar('120');
        setCorrectionFactor('50');
        setCarbsEaten('');
        setCarbRatio('15');
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
                        <p className="text-xs font-black text-amber-700 mb-1">⚠️ تنبيه مهم</p>
                        <p className="text-[10px] text-amber-600 leading-relaxed">
                            هذه الحاسبة للاستخدام الاسترشادي فقط. استشر طبيبك دائماً قبل تعديل جرعات الأنسولين. النتائج تعتمد على المعاملات التي يحددها طبيبك.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Calc Type Selector */}
            <div>
                <label className="block text-sm font-black text-gray-500 mb-3">نوع الحساب</label>
                <div className="grid grid-cols-3 gap-2">
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

            {/* Correction Fields */}
            {(calcType === 'correction' || calcType === 'both') && (
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

            {/* Carb Fields */}
            {(calcType === 'carb' || calcType === 'both') && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 space-y-3">
                    <h3 className="font-black text-sm text-orange-600 flex items-center gap-2">
                        🍽️ بيانات الوجبة
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

                        {calcType === 'both' && (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/80 rounded-xl p-3 text-center">
                                    <p className="text-[9px] text-gray-400 font-bold">جرعة التصحيح</p>
                                    <p className="font-black text-lg text-sky-500">{result.correctionDose}</p>
                                    <p className="text-[8px] text-gray-400">وحدة</p>
                                </div>
                                <div className="bg-white/80 rounded-xl p-3 text-center">
                                    <p className="text-[9px] text-gray-400 font-bold">جرعة الوجبة</p>
                                    <p className="font-black text-lg text-orange-500">{result.carbDose}</p>
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
