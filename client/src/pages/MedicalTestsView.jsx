import { useState, useEffect, useRef } from 'react';
import { ArrowRight, TestTube, Plus, X, Check, Clock, FileText, Loader2, Trash2, Eye, Edit3, Save, AlertTriangle, Upload, Image, File, Download, ZoomIn, Search, Droplets, FlaskConical, Pill, Activity, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_BASE } from '../api/config';
import bannerImg from '@assets/image_1771065508471.png';

const API = `${API_BASE}/services`;

const testCategories = [
    { key: 'blood', icon: Droplets, label_ar: 'تحاليل الدم', label_en: 'Blood Tests', color: 'from-red-400 to-rose-500', bg: 'bg-red-50' },
    { key: 'diabetes', icon: TestTube, label_ar: 'تحاليل السكري', label_en: 'Diabetes Tests', color: 'from-sky-400 to-blue-500', bg: 'bg-sky-50' },
    { key: 'hormones', icon: FlaskConical, label_ar: 'تحاليل الغدة\nوالهرمونات', label_en: 'Gland &\nHormone Tests', color: 'from-violet-400 to-purple-500', bg: 'bg-violet-50' },
    { key: 'liver_kidney', icon: Activity, label_ar: 'تحاليل الكبد والكلى', label_en: 'Liver & Kidney Tests', color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50' },
    { key: 'vitamins', icon: Pill, label_ar: 'تحاليل الفيتامينات\nوالمعادن', label_en: 'Vitamins &\nMinerals Tests', color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50' },
    { key: 'other', icon: MoreHorizontal, label_ar: 'خدمات أخرى', label_en: 'Other Services', color: 'from-gray-400 to-slate-500', bg: 'bg-gray-50' },
];

const MedicalTestsView = () => {
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const lang = i18n.language === 'ar' ? 'ar' : 'en';
    const [showAdd, setShowAdd] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showDetail, setShowDetail] = useState(null);
    const [editingResult, setEditingResult] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: '', lab: '', date: '', result: '', notes: '' });
    const [pendingFiles, setPendingFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = useRef(null);
    const detailFileRef = useRef(null);

    const testTypes = [
        'تحليل سكر تراكمي HbA1c', 'صورة دم كاملة CBC', 'وظائف كلى', 'وظائف كبد',
        'دهون الدم', 'بول كامل', 'هرمونات الغدة الدرقية', 'فيتامين D', 'حديد', 'أخرى'
    ];

    const fetchTests = async () => {
        try {
            const res = await fetch(`${API}/medical-tests`);
            if (res.ok) setTests(await res.json());
        } catch (err) { console.error('Failed to fetch tests:', err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchTests(); }, []);

    const uploadFiles = async (testId, files) => {
        setUploading(true);
        for (const file of files) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                await fetch(`${API}/medical-tests/${testId}/upload`, {
                    method: 'POST',
                    body: formData,
                });
            } catch (err) { console.error('Upload failed:', err); }
        }
        setUploading(false);
        fetchTests();
    };

    const handleAdd = async () => {
        if (!form.name) return;
        try {
            const res = await fetch(`${API}/medical-tests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                const newTest = await res.json();
                if (pendingFiles.length > 0) {
                    await uploadFiles(newTest.id, pendingFiles);
                }
                setShowAdd(false);
                setForm({ name: '', lab: '', date: '', result: '', notes: '' });
                setPendingFiles([]);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2500);
                fetchTests();
            }
        } catch (err) { console.error('Failed to add test:', err); }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${API}/medical-tests/${id}`, { method: 'DELETE' });
            setConfirmDelete(null);
            setShowDetail(null);
            fetchTests();
        } catch (err) { console.error('Failed to delete test:', err); }
    };

    const handleUpdateResult = async (id) => {
        if (!editingResult) return;
        try {
            await fetch(`${API}/medical-tests/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ result: editingResult, status: 'completed' }),
            });
            setEditingResult(null);
            fetchTests();
        } catch (err) { console.error('Update failed:', err); }
    };

    const filteredTests = tests.filter(t => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return t.name?.toLowerCase().includes(q) || t.lab?.toLowerCase().includes(q);
    });

    return (
        <div className="space-y-5 pb-24">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-xl shadow-sm" data-testid="button-back-tests">
                    <ArrowRight className="w-5 h-5 rtl:rotate-0 rotate-180 text-gray-500" />
                </button>
                <h2 className="text-2xl font-black text-primary-dark flex-1">
                    {lang === 'ar' ? 'التحاليل الطبية' : 'Medical Tests'}
                </h2>
                <button onClick={() => setShowAdd(true)} className="p-3 bg-primary-emerald text-white rounded-2xl shadow-lg active:scale-95 transition" data-testid="button-add-test">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-sm">
                <img src={bannerImg} alt="Sukarak Mazboot" className="w-full h-40 object-cover" />
            </div>

            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={lang === 'ar' ? 'ابحث عن الخدمات...' : 'Search services...'}
                    className="w-full bg-white py-3.5 px-12 rounded-2xl shadow-sm border border-gray-100 text-sm outline-none focus:border-primary-emerald/30 transition"
                    data-testid="input-search-tests"
                />
                <Search className="w-4.5 h-4.5 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-4" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                {testCategories.map((cat, i) => {
                    const Icon = cat.icon;
                    return (
                        <motion.button
                            key={cat.key}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="relative bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center active:scale-95 transition hover:shadow-md flex flex-col items-center gap-3"
                            data-testid={`button-test-category-${cat.key}`}
                        >
                            <div className={`w-14 h-14 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                                <Icon className="w-7 h-7 text-white" />
                            </div>
                            <h4 className="font-bold text-sm text-primary-dark leading-tight whitespace-pre-line">
                                {lang === 'ar' ? cat.label_ar : cat.label_en}
                            </h4>
                        </motion.button>
                    );
                })}
            </div>

            {!loading && filteredTests.length > 0 && (
                <div>
                    <h3 className="text-sm font-black text-gray-500 mb-3">{lang === 'ar' ? 'تحاليلي' : 'My Tests'}</h3>
                    <div className="grid gap-3">
                        {filteredTests.map((test, i) => (
                            <motion.div key={test.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                onClick={() => setShowDetail(test)}
                                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex items-center justify-between active:scale-[0.98] transition cursor-pointer"
                                data-testid={`card-test-${test.id}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                        <TestTube className="w-5 h-5 text-indigo-500" />
                                    </div>
                                    <div className="text-right">
                                        <h4 className="font-black text-sm text-gray-800">{test.name}</h4>
                                        <p className="text-[10px] text-gray-400">{test.date} {test.lab ? `\u2022 ${test.lab}` : ''}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${test.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {test.status === 'completed' ? (lang === 'ar' ? 'مكتمل' : 'Completed') : (lang === 'ar' ? 'بانتظار النتيجة' : 'Pending')}
                                    </span>
                                    {test.result && <span className="text-xs font-black text-primary-dark">{test.result}</span>}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {!loading && filteredTests.length === 0 && tests.length === 0 && (
                <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-200">
                    <TestTube className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-bold">{lang === 'ar' ? 'لا توجد تحاليل مسجلة' : 'No tests recorded'}</p>
                </div>
            )}

            <AnimatePresence>
                {showSuccess && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="fixed top-16 right-4 left-4 z-[1100] bg-emerald-500 text-white p-4 rounded-2xl shadow-xl text-center">
                        <p className="font-black">{lang === 'ar' ? 'تم إضافة التحليل بنجاح!' : 'Test added!'}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showAdd && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm flex flex-col justify-end" onClick={() => setShowAdd(false)}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white rounded-t-3xl p-6 space-y-6" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-black text-primary-dark">{lang === 'ar' ? 'إضافة تحليل جديد' : 'Add New Test'}</h3>
                                <X onClick={() => setShowAdd(false)} className="w-6 h-6 text-gray-400 cursor-pointer" />
                            </div>
                            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-2">
                                    {testTypes.map(t => (
                                        <button key={t} onClick={() => setForm({ ...form, name: t })}
                                            className={`p-2 rounded-xl text-[10px] font-bold border ${form.name === t ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
                                            data-testid={`button-test-type-${t}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                                <input placeholder={lang === 'ar' ? 'المختبر' : 'Laboratory'} value={form.lab} onChange={e => setForm({ ...form, lab: e.target.value })}
                                    className="w-full bg-gray-50 p-4 rounded-2xl outline-none" data-testid="input-test-lab" />
                                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                                    className="w-full bg-gray-50 p-4 rounded-2xl outline-none" data-testid="input-test-date" />
                                <textarea placeholder={lang === 'ar' ? 'ملاحظات' : 'Notes'} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                                    className="w-full bg-gray-50 p-4 rounded-2xl outline-none h-20" data-testid="input-test-notes" />
                                <button onClick={handleAdd}
                                    className="w-full bg-primary-emerald text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-200/50"
                                    data-testid="button-submit-test">
                                    {lang === 'ar' ? 'إضافة' : 'Add'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDetail && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm flex flex-col justify-end" onClick={() => { setShowDetail(null); setEditingResult(null); }}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white rounded-t-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-black text-primary-dark">{showDetail.name}</h3>
                                <X onClick={() => { setShowDetail(null); setEditingResult(null); }} className="w-6 h-6 text-gray-400 cursor-pointer" />
                            </div>
                            <div className="space-y-3 text-sm">
                                {showDetail.lab && <p className="text-gray-500"><span className="font-bold">{lang === 'ar' ? 'المختبر: ' : 'Lab: '}</span>{showDetail.lab}</p>}
                                {showDetail.date && <p className="text-gray-500"><span className="font-bold">{lang === 'ar' ? 'التاريخ: ' : 'Date: '}</span>{showDetail.date}</p>}
                                {showDetail.notes && <p className="text-gray-500"><span className="font-bold">{lang === 'ar' ? 'ملاحظات: ' : 'Notes: '}</span>{showDetail.notes}</p>}
                                {showDetail.result && <p className="text-primary-dark font-black"><span className="font-bold text-gray-500">{lang === 'ar' ? 'النتيجة: ' : 'Result: '}</span>{showDetail.result}</p>}
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button onClick={() => setConfirmDelete(showDetail.id)} className="flex-1 bg-red-50 text-red-500 py-3 rounded-xl font-bold text-sm" data-testid="button-delete-test">
                                    <Trash2 className="w-4 h-4 inline mr-1" /> {lang === 'ar' ? 'حذف' : 'Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {confirmDelete && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1200] bg-black/50 flex items-center justify-center p-6">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-6 text-center space-y-4 max-w-sm w-full">
                            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
                            <p className="font-black text-primary-dark">{lang === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure?'}</p>
                            <div className="flex gap-3">
                                <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold" data-testid="button-cancel-delete">
                                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                                </button>
                                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold" data-testid="button-confirm-delete">
                                    {lang === 'ar' ? 'حذف' : 'Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MedicalTestsView;
