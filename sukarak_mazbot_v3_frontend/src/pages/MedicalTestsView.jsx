import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, TestTube, Plus, X, Check, Clock, FileText, Loader2, Trash2, Eye, Edit3, Save, AlertTriangle, Upload, Image, File, Download, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_BASE } from '../api/config';

const API = `${API_BASE}/services`;

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

    return (
        <div className="space-y-4 pb-24">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-primary-dark">{lang === 'ar' ? 'التحاليل الطبية' : 'Medical Tests'}</h2>
                <button onClick={() => setShowAdd(true)} className="p-3 bg-primary-emerald text-white rounded-2xl shadow-lg active:scale-95 transition">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {loading ? <Loader2 className="w-8 h-8 animate-spin mx-auto mt-10" /> : tests.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-200">
                    <TestTube className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-bold">{lang === 'ar' ? 'لا توجد تحاليل مسجلة' : 'No tests recorded'}</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {tests.map((test, i) => (
                        <motion.div key={test.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            onClick={() => setShowDetail(test)}
                            className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex items-center justify-between active:scale-[0.98] transition cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                    <TestTube className="w-5 h-5 text-indigo-500" />
                                </div>
                                <div className="text-right">
                                    <h4 className="font-black text-sm text-gray-800">{test.name}</h4>
                                    <p className="text-[10px] text-gray-400">{test.date} • {test.lab}</p>
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
            )}

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
                                        <button key={t} onClick={() => setForm({ ...form, name: t })} className={`p-2 rounded-xl text-[10px] font-bold border ${form.name === t ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>{t}</button>
                                    ))}
                                </div>
                                <input placeholder={lang === 'ar' ? 'المختبر' : 'Laboratory'} value={form.lab} onChange={e => setForm({ ...form, lab: e.target.value })} className="w-full bg-gray-50 p-4 rounded-2xl outline-none" />
                                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full bg-gray-50 p-4 rounded-2xl outline-none" />
                                <textarea placeholder={lang === 'ar' ? 'ملاحظات' : 'Notes'} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full bg-gray-50 p-4 rounded-2xl outline-none h-20" />
                                <button onClick={handleAdd} className="w-full bg-primary-emerald text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-200/50">{lang === 'ar' ? 'إضافة' : 'Add'}</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MedicalTestsView;
