import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Pill, Plus, Trash2, Clock, AlertCircle, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../api/config';

const MedicationsView = () => {
    const navigate = useNavigate();
    const [drugs, setDrugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [form, setForm] = useState({ name: '', form: 'أقراص', frequency: 'مرتين يومياً', serving: '', concentration: '' });
    const [submitting, setSubmitting] = useState(false);

    const formTypes = ['أقراص', 'حقن', 'شراب', 'كبسولات', 'قطرات', 'كريم', 'بخاخ'];
    const frequencies = ['مرة يومياً', 'مرتين يومياً', 'ثلاث مرات يومياً', 'أربع مرات يومياً', 'عند الحاجة', 'أسبوعياً'];

    useEffect(() => { fetchDrugs(); }, []);

    const fetchDrugs = () => {
        fetch(`${API_BASE}/health/drugs`).then(r => r.json()).then(d => { setDrugs(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
    };

    const handleAdd = async () => {
        if (!form.name) return;
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/health/drugs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setShowAdd(false);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2500);
                fetchDrugs();
                setForm({ name: '', form: 'أقراص', frequency: 'مرتين يومياً', serving: '', concentration: '' });
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

    const formEmoji = { 'أقراص': '💊', 'حقن': '💉', 'شراب': '🧴', 'كبسولات': '💊', 'قطرات': '💧', 'كريم': '🧴', 'بخاخ': '🌬️' };

    return (
        <div className="space-y-5 pb-24">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-xl shadow-sm">
                        <ArrowRight className="w-5 h-5 rtl:rotate-0 rotate-180 text-gray-500" />
                    </button>
                    <h2 className="text-2xl font-black text-primary-dark">أدويتك</h2>
                </div>
                <button onClick={() => setShowAdd(true)} className="bg-primary-emerald text-white p-3 rounded-2xl shadow-lg shadow-emerald-200/50 active:scale-95 transition">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="fixed top-20 right-4 left-4 z-[1100] bg-emerald-500 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl"><Check className="w-5 h-5" /></div>
                        <span className="font-bold">تم إضافة الدواء بنجاح ✓</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-2xl border border-purple-100">
                <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-xl flex-shrink-0"><AlertCircle className="w-5 h-5 text-purple-600" /></div>
                    <div>
                        <p className="text-sm font-bold text-purple-800 mb-1">تذكير مهم</p>
                        <p className="text-xs text-purple-600 leading-relaxed">احرص على تناول أدويتك في المواعيد المحددة. سجّل أدويتك هنا لتتذكرها دائماً.</p>
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
                    <p className="text-gray-400 font-bold mb-1">لم تسجل أي أدوية بعد</p>
                    <p className="text-gray-300 text-sm">اضغط + لإضافة أول دواء</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {drugs.map((drug, i) => (
                        <motion.div key={drug.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{formEmoji[drug.form] || '💊'}</span>
                                    <div>
                                        <h4 className="font-bold text-sm text-primary-dark">{drug.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            {drug.form && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">{drug.form}</span>}
                                            {drug.concentration && <span className="text-[10px] bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full font-bold">{drug.concentration}</span>}
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
                                    <button onClick={() => handleDelete(drug.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-400 transition">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {showAdd && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}>
                            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex justify-between items-center z-10">
                                <h3 className="text-lg font-black text-primary-dark">إضافة دواء</h3>
                                <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-400" /></button>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2">اسم الدواء *</label>
                                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        placeholder="مثال: ميتفورمين" className="w-full bg-gray-50 p-3 rounded-xl border-2 border-gray-100 focus:border-primary-emerald outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2">الشكل الدوائي</label>
                                    <div className="flex flex-wrap gap-2">
                                        {formTypes.map(f => (
                                            <button key={f} onClick={() => setForm(prev => ({ ...prev, form: f }))}
                                                className={`px-3 py-2 rounded-xl text-sm font-bold transition-all border-2 ${form.form === f ? 'border-primary-emerald bg-primary-emerald/5 text-primary-emerald' : 'border-gray-100 text-gray-400'}`}>
                                                {formEmoji[f] || '💊'} {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2">التكرار</label>
                                    <div className="flex flex-wrap gap-2">
                                        {frequencies.map(f => (
                                            <button key={f} onClick={() => setForm(prev => ({ ...prev, frequency: f }))}
                                                className={`px-3 py-2 rounded-xl text-sm font-bold transition-all border-2 ${form.frequency === f ? 'border-primary-emerald bg-primary-emerald/5 text-primary-emerald' : 'border-gray-100 text-gray-400'}`}>
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-500 mb-2">الجرعة</label>
                                        <input type="text" value={form.serving} onChange={e => setForm(f => ({ ...f, serving: e.target.value }))}
                                            placeholder="مثال: 500mg" className="w-full bg-gray-50 p-3 rounded-xl border-2 border-gray-100 focus:border-primary-emerald outline-none text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-500 mb-2">التركيز</label>
                                        <input type="text" value={form.concentration} onChange={e => setForm(f => ({ ...f, concentration: e.target.value }))}
                                            placeholder="مثال: 500mg" className="w-full bg-gray-50 p-3 rounded-xl border-2 border-gray-100 focus:border-primary-emerald outline-none text-sm" />
                                    </div>
                                </div>
                                <button onClick={handleAdd} disabled={!form.name || submitting}
                                    className="w-full bg-gradient-to-l from-primary-dark to-primary-emerald text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-200/50 disabled:opacity-50 active:scale-[0.98] transition">
                                    {submitting ? 'جاري الإضافة...' : <><Pill className="w-5 h-5" /> إضافة الدواء</>}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MedicationsView;
