import React, { useState, useEffect } from 'react';
import { ArrowRight, Plus, X, Check, MapPin, Calendar, Clock, Loader2, User, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_BASE } from '../api/config';

const API = `${API_BASE}/nursing`;

const NursingView = () => {
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const lang = i18n.language === 'ar' ? 'ar' : 'en';
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBook, setShowBook] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [form, setForm] = useState({ date: '', time: '', address: '', notes: '' });

    // Fetch services & bookings
    const fetchData = async () => {
        try {
            const [sRes, bRes] = await Promise.all([
                fetch(`${API}/services`),
                fetch(`${API}/bookings`),
            ]);
            if (sRes.ok) setServices(await sRes.json());
            if (bRes.ok) setBookings(await bRes.json());
        } catch (err) {
            console.error('Failed to load nursing data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleBook = async () => {
        if (!form.date || !form.address) return;
        try {
            const res = await fetch(`${API}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: showBook.id,
                    service_name: showBook.title,
                    date: form.date,
                    time: form.time,
                    address: form.address,
                    notes: form.notes,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setSuccessData({ ...data, service_name: showBook.title, price: showBook.price });
                setShowBook(null);
                setForm({ date: '', time: '', address: '', notes: '' });
                setShowSuccess(true);
                fetchData();
            }
        } catch (err) {
            console.error('Failed to book:', err);
        }
    };

    const handleCancel = async (id) => {
        try {
            await fetch(`${API}/bookings/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (err) {
            console.error('Failed to cancel booking:', err);
        }
    };

    const statusColors = {
        confirmed: 'bg-emerald-100 text-emerald-600',
        pending: 'bg-amber-100 text-amber-600',
        completed: 'bg-blue-100 text-blue-600',
        cancelled: 'bg-red-100 text-red-500',
    };
    const statusLabels = {
        confirmed: lang === 'ar' ? 'مؤكد' : 'Confirmed',
        pending: lang === 'ar' ? 'قيد الانتظار' : 'Pending',
        completed: lang === 'ar' ? 'تم' : 'Done',
        cancelled: lang === 'ar' ? 'ملغى' : 'Cancelled',
    };

    if (loading) return (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-emerald" /></div>
    );

    return (
        <div className="space-y-5 pb-4">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-xl shadow-sm">
                    <ArrowRight className="w-5 h-5 rtl:rotate-0 rotate-180 text-gray-500" />
                </button>
                <h2 className="text-2xl font-black text-primary-dark">
                    {lang === 'ar' ? 'التمريض المنزلي' : 'Home Nursing'}
                </h2>
            </div>

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccess && successData && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="fixed top-16 right-4 left-4 z-[1100] bg-emerald-500 text-white p-5 rounded-2xl shadow-xl">
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="bg-white/20 p-2 rounded-full"><Check className="w-6 h-6" /></div>
                            <p className="font-black text-lg">{lang === 'ar' ? 'تم الحجز بنجاح!' : 'Booked!'}</p>
                            <p className="text-sm text-white/90 font-bold">
                                {lang === 'ar' ? 'الممرضة: ' : 'Nurse: '}{successData.nurse_name}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Services Grid */}
            <div>
                <h3 className="text-sm font-black text-gray-500 mb-3">{lang === 'ar' ? 'الخدمات المتاحة' : 'Available Services'}</h3>
                <div className="grid grid-cols-2 gap-3">
                    {services.map((svc, i) => (
                        <motion.button key={svc.id}
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setShowBook(svc)}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 text-center active:scale-95 transition hover:shadow flex flex-col items-center gap-3">
                            <div className={`text-3xl w-12 h-12 bg-gradient-to-br ${svc.color} rounded-xl flex items-center justify-center text-white`}>
                                <span>{svc.icon}</span>
                            </div>
                            <h4 className="font-bold text-sm text-primary-dark leading-tight">{svc.title}</h4>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Bookings */}
            {bookings.length > 0 && (
                <div>
                    <h3 className="text-sm font-black text-gray-500 mb-3">{lang === 'ar' ? 'حجوزاتي' : 'My Bookings'}</h3>
                    <div className="space-y-2">
                        {bookings.map((b, i) => (
                            <motion.div key={b.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-sm text-primary-dark">{b.service_name}</h4>
                                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${statusColors[b.status] || 'bg-gray-100 text-gray-500'}`}>
                                        {statusLabels[b.status] || b.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-[11px] text-gray-400">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.date}</span>
                                    {b.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.time}</span>}
                                    {b.nurse_name && <span className="flex items-center gap-1"><User className="w-3 h-3" />{b.nurse_name}</span>}
                                </div>
                                {b.status !== 'cancelled' && b.status !== 'completed' && (
                                    <button onClick={() => handleCancel(b.id)} className="mt-2 text-red-400 text-[11px] font-bold hover:text-red-600 transition">
                                        {lang === 'ar' ? 'إلغاء الحجز' : 'Cancel'}
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Booking Modal */}
            <AnimatePresence>
                {showBook && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm" onClick={() => setShowBook(null)}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}>
                            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex justify-between items-center z-10">
                                <div>
                                    <h3 className="text-lg font-black text-primary-dark">{lang === 'ar' ? 'حجز خدمة' : 'Book Service'}</h3>
                                    <p className="text-sm text-gray-400 font-bold">{showBook.title}</p>
                                </div>
                                <button onClick={() => setShowBook(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-400" /></button>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2">{lang === 'ar' ? 'التاريخ *' : 'Date *'}</label>
                                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                        className="w-full bg-gray-50 p-3 rounded-xl border-2 border-gray-100 focus:border-primary-emerald outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2">{lang === 'ar' ? 'الوقت المفضل' : 'Preferred Time'}</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['09:00', '10:00', '11:00', '14:00', '16:00', '18:00'].map(t => (
                                            <button key={t} onClick={() => setForm(f => ({ ...f, time: t }))}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition border-2 ${form.time === t ? 'border-primary-emerald bg-primary-emerald/5 text-primary-emerald' : 'border-gray-100 text-gray-400'}`}>
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2">{lang === 'ar' ? 'العنوان *' : 'Address *'}</label>
                                    <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                        placeholder={lang === 'ar' ? 'أدخل عنوانك بالتفصيل' : 'Enter your address'}
                                        className="w-full bg-gray-50 p-3 rounded-xl border-2 border-gray-100 focus:border-primary-emerald outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2">{lang === 'ar' ? 'ملاحظات' : 'Notes'}</label>
                                    <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                        placeholder={lang === 'ar' ? 'أي ملاحظات...' : 'Any notes...'}
                                        rows={2} className="w-full bg-gray-50 p-3 rounded-xl border-2 border-gray-100 focus:border-primary-emerald outline-none text-sm resize-none" />
                                </div>
                                <button onClick={handleBook} disabled={!form.date || !form.address}
                                    className="w-full bg-gradient-to-l from-primary-dark to-primary-emerald text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-200/50 disabled:opacity-50 active:scale-[0.98] transition">
                                    <Check className="w-5 h-5" /> {lang === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NursingView;
