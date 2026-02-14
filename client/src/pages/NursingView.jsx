import { useState, useEffect } from 'react';
import { ArrowRight, Plus, X, Check, MapPin, Calendar, Clock, Loader2, User, Phone, Search, Syringe, HeartPulse, Bandage, MoreHorizontal, ShoppingCart, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_BASE } from '../api/config';
import bannerImg from '@assets/nursing_banner.png';

const SERVICES_API = `${API_BASE}/services/nursing/services`;
const BOOKINGS_API = `${API_BASE}/services/nursing/bookings`;

const nursingCategories = [
    { key: 'injections', icon: Syringe, label_ar: 'الحقن والمحاليل', label_en: 'Injections & IV', color: 'from-sky-400 to-blue-500', bg: 'bg-sky-50' },
    { key: 'monitoring', icon: HeartPulse, label_ar: 'متابعة السكر والضغط', label_en: 'Sugar & BP Monitoring', color: 'from-rose-400 to-pink-500', bg: 'bg-rose-50' },
    { key: 'wounds', icon: Bandage, label_ar: 'تضميد الجروح\nوالحروق', label_en: 'Wound &\nBurn Dressing', color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50' },
    { key: 'other', icon: MoreHorizontal, label_ar: 'خدمات أخرى', label_en: 'Other Services', color: 'from-violet-400 to-purple-500', bg: 'bg-violet-50' },
];

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
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchData = async () => {
        try {
            const [sRes, bRes] = await Promise.all([
                fetch(`${SERVICES_API}?service_type=nursing`),
                fetch(BOOKINGS_API),
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
            const res = await fetch(BOOKINGS_API, {
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
                setTimeout(() => setShowSuccess(false), 3000);
                fetchData();
            }
        } catch (err) {
            console.error('Failed to book:', err);
        }
    };

    const handleCancel = async (id) => {
        try {
            await fetch(`${BOOKINGS_API}/${id}`, { method: 'DELETE' });
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

    const filteredServices = services.filter(svc => {
        if (selectedCategory && svc.category !== selectedCategory) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return svc.title?.toLowerCase().includes(q) || svc.title_en?.toLowerCase().includes(q);
        }
        return true;
    });

    if (loading) return (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-emerald" /></div>
    );

    return (
        <div className="space-y-5 pb-4">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-xl shadow-sm" data-testid="button-back-nursing">
                    <ArrowRight className="w-5 h-5 rtl:rotate-0 rotate-180 text-gray-500" />
                </button>
                <h2 className="text-2xl font-black text-primary-dark">
                    {lang === 'ar' ? 'التمريض المنزلي' : 'Home Nursing'}
                </h2>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img src={bannerImg} alt="Home Nursing" className="w-full h-44 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <h3 className="text-lg font-black mb-1">{lang === 'ar' ? 'خدمات التمريض المنزلي' : 'Home Nursing Services'}</h3>
                    <p className="text-xs text-white/80">{lang === 'ar' ? 'اطلب ممرض/ة لمنزلك بأفضل الأسعار' : 'Book a nurse to your home at the best prices'}</p>
                </div>
            </div>

            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={lang === 'ar' ? 'ابحث عن الخدمات...' : 'Search services...'}
                    className="w-full bg-white py-3.5 px-12 rounded-2xl shadow-sm border border-gray-100 text-sm outline-none focus:border-primary-emerald/30 transition"
                    data-testid="input-search-nursing"
                />
                <Search className="w-4.5 h-4.5 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-4" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                {nursingCategories.map((cat, i) => {
                    const Icon = cat.icon;
                    return (
                        <motion.button
                            key={cat.key}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            onClick={() => setSelectedCategory(selectedCategory === cat.key ? null : cat.key)}
                            className={`relative bg-white p-5 rounded-2xl shadow-sm border text-center active:scale-95 transition hover:shadow-md flex flex-col items-center gap-3 ${selectedCategory === cat.key ? 'border-primary-emerald/40 ring-1 ring-primary-emerald/20' : 'border-gray-100'}`}
                            data-testid={`button-category-${cat.key}`}
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

            {filteredServices.length > 0 && (
                <div>
                    <h3 className="text-sm font-black text-gray-500 mb-3">{lang === 'ar' ? 'الخدمات المتاحة' : 'Available Services'}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {filteredServices.map((svc, i) => (
                            <motion.button key={svc.id}
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setShowBook(svc)}
                                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 text-center active:scale-95 transition hover:shadow flex flex-col items-center gap-2"
                                data-testid={`button-service-${svc.id}`}
                            >
                                <div className={`text-2xl w-12 h-12 bg-gradient-to-br ${svc.color || 'from-emerald-400 to-teal-500'} rounded-xl flex items-center justify-center text-white`}>
                                    <span>{svc.icon}</span>
                                </div>
                                <h4 className="font-bold text-sm text-primary-dark leading-tight">{svc.title}</h4>
                                <div className="flex items-center gap-1">
                                    <span className="text-sm font-black text-emerald-600">{svc.price}</span>
                                    <span className="text-[10px] text-gray-400">{lang === 'ar' ? 'ر.س' : 'SAR'}</span>
                                </div>
                                {svc.duration && <span className="text-[10px] text-gray-400">{svc.duration}</span>}
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}

            {filteredServices.length === 0 && !loading && (
                <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-200">
                    <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-bold text-sm">{lang === 'ar' ? 'لا توجد خدمات في هذا القسم' : 'No services in this category'}</p>
                </div>
            )}

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
                                <div className="flex items-center gap-4 text-[11px] text-gray-400 flex-wrap">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.date}</span>
                                    {b.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.time}</span>}
                                    {b.nurse_name && <span className="flex items-center gap-1"><User className="w-3 h-3" />{b.nurse_name}</span>}
                                </div>
                                {b.status !== 'cancelled' && b.status !== 'completed' && (
                                    <button onClick={() => handleCancel(b.id)} className="mt-2 text-red-400 text-[11px] font-bold hover:text-red-600 transition"
                                        data-testid={`button-cancel-booking-${b.id}`}>
                                        {lang === 'ar' ? 'إلغاء الحجز' : 'Cancel'}
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

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
                            {successData.price && (
                                <p className="text-sm text-white/80 font-bold">{lang === 'ar' ? 'المبلغ: ' : 'Amount: '}{successData.price} {lang === 'ar' ? 'ر.س' : 'SAR'}</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                                <div className="bg-gradient-to-l from-emerald-50 to-teal-50 p-4 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${showBook.color || 'from-emerald-400 to-teal-500'} rounded-xl flex items-center justify-center text-white text-xl`}>
                                            {showBook.icon}
                                        </div>
                                        <div>
                                            <p className="font-black text-primary-dark">{showBook.title}</p>
                                            {showBook.duration && <p className="text-[11px] text-gray-400">{showBook.duration}</p>}
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xl font-black text-emerald-600">{showBook.price}</p>
                                        <p className="text-[10px] text-gray-400">{lang === 'ar' ? 'ر.س' : 'SAR'}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2">{lang === 'ar' ? 'التاريخ *' : 'Date *'}</label>
                                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                        className="w-full bg-gray-50 p-3 rounded-xl border-2 border-gray-100 focus:border-primary-emerald outline-none text-sm"
                                        data-testid="input-booking-date" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2">{lang === 'ar' ? 'الوقت المفضل' : 'Preferred Time'}</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['09:00', '10:00', '11:00', '14:00', '16:00', '18:00'].map(t => (
                                            <button key={t} onClick={() => setForm(f => ({ ...f, time: t }))}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition border-2 ${form.time === t ? 'border-primary-emerald bg-primary-emerald/5 text-primary-emerald' : 'border-gray-100 text-gray-400'}`}
                                                data-testid={`button-time-${t}`}>
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2">{lang === 'ar' ? 'العنوان *' : 'Address *'}</label>
                                    <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                        placeholder={lang === 'ar' ? 'أدخل عنوانك بالتفصيل' : 'Enter your address'}
                                        className="w-full bg-gray-50 p-3 rounded-xl border-2 border-gray-100 focus:border-primary-emerald outline-none text-sm"
                                        data-testid="input-booking-address" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2">{lang === 'ar' ? 'ملاحظات' : 'Notes'}</label>
                                    <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                        placeholder={lang === 'ar' ? 'أي ملاحظات...' : 'Any notes...'}
                                        rows={2} className="w-full bg-gray-50 p-3 rounded-xl border-2 border-gray-100 focus:border-primary-emerald outline-none text-sm resize-none"
                                        data-testid="input-booking-notes" />
                                </div>

                                <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-500">{lang === 'ar' ? 'المبلغ المطلوب' : 'Total Amount'}</span>
                                    <span className="text-lg font-black text-emerald-600">{showBook.price} {lang === 'ar' ? 'ر.س' : 'SAR'}</span>
                                </div>

                                <button onClick={handleBook} disabled={!form.date || !form.address}
                                    className="w-full bg-gradient-to-l from-primary-dark to-primary-emerald text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-200/50 disabled:opacity-50 active:scale-[0.98] transition"
                                    data-testid="button-confirm-booking">
                                    <CreditCard className="w-5 h-5" /> {lang === 'ar' ? `تأكيد الحجز - ${showBook.price} ر.س` : `Confirm Booking - ${showBook.price} SAR`}
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
