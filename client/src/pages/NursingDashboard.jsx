import { useState, useEffect, useCallback } from 'react';
import {
    LayoutDashboard, Heart, Users, Calendar, Clock, MapPin,
    Plus, X, Check, Trash2, Edit3, Search, LogOut, MoreVertical,
    ToggleLeft, ToggleRight, Activity, DollarSign, ClipboardList,
    UserPlus, Phone, Mail, ChevronDown, Eye, AlertCircle,
    Stethoscope, FileText, Settings, Home, User, CheckCircle,
    XCircle, Star, TrendingUp, ChevronRight, RefreshCw, Save,
    Shield, Briefcase, UserCheck, Menu, Send, CalendarCheck, Navigation
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../api/config';

const API = `${API_BASE}/nursing`;

const statusConfig = {
    pending: { label: 'قيد الانتظار', labelEn: 'Pending', color: 'bg-amber-500', text: 'text-amber-500', light: 'bg-amber-500/10', border: 'border-amber-500/30' },
    confirmed: { label: 'مؤكد', labelEn: 'Confirmed', color: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-500/10', border: 'border-blue-500/30' },
    in_progress: { label: 'جاري التنفيذ', labelEn: 'In Progress', color: 'bg-purple-500', text: 'text-purple-500', light: 'bg-purple-500/10', border: 'border-purple-500/30' },
    completed: { label: 'مكتمل', labelEn: 'Completed', color: 'bg-emerald-500', text: 'text-emerald-500', light: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    cancelled: { label: 'ملغي', labelEn: 'Cancelled', color: 'bg-red-500', text: 'text-red-500', light: 'bg-red-500/10', border: 'border-red-500/30' },
};

const NursingDashboard = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState('overview');
    const [mobileMenu, setMobileMenu] = useState(false);
    const [stats, setStats] = useState(null);
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [nurses, setNurses] = useState([]);
    const [bookingFilter, setBookingFilter] = useState('all');
    const [expandedBooking, setExpandedBooking] = useState(null);
    const [toast, setToast] = useState('');
    const [loading, setLoading] = useState(true);

    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showNurseModal, setShowNurseModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(null);
    const [editingService, setEditingService] = useState(null);

    const [serviceForm, setServiceForm] = useState({ title: '', title_en: '', price: '', duration: '', icon: '', color: 'from-teal-500 to-emerald-500', service_type: 'nursing', category: 'other' });
    const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
    const [nurseForm, setNurseForm] = useState({ name: '', email: '', phone: '', password: '' });
    const [scheduleForm, setScheduleForm] = useState({ date: '', time: '', nurse_name: '', notes: '' });

    const nurseUser = JSON.parse(localStorage.getItem('admin_user') || '{}');

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) window.location.href = '/admin/login';
    }, []);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
    const fmt = (iso) => {
        if (!iso) return '--';
        try {
            return new Date(iso).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch { return iso; }
    };

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [st, sv, bk, nr] = await Promise.all([
                fetch(`${API}/stats`).then(r => r.json()),
                fetch(`${API}/services`).then(r => r.json()),
                fetch(`${API}/bookings`).then(r => r.json()),
                fetch(`${API}/nurses`).then(r => r.json()),
            ]);
            setStats(st);
            setServices(Array.isArray(sv) ? sv : []);
            setBookings(Array.isArray(bk) ? bk : []);
            setNurses(Array.isArray(nr) ? nr : []);
        } catch (e) { console.error(e); }
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const saveService = async () => {
        const body = { ...serviceForm, price: parseFloat(serviceForm.price) || 0 };
        if (editingService) {
            await fetch(`${API}/services/${editingService.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            showToast('تم تحديث الخدمة');
        } else {
            await fetch(`${API}/services`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            showToast('تم إضافة الخدمة');
        }
        setShowServiceModal(false);
        setEditingService(null);
        setServiceForm({ title: '', title_en: '', price: '', duration: '', icon: '', color: 'from-teal-500 to-emerald-500', service_type: 'nursing', category: 'other' });
        load();
    };

    const toggleService = async (id) => { await fetch(`${API}/services/${id}/toggle`, { method: 'PUT' }); load(); };
    const deleteService = async (id) => { if (!window.confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return; await fetch(`${API}/services/${id}`, { method: 'DELETE' }); showToast('تم حذف الخدمة'); load(); };

    const editService = (s) => {
        setEditingService(s);
        setServiceForm({ title: s.title, title_en: s.title_en || '', price: s.price || '', duration: s.duration || '', icon: s.icon || '', color: s.color || 'from-teal-500 to-emerald-500', service_type: s.service_type || 'nursing', category: s.category || 'other' });
        setShowServiceModal(true);
    };

    const updateBookingStatus = async (id, status, nurse_name) => {
        await fetch(`${API}/bookings/${id}/status`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, nurse_name })
        });
        showToast(`تم تحديث حالة الحجز: ${statusConfig[status]?.label}`);
        load();
    };

    const assignNurse = async (bookingId, nurseName) => {
        await fetch(`${API}/bookings/${bookingId}/assign`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nurse_name: nurseName })
        });
        showToast(`تم تعيين الممرض/ة: ${nurseName}`);
        load();
    };

    const openScheduleModal = (booking) => {
        setScheduleForm({
            date: booking.date || '',
            time: booking.time || '',
            nurse_name: booking.nurse_name || '',
            notes: booking.notes || '',
        });
        setShowScheduleModal(booking);
    };

    const saveSchedule = async () => {
        if (!showScheduleModal) return;
        await fetch(`${API}/bookings/${showScheduleModal.id}/schedule`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scheduleForm),
        });
        if (showScheduleModal.status === 'pending' && scheduleForm.nurse_name) {
            await fetch(`${API}/bookings/${showScheduleModal.id}/status`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'confirmed', nurse_name: scheduleForm.nurse_name }),
            });
        }
        showToast('تم تحديث موعد الحجز وتعيين الممرض/ة');
        setShowScheduleModal(null);
        load();
    };

    const deleteBooking = async (id) => { if (!window.confirm('هل أنت متأكد؟')) return; await fetch(`${API}/bookings/${id}`, { method: 'DELETE' }); showToast('تم حذف الحجز'); load(); };

    const addNurse = async () => {
        if (!nurseForm.name || !nurseForm.email) return;
        const res = await fetch(`${API}/nurses`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nurseForm) });
        if (res.ok) { showToast('تم إضافة الممرض/ة'); setShowNurseModal(false); setNurseForm({ name: '', email: '', phone: '', password: '' }); load(); }
        else { const e = await res.json(); showToast(e.detail || 'خطأ في الإضافة'); }
    };
    const toggleNurse = async (id) => { await fetch(`${API}/nurses/${id}/toggle`, { method: 'PUT' }); load(); };
    const deleteNurse = async (id) => { if (!window.confirm('هل أنت متأكد؟')) return; await fetch(`${API}/nurses/${id}`, { method: 'DELETE' }); showToast('تم حذف الممرض/ة'); load(); };

    const filteredBookings = bookingFilter === 'all' ? bookings : bookings.filter(b => b.status === bookingFilter);
    const glass = 'bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] shadow-2xl';
    const inputStyle = 'w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-teal-400/50 transition placeholder:text-white/20';

    const sideItems = [
        { id: 'overview', label: 'الإحصائيات', icon: LayoutDashboard },
        { id: 'bookings', label: 'الحجوزات', icon: ClipboardList, badge: bookings.filter(b => b.status === 'pending').length },
        { id: 'services', label: 'الخدمات', icon: Heart },
        { id: 'nurses', label: 'الممرضين', icon: UserCheck },
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex font-cairo" dir="rtl">
            {toast && <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-teal-500 text-white px-8 py-3 rounded-2xl shadow-xl z-[200] font-black animate-pulse">{toast}</div>}

            <aside className={`fixed lg:sticky top-0 z-50 h-screen w-72 bg-[#0c1322] border-l border-white/[0.06] flex flex-col transition-all ${mobileMenu ? 'right-0' : '-right-80 lg:right-0'}`}>
                <div className="p-6 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                            <Heart className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-black text-base">لوحة التمريض</h2>
                            <p className="text-[10px] text-white/30 font-bold">{nurseUser?.name || 'مدير التمريض'}</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {sideItems.map(s => (
                        <button key={s.id} onClick={() => { setTab(s.id); setMobileMenu(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition ${tab === s.id ? 'bg-gradient-to-l from-teal-500/20 to-emerald-500/10 text-teal-400 shadow-lg shadow-teal-500/5' : 'text-white/30 hover:text-white/50 hover:bg-white/[0.03]'}`}
                            data-testid={`button-tab-${s.id}`}>
                            <s.icon className="w-5 h-5" /> {s.label}
                            {s.badge > 0 && <span className="mr-auto bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black">{s.badge}</span>}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-white/[0.06]">
                    <button onClick={() => { localStorage.clear(); window.location.href = '/admin/login'; }} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition">
                        <LogOut className="w-5 h-5" /> تسجيل الخروج
                    </button>
                </div>
            </aside>
            {mobileMenu && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileMenu(false)} />}

            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 rounded-xl bg-white/[0.05]" onClick={() => setMobileMenu(true)}><Menu className="w-5 h-5" /></button>
                        <h1 className="text-xl md:text-2xl font-black">{sideItems.find(s => s.id === tab)?.label || 'لوحة التحكم'}</h1>
                    </div>
                    <button onClick={load} className="p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] transition" data-testid="button-refresh"><RefreshCw className="w-5 h-5 text-white/40" /></button>
                </header>

                {/* ═══════ OVERVIEW ═══════ */}
                {tab === 'overview' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'إجمالي الحجوزات', value: stats?.total_bookings || 0, icon: ClipboardList, gradient: 'from-blue-500 to-blue-600' },
                                { label: 'حجوزات اليوم', value: stats?.today_bookings || 0, icon: Calendar, gradient: 'from-emerald-500 to-teal-600' },
                                { label: 'إجمالي الإيرادات', value: `${stats?.total_revenue || 0} SAR`, icon: DollarSign, gradient: 'from-teal-500 to-cyan-600' },
                                { label: 'الخدمات النشطة', value: stats?.active_services || 0, icon: Heart, gradient: 'from-rose-500 to-pink-600' },
                            ].map((s, i) => (
                                <div key={i} className={`bg-gradient-to-br ${s.gradient} p-5 rounded-3xl shadow-xl`} data-testid={`card-stat-${i}`}>
                                    <s.icon className="w-7 h-7 opacity-30 mb-3" />
                                    <p className="text-2xl font-black">{s.value}</p>
                                    <p className="text-white/60 text-xs font-bold mt-1">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={`${glass} rounded-3xl p-6`}>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-black">آخر الحجوزات</h3>
                                    <button onClick={() => setTab('bookings')} className="text-teal-400 text-xs font-bold flex items-center gap-1">عرض الكل <ChevronRight className="w-3 h-3 rotate-180" /></button>
                                </div>
                                {bookings.length === 0 ? (
                                    <div className="text-center py-8">
                                        <ClipboardList className="w-12 h-12 mx-auto opacity-10 mb-3" />
                                        <p className="text-white/20 text-sm">لا توجد حجوزات</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {bookings.slice(0, 5).map(b => {
                                            const sc = statusConfig[b.status] || statusConfig.pending;
                                            return (
                                                <div key={b.id} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0" data-testid={`card-recent-booking-${b.id}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-sm font-black">{b.user_name?.[0] || '?'}</div>
                                                        <div>
                                                            <p className="text-sm font-bold">{b.user_name}</p>
                                                            <p className="text-[10px] text-white/25">{b.service_name} - {b.date}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`${sc.light} ${sc.text} px-2 py-0.5 rounded-lg text-[9px] font-black`}>{sc.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className={`${glass} rounded-3xl p-6`}>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-black">فريق التمريض</h3>
                                    <button onClick={() => setTab('nurses')} className="text-teal-400 text-xs font-bold flex items-center gap-1">إدارة <ChevronRight className="w-3 h-3 rotate-180" /></button>
                                </div>
                                {nurses.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Users className="w-12 h-12 mx-auto opacity-10 mb-3" />
                                        <p className="text-white/20 text-sm">لم يتم إضافة ممرضين بعد</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {nurses.map(n => (
                                            <div key={n.id} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center text-sm font-black text-teal-400">{n.name?.[0]}</div>
                                                    <div>
                                                        <p className="text-sm font-bold">{n.name}</p>
                                                        <p className="text-[10px] text-white/25">{n.email}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${n.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{n.is_active ? 'نشط' : 'غير نشط'}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`${glass} rounded-3xl p-6`}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-black">الخدمات المتاحة</h3>
                                <button onClick={() => setTab('services')} className="text-teal-400 text-xs font-bold flex items-center gap-1">إدارة <ChevronRight className="w-3 h-3 rotate-180" /></button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {services.filter(s => s.active).map(s => (
                                    <div key={s.id} className="bg-white/[0.03] rounded-2xl p-4 text-center">
                                        <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${s.color || 'from-teal-500 to-emerald-500'} flex items-center justify-center mb-2 shadow-lg`}>
                                            <Stethoscope className="w-5 h-5 text-white/80" />
                                        </div>
                                        <p className="text-sm font-bold mt-1">{s.title}</p>
                                        <p className="text-xs text-teal-400 font-black">{s.price} SAR</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════ BOOKINGS ═══════ */}
                {tab === 'bookings' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                                { id: 'all', label: 'الكل', count: bookings.length, gradient: 'from-slate-500 to-slate-600' },
                                { id: 'pending', label: 'قيد الانتظار', count: bookings.filter(b => b.status === 'pending').length, gradient: 'from-amber-500 to-amber-600' },
                                { id: 'confirmed', label: 'مؤكد', count: bookings.filter(b => b.status === 'confirmed').length, gradient: 'from-blue-500 to-blue-600' },
                                { id: 'completed', label: 'مكتمل', count: bookings.filter(b => b.status === 'completed').length, gradient: 'from-emerald-500 to-emerald-600' },
                                { id: 'cancelled', label: 'ملغي', count: bookings.filter(b => b.status === 'cancelled').length, gradient: 'from-red-500 to-red-600' },
                            ].map(f => (
                                <button key={f.id} onClick={() => setBookingFilter(f.id)}
                                    className={`p-4 rounded-2xl text-xs font-black transition-all ${bookingFilter === f.id ? `bg-gradient-to-br ${f.gradient} shadow-lg scale-[1.02]` : 'bg-white/[0.05] text-white/40 hover:bg-white/[0.08]'}`}
                                    data-testid={`button-filter-${f.id}`}>
                                    <p className={`text-2xl font-black mb-1 ${bookingFilter === f.id ? 'text-white' : 'text-white/60'}`}>{f.count}</p>
                                    <p>{f.label}</p>
                                </button>
                            ))}
                        </div>

                        {filteredBookings.length === 0 ? (
                            <div className={`${glass} rounded-3xl p-16 text-center`}>
                                <ClipboardList className="w-16 h-16 mx-auto opacity-10 mb-4" />
                                <p className="text-white/30 font-bold text-lg">لا توجد حجوزات</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredBookings.map(b => {
                                    const sc = statusConfig[b.status] || statusConfig.pending;
                                    const isExpanded = expandedBooking === b.id;
                                    return (
                                        <div key={b.id} className={`${glass} rounded-3xl overflow-hidden transition-all ${isExpanded ? 'ring-1 ring-teal-500/30' : ''}`} data-testid={`card-booking-${b.id}`}>
                                            <div className={`h-1.5 ${sc.color}`} />
                                            <div className="p-5 cursor-pointer" onClick={() => setExpandedBooking(isExpanded ? null : b.id)}>
                                                <div className="flex flex-wrap items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${sc.light}`}>
                                                            <ClipboardList className={`w-6 h-6 ${sc.text}`} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <p className="font-black">حجز #{b.id}</p>
                                                                <span className={`${sc.light} ${sc.text} px-2.5 py-0.5 rounded-lg text-[10px] font-black`}>{sc.label}</span>
                                                            </div>
                                                            <p className="text-xs text-white/30 mt-1">{fmt(b.created_at)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-2.5">
                                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-sm">{b.user_name?.[0] || '?'}</div>
                                                        <div>
                                                            <p className="text-sm font-bold">{b.user_name || 'عميل'}</p>
                                                            <p className="text-[10px] text-white/25">{b.service_name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-black text-teal-400">{b.service_price || 0} <span className="text-xs text-white/20">SAR</span></p>
                                                        <p className="text-[10px] text-white/30 flex items-center gap-1"><Calendar className="w-3 h-3" /> {b.date} {b.time && `- ${b.time}`}</p>
                                                    </div>
                                                    <ChevronDown className={`w-5 h-5 text-white/20 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div className="border-t border-white/[0.06]">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                                                        {/* Customer Details */}
                                                        <div className="p-5">
                                                            <h4 className="text-xs font-black text-white/30 mb-3 flex items-center gap-2"><User className="w-3.5 h-3.5" /> بيانات العميل</h4>
                                                            <div className="space-y-2.5">
                                                                <div className="flex items-center gap-2 text-sm"><User className="w-3.5 h-3.5 text-white/20" /><span className="font-bold">{b.user_name || '--'}</span></div>
                                                                <div className="flex items-center gap-2 text-sm"><Phone className="w-3.5 h-3.5 text-white/20" /><span className="text-white/50" dir="ltr">{b.user_phone || '--'}</span></div>
                                                                <div className="flex items-center gap-2 text-sm"><Mail className="w-3.5 h-3.5 text-white/20" /><span className="text-white/50" dir="ltr">{b.user_email || '--'}</span></div>
                                                                <div className="flex items-center gap-2 text-sm"><MapPin className="w-3.5 h-3.5 text-white/20" /><span className="text-white/50">{b.address || 'بدون عنوان'}</span></div>
                                                            </div>
                                                        </div>
                                                        {/* Service Details */}
                                                        <div className="p-5 md:border-r md:border-white/[0.06]">
                                                            <h4 className="text-xs font-black text-white/30 mb-3 flex items-center gap-2"><Heart className="w-3.5 h-3.5" /> تفاصيل الخدمة</h4>
                                                            <div className="space-y-2.5">
                                                                <div className="flex items-center gap-2 text-sm"><Stethoscope className="w-3.5 h-3.5 text-white/20" /><span className="font-bold">{b.service_name}</span></div>
                                                                <div className="flex items-center gap-2 text-sm"><DollarSign className="w-3.5 h-3.5 text-white/20" /><span className="text-teal-400 font-black">{b.service_price || 0} SAR</span></div>
                                                                <div className="flex items-center gap-2 text-sm"><FileText className="w-3.5 h-3.5 text-white/20" /><span className="text-white/50">{b.notes || 'بدون ملاحظات'}</span></div>
                                                            </div>
                                                        </div>
                                                        {/* Appointment & Nurse */}
                                                        <div className="p-5 md:border-r md:border-white/[0.06]">
                                                            <h4 className="text-xs font-black text-white/30 mb-3 flex items-center gap-2"><CalendarCheck className="w-3.5 h-3.5" /> الموعد والممرض/ة</h4>
                                                            <div className="space-y-2.5">
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <Calendar className="w-3.5 h-3.5 text-white/20" />
                                                                    <span className={`font-bold ${b.date ? 'text-white' : 'text-amber-400'}`}>{b.date || 'لم يحدد بعد'}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <Clock className="w-3.5 h-3.5 text-white/20" />
                                                                    <span className={`font-bold ${b.time ? 'text-white' : 'text-amber-400'}`}>{b.time || 'لم يحدد بعد'}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <UserCheck className="w-3.5 h-3.5 text-white/20" />
                                                                    {b.nurse_name ? (
                                                                        <span className="font-bold text-emerald-400">{b.nurse_name}</span>
                                                                    ) : (
                                                                        <span className="text-amber-400 text-xs font-bold">لم يتم تعيين ممرض/ة</span>
                                                                    )}
                                                                </div>
                                                                <button onClick={(e) => { e.stopPropagation(); openScheduleModal(b); }}
                                                                    className="mt-2 w-full bg-gradient-to-l from-teal-500 to-emerald-600 px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                                                                    data-testid={`button-schedule-${b.id}`}>
                                                                    <CalendarCheck className="w-4 h-4" /> تحديد/تعديل الموعد والممرض
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Actions Bar */}
                                                    <div className="p-5 border-t border-white/[0.06] bg-white/[0.02]">
                                                        <div className="flex flex-wrap gap-2 items-center">
                                                            {b.status === 'pending' && (
                                                                <>
                                                                    <button onClick={() => updateBookingStatus(b.id, 'confirmed')}
                                                                        className="bg-gradient-to-l from-blue-500 to-blue-600 px-5 py-2.5 rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5"
                                                                        data-testid={`button-confirm-${b.id}`}>
                                                                        <Check className="w-4 h-4" /> تأكيد الحجز
                                                                    </button>
                                                                    <button onClick={() => openScheduleModal(b)}
                                                                        className="bg-gradient-to-l from-teal-500 to-emerald-600 px-5 py-2.5 rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5"
                                                                        data-testid={`button-assign-schedule-${b.id}`}>
                                                                        <Send className="w-4 h-4" /> تعيين ممرض وتحديد موعد
                                                                    </button>
                                                                    <button onClick={() => updateBookingStatus(b.id, 'cancelled')}
                                                                        className="bg-white/[0.05] px-5 py-2.5 rounded-xl text-xs font-black text-red-400 flex items-center gap-1.5">
                                                                        <XCircle className="w-4 h-4" /> رفض
                                                                    </button>
                                                                </>
                                                            )}
                                                            {b.status === 'confirmed' && (
                                                                <>
                                                                    <button onClick={() => updateBookingStatus(b.id, 'in_progress')}
                                                                        className="bg-gradient-to-l from-purple-500 to-purple-600 px-5 py-2.5 rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5">
                                                                        <Navigation className="w-4 h-4" /> إرسال الممرض/ة
                                                                    </button>
                                                                    <button onClick={() => openScheduleModal(b)}
                                                                        className="bg-white/[0.05] px-5 py-2.5 rounded-xl text-xs font-black text-teal-400 flex items-center gap-1.5">
                                                                        <CalendarCheck className="w-4 h-4" /> تعديل الموعد
                                                                    </button>
                                                                </>
                                                            )}
                                                            {b.status === 'in_progress' && (
                                                                <button onClick={() => updateBookingStatus(b.id, 'completed')}
                                                                    className="bg-gradient-to-l from-emerald-500 to-teal-600 px-5 py-2.5 rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5">
                                                                    <CheckCircle className="w-4 h-4" /> إنهاء الخدمة
                                                                </button>
                                                            )}
                                                            <button onClick={() => deleteBooking(b.id)}
                                                                className="bg-white/[0.05] px-5 py-2.5 rounded-xl text-xs font-black text-red-400 mr-auto flex items-center gap-1.5">
                                                                <Trash2 className="w-4 h-4" /> حذف
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ═══════ SERVICES ═══════ */}
                {tab === 'services' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center flex-wrap gap-3">
                            <p className="text-white/30 text-sm">{services.length} خدمة</p>
                            <button onClick={() => { setEditingService(null); setServiceForm({ title: '', title_en: '', price: '', duration: '', icon: '', color: 'from-teal-500 to-emerald-500', service_type: 'nursing', category: 'other' }); setShowServiceModal(true); }}
                                className="bg-gradient-to-l from-teal-500 to-emerald-600 px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 shadow-lg shadow-teal-500/20" data-testid="button-add-service">
                                <Plus className="w-4 h-4" /> إضافة خدمة
                            </button>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {[
                                { key: 'all', label: 'الكل' },
                                { key: 'nursing', label: 'تمريض' },
                                { key: 'lab', label: 'تحاليل' },
                            ].map(f => (
                                <button key={f.key} onClick={() => setServiceTypeFilter(f.key)}
                                    className={`px-4 py-2 rounded-xl text-xs font-black transition ${serviceTypeFilter === f.key ? 'bg-teal-500 text-white' : 'bg-white/[0.05] text-white/40 hover:bg-white/[0.08]'}`}>
                                    {f.label}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {services.filter(s => serviceTypeFilter === 'all' || s.service_type === serviceTypeFilter).map(s => (
                                <div key={s.id} className={`${glass} rounded-3xl p-5 ${!s.active ? 'opacity-40' : ''}`} data-testid={`card-service-${s.id}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color || 'from-teal-500 to-emerald-500'} flex items-center justify-center shadow-lg`}>
                                                <Stethoscope className="w-6 h-6 text-white/80" />
                                            </div>
                                            <div>
                                                <p className="font-black">{s.title}</p>
                                                {s.title_en && <p className="text-xs text-white/25">{s.title_en}</p>}
                                                <div className="flex gap-1.5 mt-1 flex-wrap">
                                                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${s.service_type === 'lab' ? 'bg-sky-500/20 text-sky-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{s.service_type === 'lab' ? 'تحاليل' : 'تمريض'}</span>
                                                    {s.category && <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/30 font-bold">{s.category}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => editService(s)} className="p-2 rounded-lg hover:bg-white/[0.05]"><Edit3 className="w-4 h-4 text-white/30" /></button>
                                            <button onClick={() => toggleService(s.id)} className="p-2 rounded-lg hover:bg-white/[0.05]">{s.active ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-white/20" />}</button>
                                            <button onClick={() => deleteService(s.id)} className="p-2 rounded-lg hover:bg-white/[0.05]"><Trash2 className="w-4 h-4 text-red-400/50" /></button>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-teal-400 font-black text-lg">{s.price} <span className="text-xs text-white/20">SAR</span></span>
                                        {s.duration && <span className="text-[10px] text-white/20 bg-white/[0.03] px-2 py-1 rounded-lg flex items-center gap-1"><Clock className="w-3 h-3" /> {s.duration}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══════ NURSES ═══════ */}
                {tab === 'nurses' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <p className="text-white/30 text-sm">{nurses.length} ممرض/ة</p>
                            <button onClick={() => { setNurseForm({ name: '', email: '', phone: '', password: '' }); setShowNurseModal(true); }}
                                className="bg-gradient-to-l from-teal-500 to-emerald-600 px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 shadow-lg shadow-teal-500/20" data-testid="button-add-nurse">
                                <UserPlus className="w-4 h-4" /> إضافة ممرض/ة
                            </button>
                        </div>
                        {nurses.length === 0 ? (
                            <div className={`${glass} rounded-3xl p-16 text-center`}>
                                <Users className="w-16 h-16 mx-auto opacity-10 mb-4" />
                                <p className="text-white/30 font-bold text-lg">لم يتم إضافة ممرضين بعد</p>
                                <p className="text-white/15 text-sm mt-2">أضف أول ممرض/ة لفريقك</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {nurses.map(n => (
                                    <div key={n.id} className={`${glass} rounded-3xl p-5 ${!n.is_active ? 'opacity-40' : ''}`} data-testid={`card-nurse-${n.id}`}>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-xl font-black shadow-lg shadow-teal-500/20">{n.name?.[0]}</div>
                                            <div className="flex-1">
                                                <p className="font-black text-base">{n.name}</p>
                                                <p className="text-xs text-white/30">{n.email}</p>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black ${n.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{n.is_active ? 'نشط' : 'معلّق'}</span>
                                        </div>
                                        {n.phone && <p className="text-xs text-white/25 mb-3 flex items-center gap-1"><Phone className="w-3 h-3" /> <span dir="ltr">{n.phone}</span></p>}
                                        <div className="flex gap-2">
                                            <button onClick={() => toggleNurse(n.id)} className={`flex-1 py-2 rounded-xl text-xs font-black ${n.is_active ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{n.is_active ? 'تعليق' : 'تفعيل'}</button>
                                            <button onClick={() => deleteNurse(n.id)} className="py-2 px-3 rounded-xl text-xs font-black bg-red-500/10 text-red-400">حذف</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* ══ Schedule/Assign Modal ══ */}
            {showScheduleModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowScheduleModal(null)}>
                    <div className="bg-[#1e293b] rounded-3xl p-6 w-full max-w-lg border border-white/[0.1]" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-black text-lg">تحديد الموعد وتعيين الممرض/ة</h3>
                                <p className="text-white/30 text-xs mt-1">حجز #{showScheduleModal.id} - {showScheduleModal.user_name}</p>
                            </div>
                            <button onClick={() => setShowScheduleModal(null)} className="p-2 rounded-xl bg-white/[0.05]"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="bg-white/[0.03] rounded-2xl p-4 mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-sm">{showScheduleModal.user_name?.[0] || '?'}</div>
                                <div>
                                    <p className="text-sm font-bold">{showScheduleModal.user_name}</p>
                                    <p className="text-[10px] text-white/25">{showScheduleModal.service_name} - {showScheduleModal.service_price || 0} SAR</p>
                                </div>
                                <span className={`mr-auto ${(statusConfig[showScheduleModal.status] || statusConfig.pending).light} ${(statusConfig[showScheduleModal.status] || statusConfig.pending).text} px-2.5 py-0.5 rounded-lg text-[10px] font-black`}>
                                    {(statusConfig[showScheduleModal.status] || statusConfig.pending).label}
                                </span>
                            </div>
                            {showScheduleModal.address && (
                                <div className="mt-3 flex items-center gap-2 text-xs text-white/40">
                                    <MapPin className="w-3.5 h-3.5" /> {showScheduleModal.address}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white/30 text-[10px] font-black mb-1.5 flex items-center gap-1"><Calendar className="w-3 h-3" /> تاريخ الموعد *</label>
                                    <input type="date" className={inputStyle} value={scheduleForm.date} onChange={e => setScheduleForm({ ...scheduleForm, date: e.target.value })} data-testid="input-schedule-date" />
                                </div>
                                <div>
                                    <label className="block text-white/30 text-[10px] font-black mb-1.5 flex items-center gap-1"><Clock className="w-3 h-3" /> وقت الموعد *</label>
                                    <input type="time" className={inputStyle} value={scheduleForm.time} onChange={e => setScheduleForm({ ...scheduleForm, time: e.target.value })} data-testid="input-schedule-time" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-white/30 text-[10px] font-black mb-1.5 flex items-center gap-1"><UserCheck className="w-3 h-3" /> تعيين ممرض/ة *</label>
                                <select className={`${inputStyle} bg-[#1e293b]`} value={scheduleForm.nurse_name} onChange={e => setScheduleForm({ ...scheduleForm, nurse_name: e.target.value })} data-testid="select-nurse">
                                    <option value="">اختر الممرض/ة</option>
                                    {nurses.filter(n => n.is_active).map(n => <option key={n.id} value={n.name}>{n.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-white/30 text-[10px] font-black mb-1.5 flex items-center gap-1"><FileText className="w-3 h-3" /> ملاحظات إضافية</label>
                                <textarea className={`${inputStyle} h-20 resize-none`} value={scheduleForm.notes} onChange={e => setScheduleForm({ ...scheduleForm, notes: e.target.value })} placeholder="ملاحظات للممرض/ة..." data-testid="input-schedule-notes" />
                            </div>
                            <button onClick={saveSchedule} disabled={!scheduleForm.date || !scheduleForm.time || !scheduleForm.nurse_name}
                                className="w-full bg-gradient-to-l from-teal-500 to-emerald-600 py-3.5 rounded-xl font-black shadow-lg shadow-teal-500/20 disabled:opacity-40 flex items-center justify-center gap-2"
                                data-testid="button-save-schedule">
                                <Send className="w-5 h-5" /> تأكيد الموعد وإرسال الممرض/ة
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ Service Modal ══ */}
            {showServiceModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowServiceModal(false)}>
                    <div className="bg-[#1e293b] rounded-3xl p-6 w-full max-w-lg border border-white/[0.1]" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-lg">{editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}</h3>
                            <button onClick={() => setShowServiceModal(false)} className="p-2 rounded-xl bg-white/[0.05]"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white/30 text-[10px] font-black mb-1.5">نوع الخدمة *</label>
                                    <select className={`${inputStyle} bg-[#1e293b]`} value={serviceForm.service_type} onChange={e => setServiceForm({ ...serviceForm, service_type: e.target.value, category: 'other' })}>
                                        <option value="nursing">تمريض منزلي</option>
                                        <option value="lab">تحاليل طبية</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-white/30 text-[10px] font-black mb-1.5">التصنيف *</label>
                                    <select className={`${inputStyle} bg-[#1e293b]`} value={serviceForm.category} onChange={e => setServiceForm({ ...serviceForm, category: e.target.value })}>
                                        {serviceForm.service_type === 'nursing' ? (<>
                                            <option value="injections">الحقن والمحاليل</option>
                                            <option value="monitoring">متابعة السكر والضغط</option>
                                            <option value="wounds">تضميد الجروح</option>
                                            <option value="other">خدمات أخرى</option>
                                        </>) : (<>
                                            <option value="blood">تحاليل الدم</option>
                                            <option value="diabetes">تحاليل السكري</option>
                                            <option value="hormones">الغدة والهرمونات</option>
                                            <option value="liver_kidney">الكبد والكلى</option>
                                            <option value="vitamins">الفيتامينات والمعادن</option>
                                            <option value="other">أخرى</option>
                                        </>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-white/30 text-[10px] font-black mb-1.5">اسم الخدمة (عربي) *</label>
                                <input className={inputStyle} value={serviceForm.title} onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })} placeholder="مثل: رعاية منزلية" />
                            </div>
                            <div>
                                <label className="block text-white/30 text-[10px] font-black mb-1.5">اسم الخدمة (إنجليزي)</label>
                                <input className={inputStyle} value={serviceForm.title_en} onChange={e => setServiceForm({ ...serviceForm, title_en: e.target.value })} placeholder="Home Care" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white/30 text-[10px] font-black mb-1.5">السعر (SAR) *</label>
                                    <input type="number" className={inputStyle} value={serviceForm.price} onChange={e => setServiceForm({ ...serviceForm, price: e.target.value })} placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-white/30 text-[10px] font-black mb-1.5">المدة</label>
                                    <input className={inputStyle} value={serviceForm.duration} onChange={e => setServiceForm({ ...serviceForm, duration: e.target.value })} placeholder="ساعة واحدة" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-white/30 text-[10px] font-black mb-1.5">اللون</label>
                                <select className={`${inputStyle} bg-[#1e293b]`} value={serviceForm.color} onChange={e => setServiceForm({ ...serviceForm, color: e.target.value })}>
                                    <option value="from-teal-500 to-emerald-500">أخضر</option>
                                    <option value="from-blue-500 to-indigo-500">أزرق</option>
                                    <option value="from-purple-500 to-fuchsia-500">بنفسجي</option>
                                    <option value="from-rose-500 to-pink-500">وردي</option>
                                    <option value="from-sky-400 to-blue-500">سماوي</option>
                                    <option value="from-red-400 to-rose-500">أحمر</option>
                                    <option value="from-amber-400 to-orange-500">برتقالي</option>
                                    <option value="from-violet-400 to-purple-500">بنفسجي فاتح</option>
                                </select>
                            </div>
                            <button onClick={saveService} className="w-full bg-gradient-to-l from-teal-500 to-emerald-600 py-3 rounded-xl font-black shadow-lg shadow-teal-500/20">{editingService ? 'حفظ التعديلات' : 'إضافة الخدمة'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ Nurse Modal ══ */}
            {showNurseModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowNurseModal(false)}>
                    <div className="bg-[#1e293b] rounded-3xl p-6 w-full max-w-lg border border-white/[0.1]" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-lg">إضافة ممرض/ة جديد</h3>
                            <button onClick={() => setShowNurseModal(false)} className="p-2 rounded-xl bg-white/[0.05]"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-white/30 text-[10px] font-black mb-1.5">الاسم الكامل *</label>
                                <input className={inputStyle} value={nurseForm.name} onChange={e => setNurseForm({ ...nurseForm, name: e.target.value })} placeholder="اسم الممرض/ة" />
                            </div>
                            <div>
                                <label className="block text-white/30 text-[10px] font-black mb-1.5">البريد الإلكتروني *</label>
                                <input className={inputStyle} value={nurseForm.email} onChange={e => setNurseForm({ ...nurseForm, email: e.target.value })} placeholder="nurse@example.com" />
                            </div>
                            <div>
                                <label className="block text-white/30 text-[10px] font-black mb-1.5">رقم الهاتف</label>
                                <input className={inputStyle} value={nurseForm.phone} onChange={e => setNurseForm({ ...nurseForm, phone: e.target.value })} placeholder="+966..." />
                            </div>
                            <div>
                                <label className="block text-white/30 text-[10px] font-black mb-1.5">كلمة المرور</label>
                                <input type="password" className={inputStyle} value={nurseForm.password} onChange={e => setNurseForm({ ...nurseForm, password: e.target.value })} placeholder="أدخل كلمة مرور" />
                            </div>
                            <button onClick={addNurse} className="w-full bg-gradient-to-l from-teal-500 to-emerald-600 py-3 rounded-xl font-black shadow-lg shadow-teal-500/20">إضافة الممرض/ة</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NursingDashboard;
