import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Video, User, Clock, X } from 'lucide-react';
import { API_BASE } from '../api/config';

const SessionNotificationOverlay = () => {
    const [approvedSession, setApprovedSession] = useState(null);
    const [visible, setVisible] = useState(false);
    const [ringPulse, setRingPulse] = useState(false);
    const pollRef = useRef(null);
    const dismissedRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const userId = localStorage.getItem('sukarak_user_id');
    const isLoggedIn = !!localStorage.getItem('sukarak_token');
    const isPanel = location.pathname.startsWith('/admin') || location.pathname.startsWith('/doctor') || location.pathname.startsWith('/seller') || location.pathname.startsWith('/nursing-admin');

    useEffect(() => {
        if (!isLoggedIn || isPanel) return;

        const checkApprovedSessions = async () => {
            try {
                const res = await fetch(`${API_BASE}/health/appointments`);
                if (!res.ok) return;
                const data = await res.json();
                if (!Array.isArray(data)) return;
                const approved = data.find(a =>
                    a.session_request === 'approved' &&
                    a.session_room_id
                );
                if (approved && !approvedSession && dismissedRef.current !== approved.id) {
                    setApprovedSession(approved);
                    setVisible(true);
                    setRingPulse(true);
                } else if (!approved && approvedSession) {
                    setApprovedSession(null);
                    setVisible(false);
                }
            } catch { }
        };

        checkApprovedSessions();
        pollRef.current = setInterval(checkApprovedSessions, 4000);

        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [isLoggedIn, isPanel, approvedSession]);

    useEffect(() => {
        if (!ringPulse) return;
        const t = setTimeout(() => setRingPulse(false), 10000);
        return () => clearTimeout(t);
    }, [ringPulse]);

    const handleAccept = () => {
        setVisible(false);
        dismissedRef.current = approvedSession?.id;
        if (pollRef.current) clearInterval(pollRef.current);
        const sessionData = { ...approvedSession, autoStart: true };
        setApprovedSession(null);
        navigate('/appointments', { state: { startSession: sessionData } });
    };

    const handleReject = async () => {
        setVisible(false);
        dismissedRef.current = approvedSession?.id;
        if (approvedSession?.id) {
            try {
                await fetch(`${API_BASE}/health/appointments/${approvedSession.id}/reject-session`, { method: 'PUT' });
            } catch { }
        }
        setApprovedSession(null);
    };

    if (!visible || !approvedSession) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center"
                data-testid="session-notification-overlay"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80 backdrop-blur-md" />

                <div className="absolute top-0 left-0 right-0 h-1">
                    <motion.div
                        className="h-full bg-emerald-400"
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{ duration: 60, ease: 'linear' }}
                    />
                </div>

                <motion.div
                    initial={{ scale: 0.7, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.7, opacity: 0, y: 40 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="relative z-10 w-full max-w-sm mx-6 text-center"
                >
                    <div className="relative mx-auto mb-8">
                        <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                            className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-emerald-500/20"
                            style={{ top: '-16px', left: '50%', transform: 'translateX(-50%)' }}
                        />
                        <motion.div
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: 0.3 }}
                            className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-emerald-500/10"
                            style={{ top: '-16px', left: '50%', transform: 'translateX(-50%)' }}
                        />
                        <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                            <Video className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3 mb-10"
                    >
                        <h2 className="text-2xl font-black text-white">
                            الفريق الطبي بانتظارك
                        </h2>
                        <p className="text-white/60 text-sm font-bold">
                            تمت الموافقة على جلستك، هل تريد الانضمام الآن؟
                        </p>

                        <div className="flex items-center justify-center gap-4 text-white/40 text-xs">
                            <span className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5" />
                                {approvedSession.doctor_name || 'الفريق الطبي'}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {approvedSession.duration_minutes || 30} دقيقة
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center justify-center gap-6"
                    >
                        <button
                            onClick={handleReject}
                            data-testid="button-reject-session"
                            className="group flex flex-col items-center gap-2"
                        >
                            <div className="w-16 h-16 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center transition-all active:scale-90">
                                <PhoneOff className="w-7 h-7 text-red-400" />
                            </div>
                            <span className="text-red-400/80 text-xs font-bold">رفض</span>
                        </button>

                        <button
                            onClick={handleAccept}
                            data-testid="button-accept-session"
                            className="group flex flex-col items-center gap-2"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.08, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/40 transition-all active:scale-90"
                            >
                                <Phone className="w-9 h-9 text-white" />
                            </motion.div>
                            <span className="text-emerald-400 text-xs font-bold">قبول</span>
                        </button>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-white/20 text-[10px] mt-8 font-bold"
                    >
                        سيتم إغلاق الإشعار تلقائياً بعد دقيقة
                    </motion.p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SessionNotificationOverlay;
