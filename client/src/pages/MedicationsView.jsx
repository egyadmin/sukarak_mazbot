import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Pill, Plus, Trash2, Clock, AlertCircle, Check, X, ChevronDown, Syringe, Droplets, Wind, Pipette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../api/config';

const formTypes = [
    { key: 'أقراص', icon: Pill, label_ar: 'أقراص', label_en: 'Tablets' },
    { key: 'حقن', icon: Syringe, label_ar: 'حقن', label_en: 'Injections' },
    { key: 'شراب', icon: Droplets, label_ar: 'شراب', label_en: 'Syrup' },
    { key: 'كبسولات', icon: Pill, label_ar: 'كبسولات', label_en: 'Capsules' },
    { key: 'قطرات', icon: Pipette, label_ar: 'قطرات', label_en: 'Drops' },
    { key: 'كريم', icon: Droplets, label_ar: 'كريم', label_en: 'Cream' },
    { key: 'بخاخ', icon: Wind, label_ar: 'بخاخ', label_en: 'Spray' },
];

const frequencies = [
    { key: 'مرة يومياً', label_ar: 'مرة يومياً', label_en: 'Once daily' },
    { key: 'مرتين يومياً', label_ar: 'مرتين يومياً', label_en: 'Twice daily' },
    { key: 'ثلاث مرات يومياً', label_ar: 'ثلاث مرات يومياً', label_en: '3 times daily' },
    { key: 'كل 6 ساعات', label_ar: 'كل 6 ساعات', label_en: 'Every 6 hours' },
    { key: 'كل 4 ساعات', label_ar: 'كل 4 ساعات', label_en: 'Every 4 hours' },
    { key: 'مرة واحدة صباحاً', label_ar: 'مرة واحدة صباحاً', label_en: 'Once in the morning' },
    { key: 'مرة واحدة مساءً', label_ar: 'مرة واحدة مساءً', label_en: 'Once in the evening' },
    { key: 'مرة واحدة قبل النوم', label_ar: 'مرة واحدة قبل النوم', label_en: 'Once before bed' },
    { key: 'مرة واحدة قبل الإفطار', label_ar: 'مرة واحدة قبل الإفطار', label_en: 'Once before breakfast' },
    { key: 'مرة واحدة في الأسبوع', label_ar: 'مرة واحدة في الأسبوع', label_en: 'Once a week' },
    { key: 'مرتين في الأسبوع', label_ar: 'مرتين في الأسبوع', label_en: 'Twice a week' },
    { key: 'ثلاث مرات في الأسبوع', label_ar: 'ثلاث مرات في الأسبوع', label_en: '3 times a week' },
    { key: 'مرة واحدة في الشهر', label_ar: 'مرة واحدة في الشهر', label_en: 'Once a month' },
];

const doseUnits = [
    { key: 'حبة', label_ar: 'حبة', label_en: 'Pill' },
    { key: 'كبسولة', label_ar: 'كبسولة', label_en: 'Capsule' },
    { key: 'مل', label_ar: 'مل', label_en: 'ml' },
    { key: 'وحدة', label_ar: 'وحدة', label_en: 'Unit' },
    { key: 'وحدات', label_ar: 'وحدات', label_en: 'Units' },
    { key: 'نقطة', label_ar: 'نقطة', label_en: 'Drop' },
    { key: 'بخة', label_ar: 'بخة', label_en: 'Puff' },
];

const concentrationUnits = [
    { key: 'ملي جرام', label_ar: 'ملي جرام', label_en: 'mg' },
    { key: 'جرام', label_ar: 'جرام', label_en: 'g' },
    { key: 'مل', label_ar: 'مل', label_en: 'ml' },
    { key: 'ميكروجرام', label_ar: 'ميكروجرام', label_en: 'mcg' },
    { key: 'وحدة دولية', label_ar: 'وحدة دولية', label_en: 'IU' },
    { key: '%', label_ar: '%', label_en: '%' },
];

const quickFrequencies = [
    { key: 'مرة يومياً', label_ar: 'مرة يومياً', label_en: 'Once daily' },
    { key: 'مرتين يومياً', label_ar: 'مرتين يومياً', label_en: 'Twice daily' },
    { key: 'ثلاث مرات يومياً', label_ar: '3 مرات يومياً', label_en: '3x daily' },
    { key: 'أسبوعياً', label_ar: 'أسبوعياً', label_en: 'Weekly' },
];

