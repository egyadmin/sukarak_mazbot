import { useState, useEffect, useCallback } from 'react';
import {
    LayoutDashboard, TestTube, Users, Calendar, Clock, MapPin,
    Plus, X, Check, Trash2, Edit3, Search, LogOut, MoreVertical,
    ChevronDown, Activity, Phone, Mail, TrendingUp, Eye, EyeOff,
    Shield, Briefcase, UserCheck, Menu, Send, CalendarCheck, Navigation,
    FlaskConical, Droplets, Pill
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../api/config';

const API = `${API_BASE}/lab`;

const statusConfig = {
    pending: { label: 'قيد الانتظار', labelEn: 'Pending', color: 'bg-amber-500', text: 'text-amber-500', light: 'bg-amber-500/10', border: 'border-amber-500/30' },
    confirmed: { label: 'مؤكد', labelEn: 'Confirmed', color: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-500/10', border: 'border-blue-500/30' },
    completed: { label: 'مكتمل', labelEn: 'Completed', color: 'bg-emerald-500', text: 'text-emerald-500', light: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    cancelled: { label: 'ملغي', labelEn: 'Cancelled', color: 'bg-red-500', text: 'text-red-500', light: 'bg-red-500/10', border: 'border-red-500/30' },
};

const testCategories = [
    { key: 'blood', icon: '🩸', label: 'تحاليل الدم' },
    { key: 'diabetes', icon: '🔬', label: 'تحاليل السكري' },
    { key: 'hormones', icon: '💊', label: 'تحاليل الغدة والهرمونات' },
    { key: 'liver_kidney', icon: '🧪', label: 'تحاليل الكبد والكلى' },
    { key: 'vitamins', icon: '💉', label: 'تحاليل الفيتامينات والمعادن' },
    { key: 'other', icon: '📋', label: 'خدمات أخرى' },
];

const LabDashboard = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState('dashboard');
    const [sideOpen, setSideOpen] = useState(true);
    const [stats, setStats] = useState({});
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [searchQ, setSearchQ] = useState('');
    const [toast, setToast] = useState('');
    const [bookingFilter, setBookingFilter] = useState('all');

    // Service form
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [serviceForm, setServiceForm] = useState({ title: '', title_en: '', price: '', duration: '', icon: '🧪', category: 'blood', price_eg: '', price_sa: '', price_ae: '', price_kw: '' });
    const [editingServiceId, setEditingServiceId] = useState(null);

    // Technician form
    const [showTechForm, setShowTechForm] = useState(false);
    const [techForm, setTechForm] = useState({ name: '', email: '', phone: '', password: '' });

    // Schedule modal
    const [scheduleModal, setScheduleModal] = useState(null);
    const [scheduleForm, setScheduleForm] = useState({ date: '', time: '', technician_name: '' });

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
    const fmt = (iso) => {
        if (!iso) return '—';
        try {
            const d = new Date(iso);
            return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch { return iso; }
    };

    const fetchAll = useCallback(async () => {
        try {
            const [statsRes, svcRes, bookRes, techRes] = await Promise.all([
                fetch(`${API}/stats`), fetch(`${API}/services`),
                fetch(`${API}/bookings`), fetch(`${API}/technicians`),
            ]);
            if (statsRes.ok) setStats(await statsRes.json());
            if (svcRes.ok) setServices(await svcRes.json());
            if (bookRes.ok) setBookings(await bookRes.json());
            if (techRes.ok) setTechnicians(await techRes.json());
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // Service CRUD
    const saveService = async () => {
        const url = editingServiceId ? `${API}/services/${editingServiceId}` : `${API}/services`;
        const method = editingServiceId ? 'PUT' : 'POST';
        const body = {
            ...serviceForm,
            price: parseFloat(serviceForm.price) || 0,
            price_eg: parseFloat(serviceForm.price_eg) || null,
            price_sa: parseFloat(serviceForm.price_sa) || null,
            price_ae: parseFloat(serviceForm.price_ae) || null,
            price_kw: parseFloat(serviceForm.price_kw) || null,
        };
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (res.ok) {
            showToast(editingServiceId ? 'تم تحديث الخدمة' : 'تم إضافة الخدمة');
            setShowServiceForm(false);
            setEditingServiceId(null);
            setServiceForm({ title: '', title_en: '', price: '', duration: '', icon: '🧪', category: 'blood', price_eg: '', price_sa: '', price_ae: '', price_kw: '' });
            fetchAll();
        }
    };

    const toggleService = async (id) => { await fetch(`${API}/services/${id}/toggle`, { method: 'PUT' }); fetchAll(); };
    const deleteService = async (id) => { await fetch(`${API}/services/${id}`, { method: 'DELETE' }); fetchAll(); showToast('تم حذف الخدمة'); };

    const editService = (s) => {
        setEditingServiceId(s.id);
        setServiceForm({
            title: s.title, title_en: s.title_en || '', price: s.price,
            duration: s.duration || '', icon: s.icon || '🧪', category: s.category || 'blood',
            price_eg: s.price_eg || '', price_sa: s.price_sa || '',
            price_ae: s.price_ae || '', price_kw: s.price_kw || '',
        });
        setShowServiceForm(true);
    };

    // Booking actions
    const updateBookingStatus = async (id, status, technician_name = null) => {
        const body = { status };
        if (technician_name) body.technician_name = technician_name;
        await fetch(`${API}/bookings/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        fetchAll();
        showToast(`تم تحديث حالة الحجز إلى ${statusConfig[status]?.label || status}`);
    };

    const assignTechnician = async (bookingId, techName) => {
        await fetch(`${API}/bookings/${bookingId}/assign`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ technician_name: techName }),
        });
        fetchAll(); showToast('تم تعيين الفني');
    };

    const openScheduleModal = (booking) => {
        setScheduleModal(booking);
        setScheduleForm({
            date: booking.date || '',
            time: booking.time || '',
            technician_name: booking.technician_name || '',
        });
    };

    const saveSchedule = async () => {
        if (!scheduleModal) return;
        await fetch(`${API}/bookings/${scheduleModal.id}/schedule`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scheduleForm),
        });
        setScheduleModal(null);
        fetchAll(); showToast('تم تحديث الموعد');
    };

    const deleteBooking = async (id) => { await fetch(`${API}/bookings/${id}`, { method: 'DELETE' }); fetchAll(); showToast('تم حذف الحجز'); };

    // Technician CRUD
    const addTechnician = async () => {
        const res = await fetch(`${API}/technicians`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(techForm) });
        if (res.ok) { setShowTechForm(false); setTechForm({ name: '', email: '', phone: '', password: '' }); fetchAll(); showToast('تم إضافة الفني'); }
        else { const e = await res.json(); showToast(e.detail || 'خطأ'); }
    };
    const toggleTechnician = async (id) => { await fetch(`${API}/technicians/${id}/toggle`, { method: 'PUT' }); fetchAll(); };
    const deleteTechnician = async (id) => { await fetch(`${API}/technicians/${id}`, { method: 'DELETE' }); fetchAll(); showToast('تم حذف الفني'); };

    const filteredBookings = bookings.filter(b => {
        const matchStatus = bookingFilter === 'all' || b.status === bookingFilter;
        const matchSearch = !searchQ || b.user_name?.includes(searchQ) || b.service_name?.includes(searchQ);
        return matchStatus && matchSearch;
    });

    const sideItems = [
        { key: 'dashboard', icon: LayoutDashboard, label: 'لوحة القيادة' },
        { key: 'bookings', icon: Calendar, label: 'الحجوزات' },
        { key: 'services', icon: FlaskConical, label: 'خدمات التحاليل' },
        { key: 'technicians', icon: Users, label: 'فريق المعمل' },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30" style={{ direction: 'rtl' }}>
            {/* Sidebar */}
            <aside className={`${sideOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 text-white transition-all duration-300 flex flex-col shadow-2xl`}>
                <div className="p-5 flex items-center gap-3 border-b border-white/10">
                    <div className="w-10 h-10 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center text-lg">🧪</div>
                    {sideOpen && <div><h2 className="font-black text-sm">لوحة المعمل</h2><p className="text-[10px] text-blue-200">إدارة التحاليل الطبية</p></div>}
                    <button onClick={() => setSideOpen(!sideOpen)} className="mr-auto text-white/60 hover:text-white"><Menu size={18} /></button>
                </div>
                <nav className="flex-1 p-3 space-y-1">
                    {sideItems.map(item => (
                        <button key={item.key} onClick={() => setTab(item.key)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${tab === item.key ? 'bg-white/15 text-white font-bold shadow-lg' : 'text-blue-200 hover:bg-white/5'}`}>
                            <item.icon size={18} />
                            {sideOpen && <span>{item.label}</span>}
                            {sideOpen && item.key === 'bookings' && stats.pending_bookings > 0 && (
                                <span className="mr-auto bg-red-500 text-[10px] px-2 py-0.5 rounded-full">{stats.pending_bookings}</span>
                            )}
                        </button>
                    ))}
                </nav>
                <div className="p-3 border-t border-white/10">
                    <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-blue-200 hover:bg-white/5">
                        <LogOut size={18} />{sideOpen && <span>العودة للتطبيق</span>}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
                {/* Top bar */}
                <div className="bg-white/80 backdrop-blur-xl border-b border-blue-100 px-6 py-4 sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-black text-blue-900">{sideItems.find(i => i.key === tab)?.label || 'لوحة القيادة'}</h1>
                            <p className="text-xs text-gray-400">إدارة التحاليل الطبية</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute right-3 top-2 w-4 h-4 text-gray-300" />
                                <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="بحث..."
                                    className="pr-9 pl-4 py-2 bg-gray-50 rounded-xl text-sm border-0 focus:ring-2 focus:ring-blue-200 w-56" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toast */}
                {toast && (
                    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-blue-900 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 font-bold text-sm animate-bounce">
                        ✅ {toast}
                    </div>
                )}

                <div className="p-6">
                    {/* ═══════════ DASHBOARD ═══════════ */}
                    {tab === 'dashboard' && (
                        <div className="space-y-6">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'إجمالي الخدمات', value: stats.total_services || 0, icon: FlaskConical, color: 'from-blue-500 to-indigo-500' },
                                    { label: 'حجوزات معلقة', value: stats.pending_bookings || 0, icon: Clock, color: 'from-amber-500 to-orange-500' },
                                    { label: 'حجوزات مكتملة', value: stats.completed_bookings || 0, icon: Check, color: 'from-emerald-500 to-teal-500' },
                                    { label: 'فريق المعمل', value: stats.technicians || 0, icon: Users, color: 'from-purple-500 to-violet-500' },
                                ].map((s, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 hover:shadow-md transition-all">
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                                            <s.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <p className="text-2xl font-black text-gray-800">{s.value}</p>
                                        <p className="text-xs text-gray-400">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Revenue Card */}
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm mb-1">إجمالي الإيرادات</p>
                                        <p className="text-3xl font-black">{(stats.revenue || 0).toLocaleString()} <span className="text-lg">ج.م</span></p>
                                    </div>
                                    <TrendingUp className="w-12 h-12 text-blue-200/40" />
                                </div>
                            </div>

                            {/* Recent Bookings */}
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
                                <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-500" /> آخر الحجوزات
                                </h3>
                                {bookings.slice(0, 5).map(b => {
                                    const cfg = statusConfig[b.status] || statusConfig.pending;
                                    return (
                                        <div key={b.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                            <div>
                                                <p className="font-bold text-sm text-gray-700">{b.user_name}</p>
                                                <p className="text-xs text-gray-400">{b.service_name} — {b.date}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${cfg.light} ${cfg.text} ${cfg.border} border`}>
                                                {cfg.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ═══════════ BOOKINGS ═══════════ */}
                    {tab === 'bookings' && (
                        <div className="space-y-4">
                            <div className="flex gap-2 flex-wrap">
                                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
                                    <button key={f} onClick={() => setBookingFilter(f)}
                                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${bookingFilter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border'}`}>
                                        {f === 'all' ? 'الكل' : statusConfig[f]?.label || f}
                                    </button>
                                ))}
                            </div>

                            {filteredBookings.length === 0 ? (
                                <div className="text-center py-16 text-gray-300">
                                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
                                    <p className="font-bold">لا توجد حجوزات</p>
                                </div>
                            ) : filteredBookings.map(b => {
                                const cfg = statusConfig[b.status] || statusConfig.pending;
                                return (
                                    <div key={b.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 hover:shadow-md transition space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-black text-gray-800">{b.user_name}</p>
                                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                                    <TestTube className="w-3.5 h-3.5" /> {b.service_name}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${cfg.light} ${cfg.text} ${cfg.border} border`}>
                                                {cfg.label}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                            <div className="bg-gray-50 p-2.5 rounded-xl flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                                <span className="text-gray-600 font-bold">{b.date || '—'}</span>
                                            </div>
                                            <div className="bg-gray-50 p-2.5 rounded-xl flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5 text-blue-400" />
                                                <span className="text-gray-600 font-bold">{b.time || '—'}</span>
                                            </div>
                                            <div className="bg-gray-50 p-2.5 rounded-xl flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                                                <span className="text-gray-600 font-bold truncate">{b.address || '—'}</span>
                                            </div>
                                        </div>
                                        {b.technician_name && (
                                            <div className="bg-blue-50 p-2.5 rounded-xl flex items-center gap-2 text-xs">
                                                <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                                                <span className="text-blue-700 font-bold">الفني: {b.technician_name}</span>
                                            </div>
                                        )}
                                        {b.notes && <p className="text-xs text-gray-400 bg-gray-50 p-2 rounded-lg">{b.notes}</p>}
                                        <div className="flex gap-2 flex-wrap">
                                            {b.status === 'pending' && (
                                                <>
                                                    <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1">
                                                        <Check size={14} /> تأكيد
                                                    </button>
                                                    <button onClick={() => updateBookingStatus(b.id, 'cancelled')} className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-[11px] font-bold flex items-center gap-1">
                                                        <X size={14} /> رفض
                                                    </button>
                                                </>
                                            )}
                                            {b.status === 'confirmed' && (
                                                <button onClick={() => updateBookingStatus(b.id, 'completed')} className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1">
                                                    <Check size={14} /> إتمام
                                                </button>
                                            )}
                                            <button onClick={() => openScheduleModal(b)} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-[11px] font-bold flex items-center gap-1">
                                                <CalendarCheck size={14} /> جدولة
                                            </button>
                                            {!b.technician_name && technicians.length > 0 && (
                                                <select onChange={e => e.target.value && assignTechnician(b.id, e.target.value)}
                                                    className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-[11px] font-bold border-0">
                                                    <option value="">تعيين فني</option>
                                                    {technicians.filter(t => t.is_active).map(t => (
                                                        <option key={t.id} value={t.name}>{t.name}</option>
                                                    ))}
                                                </select>
                                            )}
                                            <button onClick={() => deleteBooking(b.id)} className="px-3 py-1.5 text-red-400 rounded-lg text-[11px] font-bold">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ═══════════ SERVICES ═══════════ */}
                    {tab === 'services' && (
                        <div className="space-y-4">
                            <button onClick={() => { setEditingServiceId(null); setServiceForm({ title: '', title_en: '', price: '', duration: '', icon: '🧪', category: 'blood' }); setShowServiceForm(true); }}
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition">
                                <Plus size={16} /> إضافة خدمة تحاليل
                            </button>

                            {services.length === 0 ? (
                                <div className="text-center py-16 text-gray-300">
                                    <FlaskConical className="w-12 h-12 mx-auto mb-3 opacity-40" />
                                    <p className="font-bold">لا توجد خدمات بعد</p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {services.map(s => (
                                        <div key={s.id} className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-50 ${!s.active ? 'opacity-50' : ''}`}>
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-lg">{s.icon || '🧪'}</div>
                                                    <div>
                                                        <p className="font-black text-gray-800 text-sm">{s.title}</p>
                                                        {s.title_en && <p className="text-[10px] text-gray-400">{s.title_en}</p>}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => editService(s)} className="p-1.5 text-gray-400 hover:text-blue-500"><Edit3 size={14} /></button>
                                                    <button onClick={() => toggleService(s.id)} className="p-1.5 text-gray-400 hover:text-amber-500">
                                                        {s.active ? <Eye size={14} /> : <EyeOff size={14} />}
                                                    </button>
                                                    <button onClick={() => deleteService(s.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg font-bold">
                                                    {testCategories.find(c => c.key === s.category)?.label || s.category}
                                                </span>
                                                <span className="font-black text-blue-700 text-lg">{s.price} <span className="text-xs">ج.م</span></span>
                                            </div>
                                            {(s.price_eg || s.price_sa || s.price_ae || s.price_kw) && (
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {s.price_eg && <span className="text-[10px] bg-gray-50 px-2 py-0.5 rounded-lg text-gray-500">🇪🇬 {s.price_eg}</span>}
                                                    {s.price_sa && <span className="text-[10px] bg-gray-50 px-2 py-0.5 rounded-lg text-gray-500">🇸🇦 {s.price_sa}</span>}
                                                    {s.price_ae && <span className="text-[10px] bg-gray-50 px-2 py-0.5 rounded-lg text-gray-500">🇦🇪 {s.price_ae}</span>}
                                                    {s.price_kw && <span className="text-[10px] bg-gray-50 px-2 py-0.5 rounded-lg text-gray-500">🇰🇼 {s.price_kw}</span>}
                                                </div>
                                            )}
                                            {s.duration && <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1"><Clock size={10} /> {s.duration}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══════════ TECHNICIANS ═══════════ */}
                    {tab === 'technicians' && (
                        <div className="space-y-4">
                            <button onClick={() => { setTechForm({ name: '', email: '', phone: '', password: '' }); setShowTechForm(true); }}
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg">
                                <Plus size={16} /> إضافة فني معمل
                            </button>

                            {technicians.length === 0 ? (
                                <div className="text-center py-16 text-gray-300">
                                    <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
                                    <p className="font-bold">لا يوجد فنيون بعد</p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {technicians.map(t => (
                                        <div key={t.id} className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-50 ${!t.is_active ? 'opacity-50' : ''}`}>
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-xl flex items-center justify-center font-black text-sm">
                                                        {t.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-800 text-sm">{t.name}</p>
                                                        <p className="text-[10px] text-gray-400 flex items-center gap-1"><Mail size={10} /> {t.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => toggleTechnician(t.id)} className="p-1.5 text-gray-400 hover:text-amber-500">{t.is_active ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                                                    <button onClick={() => deleteTechnician(t.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                {t.phone && <span className="flex items-center gap-1"><Phone size={10} /> {t.phone}</span>}
                                                <span className={`mr-auto px-2 py-0.5 rounded-full text-[10px] font-bold ${t.is_active ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                                                    {t.is_active ? 'نشط' : 'معطل'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main >

            {/* ═══════════ MODALS ═══════════ */}

            {/* Service Form Modal */}
            {
                showServiceForm && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4" style={{ direction: 'rtl' }}>
                            <div className="flex items-center justify-between">
                                <h3 className="font-black text-lg text-blue-900">{editingServiceId ? 'تعديل الخدمة' : 'إضافة خدمة'}</h3>
                                <button onClick={() => setShowServiceForm(false)} className="p-2 text-gray-400 hover:text-red-500"><X size={20} /></button>
                            </div>
                            <input value={serviceForm.title} onChange={e => setServiceForm(f => ({ ...f, title: e.target.value }))}
                                placeholder="اسم الخدمة (عربي)" className="w-full p-3 border rounded-xl text-sm" />
                            <input value={serviceForm.title_en} onChange={e => setServiceForm(f => ({ ...f, title_en: e.target.value }))}
                                placeholder="Service name (English)" className="w-full p-3 border rounded-xl text-sm" dir="ltr" />
                            <div className="grid grid-cols-2 gap-3">
                                <input value={serviceForm.price} onChange={e => setServiceForm(f => ({ ...f, price: e.target.value }))}
                                    placeholder="السعر" type="number" className="p-3 border rounded-xl text-sm" />
                                <input value={serviceForm.duration} onChange={e => setServiceForm(f => ({ ...f, duration: e.target.value }))}
                                    placeholder="المدة (مثال: 30 دقيقة)" className="p-3 border rounded-xl text-sm" />
                            </div>
                            <select value={serviceForm.category} onChange={e => setServiceForm(f => ({ ...f, category: e.target.value }))}
                                className="w-full p-3 border rounded-xl text-sm">
                                {testCategories.map(c => <option key={c.key} value={c.key}>{c.icon} {c.label}</option>)}
                            </select>
                            <div className="flex gap-2">
                                {['🧪', '🩸', '💊', '🔬', '📋', '💉'].map(icon => (
                                    <button key={icon} onClick={() => setServiceForm(f => ({ ...f, icon }))}
                                        className={`w-10 h-10 rounded-xl border-2 text-lg flex items-center justify-center ${serviceForm.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-100'}`}>
                                        {icon}
                                    </button>
                                ))}
                            </div>
                            {/* Country-based pricing */}
                            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 space-y-2">
                                <p className="text-xs font-bold text-blue-700">🌍 أسعار حسب الدولة (اختياري)</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">🇪🇬</span>
                                        <input value={serviceForm.price_eg} onChange={e => setServiceForm(f => ({ ...f, price_eg: e.target.value }))}
                                            placeholder="مصر (ج.م)" type="number" className="flex-1 p-2 border rounded-lg text-xs" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">🇸🇦</span>
                                        <input value={serviceForm.price_sa} onChange={e => setServiceForm(f => ({ ...f, price_sa: e.target.value }))}
                                            placeholder="السعودية (ر.س)" type="number" className="flex-1 p-2 border rounded-lg text-xs" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">🇦🇪</span>
                                        <input value={serviceForm.price_ae} onChange={e => setServiceForm(f => ({ ...f, price_ae: e.target.value }))}
                                            placeholder="الإمارات (د.إ)" type="number" className="flex-1 p-2 border rounded-lg text-xs" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">🇰🇼</span>
                                        <input value={serviceForm.price_kw} onChange={e => setServiceForm(f => ({ ...f, price_kw: e.target.value }))}
                                            placeholder="الكويت (د.ك)" type="number" className="flex-1 p-2 border rounded-lg text-xs" />
                                    </div>
                                </div>
                            </div>
                            <button onClick={saveService} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm">
                                {editingServiceId ? 'تحديث' : 'إضافة'}
                            </button>
                        </div>
                    </div>
                )
            }

            {/* Technician Form Modal */}
            {
                showTechForm && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4" style={{ direction: 'rtl' }}>
                            <div className="flex items-center justify-between">
                                <h3 className="font-black text-lg text-blue-900">إضافة فني معمل</h3>
                                <button onClick={() => setShowTechForm(false)} className="p-2 text-gray-400 hover:text-red-500"><X size={20} /></button>
                            </div>
                            <input value={techForm.name} onChange={e => setTechForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="الاسم الكامل" className="w-full p-3 border rounded-xl text-sm" />
                            <input value={techForm.email} onChange={e => setTechForm(f => ({ ...f, email: e.target.value }))}
                                placeholder="البريد الإلكتروني" type="email" className="w-full p-3 border rounded-xl text-sm" dir="ltr" />
                            <input value={techForm.phone} onChange={e => setTechForm(f => ({ ...f, phone: e.target.value }))}
                                placeholder="رقم الهاتف" className="w-full p-3 border rounded-xl text-sm" dir="ltr" />
                            <input value={techForm.password} onChange={e => setTechForm(f => ({ ...f, password: e.target.value }))}
                                placeholder="كلمة المرور" type="password" className="w-full p-3 border rounded-xl text-sm" dir="ltr" />
                            <button onClick={addTechnician} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm">
                                إضافة الفني
                            </button>
                        </div>
                    </div>
                )
            }

            {/* Schedule Modal */}
            {
                scheduleModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4" style={{ direction: 'rtl' }}>
                            <div className="flex items-center justify-between">
                                <h3 className="font-black text-lg text-blue-900">جدولة الموعد</h3>
                                <button onClick={() => setScheduleModal(null)} className="p-2 text-gray-400 hover:text-red-500"><X size={20} /></button>
                            </div>
                            <p className="text-sm text-gray-500">{scheduleModal.user_name} — {scheduleModal.service_name}</p>
                            <div className="grid grid-cols-2 gap-3">
                                <input value={scheduleForm.date} onChange={e => setScheduleForm(f => ({ ...f, date: e.target.value }))}
                                    type="date" className="p-3 border rounded-xl text-sm" />
                                <input value={scheduleForm.time} onChange={e => setScheduleForm(f => ({ ...f, time: e.target.value }))}
                                    type="time" className="p-3 border rounded-xl text-sm" />
                            </div>
                            <select value={scheduleForm.technician_name} onChange={e => setScheduleForm(f => ({ ...f, technician_name: e.target.value }))}
                                className="w-full p-3 border rounded-xl text-sm">
                                <option value="">اختر الفني</option>
                                {technicians.filter(t => t.is_active).map(t => (
                                    <option key={t.id} value={t.name}>{t.name}</option>
                                ))}
                            </select>
                            <button onClick={saveSchedule} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm">
                                حفظ الموعد
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default LabDashboard;
