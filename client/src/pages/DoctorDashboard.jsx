import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Calendar, Users, MessageSquare, Activity, Clock, Video, Phone, Check, X,
    Bell, Settings, LogOut, ChevronLeft, ChevronRight, Loader2, FileText,
    Pill, Eye, User, AlertTriangle, CheckCircle, XCircle, BarChart3,
    Stethoscope, ClipboardList, Plus, Search, RefreshCw, Home, Save, Edit3, Trash2,
    PhoneCall, PhoneOff, Mic, MicOff, Camera, CameraOff, Send, Maximize, Minimize, MoreVertical,
    ChevronDown, Menu, TrendingUp, Heart, DollarSign, UserCheck, Star
} from 'lucide-react';
import { API_BASE } from '../api/config';

const apptStatusConfig = {
    pending: { label: 'في الانتظار', color: 'bg-amber-500', text: 'text-amber-500', light: 'bg-amber-500/10', icon: '⏳' },
    scheduled: { label: 'مقبول', color: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-500/10', icon: '📅' },
    approved: { label: 'مقبول', color: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-500/10', icon: '✅' },
    completed: { label: 'مكتمل', color: 'bg-emerald-500', text: 'text-emerald-500', light: 'bg-emerald-500/10', icon: '✔️' },
    cancelled: { label: 'ملغي', color: 'bg-red-500', text: 'text-red-500', light: 'bg-red-500/10', icon: '❌' },
};

const apptTypeConfig = {
    video: { label: 'مكالمة فيديو', icon: '🎥', color: 'text-purple-400' },
    audio: { label: 'مكالمة صوتية', icon: '📞', color: 'text-blue-400' },
    chat: { label: 'محادثة', icon: '💬', color: 'text-teal-400' },
};

const DoctorDashboard = () => {
    const [doctor, setDoctor] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [mobileMenu, setMobileMenu] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [sessionRequests, setSessionRequests] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedAppt, setExpandedAppt] = useState(null);
    const [apptFilter, setApptFilter] = useState('all');
    const [patientSearch, setPatientSearch] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [toast, setToast] = useState('');

    const [activeConsultation, setActiveConsultation] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [consultTimer, setConsultTimer] = useState(0);
    const [patientJoined, setPatientJoined] = useState(false);
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const timerRef = useRef(null);
    const chatEndRef = useRef(null);
    const wsRef = useRef(null);
    const localVideoRef = useRef(null);
    const localStreamRef = useRef(null);

    // Settings state
    const [settingsSection, setSettingsSection] = useState('profile');
    const [profileForm, setProfileForm] = useState({ name: '', phone: '', email: '' });
    const [prices, setPrices] = useState({ video: '150', audio: '100', chat: '75' });
    const [workingHours, setWorkingHours] = useState([
        { day: 'الأحد', from: '09:00', to: '17:00', active: true },
        { day: 'الإثنين', from: '09:00', to: '17:00', active: true },
        { day: 'الثلاثاء', from: '09:00', to: '17:00', active: true },
        { day: 'الأربعاء', from: '09:00', to: '17:00', active: true },
        { day: 'الخميس', from: '09:00', to: '14:00', active: true },
        { day: 'الجمعة', from: '', to: '', active: false },
        { day: 'السبت', from: '', to: '', active: false },
    ]);
    const [savingSettings, setSavingSettings] = useState(false);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
    const fmt = (iso) => iso ? new Date(iso).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '--';
    const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : '--';
    const fmtTime = (iso) => iso ? new Date(iso).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : '--';

    useEffect(() => {
        const savedUser = localStorage.getItem('admin_user');
        if (savedUser) {
            const u = JSON.parse(savedUser);
            if (u.role !== 'doctor') { window.location.href = '/admin/login'; return; }
            setDoctor(u);
            setProfileForm({ name: u.name || '', phone: u.phone || '', email: u.email || '' });
            loadData(u.id);
        } else {
            window.location.href = '/admin/login';
        }
    }, []);

    const loadData = useCallback(async (doctorId) => {
        setLoading(true);
        try {
            const [apptRes, patRes, sessRes] = await Promise.all([
                fetch(`${API_BASE}/health/doctor/appointments?doctor_id=${doctorId}`),
                fetch(`${API_BASE}/health/doctor/patients?doctor_id=${doctorId}`),
                fetch(`${API_BASE}/health/session-requests`),
            ]);
            const apptData = await apptRes.json();
            const patData = await patRes.json();
            const sessData = await sessRes.json();
            setAppointments(Array.isArray(apptData) ? apptData : []);
            setPatients(Array.isArray(patData) ? patData : []);
            setSessionRequests(Array.isArray(sessData) ? sessData : []);
        } catch (err) { console.error(err); }
        setLoading(false);
    }, []);

    const handleApprove = async (id) => {
        try {
            await fetch(`${API_BASE}/health/appointments/${id}/approve`, { method: 'PUT' });
            showToast('تم قبول الموعد بنجاح');
            if (doctor) loadData(doctor.id);
        } catch (err) { console.error(err); }
    };

    const handleComplete = async (id) => {
        try {
            await fetch(`${API_BASE}/health/appointments/${id}/complete`, { method: 'PUT' });
            showToast('تم إنهاء الجلسة بنجاح');
            if (doctor) loadData(doctor.id);
        } catch (err) { console.error(err); }
    };

    const handleCancel = async (id) => {
        try {
            await fetch(`${API_BASE}/health/appointments/${id}/cancel`, { method: 'PUT' });
            showToast('تم إلغاء الموعد');
            if (doctor) loadData(doctor.id);
        } catch (err) { console.error(err); }
    };

    const filteredAppts = apptFilter === 'all' ? appointments : appointments.filter(a => a.status === apptFilter);
    const filteredPatients = patients.filter(p => !patientSearch || p.name?.toLowerCase().includes(patientSearch.toLowerCase()));

    const todayAppts = appointments.filter(a => {
        if (!a.scheduled_at) return false;
        const d = new Date(a.scheduled_at).toDateString();
        return d === new Date().toDateString();
    });
    const pendingAppts = appointments.filter(a => a.status === 'pending');
    const completedAppts = appointments.filter(a => a.status === 'completed');

    const handleApproveSession = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/health/appointments/${id}/approve-session`, { method: 'PUT' });
            if (res.ok) {
                const data = await res.json();
                showToast('تم قبول طلب الجلسة - جاري الدخول...');
                if (doctor) loadData(doctor.id);
                const sessionReq = sessionRequests.find(r => r.id === id);
                const appt = appointments.find(a => a.id === id);
                startConsultation({
                    id: id,
                    room_id: data.room_id,
                    patient_name: data.patient_name || sessionReq?.patient_name || appt?.patient_name || 'المريض',
                    appointment_type: sessionReq?.appointment_type || appt?.appointment_type || 'chat',
                });
            } else {
                showToast('حدث خطأ في قبول الجلسة');
            }
        } catch (err) { console.error(err); showToast('حدث خطأ في الاتصال'); }
    };

    const handleRejectSession = async (id) => {
        try {
            await fetch(`${API_BASE}/health/appointments/${id}/reject-session`, { method: 'PUT' });
            showToast('تم رفض طلب الجلسة');
            if (doctor) loadData(doctor.id);
        } catch (err) { console.error(err); }
    };

    const connectWebSocket = (roomId) => {
        if (!doctor) return;
        const wsUrl = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}${API_BASE}/chat/ws/${doctor.id}?name=${encodeURIComponent(doctor.name || 'الطبيب')}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;
        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'join_room', room_id: roomId }));
        };
        ws.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            if (msg.type === 'chat_message') {
                setChatMessages(prev => [...prev, {
                    id: Date.now(),
                    from: String(msg.user_id) === String(doctor.id) ? 'doctor' : 'patient',
                    name: msg.name,
                    text: msg.text,
                    time: new Date(msg.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
                }]);
            }
            if (msg.type === 'room_history') {
                setChatMessages(prev => {
                    const history = msg.messages.map(m => ({
                        id: m.timestamp,
                        from: String(m.user_id) === String(doctor.id) ? 'doctor' : 'patient',
                        name: m.name,
                        text: m.text,
                        time: new Date(m.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
                    }));
                    return [...prev.filter(m => m.from === 'system'), ...history];
                });
                if (msg.messages && msg.messages.some(m => String(m.user_id) !== String(doctor.id))) {
                    setPatientJoined(true);
                }
            }
            if (msg.type === 'user_joined' && String(msg.user_id) !== String(doctor.id)) {
                setPatientJoined(true);
            }
        };
        ws.onclose = () => { wsRef.current = null; };
    };

    const startMedia = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        } catch (err) { console.log('Media access error:', err); }
    };

    const stopMedia = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
    };

    const toggleMic = () => {
        if (localStreamRef.current) localStreamRef.current.getAudioTracks().forEach(t => t.enabled = !t.enabled);
        setMicOn(!micOn);
    };

    const toggleCam = () => {
        if (localStreamRef.current) localStreamRef.current.getVideoTracks().forEach(t => t.enabled = !t.enabled);
        setCamOn(!camOn);
    };

    const startConsultation = (apptData) => {
        const roomId = apptData.room_id || apptData.session_room_id;
        if (!roomId) {
            showToast('خطأ: لا يوجد رابط جلسة. حاول مرة أخرى.');
            return;
        }
        if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        stopMedia();
        setActiveConsultation({ ...apptData, room_id: roomId });
        setPatientJoined(false);
        setMicOn(true);
        setCamOn(true);
        setChatMessages([{ id: 1, from: 'system', text: `بدأت الجلسة مع ${apptData.patient_name || 'المريض'}`, time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) }]);
        setConsultTimer(0);
        timerRef.current = setInterval(() => setConsultTimer(t => t + 1), 1000);
        connectWebSocket(roomId);
        setTimeout(() => startMedia(), 500);
        setActiveTab('consultation');
    };

    const handleEndConsultation = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        stopMedia();
        if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
        if (activeConsultation?.id) {
            try { await fetch(`${API_BASE}/health/appointments/${activeConsultation.id}/end-session`, { method: 'PUT' }); } catch { }
        }
        setActiveConsultation(null);
        setChatMessages([]);
        setConsultTimer(0);
        setPatientJoined(false);
        setChatInput('');
        setActiveTab('sessions');
        if (doctor) loadData(doctor.id);
        showToast('تم إنهاء الجلسة بنجاح');
    };

    const handleSendChat = () => {
        if (!chatInput.trim()) return;
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && activeConsultation) {
            wsRef.current.send(JSON.stringify({
                type: 'chat_message',
                room_id: activeConsultation.room_id || activeConsultation.session_room_id,
                text: chatInput
            }));
        } else {
            setChatMessages(prev => [...prev, { id: Date.now(), from: 'doctor', name: doctor?.name, text: chatInput, time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) }]);
        }
        setChatInput('');
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    useEffect(() => {
        return () => {
            if (wsRef.current) wsRef.current.close();
            if (timerRef.current) clearInterval(timerRef.current);
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const formatTimer = (sec) => {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const glass = 'bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] shadow-2xl';

    const activeSessCount = appointments.filter(a => a.session_request === 'approved' && a.status === 'in_progress').length;
    const sideItems = [
        { id: 'dashboard', label: 'الرئيسية', icon: Home },
        { id: 'appointments', label: 'المواعيد', icon: Calendar, badge: pendingAppts.length },
        { id: 'sessions', label: 'الجلسات', icon: Video, badge: sessionRequests.filter(r => r.session_request === 'pending').length + activeSessCount },
        ...(activeConsultation ? [{ id: 'consultation', label: 'جلسة نشطة', icon: MessageSquare, badge: 0, highlight: true }] : []),
        { id: 'patients', label: 'المرضى', icon: Users },
        { id: 'settings', label: 'الإعدادات', icon: Settings },
    ];

    const now = new Date();
    const dateStr = now.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex font-cairo" dir="rtl">
            {/* Toast */}
            {toast && <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-8 py-3 rounded-2xl shadow-xl z-[200] font-black animate-pulse">{toast}</div>}

            {/* ══ Sidebar ══ */}
            <aside className={`fixed lg:sticky top-0 z-50 h-screen w-72 bg-[#0c1322] border-l border-white/[0.06] flex flex-col transition-all ${mobileMenu ? 'right-0' : '-right-80 lg:right-0'}`}>
                <div className="p-6 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Stethoscope className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-black text-base">لوحة الطبيب</h2>
                            <p className="text-[10px] text-white/30 font-bold">د. {doctor?.name || 'طبيب'}</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {sideItems.map(s => (
                        <button key={s.id} onClick={() => { setActiveTab(s.id); setMobileMenu(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition ${s.highlight ? 'bg-gradient-to-l from-emerald-500/20 to-teal-500/10 text-emerald-400 shadow-lg shadow-emerald-500/5 animate-pulse' : activeTab === s.id ? 'bg-gradient-to-l from-blue-500/20 to-indigo-500/10 text-blue-400 shadow-lg shadow-blue-500/5' : 'text-white/30 hover:text-white/50 hover:bg-white/[0.03]'}`}>
                            <s.icon className="w-5 h-5" /> {s.label}
                            {s.badge > 0 && <span className="mr-auto bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black">{s.badge}</span>}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-white/[0.06]">
                    <button onClick={() => { localStorage.removeItem('admin_user'); localStorage.removeItem('admin_token'); window.location.href = '/admin/login'; }} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition">
                        <LogOut className="w-5 h-5" /> تسجيل الخروج
                    </button>
                </div>
            </aside>
            {mobileMenu && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileMenu(false)} />}

            {/* ══ Mobile Bottom Navigation ══ */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#0c1322]/80 backdrop-blur-2xl border-t border-white/5 z-50 flex items-center justify-around px-4">
                {sideItems.map(s => (
                    <button 
                        key={s.id} 
                        onClick={() => setActiveTab(s.id)}
                        className={`flex flex-col items-center gap-1 transition-all ${activeTab === s.id ? 'text-blue-400' : 'text-white/20'}`}
                    >
                        <div className={`relative p-2 rounded-xl transition-all ${activeTab === s.id ? 'bg-blue-400/10' : ''}`}>
                            <s.icon className="w-6 h-6" />
                            {s.badge > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full font-black border-2 border-[#0c1322]">
                                    {s.badge}
                                </span>
                            )}
                        </div>
                        <span className="text-[9px] font-bold">{s.label}</span>
                    </button>
                ))}
                <button 
                    onClick={() => { localStorage.removeItem('admin_user'); window.location.href='/admin/login'; }}
                    className="flex flex-col items-center gap-1 text-red-400/40"
                >
                    <div className="p-2">
                        <LogOut className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-bold">خروج</span>
                </button>
            </nav>

            {/* ══ Main ══ */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-28 lg:pb-8">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 rounded-xl bg-white/[0.05]" onClick={() => setMobileMenu(true)}><Menu className="w-5 h-5" /></button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-black">أهلاً بك، د. {doctor?.name}</h1>
                            <p className="text-white/25 text-xs mt-1">{dateStr}</p>
                        </div>
                    </div>
                    <div className="flex gap-3 items-center">
                        <button onClick={() => doctor && loadData(doctor.id)} className="p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] transition"><RefreshCw className="w-5 h-5 text-white/40" /></button>
                        <button className="p-3 rounded-xl bg-white/[0.05] relative">
                            <Bell className="w-5 h-5 text-white/40" />
                            {pendingAppts.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[9px] flex items-center justify-center font-black">{pendingAppts.length}</span>}
                        </button>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center font-black">{doctor?.name?.[0]}</div>
                    </div>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
                    </div>
                ) : (
                    <>
                        {/* ═══════ DASHBOARD ═══════ */}
                        {activeTab === 'dashboard' && (
                            <div className="space-y-8">
                                {/* Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'مواعيد اليوم', value: todayAppts.length, icon: Calendar, gradient: 'from-blue-500 to-blue-600' },
                                        { label: 'إجمالي المرضى', value: patients.length, icon: Users, gradient: 'from-purple-500 to-purple-600' },
                                        { label: 'مواعيد معلقة', value: pendingAppts.length, icon: Clock, gradient: 'from-amber-500 to-amber-600' },
                                        { label: 'جلسات مكتملة', value: completedAppts.length, icon: CheckCircle, gradient: 'from-emerald-500 to-teal-600' },
                                    ].map((s, i) => (
                                        <div key={i} className={`bg-gradient-to-br ${s.gradient} p-5 rounded-3xl shadow-xl`}>
                                            <s.icon className="w-7 h-7 opacity-30 mb-3" />
                                            <p className="text-2xl font-black">{s.value}</p>
                                            <p className="text-white/60 text-xs font-bold mt-1">{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Pending Appointments */}
                                    <div className={`lg:col-span-2 ${glass} rounded-3xl p-6`}>
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-black">المواعيد المعلقة</h3>
                                            <button onClick={() => setActiveTab('appointments')} className="text-blue-400 text-xs font-bold">عرض الكل ←</button>
                                        </div>
                                        {pendingAppts.length === 0 ? (
                                            <div className="text-center py-12">
                                                <Calendar className="w-12 h-12 mx-auto opacity-10 mb-3" />
                                                <p className="text-white/20 font-bold">لا توجد مواعيد معلقة</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {pendingAppts.slice(0, 5).map(appt => {
                                                    const typeC = apptTypeConfig[appt.appointment_type] || apptTypeConfig.video;
                                                    return (
                                                        <div key={appt.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] transition">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center font-black text-sm">{appt.patient_name?.[0] || '?'}</div>
                                                                <div>
                                                                    <p className="font-bold text-sm">{appt.patient_name}</p>
                                                                    <p className="text-[10px] text-white/25">{typeC.icon} {typeC.label} • {fmt(appt.scheduled_at)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button onClick={() => handleApprove(appt.id)} className="px-4 py-2 bg-gradient-to-l from-emerald-500 to-emerald-600 rounded-xl text-xs font-black">قبول</button>
                                                                <button onClick={() => handleCancel(appt.id)} className="px-3 py-2 bg-white/[0.05] rounded-xl text-xs font-black text-red-400">رفض</button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Today's Schedule */}
                                    <div className={`${glass} rounded-3xl p-6`}>
                                        <h3 className="font-black mb-4">جدول اليوم</h3>
                                        {todayAppts.length === 0 ? (
                                            <div className="text-center py-12">
                                                <Clock className="w-12 h-12 mx-auto opacity-10 mb-3" />
                                                <p className="text-white/20 font-bold text-sm">لا توجد مواعيد اليوم</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {todayAppts.map(appt => {
                                                    const sc = apptStatusConfig[appt.status] || apptStatusConfig.pending;
                                                    return (
                                                        <div key={appt.id} className="p-3 rounded-xl bg-white/[0.03] border-r-2 border-blue-500">
                                                            <div className="flex justify-between items-center">
                                                                <p className="font-bold text-sm">{appt.patient_name}</p>
                                                                <span className={`${sc.light} ${sc.text} px-2 py-0.5 rounded-lg text-[9px] font-black`}>{sc.label}</span>
                                                            </div>
                                                            <p className="text-[10px] text-white/25 mt-1">🕐 {fmtTime(appt.scheduled_at)} • {appt.duration_minutes || 30} دقيقة</p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Recent Patients */}
                                <div className={`${glass} rounded-3xl p-6`}>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-black">آخر المرضى</h3>
                                        <button onClick={() => setActiveTab('patients')} className="text-blue-400 text-xs font-bold">عرض الكل ←</button>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {patients.slice(0, 8).map(p => (
                                            <div key={p.id} className="p-3 rounded-2xl bg-white/[0.03] text-center">
                                                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-sm font-black mb-2">{p.name?.[0]}</div>
                                                <p className="text-sm font-bold">{p.name}</p>
                                                <p className="text-[10px] text-white/25">{p.sugar_readings_count || 0} قراءة</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══════ SESSION REQUESTS ═══════ */}
                        {activeTab === 'sessions' && (
                            <div className="space-y-6">
                                {/* Active sessions (approved, can rejoin) */}
                                {(() => {
                                    const activeSessions = appointments.filter(a => a.session_request === 'approved' && a.status === 'in_progress');
                                    if (activeSessions.length === 0) return null;
                                    return (
                                        <div className="space-y-3">
                                            <h3 className="text-lg font-black flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                                                جلسات نشطة
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {activeSessions.map(sess => (
                                                    <div key={sess.id} className={`${glass} rounded-3xl p-6 border-emerald-500/20`}>
                                                        <div className="flex items-center gap-4 mb-4">
                                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-black text-xl">
                                                                {sess.patient_name?.[0]}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-lg">{sess.patient_name}</p>
                                                                <p className="text-emerald-400/60 text-xs">جلسة نشطة - {sess.appointment_type === 'chat' ? 'محادثة' : 'فيديو'}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => startConsultation({ id: sess.id, room_id: sess.session_room_id, patient_name: sess.patient_name, appointment_type: sess.appointment_type })}
                                                            className="w-full py-3 bg-gradient-to-l from-emerald-500 to-teal-600 rounded-2xl text-sm font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition flex items-center justify-center gap-2"
                                                        >
                                                            <Video className="w-4 h-4" /> الانضمام للجلسة
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}

                                <h3 className="text-xl font-black">طلبات بدء الجلسات الحالية</h3>
                                {sessionRequests.length === 0 ? (
                                    <div className={`${glass} rounded-3xl p-16 text-center`}>
                                        <Video className="w-16 h-16 mx-auto opacity-10 mb-4" />
                                        <p className="text-white/30 font-bold text-lg">لا توجد طلبات جلسات حالية</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {sessionRequests.map(req => (
                                            <div key={req.id} className={`${glass} rounded-3xl p-6 flex flex-col gap-4`}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-xl">
                                                        {req.patient_name?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-lg">{req.patient_name}</p>
                                                        <p className="text-white/40 text-xs">طلب بدء جلسة {req.appointment_type === 'chat' ? 'محادثة' : 'فيديو'}</p>
                                                    </div>
                                                </div>
                                                {req.notes && (
                                                    <div className="bg-white/5 p-3 rounded-xl text-xs text-white/60 italic">
                                                        " {req.notes} "
                                                    </div>
                                                )}
                                                <div className="flex gap-2 mt-2">
                                                    <button 
                                                        onClick={() => handleApproveSession(req.id)}
                                                        className="flex-1 py-3 bg-gradient-to-l from-emerald-500 to-emerald-600 rounded-2xl text-sm font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition"
                                                    >
                                                        قبول وبدء الجلسة
                                                    </button>
                                                    <button 
                                                        onClick={() => handleRejectSession(req.id)}
                                                        className="px-6 py-3 bg-white/5 hover:bg-red-500/10 rounded-2xl text-sm font-black text-red-400 border border-white/5 transition"
                                                    >
                                                        رفض
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ═══════ ACTIVE CONSULTATION ═══════ */}
                        {activeTab === 'consultation' && activeConsultation && (
                            <div className="space-y-4">
                                <div className={`${glass} rounded-3xl overflow-hidden`}>
                                    <div className="bg-gradient-to-l from-emerald-600 to-teal-600 p-4 flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black text-lg">
                                                {activeConsultation.patient_name?.[0] || '?'}
                                            </div>
                                            <div>
                                                <p className="font-black text-sm">{activeConsultation.patient_name}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-white/60">
                                                    <span className="flex items-center gap-1">
                                                        <span className={`w-2 h-2 rounded-full ${patientJoined ? 'bg-green-300 animate-pulse' : 'bg-white/30'}`} />
                                                        {patientJoined ? 'المريض متصل' : 'بانتظار المريض'}
                                                    </span>
                                                    <span>|</span>
                                                    <Clock className="w-3 h-3" />
                                                    <span className="font-mono">{formatTimer(consultTimer)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={toggleMic}
                                                data-testid="button-toggle-mic"
                                                className={`p-2.5 rounded-xl transition ${micOn ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500 hover:bg-red-600'}`}
                                            >
                                                {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={toggleCam}
                                                data-testid="button-toggle-cam"
                                                className={`p-2.5 rounded-xl transition ${camOn ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500 hover:bg-red-600'}`}
                                            >
                                                {camOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={handleEndConsultation}
                                                data-testid="button-end-consultation"
                                                className="flex items-center gap-2 bg-red-500/80 hover:bg-red-500 px-4 py-2 rounded-xl text-xs font-black transition"
                                            >
                                                <PhoneOff className="w-4 h-4" /> إنهاء الجلسة
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col lg:flex-row h-[calc(100vh-320px)] min-h-[400px]">
                                        {/* Video Preview Panel */}
                                        <div className="relative w-full lg:w-2/5 bg-black/40 flex-shrink-0">
                                            <video
                                                ref={localVideoRef}
                                                autoPlay
                                                muted
                                                playsInline
                                                className="w-full h-full object-cover"
                                                style={{ minHeight: '200px' }}
                                            />
                                            {!camOn && (
                                                <div className="absolute inset-0 bg-[#0f172a] flex flex-col items-center justify-center gap-3">
                                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 rounded-full flex items-center justify-center">
                                                        <CameraOff className="w-10 h-10 text-white/30" />
                                                    </div>
                                                    <p className="text-white/30 text-sm font-bold">الكاميرا مغلقة</p>
                                                </div>
                                            )}
                                            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                                                أنت (د. {doctor?.name})
                                            </div>
                                            {patientJoined && (
                                                <div className="absolute top-3 right-3 bg-emerald-500/80 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                                    المريض متصل
                                                </div>
                                            )}
                                            {!micOn && (
                                                <div className="absolute bottom-3 left-3 bg-red-500/80 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                                    <MicOff className="w-3 h-3" />
                                                    صامت
                                                </div>
                                            )}
                                            {/* Mobile video controls */}
                                            <div className="lg:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3">
                                                <button onClick={toggleMic} data-testid="button-mobile-toggle-mic" className={`p-3 rounded-full ${micOn ? 'bg-white/20' : 'bg-red-500'}`}>
                                                    {micOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
                                                </button>
                                                <button onClick={toggleCam} data-testid="button-mobile-toggle-cam" className={`p-3 rounded-full ${camOn ? 'bg-white/20' : 'bg-red-500'}`}>
                                                    {camOn ? <Camera className="w-5 h-5 text-white" /> : <CameraOff className="w-5 h-5 text-white" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Chat Panel */}
                                        <div className="flex-1 flex flex-col min-w-0">
                                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                                {chatMessages.map(msg => (
                                                    <div key={msg.id} className={`flex ${msg.from === 'doctor' ? 'justify-start' : msg.from === 'system' ? 'justify-center' : 'justify-end'}`}>
                                                        {msg.from === 'system' ? (
                                                            <div className="bg-white/5 text-white/30 text-[10px] px-4 py-1.5 rounded-full font-bold">
                                                                {msg.text}
                                                            </div>
                                                        ) : (
                                                            <div className={`max-w-[85%] ${msg.from === 'doctor' ? 'bg-blue-500/20 border border-blue-500/10' : 'bg-white/[0.08] border border-white/[0.06]'} rounded-2xl p-3`}>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className={`text-[10px] font-black ${msg.from === 'doctor' ? 'text-blue-400' : 'text-emerald-400'}`}>
                                                                        {msg.from === 'doctor' ? 'أنت' : msg.name || 'المريض'}
                                                                    </span>
                                                                    <span className="text-[9px] text-white/20">{msg.time}</span>
                                                                </div>
                                                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                <div ref={chatEndRef} />
                                            </div>

                                            <div className="p-4 border-t border-white/[0.06] bg-white/[0.02]">
                                                <div className="flex gap-2">
                                                    <input
                                                        className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-400/50 transition placeholder:text-white/20"
                                                        placeholder="اكتب رسالة..."
                                                        value={chatInput}
                                                        onChange={e => setChatInput(e.target.value)}
                                                        onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                                                        data-testid="input-doctor-chat"
                                                    />
                                                    <button
                                                        onClick={handleSendChat}
                                                        disabled={!chatInput.trim()}
                                                        data-testid="button-doctor-send-chat"
                                                        className="bg-gradient-to-l from-blue-500 to-indigo-600 px-5 rounded-xl font-black text-sm shadow-lg shadow-blue-500/20 disabled:opacity-30 transition"
                                                    >
                                                        <Send className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══════ APPOINTMENTS ═══════ */}
                        {activeTab === 'appointments' && (
                            <div className="space-y-6">
                                {/* Filters */}
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    {[
                                        { id: 'all', label: 'الكل', count: appointments.length, gradient: 'from-slate-500 to-slate-600' },
                                        { id: 'pending', label: 'معلق', count: pendingAppts.length, gradient: 'from-amber-500 to-amber-600' },
                                        { id: 'scheduled', label: 'مقبول', count: appointments.filter(a => a.status === 'scheduled' || a.status === 'approved').length, gradient: 'from-blue-500 to-blue-600' },
                                        { id: 'completed', label: 'مكتمل', count: completedAppts.length, gradient: 'from-emerald-500 to-emerald-600' },
                                        { id: 'cancelled', label: 'ملغي', count: appointments.filter(a => a.status === 'cancelled').length, gradient: 'from-red-500 to-red-600' },
                                    ].map(f => (
                                        <button key={f.id} onClick={() => setApptFilter(f.id)} className={`p-4 rounded-2xl text-xs font-black transition-all ${apptFilter === f.id ? `bg-gradient-to-br ${f.gradient} shadow-lg scale-[1.02]` : 'bg-white/[0.05] text-white/40 hover:bg-white/[0.08]'}`}>
                                            <p className={`text-2xl font-black mb-1 ${apptFilter === f.id ? 'text-white' : 'text-white/60'}`}>{f.count}</p>
                                            <p>{f.label}</p>
                                        </button>
                                    ))}
                                </div>

                                {/* Appointments List */}
                                {filteredAppts.length === 0 ? (
                                    <div className={`${glass} rounded-3xl p-16 text-center`}>
                                        <Calendar className="w-16 h-16 mx-auto opacity-10 mb-4" />
                                        <p className="text-white/30 font-bold text-lg">لا توجد مواعيد</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredAppts.map(appt => {
                                            const sc = apptStatusConfig[appt.status] || apptStatusConfig.pending;
                                            const typeC = apptTypeConfig[appt.appointment_type] || apptTypeConfig.video;
                                            const isExpanded = expandedAppt === appt.id;
                                            return (
                                                <div key={appt.id} className={`${glass} rounded-3xl overflow-hidden transition-all ${isExpanded ? 'ring-1 ring-white/10' : ''}`}>
                                                    <div className={`h-1 ${sc.color}`} />
                                                    <div className="p-5 cursor-pointer" onClick={() => setExpandedAppt(isExpanded ? null : appt.id)}>
                                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${sc.light}`}>{sc.icon}</div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="font-black">موعد #{appt.id}</p>
                                                                        <span className={`${sc.light} ${sc.text} px-2.5 py-0.5 rounded-lg text-[10px] font-black`}>{sc.label}</span>
                                                                    </div>
                                                                    <p className="text-xs text-white/30 mt-1">{fmt(appt.scheduled_at)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-2.5">
                                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-black text-sm">{appt.patient_name?.[0] || '?'}</div>
                                                                <div>
                                                                    <p className="text-sm font-bold">{appt.patient_name || 'مريض'}</p>
                                                                    <p className="text-[10px] text-white/25">{typeC.icon} {typeC.label}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-sm font-bold">{appt.duration_minutes || 30} <span className="text-xs text-white/20">دقيقة</span></p>
                                                                <p className="text-[10px] text-white/30">{fmtDate(appt.scheduled_at)}</p>
                                                            </div>
                                                            <ChevronDown className={`w-5 h-5 text-white/20 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                        </div>
                                                    </div>

                                                    {isExpanded && (
                                                        <div className="border-t border-white/[0.06]">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                                                                <div className="p-5">
                                                                    <h4 className="text-xs font-black text-white/30 mb-3 flex items-center gap-2"><User className="w-3.5 h-3.5" /> بيانات المريض</h4>
                                                                    <div className="space-y-2.5">
                                                                        <div className="flex items-center gap-2 text-sm"><span className="text-white/20">👤</span><span className="font-bold">{appt.patient_name || '—'}</span></div>
                                                                        <div className="flex items-center gap-2 text-sm"><span className="text-white/20">🆔</span><span className="text-white/50">ID: {appt.patient_id}</span></div>
                                                                        <div className="flex items-center gap-2 text-sm"><span className="text-white/20">📅</span><span className="text-white/50">{fmtDate(appt.scheduled_at)}</span></div>
                                                                        <div className="flex items-center gap-2 text-sm"><span className="text-white/20">🕐</span><span className="text-white/50">{fmtTime(appt.scheduled_at)}</span></div>
                                                                    </div>
                                                                </div>
                                                                <div className="p-5 md:border-r md:border-white/[0.06]">
                                                                    <h4 className="text-xs font-black text-white/30 mb-3 flex items-center gap-2"><Stethoscope className="w-3.5 h-3.5" /> تفاصيل الجلسة</h4>
                                                                    <div className="space-y-2.5">
                                                                        <div className="flex items-center gap-2 text-sm"><span className="text-white/20">{typeC.icon}</span><span className="font-bold">{typeC.label}</span></div>
                                                                        <div className="flex items-center gap-2 text-sm"><span className="text-white/20">⏱</span><span className="text-white/50">{appt.duration_minutes || 30} دقيقة</span></div>
                                                                        <div className="flex items-center gap-2 text-sm"><span className="text-white/20">📋</span><span className="text-white/50">{appt.notes || 'بدون ملاحظات'}</span></div>
                                                                        <div className="flex items-center gap-2 text-sm"><span className="text-white/20">📆</span><span className="text-white/30">تم الحجز: {fmt(appt.created_at)}</span></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* Actions */}
                                                            <div className="p-5 border-t border-white/[0.06] bg-white/[0.02] flex flex-wrap gap-2">
                                                                {appt.status === 'pending' && <>
                                                                    <button onClick={() => handleApprove(appt.id)} className="bg-gradient-to-l from-emerald-500 to-emerald-600 px-5 py-2 rounded-xl text-xs font-black shadow-lg">✅ قبول الموعد</button>
                                                                    <button onClick={() => handleCancel(appt.id)} className="bg-white/[0.05] px-5 py-2 rounded-xl text-xs font-black text-red-400">❌ رفض</button>
                                                                </>}
                                                                {(appt.status === 'scheduled' || appt.status === 'approved') && <>
                                                                    <button onClick={() => handleComplete(appt.id)} className="bg-gradient-to-l from-blue-500 to-indigo-600 px-5 py-2 rounded-xl text-xs font-black shadow-lg">✔️ إنهاء الجلسة</button>
                                                                    <button onClick={() => handleCancel(appt.id)} className="bg-white/[0.05] px-5 py-2 rounded-xl text-xs font-black text-red-400">❌ إلغاء</button>
                                                                </>}
                                                                {appt.status === 'in_progress' && appt.session_request === 'approved' && appt.session_room_id && (
                                                                    <>
                                                                        <button onClick={() => startConsultation({ id: appt.id, room_id: appt.session_room_id, patient_name: appt.patient_name, appointment_type: appt.appointment_type })} className="bg-gradient-to-l from-emerald-500 to-teal-600 px-5 py-2 rounded-xl text-xs font-black shadow-lg flex items-center gap-1"><Video className="w-3.5 h-3.5" /> انضمام للجلسة</button>
                                                                        <button onClick={() => handleComplete(appt.id)} className="bg-white/[0.05] px-5 py-2 rounded-xl text-xs font-black text-amber-400">✔️ إنهاء</button>
                                                                        <button onClick={() => handleCancel(appt.id)} className="bg-white/[0.05] px-5 py-2 rounded-xl text-xs font-black text-red-400">❌ إلغاء</button>
                                                                    </>
                                                                )}
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

                        {/* ═══════ PATIENTS ═══════ */}
                        {activeTab === 'patients' && (
                            <div className="space-y-6">
                                <div className="flex flex-wrap gap-4 items-center justify-between">
                                    <p className="text-white/30 text-sm">{patients.length} مريض</p>
                                    <div className="relative">
                                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input className="bg-white/[0.05] border border-white/[0.1] rounded-xl pl-4 pr-10 py-2 text-sm text-white outline-none focus:border-blue-400/50 transition placeholder:text-white/15" placeholder="بحث عن مريض..." value={patientSearch} onChange={e => setPatientSearch(e.target.value)} />
                                    </div>
                                </div>

                                {filteredPatients.length === 0 ? (
                                    <div className={`${glass} rounded-3xl p-16 text-center`}>
                                        <Users className="w-16 h-16 mx-auto opacity-10 mb-4" />
                                        <p className="text-white/30 font-bold text-lg">لا يوجد مرضى</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {filteredPatients.map(p => {
                                            const patientAppts = appointments.filter(a => a.patient_id === p.id);
                                            return (
                                                <div key={p.id} className={`${glass} rounded-3xl p-5 hover:ring-1 hover:ring-white/10 transition cursor-pointer ${selectedPatient === p.id ? 'ring-1 ring-blue-400/50' : ''}`} onClick={() => setSelectedPatient(selectedPatient === p.id ? null : p.id)}>
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-black shadow-lg shadow-blue-500/20">{p.name?.[0]}</div>
                                                        <div className="flex-1">
                                                            <p className="font-black text-base">{p.name}</p>
                                                            {p.phone && <p className="text-xs text-white/30" dir="ltr">📞 {p.phone}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2 text-center">
                                                        <div className="bg-white/[0.03] rounded-xl p-2">
                                                            <p className="text-sm font-black text-blue-400">{patientAppts.length}</p>
                                                            <p className="text-[9px] text-white/20">زيارات</p>
                                                        </div>
                                                        <div className="bg-white/[0.03] rounded-xl p-2">
                                                            <p className="text-sm font-black text-purple-400">{p.sugar_readings_count || 0}</p>
                                                            <p className="text-[9px] text-white/20">قراءات</p>
                                                        </div>
                                                        <div className="bg-white/[0.03] rounded-xl p-2">
                                                            <p className="text-sm font-black text-emerald-400">{p.age || '--'}</p>
                                                            <p className="text-[9px] text-white/20">العمر</p>
                                                        </div>
                                                    </div>
                                                    {selectedPatient === p.id && (
                                                        <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-2">
                                                            <p className="text-xs text-white/30 font-black">السجل الطبي</p>
                                                            {p.weight && <p className="text-xs text-white/50">⚖️ الوزن: {p.weight} كجم</p>}
                                                            <div className="space-y-1">
                                                                {patientAppts.slice(0, 3).map(a => {
                                                                    const asc = apptStatusConfig[a.status] || apptStatusConfig.pending;
                                                                    return (
                                                                        <div key={a.id} className="flex items-center justify-between text-[10px]">
                                                                            <span className="text-white/30">{fmt(a.scheduled_at)}</span>
                                                                            <span className={`${asc.light} ${asc.text} px-2 py-0.5 rounded text-[8px] font-black`}>{asc.label}</span>
                                                                        </div>
                                                                    );
                                                                })}
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

                        {/* ═══════ SETTINGS ═══════ */}
                        {activeTab === 'settings' && (
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                {/* Settings Nav */}
                                <div className={`${glass} rounded-3xl p-4`}>
                                    <div className="space-y-1">
                                        {[
                                            { id: 'profile', label: 'الملف الشخصي', icon: User },
                                            { id: 'schedule', label: 'ساعات العمل', icon: Clock },
                                            { id: 'pricing', label: 'أسعار الجلسات', icon: DollarSign },
                                        ].map(s => (
                                            <button key={s.id} onClick={() => setSettingsSection(s.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${settingsSection === s.id ? 'bg-blue-500/10 text-blue-400' : 'text-white/30 hover:bg-white/[0.03]'}`}>
                                                <s.icon className="w-4 h-4" /> {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Settings Content */}
                                <div className={`lg:col-span-3 ${glass} rounded-3xl p-6`}>
                                    {settingsSection === 'profile' && (
                                        <div className="space-y-6">
                                            <h3 className="font-black text-lg">الملف الشخصي</h3>
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-3xl font-black shadow-xl">{doctor?.name?.[0]}</div>
                                                <div>
                                                    <p className="font-black text-xl">د. {doctor?.name}</p>
                                                    <p className="text-white/30 text-sm">{doctor?.email}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-white/30 text-[10px] font-black mb-1.5">الاسم</label>
                                                    <input className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-400/50 transition" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
                                                </div>
                                                <div>
                                                    <label className="block text-white/30 text-[10px] font-black mb-1.5">رقم الهاتف</label>
                                                    <input className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-400/50 transition" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} />
                                                </div>
                                            </div>
                                            <button onClick={() => showToast('تم حفظ البيانات')} className="bg-gradient-to-l from-blue-500 to-indigo-600 px-6 py-3 rounded-xl font-black text-sm shadow-lg shadow-blue-500/20">
                                                <Save className="w-4 h-4 inline ml-2" /> حفظ التعديلات
                                            </button>
                                        </div>
                                    )}

                                    {settingsSection === 'schedule' && (
                                        <div className="space-y-6">
                                            <h3 className="font-black text-lg">ساعات العمل</h3>
                                            <div className="space-y-3">
                                                {workingHours.map((wh, i) => (
                                                    <div key={i} className={`flex items-center gap-4 p-3 rounded-xl ${wh.active ? 'bg-white/[0.03]' : 'bg-white/[0.01] opacity-40'}`}>
                                                        <button onClick={() => { const nh = [...workingHours]; nh[i].active = !nh[i].active; setWorkingHours(nh); }} className={`w-7 h-7 rounded-lg flex items-center justify-center ${wh.active ? 'bg-blue-500' : 'bg-white/[0.1]'}`}>
                                                            {wh.active && <Check className="w-4 h-4" />}
                                                        </button>
                                                        <span className="font-bold text-sm w-24">{wh.day}</span>
                                                        {wh.active && (
                                                            <div className="flex items-center gap-2">
                                                                <input type="time" className="bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-1.5 text-xs text-white outline-none" value={wh.from} onChange={e => { const nh = [...workingHours]; nh[i].from = e.target.value; setWorkingHours(nh); }} />
                                                                <span className="text-white/20 text-xs">إلى</span>
                                                                <input type="time" className="bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-1.5 text-xs text-white outline-none" value={wh.to} onChange={e => { const nh = [...workingHours]; nh[i].to = e.target.value; setWorkingHours(nh); }} />
                                                            </div>
                                                        )}
                                                        {!wh.active && <span className="text-white/15 text-xs">عطلة</span>}
                                                    </div>
                                                ))}
                                            </div>
                                            <button onClick={() => showToast('تم حفظ ساعات العمل')} className="bg-gradient-to-l from-blue-500 to-indigo-600 px-6 py-3 rounded-xl font-black text-sm shadow-lg shadow-blue-500/20">
                                                <Save className="w-4 h-4 inline ml-2" /> حفظ
                                            </button>
                                        </div>
                                    )}

                                    {settingsSection === 'pricing' && (
                                        <div className="space-y-6">
                                            <h3 className="font-black text-lg">أسعار الجلسات</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {[
                                                    { key: 'video', label: 'مكالمة فيديو', icon: '🎥', color: 'from-purple-500 to-purple-600' },
                                                    { key: 'audio', label: 'مكالمة صوتية', icon: '📞', color: 'from-blue-500 to-blue-600' },
                                                    { key: 'chat', label: 'محادثة نصية', icon: '💬', color: 'from-teal-500 to-teal-600' },
                                                ].map(p => (
                                                    <div key={p.key} className={`bg-gradient-to-br ${p.color} rounded-2xl p-5`}>
                                                        <span className="text-2xl">{p.icon}</span>
                                                        <p className="font-bold text-sm mt-2 mb-3">{p.label}</p>
                                                        <div className="relative">
                                                            <input type="number" className="w-full bg-white/20 rounded-xl px-4 py-2.5 text-white font-black text-lg outline-none placeholder:text-white/30" value={prices[p.key]} onChange={e => setPrices({ ...prices, [p.key]: e.target.value })} />
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-xs">SAR</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button onClick={() => showToast('تم حفظ الأسعار')} className="bg-gradient-to-l from-blue-500 to-indigo-600 px-6 py-3 rounded-xl font-black text-sm shadow-lg shadow-blue-500/20">
                                                <Save className="w-4 h-4 inline ml-2" /> حفظ الأسعار
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default DoctorDashboard;