const MedicationsView = () => {
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const lang = i18n.language === 'ar' ? 'ar' : 'en';
    const [drugs, setDrugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [form, setForm] = useState({
        name: '',
        form: 'أقراص',
        frequency: 'مرة يومياً',
        serving: '',
        concentration: '',
        dose_quantity: '1',
        dose_unit: 'حبة',
        concentration_unit: 'ملي جرام',
    });
    const [submitting, setSubmitting] = useState(false);
    const [showFreqPicker, setShowFreqPicker] = useState(false);
    const [showDoseUnitPicker, setShowDoseUnitPicker] = useState(false);
    const [showConcUnitPicker, setShowConcUnitPicker] = useState(false);

    useEffect(() => { fetchDrugs(); }, []);

    const fetchDrugs = () => {
        fetch(`${API_BASE}/health/drugs`).then(r => r.json()).then(d => { setDrugs(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
    };

    const handleAdd = async () => {
        if (!form.name) return;
        setSubmitting(true);
        const serving = form.dose_quantity && form.dose_unit
            ? `${form.dose_quantity} ${form.dose_unit}`
            : form.serving;
        const concentration = form.concentration
            ? `${form.concentration} ${form.concentration_unit}`
            : '';
        try {
            const res = await fetch(`${API_BASE}/health/drugs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    form: form.form,
                    frequency: form.frequency,
                    serving: serving,
                    concentration: concentration,
                }),
            });
            if (res.ok) {
                setShowAdd(false);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2500);
                fetchDrugs();
                setForm({ name: '', form: 'أقراص', frequency: 'مرة يومياً', serving: '', concentration: '', dose_quantity: '1', dose_unit: 'حبة', concentration_unit: 'ملي جرام' });
            }
        } catch (err) { console.error(err); }
        setSubmitting(false);
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${API_BASE}/health/drugs/${id}`, { method: 'DELETE' });
            fetchDrugs();
        } catch (err) { console.error(err); }
    };

    const getFormIcon = (formKey) => {
        const found = formTypes.find(f => f.key === formKey);
        if (found) {
            const Icon = found.icon;
            return <Icon className="w-5 h-5" />;
        }
        return <Pill className="w-5 h-5" />;
    };

    const getDoseLabel = () => {
        if (form.dose_quantity && form.dose_unit) {
            const qty = form.dose_quantity;
            return `${qty} ${form.dose_unit}`;
        }
        return '';
    };

    return (
        <div className="space-y-5 pb-24">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-xl shadow-sm" data-testid="button-back">
                        <ArrowRight className="w-5 h-5 rtl:rotate-0 rotate-180 text-gray-500" />
                    </button>
                    <h2 className="text-2xl font-black text-primary-dark" data-testid="text-page-title">
                        {lang === 'ar' ? 'سجل أدويتك' : 'Your Medications'}
                    </h2>
                </div>
                <button onClick={() => setShowAdd(true)} className="bg-primary-emerald text-white p-3 rounded-2xl shadow-lg shadow-emerald-200/50 active:scale-95 transition" data-testid="button-add-drug">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="fixed top-20 right-4 left-4 z-[1100] bg-emerald-500 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3" data-testid="status-success">
                        <div className="bg-white/20 p-2 rounded-xl"><Check className="w-5 h-5" /></div>
                        <span className="font-bold">{lang === 'ar' ? 'تم إضافة الدواء بنجاح' : 'Medication added successfully'}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-2xl border border-purple-100">
                <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-xl flex-shrink-0"><AlertCircle className="w-5 h-5 text-purple-600" /></div>
                    <div>
                        <p className="text-sm font-bold text-purple-800 mb-1">{lang === 'ar' ? 'تذكير مهم' : 'Important Reminder'}</p>
                        <p className="text-xs text-purple-600 leading-relaxed">{lang === 'ar' ? 'احرص على تناول أدويتك في المواعيد المحددة. سجّل أدويتك هنا لتتذكرها دائماً.' : 'Make sure to take your medications on time. Record them here to always remember.'}</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2].map(i => (
                        <div key={i} className="bg-white p-5 rounded-2xl animate-pulse">
                            <div className="h-5 bg-gray-100 rounded w-1/2 mb-2" />
                            <div className="h-3 bg-gray-100 rounded w-1/3" />
                        </div>
                    ))}
                </div>
            ) : drugs.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                    <Pill className="w-14 h-14 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-bold mb-1">{lang === 'ar' ? 'لم تسجل أي أدوية بعد' : 'No medications recorded yet'}</p>
                    <p className="text-gray-300 text-sm">{lang === 'ar' ? 'اضغط + لإضافة أول دواء' : 'Press + to add your first medication'}</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {drugs.map((drug, i) => (
                        <motion.div key={drug.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50" data-testid={`card-drug-${drug.id}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-emerald-500">
                                        {getFormIcon(drug.form)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-primary-dark">{drug.name}</h4>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            {drug.form && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">{drug.form}</span>}
                                            {drug.concentration && <span className="text-[10px] bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full font-bold">{drug.concentration}</span>}
                                            {drug.serving && <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">{drug.serving}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {drug.frequency && (
                                        <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                                            <Clock className="w-3 h-3 text-emerald-500" />
                                            <span className="text-[10px] font-bold text-emerald-600">{drug.frequency}</span>
                                        </div>
                                    )}
                                    <button onClick={() => handleDelete(drug.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-400 transition" data-testid={`button-delete-drug-${drug.id}`}>
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add Medication Sheet */}
            <AnimatePresence>
                {showAdd && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}>
                            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex justify-between items-center z-10">
                                <h3 className="text-lg font-black text-primary-dark">{lang === 'ar' ? 'إضافة دواء' : 'Add Medication'}</h3>
                                <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 rounded-xl" data-testid="button-close-add"><X className="w-5 h-5 text-gray-400" /></button>
                            </div>
                            <div className="p-6 space-y-5">
                                {/* Drug Name */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2">{lang === 'ar' ? 'اسم الدواء' : 'Medication Name'} *</label>
                                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        placeholder={lang === 'ar' ? 'مثال: ميتفورمين' : 'e.g. Metformin'}
                                        className="w-full bg-gray-50 p-3.5 rounded-xl border-2 border-gray-100 focus:border-primary-emerald outline-none text-sm"
                                        data-testid="input-drug-name" />
                                </div>

                                {/* Drug Form */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2">{lang === 'ar' ? 'الشكل الدوائي' : 'Drug Form'}</label>
                                    <div className="flex flex-wrap gap-2">
                                        {formTypes.map(f => {
                                            const Icon = f.icon;
                                            const isActive = form.form === f.key;
                                            return (
                                                <button key={f.key} onClick={() => setForm(prev => ({ ...prev, form: f.key }))}
                                                    className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${isActive ? 'border-primary-emerald bg-primary-emerald text-white shadow-md shadow-emerald-200/50' : 'border-gray-100 bg-white text-gray-500'}`}
                                                    data-testid={`button-form-${f.key}`}>
                                                    <Icon className="w-4 h-4" />
                                                    {lang === 'ar' ? f.label_ar : f.label_en}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Concentration */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2">{lang === 'ar' ? 'التركيز' : 'Concentration'}</label>
                                    <div className="flex gap-2">
                                        <input type="text" value={form.concentration} onChange={e => setForm(f => ({ ...f, concentration: e.target.value }))}
                                            placeholder={lang === 'ar' ? 'مثال: 500' : 'e.g. 500'}
                                            className="flex-1 bg-gray-50 p-3.5 rounded-xl border-2 border-gray-100 focus:border-primary-emerald outline-none text-sm"
                                            data-testid="input-concentration" />
                                        <div className="relative">
                                            <button onClick={() => setShowConcUnitPicker(!showConcUnitPicker)}
                                                className="h-full px-4 bg-gray-50 rounded-xl border-2 border-gray-100 text-sm font-bold text-gray-600 flex items-center gap-1.5 min-w-[90px] justify-between"
                                                data-testid="button-conc-unit">
                                                <span>{lang === 'ar' ? form.concentration_unit : concentrationUnits.find(u => u.key === form.concentration_unit)?.label_en || form.concentration_unit}</span>
                                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showConcUnitPicker ? 'rotate-180' : ''}`} />
                                            </button>
                                            <AnimatePresence>
                                                {showConcUnitPicker && (
                                                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                                        className="absolute top-full mt-1 right-0 left-0 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden min-w-[120px]">
                                                        {concentrationUnits.map(u => (
                                                            <button key={u.key} onClick={() => { setForm(f => ({ ...f, concentration_unit: u.key })); setShowConcUnitPicker(false); }}
                                                                className={`w-full px-4 py-2.5 text-right text-sm font-medium transition-colors ${form.concentration_unit === u.key ? 'bg-primary-emerald/10 text-primary-emerald font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                                                                {lang === 'ar' ? u.label_ar : u.label_en}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>

                                {/* Dose Quantity */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2">{lang === 'ar' ? 'كمية الدواء في الجرعة الواحدة' : 'Dose Quantity'}</label>
                                    <div className="flex gap-2">
                                        <input type="text" value={form.dose_quantity} onChange={e => setForm(f => ({ ...f, dose_quantity: e.target.value }))}
                                            placeholder={lang === 'ar' ? 'كمية الدواء في الجرعة الواحدة' : 'Quantity per dose'}
                                            className="flex-1 bg-gray-50 p-3.5 rounded-xl border-2 border-gray-100 focus:border-primary-emerald outline-none text-sm"
                                            data-testid="input-dose-quantity" />
                                        <div className="relative">
                                            <button onClick={() => setShowDoseUnitPicker(!showDoseUnitPicker)}
                                                className="h-full px-4 bg-gray-50 rounded-xl border-2 border-gray-100 text-sm font-bold text-gray-600 flex items-center gap-1.5 min-w-[80px] justify-between"
                                                data-testid="button-dose-unit">
                                                <span>{lang === 'ar' ? form.dose_unit : doseUnits.find(u => u.key === form.dose_unit)?.label_en || form.dose_unit}</span>
                                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDoseUnitPicker ? 'rotate-180' : ''}`} />
                                            </button>
                                            <AnimatePresence>
                                                {showDoseUnitPicker && (
                                                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                                        className="absolute top-full mt-1 right-0 left-0 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden min-w-[100px]">
                                                        {doseUnits.map(u => (
                                                            <button key={u.key} onClick={() => { setForm(f => ({ ...f, dose_unit: u.key })); setShowDoseUnitPicker(false); }}
                                                                className={`w-full px-4 py-2.5 text-right text-sm font-medium transition-colors ${form.dose_unit === u.key ? 'bg-primary-emerald/10 text-primary-emerald font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                                                                {lang === 'ar' ? u.label_ar : u.label_en}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    {getDoseLabel() && (
                                        <p className="text-xs text-gray-400 mt-1.5">{lang === 'ar' ? 'الجرعة:' : 'Dose:'} {getDoseLabel()}</p>
                                    )}
                                </div>

                                {/* Frequency - Quick Select */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2">{lang === 'ar' ? 'التكرار' : 'Frequency'}</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {quickFrequencies.map(f => (
                                            <button key={f.key} onClick={() => setForm(prev => ({ ...prev, frequency: f.key }))}
                                                className={`px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${form.frequency === f.key ? 'border-primary-emerald bg-primary-emerald text-white shadow-md shadow-emerald-200/50' : 'border-gray-100 bg-white text-gray-500'}`}
                                                data-testid={`button-freq-${f.key}`}>
                                                {lang === 'ar' ? f.label_ar : f.label_en}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => setShowFreqPicker(true)}
                                        className="flex items-center gap-1.5 text-sm text-primary-emerald font-bold mt-1"
                                        data-testid="button-more-frequencies">
                                        <ChevronDown className="w-4 h-4" />
                                        {lang === 'ar' ? 'المزيد من الخيارات...' : 'More options...'}
                                    </button>
                                </div>

                                {/* Save Button */}
                                <button onClick={handleAdd} disabled={!form.name || submitting}
                                    className="w-full bg-gradient-to-l from-primary-dark to-primary-emerald text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-200/50 disabled:opacity-50 active:scale-[0.98] transition"
                                    data-testid="button-save-drug">
                                    {submitting
                                        ? (lang === 'ar' ? 'جاري الإضافة...' : 'Adding...')
                                        : <><Pill className="w-5 h-5" /> {lang === 'ar' ? 'حفظ الدواء' : 'Save Medication'}</>}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Frequency Full Picker */}
            <AnimatePresence>
                {showFreqPicker && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1200] bg-black/40 backdrop-blur-sm" onClick={() => setShowFreqPicker(false)}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}>
                            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex justify-between items-center z-10">
                                <h3 className="text-lg font-black text-primary-dark">{lang === 'ar' ? 'اختر التكرار' : 'Select Frequency'}</h3>
                                <button onClick={() => setShowFreqPicker(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-400" /></button>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {frequencies.map(f => (
                                    <button key={f.key}
                                        onClick={() => { setForm(prev => ({ ...prev, frequency: f.key })); setShowFreqPicker(false); }}
                                        className={`w-full px-6 py-4 text-right flex items-center justify-between transition-colors ${form.frequency === f.key ? 'bg-emerald-50' : 'hover:bg-gray-50'}`}
                                        data-testid={`button-freqpicker-${f.key}`}>
                                        <span className={`text-sm font-bold ${form.frequency === f.key ? 'text-primary-emerald' : 'text-gray-700'}`}>
                                            {lang === 'ar' ? f.label_ar : f.label_en}
                                        </span>
                                        {form.frequency === f.key && (
                                            <div className="bg-primary-emerald p-1 rounded-full">
                                                <Check className="w-3.5 h-3.5 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MedicationsView;
