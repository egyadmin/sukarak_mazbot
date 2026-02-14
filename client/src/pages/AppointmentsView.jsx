import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, Clock, Video, Phone, MessageSquare, Plus, X, Check, Loader2, AlertTriangle, PhoneCall, PhoneOff, Mic, MicOff, Camera, CameraOff, Send, User, FileText, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '../api/config';

const AppointmentsView = () => {
    const { i18n } = useTranslation();
    const lang = i18n.language === 'ar' ? 'ar' : 'en';
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBooking, setShowBooking] = useState(false);
    const [bookingForm, setBookingForm] = useState({
        doctor_id: 1,
        doctor_name: 'الفريق الطبي',
        appointment_type: 'video',
        scheduled_at: '',
        notes: '',
        duration_minutes: 30,
    });
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [sessionRequested, setSessionRequested] = useState(null);
    const [waitingApproval, setWaitingApproval] = useState(false);
    const [activeConsultation, setActiveConsultation] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [consultTimer, setConsultTimer] = useState(0);
    const [doctorJoined, setDoctorJoined] = useState(false);
    const [showDoctorJoinedNotif, setShowDoctorJoinedNotif] = useState(false);
    const [sessionRejected, setSessionRejected] = useState(false);

    const timerRef = useRef(null);
    const chatEndRef = useRef(null);
    const localVideoRef = useRef(null);
    const localStreamRef = useRef(null);
    const wsRef = useRef(null);
    const pollRef = useRef(null);

    const userId = localStorage.getItem('sukarak_user_id') || '1';
    const userName = localStorage.getItem('sukarak_user_name') || 'المستخدم';

    const typeIcons = { video: Video, audio: Phone, chat: MessageSquare };
    const typeLabels = {
        video: lang === 'ar' ? 'فيديو' : 'Video',
        audio: lang === 'ar' ? 'صوتي' : 'Audio',
        chat: lang === 'ar' ? 'محادثة' : 'Chat'
    };

    const statusColors = {
        pending: { bg: 'bg-amber-50', text: 'text-amber-600', label: lang === 'ar' ? 'بانتظار الموافقة' : 'Pending' },
        scheduled: { bg: 'bg-blue-50', text: 'text-blue-600', label: lang === 'ar' ? 'مؤكد' : 'Confirmed' },
        in_progress: { bg: 'bg-green-50', text: 'text-green-600', label: lang === 'ar' ? 'جارٍ' : 'In Progress' },
        completed: { bg: 'bg-gray-100', text: 'text-gray-500', label: lang === 'ar' ? 'مكتمل' : 'Completed' },
        cancelled: { bg: 'bg-red-50', text: 'text-red-500', label: lang === 'ar' ? 'ملغي' : 'Cancelled' },
    };

    useEffect(() => {
        fetchAppointments();
        fetchDoctors();
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
            if (wsRef.current) wsRef.current.close();
        };
    }, []);

    const fetchDoctors = () => {
        fetch(`${API_BASE}/health/doctors`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setDoctors(data); })
            .catch(() => { });
    };

    const fetchAppointments = () => {
        fetch(`${API_BASE}/health/appointments`)
            .then(res => res.json())
            .then(data => { setAppointments(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    };

    const handleBook = async () => {
        if (!bookingForm.doctor_id || !bookingForm.scheduled_at) return;
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/health/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingForm),
            });
            const data = await res.json();
            if (data.status === 'success') {
                setShowBooking(false);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2500);
                fetchAppointments();
                setBookingForm({ doctor_id: 1, doctor_name: 'الفريق الطبي', appointment_type: 'video', scheduled_at: '', notes: '', duration_minutes: 30 });
            }
        } catch (err) { console.error(err); }
        setSubmitting(false);
    };

    const handleCancel = async (id) => {
        try {
            await fetch(`${API_BASE}/health/appointments/${id}/cancel`, { method: 'PUT' });
            fetchAppointments();
        } catch (err) { console.error(err); }
    };

    const handleRequestSession = async (appt) => {
        setSessionRequested(appt.id);
        setWaitingApproval(true);
        setSessionRejected(false);
        try {
            const res = await fetch(`${API_BASE}/health/appointments/${appt.id}/request-session`, { method: 'PUT' });
            const data = await res.json();
            if (data.status === 'success') {
                pollRef.current = setInterval(async () => {
                    try {
                        const checkRes = await fetch(`${API_BASE}/health/appointments`);
                        const allAppts = await checkRes.json();
                        const updated = allAppts.find(a => a.id === appt.id);
                        if (updated) {
                            if (updated.session_request === 'approved') {
                                clearInterval(pollRef.current);
                                pollRef.current = null;
                                setWaitingApproval(false);
                                setSessionRequested(null);
                                startConsultation({ ...appt, session_room_id: updated.session_room_id });
                            } else if (updated.session_request === 'rejected') {
                                clearInterval(pollRef.current);
                                pollRef.current = null;
                                setWaitingApproval(false);
                                setSessionRequested(null);
                                setSessionRejected(true);
                                setTimeout(() => setSessionRejected(false), 4000);
                            }
                        }
                    } catch { }
                }, 3000);
            }
        } catch (err) {
            console.error(err);
            setWaitingApproval(false);
            setSessionRequested(null);
        }
    };

    const connectWebSocket = (roomId) => {
        const wsUrl = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}${API_BASE}/chat/ws/${userId}?name=${encodeURIComponent(userName)}`;
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
                    from: String(msg.user_id) === String(userId) ? 'patient' : 'doctor',
                    name: msg.name,
                    text: msg.text,
                    time: new Date(msg.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
                }]);
            }
            if (msg.type === 'room_history') {
                setChatMessages(msg.messages.map(m => ({
                    id: m.timestamp,
                    from: String(m.user_id) === String(userId) ? 'patient' : 'doctor',
                    name: m.name,
                    text: m.text,
                    time: new Date(m.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
                })));
            }
            if (msg.type === 'user_joined' && String(msg.user_id) !== String(userId)) {
                setDoctorJoined(true);
                setShowDoctorJoinedNotif(true);
                setTimeout(() => setShowDoctorJoinedNotif(false), 3000);
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

    const startConsultation = (appt) => {
        setActiveConsultation(appt);
        setDoctorJoined(false);
        setChatMessages([{ id: 1, from: 'system', text: lang === 'ar' ? 'بدأت الجلسة مع الفريق الطبي' : 'Session started with Medical Team', time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) }]);
        setConsultTimer(0);
        timerRef.current = setInterval(() => setConsultTimer(t => t + 1), 1000);
        startMedia();
        if (appt.session_room_id) {
            connectWebSocket(appt.session_room_id);
        }
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
        setDoctorJoined(false);
        fetchAppointments();
    };

    const handleSendChat = () => {
        if (!chatInput.trim()) return;
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && activeConsultation?.session_room_id) {
            wsRef.current.send(JSON.stringify({
                type: 'chat_message',
                room_id: activeConsultation.session_room_id,
                text: chatInput
            }));
        } else {
            setChatMessages(prev => [...prev, { id: Date.now(), from: 'patient', text: chatInput, time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) }]);
        }
        setChatInput('');
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const formatTimer = (sec) => {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const upcoming = appointments.filter(a => ['pending', 'scheduled', 'in_progress'].includes(a.status));
    const past = appointments.filter(a => ['completed', 'cancelled'].includes(a.status));

    return (
        <div className="space-y-5 pb-24">
            {/* Waiting Approval Overlay */}
            <AnimatePresence>
                {waitingApproval && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-3xl p-8 mx-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
                            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
                                <Bell className="w-8 h-8 text-amber-500 animate-bounce" />
                            </div>
                            <h3 className="text-lg font-black text-primary-dark">
                                {lang === 'ar' ? 'تم إرسال طلب الجلسة' : 'Session Request Sent'}
                            </h3>
                            <p className="text-sm text-gray-400">
                                {lang === 'ar' ? 'بانتظار موافقة الفريق الطبي للدخول إلى الجلسة...' : 'Waiting for medical team approval...'}
                            </p>
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin text-primary-emerald" />
                                <span className="text-xs font-bold text-primary-emerald">
                                    {lang === 'ar' ? 'جاري الانتظار...' : 'Waiting...'}
                                </span>
                            </div>
                            <button onClick={() => { setWaitingApproval(false); setSessionRequested(null); if (pollRef.current) clearInterval(pollRef.current); }}
                                className="text-xs text-gray-300 font-bold mt-2">
                                {lang === 'ar' ? 'إلغاء الطلب' : 'Cancel Request'}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Session Rejected Alert */}
            <AnimatePresence>
                {sessionRejected && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                        <div>
                            <p className="font-black text-sm text-red-700">{lang === 'ar' ? 'تم رفض طلب الجلسة' : 'Session Rejected'}</p>
                            <p className="text-[10px] text-red-400">{lang === 'ar' ? 'الفريق الطبي غير متاح حالياً، حاول لاحقاً' : 'Medical team is currently unavailable, try again later'}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Doctor Joined Notification */}
            <AnimatePresence>
                {showDoctorJoinedNotif && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="fixed top-4 left-4 right-4 z-[1200] bg-emerald-500 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
                        <Check className="w-6 h-6" />
                        <div>
                            <p className="font-black text-sm">{lang === 'ar' ? 'انضم الطبيب للجلسة' : 'Doctor Joined'}</p>
                            <p className="text-[10px] text-white/70">{lang === 'ar' ? 'الفريق الطبي متصل الآن' : 'Medical team is now connected'}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {activeConsultation ? (
                <div className="space-y-4">
                    <div className="bg-gradient-to-l from-teal-600 to-emerald-500 p-5 rounded-3xl text-white flex items-center justify-between shadow-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black">{lang === 'ar' ? 'الفريق الطبي' : 'Medical Team'}</h3>
                                <p className="text-white/70 text-xs">{formatTimer(consultTimer)}</p>
                            </div>
                        </div>
                        <PhoneOff onClick={handleEndConsultation} className="w-6 h-6 cursor-pointer" data-testid="button-end-session" />
                    </div>

                    <div className="relative bg-gray-900 rounded-3xl overflow-hidden aspect-video">
                        <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                            <button onClick={toggleMic} className={`p-3 rounded-full ${micOn ? 'bg-white/20' : 'bg-red-500'}`}><Mic className="w-5 h-5 text-white" /></button>
                            <button onClick={toggleCam} className={`p-3 rounded-full ${camOn ? 'bg-white/20' : 'bg-red-500'}`}><Camera className="w-5 h-5 text-white" /></button>
                        </div>
                        {doctorJoined && (
                            <div className="absolute top-3 right-3 bg-emerald-500/80 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                {lang === 'ar' ? 'الطبيب متصل' : 'Doctor Online'}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 h-64 flex flex-col p-4">
                        <div className="flex-1 overflow-y-auto space-y-2">
                            {chatMessages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.from === 'patient' ? 'justify-end' : msg.from === 'system' ? 'justify-center' : 'justify-start'}`}>
                                    <div className={`p-3 rounded-2xl max-w-[80%] ${msg.from === 'patient' ? 'bg-emerald-500 text-white' : msg.from === 'system' ? 'bg-gray-50 text-gray-400 text-xs' : 'bg-gray-100 text-gray-700'}`}>
                                        {msg.from === 'doctor' && <p className="text-[10px] text-emerald-600 font-bold mb-0.5">{msg.name || (lang === 'ar' ? 'الطبيب' : 'Doctor')}</p>}
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="flex gap-2 mt-4">
                            <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                                className="flex-1 bg-gray-50 p-3 rounded-xl outline-none text-sm"
                                placeholder={lang === 'ar' ? 'اكتب رسالتك...' : 'Type a message...'}
                                data-testid="input-chat-message" />
                            <button onClick={handleSendChat} className="bg-teal-500 text-white p-3 rounded-xl" data-testid="button-send-chat">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Success Toast */}
                    <AnimatePresence>
                        {showSuccess && (
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                className="bg-emerald-500 text-white p-4 rounded-2xl text-center font-black text-sm shadow-lg">
                                {lang === 'ar' ? 'تم حجز الموعد بنجاح!' : 'Appointment booked!'}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black text-primary-dark">{lang === 'ar' ? 'المواعيد' : 'Appointments'}</h2>
                        <button onClick={() => setShowBooking(true)} className="bg-primary-emerald text-white p-3 rounded-2xl shadow-lg active:scale-95 transition" data-testid="button-book-appointment">
                            <Plus className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {loading ? <Loader2 className="w-8 h-8 animate-spin mx-auto mt-10" /> : upcoming.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-200">
                                <CalendarIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-400 font-bold">{lang === 'ar' ? 'لا توجد مواعيد قادمة' : 'No upcoming appointments'}</p>
                            </div>
                        ) : (
                            upcoming.map(app => {
                                const status = statusColors[app.status] || statusColors.scheduled;
                                const TypeIcon = typeIcons[app.appointment_type] || Video;
                                const isRequesting = sessionRequested === app.id;
                                return (
                                    <motion.div key={app.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center"><User className="w-5 h-5 text-emerald-600" /></div>
                                                <div>
                                                    <h4 className="font-black text-primary-dark">{lang === 'ar' ? 'الفريق الطبي' : 'Medical Team'}</h4>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <TypeIcon className="w-3 h-3 text-gray-400" />
                                                        <span className="text-[10px] text-gray-400 font-bold">{typeLabels[app.appointment_type] || typeLabels.video}</span>
                                                        <span className="text-[10px] text-gray-300 mx-1">-</span>
                                                        <Clock className="w-3 h-3 text-gray-400" />
                                                        <span className="text-[10px] text-gray-400 font-bold">{app.duration_minutes || 30} {lang === 'ar' ? 'دقيقة' : 'min'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black ${status.bg} ${status.text}`}>{status.label}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="flex-1 bg-gray-50 p-3 rounded-xl flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-gray-400" /><span className="text-xs font-bold text-gray-600">{new Date(app.scheduled_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span></div>
                                            <div className="flex-1 bg-gray-50 p-3 rounded-xl flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /><span className="text-xs font-bold text-gray-600">{new Date(app.scheduled_at).toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</span></div>
                                        </div>
                                        {app.notes && (
                                            <div className="bg-amber-50 p-3 rounded-xl flex items-start gap-2">
                                                <FileText className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                                                <p className="text-xs text-gray-600">{app.notes}</p>
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <button onClick={() => handleCancel(app.id)} className="flex-1 py-3 text-red-500 font-bold text-xs" data-testid={`button-cancel-${app.id}`}>
                                                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                                            </button>
                                            {(app.status === 'scheduled' || app.status === 'pending') && (
                                                <button onClick={() => handleRequestSession(app)}
                                                    disabled={isRequesting}
                                                    data-testid={`button-start-session-${app.id}`}
                                                    className="flex-[2] py-3 bg-primary-dark text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition">
                                                    {isRequesting ? <><Loader2 className="w-4 h-4 animate-spin" /> {lang === 'ar' ? 'جاري الإرسال...' : 'Sending...'}</>
                                                        : <>{lang === 'ar' ? 'بدء الجلسة' : 'Start Session'}</>}
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>

                    {/* Past Appointments */}
                    {past.length > 0 && (
                        <div className="space-y-3 mt-6">
                            <h3 className="text-sm font-black text-gray-300">{lang === 'ar' ? 'المواعيد السابقة' : 'Past Appointments'}</h3>
                            {past.map(app => {
                                const status = statusColors[app.status] || statusColors.completed;
                                return (
                                    <div key={app.id} className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <User className="w-5 h-5 text-gray-300" />
                                            <div>
                                                <p className="font-bold text-sm text-gray-500">{lang === 'ar' ? 'الفريق الطبي' : 'Medical Team'}</p>
                                                <p className="text-[10px] text-gray-300">{new Date(app.scheduled_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${status.bg} ${status.text}`}>{status.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Booking Modal */}
                    <AnimatePresence>
                        {showBooking && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm flex flex-col justify-end" onClick={() => setShowBooking(false)}>
                                <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white rounded-t-3xl p-6 space-y-6" onClick={e => e.stopPropagation()}>
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-black text-primary-dark">{lang === 'ar' ? 'حجز موعد جديد' : 'Book Appointment'}</h3>
                                        <X onClick={() => setShowBooking(false)} className="w-6 h-6 text-gray-400 cursor-pointer" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-emerald-50 p-4 rounded-2xl flex items-center gap-3 border border-emerald-100">
                                            <User className="w-6 h-6 text-emerald-600" />
                                            <div>
                                                <p className="font-bold text-sm">{lang === 'ar' ? 'الفريق الطبي' : 'Medical Team'}</p>
                                                <p className="text-[10px] text-gray-400">{lang === 'ar' ? 'فريق طبي متخصص' : 'Specialized medical team'}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold mb-2">{lang === 'ar' ? 'نوع الاستشارة' : 'Consultation Type'}</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {Object.entries(typeIcons).map(([type, Icon]) => (
                                                    <button key={type} onClick={() => setBookingForm(f => ({ ...f, appointment_type: type }))}
                                                        className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all ${bookingForm.appointment_type === type ? 'bg-primary-dark text-white shadow-lg' : 'bg-gray-50 text-gray-400'}`}>
                                                        <Icon className="w-5 h-5" />
                                                        <span className="text-[10px] font-black">{typeLabels[type]}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold mb-2">{lang === 'ar' ? 'مدة الجلسة' : 'Duration'}</p>
                                            <div className="flex gap-2">
                                                {[15, 30, 45, 60].map(d => (
                                                    <button key={d} onClick={() => setBookingForm(f => ({ ...f, duration_minutes: d }))}
                                                        className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${bookingForm.duration_minutes === d ? 'bg-primary-emerald text-white' : 'bg-gray-50 text-gray-400'}`}>
                                                        {d} {lang === 'ar' ? 'د' : 'm'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <input type="datetime-local" value={bookingForm.scheduled_at} onChange={e => setBookingForm(f => ({ ...f, scheduled_at: e.target.value }))} className="w-full bg-gray-50 p-4 rounded-2xl outline-none" data-testid="input-schedule-date" />
                                        <textarea value={bookingForm.notes} onChange={e => setBookingForm(f => ({ ...f, notes: e.target.value }))} className="w-full bg-gray-50 p-4 rounded-2xl outline-none h-24" placeholder={lang === 'ar' ? 'ملاحظات (اختياري)...' : 'Notes (optional)...'} data-testid="input-notes" />
                                        <button onClick={handleBook} disabled={!bookingForm.scheduled_at || submitting}
                                            data-testid="button-confirm-booking"
                                            className="w-full bg-primary-emerald text-white py-4 rounded-2xl font-black shadow-lg disabled:opacity-50">
                                            {submitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (lang === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking')}
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>
    );
};

export default AppointmentsView;
