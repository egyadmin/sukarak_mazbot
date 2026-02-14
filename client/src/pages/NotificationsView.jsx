import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Bell, BellRing, Check, CheckCheck, Pill, Calendar, Activity, ShoppingBag, Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DataService from '../services/DataService';

const NotificationsView = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [localAlerts, setLocalAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [readIds, setReadIds] = useState(DataService.getReadNotifications());

    useEffect(() => {
        loadNotifications();
        generateLocalAlerts();
    }, []);

    const loadNotifications = async () => {
        try {
            const { data } = await DataService.getNotifications();
            setNotifications(data.filter(n => n.active));
        } catch { }
        setLoading(false);
    };

    // Generate smart local alerts from user data (medications, appointments, etc.)
    const generateLocalAlerts = async () => {
        const alerts = [];
        const now = new Date();
        const hour = now.getHours();

        // Medication reminders
        try {
            const { data: drugs } = await DataService.getDrugs();
            if (drugs && drugs.length > 0) {
                drugs.forEach(drug => {
                    if (drug.frequency?.includes('يومياً')) {
                        if (hour >= 7 && hour <= 9) {
                            alerts.push({
                                id: `med_morning_${drug.id}`,
                                title: '💊 تذكير بالدواء',
                                details: `حان موعد تناول ${drug.name} ${drug.serving || ''}`,
                                type: 'medication',
                                icon: Pill,
                                color: 'bg-purple-500',
                                bgColor: 'bg-purple-50',
                                time: 'الصباح',
                                priority: 'high',
                            });
                        }
                        if ((hour >= 13 && hour <= 15) && drug.frequency?.includes('مرتين')) {
                            alerts.push({
                                id: `med_noon_${drug.id}`,
                                title: '💊 تذكير بالدواء',
                                details: `حان موعد الجرعة الثانية من ${drug.name}`,
                                type: 'medication',
                                icon: Pill,
                                color: 'bg-purple-500',
                                bgColor: 'bg-purple-50',
                                time: 'الظهر',
                                priority: 'high',
                            });
                        }
                    }
                });
            }
        } catch { }

        // Appointment reminders
        try {
            const { data: appointments } = await DataService.getAppointments();
            if (appointments && appointments.length > 0) {
                appointments.forEach(appt => {
                    if (appt.status === 'scheduled') {
                        const apptDate = new Date(appt.scheduled_at);
                        const diffHours = (apptDate - now) / (1000 * 60 * 60);
                        if (diffHours > 0 && diffHours <= 24) {
                            alerts.push({
                                id: `appt_${appt.id}`,
                                title: '📅 موعد قريب',
                                details: `لديك موعد مع ${appt.doctor_name} بعد ${Math.round(diffHours)} ساعة`,
                                type: 'appointment',
                                icon: Calendar,
                                color: 'bg-blue-500',
                                bgColor: 'bg-blue-50',
                                time: apptDate.toLocaleString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
                                priority: 'high',
                            });
                        }
                    }
                });
            }
        } catch { }

        // Sugar reading reminder
        try {
            const { data: readings } = await DataService.getSugarReadings();
            if (readings && readings.length > 0) {
                const lastReading = new Date(readings[0].created_at);
                const hoursSince = (now - lastReading) / (1000 * 60 * 60);
                if (hoursSince > 12) {
                    alerts.push({
                        id: 'sugar_reminder',
                        title: '🩸 تذكير بقياس السكر',
                        details: `لم تسجل قراءة سكر منذ ${Math.round(hoursSince)} ساعة. سجل قراءتك الآن!`,
                        type: 'health',
                        icon: Activity,
                        color: 'bg-emerald-500',
                        bgColor: 'bg-emerald-50',
                        time: 'الآن',
                        priority: 'medium',
                        action: () => navigate('/health-tracking'),
                    });
                }

                // Alert for high/low readings
                if (readings[0].reading > 180) {
                    alerts.push({
                        id: 'sugar_high_alert',
                        title: '⚠️ تنبيه: سكر مرتفع',
                        details: `آخر قراءة (${readings[0].reading} mg/dL) مرتفعة. راجع طبيبك واتبع خطة العلاج.`,
                        type: 'health',
                        icon: AlertCircle,
                        color: 'bg-red-500',
                        bgColor: 'bg-red-50',
                        time: 'تنبيه',
                        priority: 'critical',
                    });
                }
                if (readings[0].reading < 70) {
                    alerts.push({
                        id: 'sugar_low_alert',
                        title: '⚠️ تنبيه: سكر منخفض',
                        details: `آخر قراءة (${readings[0].reading} mg/dL) منخفضة. تناول شيء حتوائه سكر فوراً.`,
                        type: 'health',
                        icon: AlertCircle,
                        color: 'bg-amber-500',
                        bgColor: 'bg-amber-50',
                        time: 'عاجل',
                        priority: 'critical',
                    });
                }
            } else {
                alerts.push({
                    id: 'first_reading',
                    title: '👋 مرحباً بك!',
                    details: 'ابدأ بتسجيل أول قراءة سكر لمتابعة صحتك بشكل أفضل.',
                    type: 'health',
                    icon: Activity,
                    color: 'bg-teal-500',
                    bgColor: 'bg-teal-50',
                    time: 'الآن',
                    priority: 'medium',
                    action: () => navigate('/health-tracking'),
                });
            }
        } catch { }

        // Exercise reminder
        if (hour >= 16 && hour <= 19) {
            alerts.push({
                id: 'exercise_daily',
                title: '🏋️ وقت الرياضة',
                details: 'حان وقت النشاط البدني! المشي 30 دقيقة يحسن مستوى السكر.',
                type: 'exercise',
                icon: Activity,
                color: 'bg-orange-500',
                bgColor: 'bg-orange-50',
                time: 'مسائياً',
                priority: 'low',
                action: () => navigate('/sports'),
            });
        }

        setLocalAlerts(alerts);
    };

    const markAsRead = (id) => {
        DataService.markNotificationRead(id);
        setReadIds(prev => [...prev, id]);
    };

    const markAllRead = () => {
        const allIds = [...notifications.map(n => n.id), ...localAlerts.map(a => a.id)];
        allIds.forEach(id => DataService.markNotificationRead(id));
        setReadIds(allIds);
    };

    const isRead = (id) => readIds.includes(id);

    const allItems = [
        ...localAlerts.map(a => ({
            ...a,
            isLocal: true,
            isRead: isRead(a.id),
        })),
        ...notifications.map(n => ({
            id: n.id,
            title: n.title,
            details: n.details,
            type: n.type || 'general',
            icon: Bell,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            time: n.created_at ? new Date(n.created_at).toLocaleDateString('ar-EG') : '',
            isLocal: false,
            isRead: isRead(n.id),
        })),
    ].sort((a, b) => {
        // Unread first, then by priority
        if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
        const prio = { critical: 0, high: 1, medium: 2, low: 3 };
        return (prio[a.priority] || 2) - (prio[b.priority] || 2);
    });

    const unreadCount = allItems.filter(i => !i.isRead).length;

    return (
        <div className="space-y-5 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-xl shadow-sm">
                        <ArrowRight className="w-5 h-5 rtl:rotate-0 rotate-180 text-gray-500" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-primary-dark">الإشعارات</h2>
                        {unreadCount > 0 && <p className="text-xs text-gray-400">{unreadCount} غير مقروءة</p>}
                    </div>
                </div>
                {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-primary-emerald text-sm font-bold flex items-center gap-1">
                        <CheckCheck className="w-4 h-4" /> قراءة الكل
                    </button>
                )}
            </div>

            {/* Notifications List */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white p-5 rounded-2xl animate-pulse">
                            <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" /><div className="h-3 bg-gray-100 rounded w-3/4" />
                        </div>
                    ))}
                </div>
            ) : allItems.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <Bell className="w-16 h-16 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-bold text-lg mb-1">لا توجد إشعارات</p>
                    <p className="text-gray-300 text-sm">سنرسل لك تنبيهات مهمة هنا</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {allItems.map((item, i) => (
                        <motion.div key={item.id}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            onClick={() => {
                                markAsRead(item.id);
                                if (item.action) item.action();
                            }}
                            className={`p-4 rounded-2xl shadow-sm border transition cursor-pointer active:scale-[0.99] ${item.isRead ? 'bg-white border-gray-50' : 'bg-white border-primary-emerald/20 border-l-4'}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`${item.bgColor || 'bg-gray-50'} p-2.5 rounded-xl flex-shrink-0`}>
                                    <item.icon className={`w-5 h-5 ${item.color?.replace('bg-', 'text-') || 'text-gray-400'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className={`font-bold text-sm ${item.isRead ? 'text-gray-500' : 'text-primary-dark'}`}>{item.title}</h4>
                                        <div className="flex items-center gap-2 flex-shrink-0 mr-2">
                                            <span className="text-[10px] text-gray-300">{item.time}</span>
                                            {!item.isRead && <div className="w-2 h-2 rounded-full bg-primary-emerald" />}
                                        </div>
                                    </div>
                                    <p className={`text-xs mt-1 leading-relaxed ${item.isRead ? 'text-gray-400' : 'text-gray-500'}`}>{item.details}</p>
                                    {item.priority === 'critical' && !item.isRead && (
                                        <span className="inline-block mt-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">⚠ عاجل</span>
                                    )}
                                    {item.action && (
                                        <span className="inline-block mt-2 text-[10px] text-primary-emerald font-bold">اضغط للمتابعة ←</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsView;
