import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlarmClock, Plus, Trash2, Check, X, Bell, BellOff, Pill, Clock,
    ChevronLeft, Edit3, Volume2, VolumeX, Calendar, Repeat, Sun, Moon, Sunrise, Loader2
} from 'lucide-react';
import { API_BASE as GLOBAL_API } from '../api/config';

const API_PATH = `${GLOBAL_API}/health/reminders`;

const periodIcons = { morning: Sunrise, afternoon: Sun, evening: Moon };
const periodLabels = { morning: 'صباحاً', afternoon: 'ظهراً', evening: 'مساءً' };
const periodColors = {
    morning: { bg: 'from-amber-400 to-orange-500', light: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-200' },
    afternoon: { bg: 'from-sky-400 to-blue-500', light: 'bg-sky-50', text: 'text-sky-600', ring: 'ring-sky-200' },
    evening: { bg: 'from-indigo-500 to-purple-600', light: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-200' },
};

const getPeriod = (time) => {
    const h = parseInt(time.split(':')[0]);
    if (h < 12) return 'morning';
    if (h < 18) return 'afternoon';
    return 'evening';
};

const MedicineReminderView = () => {
    const navigate = useNavigate();
    const [reminders, setReminders] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState('');
    const [dose, setDose] = useState('');
    const [times, setTimes] = useState(['08:00']);
    const [days, setDays] = useState([0, 1, 2, 3, 4, 5, 6]);
    const [notes, setNotes] = useState('');
    const [notifPermission, setNotifPermission] = useState('default');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const intervalRef = useRef(null);
    const audioRef = useRef(null);
    const [ringingId, setRingingId] = useState(null);

    const dayNames = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

    // Load reminders from API
    useEffect(() => {
        loadReminders();
        if ('Notification' in window) setNotifPermission(Notification.permission);
    }, []);

    const loadReminders = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_PATH);
            const data = await res.json();
            setReminders(Array.isArray(data) ? data : []);
        } catch (e) { console.error('Load error:', e); }
        setLoading(false);
    };

    // Request notification permission
    const requestPermission = async () => {
        if ('Notification' in window) {
            const perm = await Notification.requestPermission();
            setNotifPermission(perm);
            if (perm === 'granted') {
                new Notification('✅ تم تفعيل المنبه', {
                    body: 'ستصلك تنبيهات مواعيد الدواء في الوقت المحدد',
                    icon: '💊',
                });
                if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
            }
        }
    };

    // Check reminders every 30 seconds
    useEffect(() => {
        const checkReminders = () => {
            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            const currentDay = now.getDay();

            reminders.forEach(r => {
                if (!r.active) return;
                if (!r.days.includes(currentDay)) return;
                r.times.forEach(t => {
                    if (t === currentTime) {
                        const lastNotif = localStorage.getItem(`notif_${r.id}_${t}_${now.toDateString()}`);
                        if (!lastNotif) {
                            triggerAlarm(r);
                            localStorage.setItem(`notif_${r.id}_${t}_${now.toDateString()}`, 'true');
                        }
                    }
                });
            });
        };

        intervalRef.current = setInterval(checkReminders, 30000);
        checkReminders();
        return () => clearInterval(intervalRef.current);
    }, [reminders]);

    const triggerAlarm = (reminder) => {
        if (Notification.permission === 'granted') {
            new Notification('⏰ موعد الدواء', {
                body: `${reminder.name} - ${reminder.dose}`,
                icon: '💊',
                tag: `med-${reminder.id}`,
                requireInteraction: true,
                vibrate: [200, 100, 200, 100, 200],
            });
        }
        if ('vibrate' in navigator) {
            navigator.vibrate([300, 200, 300, 200, 300, 200, 300]);
        }
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const playBeep = (freq, startTime, duration) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.3, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
                osc.start(startTime);
                osc.stop(startTime + duration);
            };
            for (let round = 0; round < 3; round++) {
                const base = ctx.currentTime + round * 1.5;
                playBeep(880, base, 0.2);
                playBeep(880, base + 0.3, 0.2);
                playBeep(1100, base + 0.6, 0.4);
            }
            audioRef.current = ctx;
        } catch (e) { console.log('Audio error:', e); }
        setRingingId(reminder.id);
    };

    const dismissAlarm = () => {
        setRingingId(null);
        if ('vibrate' in navigator) navigator.vibrate(0);
        if (audioRef.current) {
            try { audioRef.current.close(); } catch { }
            audioRef.current = null;
        }
    };

    // === CRUD with real API ===
    const handleSave = async () => {
        if (!name.trim()) return;
        setSaving(true);
        try {
            if (editingId) {
                await fetch(`${API_PATH}/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, dose, times, days, notes }),
                });
            } else {
                await fetch(API_PATH, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, dose, times, days, notes }),
                });
            }
            await loadReminders();
            resetForm();
        } catch (e) { console.error('Save error:', e); }
        setSaving(false);
    };

    const handleEdit = (r) => {
        setEditingId(r.id);
        setName(r.name);
        setDose(r.dose);
        setTimes(r.times);
        setDays(r.days);
        setNotes(r.notes || '');
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${API_PATH}/${id}`, { method: 'DELETE' });
            setReminders(prev => prev.filter(r => r.id !== id));
        } catch (e) { console.error('Delete error:', e); }
    };

    const toggleActive = async (id) => {
        const r = reminders.find(x => x.id === id);
        if (!r) return;
        try {
            await fetch(`${API_PATH}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !r.active }),
            });
            setReminders(prev => prev.map(x =>
                x.id === id ? { ...x, active: !x.active } : x
            ));
        } catch (e) { console.error('Toggle error:', e); }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setName('');
        setDose('');
        setTimes(['08:00']);
        setDays([0, 1, 2, 3, 4, 5, 6]);
        setNotes('');
    };

    const addTime = () => setTimes(prev => [...prev, '12:00']);
    const removeTime = (idx) => setTimes(prev => prev.filter((_, i) => i !== idx));
    const updateTime = (idx, val) => setTimes(prev => prev.map((t, i) => i === idx ? val : t));
    const toggleDay = (d) => setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort());

    // Group reminders by period
    const grouped = { morning: [], afternoon: [], evening: [] };
    reminders.forEach(r => {
        const mainTime = r.times[0] || '08:00';
        const period = getPeriod(mainTime);
        grouped[period].push(r);
    });

    return (
        <div className="space-y-5 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-xl shadow-sm active:scale-90 transition">
                        <ChevronLeft className="w-5 h-5 text-gray-500 rtl:rotate-180" />
                    </button>
                    <h1 className="text-xl font-black text-primary-dark flex items-center gap-2">
                        <AlarmClock className="w-6 h-6 text-rose-500" /> منبه الدواء
                    </h1>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true); }}
                    className="bg-gradient-to-l from-rose-500 to-red-500 text-white p-2.5 rounded-xl shadow-lg shadow-rose-200/50 active:scale-90 transition">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* Notification Permission Banner */}
            {notifPermission !== 'granted' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-l from-amber-500 to-orange-500 p-4 rounded-2xl text-white flex items-center gap-3">
                    <Bell className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="font-bold text-sm">فعّل الإشعارات</p>
                        <p className="text-xs text-white/80">لتصلك تنبيهات مواعيد الدواء</p>
                    </div>
                    <button onClick={requestPermission}
                        className="bg-white text-orange-600 px-4 py-2 rounded-xl font-black text-xs active:scale-95 transition">
                        تفعيل
                    </button>
                </motion.div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="text-center py-20">
                    <Loader2 className="w-8 h-8 text-rose-400 animate-spin mx-auto" />
                    <p className="text-gray-400 text-sm mt-3 font-bold">جاري التحميل...</p>
                </div>
            ) : reminders.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="text-6xl mb-4">💊</div>
                    <p className="font-black text-lg text-gray-400">لا توجد أدوية مسجلة</p>
                    <p className="text-gray-300 text-xs mt-1">اضغط + لإضافة دواء جديد</p>
                </motion.div>
            ) : (
                Object.entries(grouped).map(([period, items]) => {
                    if (items.length === 0) return null;
                    const colors = periodColors[period];
                    const PIcon = periodIcons[period];
                    return (
                        <div key={period} className="space-y-2.5">
                            <div className="flex items-center gap-2 px-1">
                                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
                                    <PIcon className="w-3.5 h-3.5 text-white" />
                                </div>
                                <h3 className="font-black text-sm text-gray-600">{periodLabels[period]}</h3>
                                <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full font-bold">{items.length}</span>
                            </div>

                            {items.map((r, i) => (
                                <motion.div key={r.id}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all
                                    ${ringingId === r.id ? 'border-rose-400 ring-2 ring-rose-200 animate-pulse' : 'border-gray-50'}
                                    ${!r.active ? 'opacity-50' : ''}`}>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                                    <Pill className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-sm text-primary-dark">{r.name}</h4>
                                                    {r.dose && <p className="text-[10px] text-gray-400 mt-0.5">{r.dose}</p>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => toggleActive(r.id)}
                                                    className={`p-2 rounded-xl transition ${r.active ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-gray-300'}`}>
                                                    {r.active ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                                                </button>
                                                <button onClick={() => handleEdit(r)} className="p-2 rounded-xl bg-blue-50 text-blue-500 transition">
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(r.id)} className="p-2 rounded-xl bg-red-50 text-red-400 transition">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Times */}
                                        <div className="flex gap-2 mt-3 flex-wrap">
                                            {r.times.map((t, ti) => (
                                                <div key={ti} className={`${colors.light} px-3 py-1.5 rounded-xl flex items-center gap-1.5`}>
                                                    <Clock className={`w-3 h-3 ${colors.text}`} />
                                                    <span className={`text-xs font-black ${colors.text}`}>{t}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Days */}
                                        <div className="flex gap-1 mt-2">
                                            {dayNames.map((d, di) => (
                                                <span key={di} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md
                                                    ${r.days.includes(di) ? `${colors.light} ${colors.text}` : 'bg-gray-50 text-gray-300'}`}>
                                                    {d}
                                                </span>
                                            ))}
                                        </div>

                                        {r.notes && <p className="text-[10px] text-gray-400 mt-2 bg-gray-50 px-3 py-1.5 rounded-lg">{r.notes}</p>}
                                    </div>

                                    {ringingId === r.id && (
                                        <div className="bg-rose-50 px-4 py-3 flex items-center justify-between">
                                            <p className="text-xs font-black text-rose-600 animate-bounce">⏰ حان موعد الدواء!</p>
                                            <button onClick={() => dismissAlarm()}
                                                className="bg-rose-500 text-white px-4 py-1.5 rounded-xl text-xs font-black active:scale-95">
                                                تم ✓
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    );
                })
            )}

            {/* Add/Edit Form Modal - Full screen overlay */}
            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1100] flex flex-col justify-end"
                        onClick={(e) => e.target === e.currentTarget && resetForm()}>
                        <motion.div
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="bg-white rounded-t-3xl w-full max-w-md mx-auto flex flex-col" style={{ maxHeight: '85vh' }}>

                            {/* Form Header - Fixed */}
                            <div className="flex items-center justify-between p-6 pb-3 flex-shrink-0">
                                <h2 className="font-black text-lg text-primary-dark">
                                    {editingId ? '✏️ تعديل الدواء' : '💊 إضافة دواء جديد'}
                                </h2>
                                <button onClick={resetForm} className="p-2 bg-gray-100 rounded-xl">
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>

                            {/* Scrollable Form Content */}
                            <div className="flex-1 overflow-y-auto px-6 space-y-4">
                                {/* Medicine Name */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">اسم الدواء *</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                                        placeholder="مثال: ميتفورمين"
                                        className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-rose-400 outline-none transition" />
                                </div>

                                {/* Dose */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">الجرعة</label>
                                    <input type="text" value={dose} onChange={e => setDose(e.target.value)}
                                        placeholder="مثال: حبة واحدة بعد الأكل"
                                        className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-rose-400 outline-none transition" />
                                </div>

                                {/* Times */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-bold text-gray-400">مواعيد التنبيه</label>
                                        <button onClick={addTime} className="text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-xl">
                                            + وقت إضافي
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {times.map((t, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <input type="time" value={t} onChange={e => updateTime(i, e.target.value)}
                                                    className="flex-1 bg-gray-50 p-3 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-rose-400 outline-none text-center" />
                                                {times.length > 1 && (
                                                    <button onClick={() => removeTime(i)} className="p-2.5 bg-red-50 rounded-xl text-red-400">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Days */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">أيام التكرار</label>
                                    <div className="flex gap-1.5">
                                        {dayNames.map((d, i) => (
                                            <button key={i} onClick={() => toggleDay(i)}
                                                className={`flex-1 py-2.5 rounded-xl font-bold text-[10px] transition-all
                                                ${days.includes(i) ? 'bg-gradient-to-b from-rose-500 to-red-500 text-white shadow-md shadow-rose-200' : 'bg-gray-100 text-gray-400'}`}>
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="pb-2">
                                    <label className="block text-sm font-bold text-gray-400 mb-2">ملاحظات</label>
                                    <textarea value={notes} onChange={e => setNotes(e.target.value)}
                                        placeholder="مثال: يؤخذ مع الماء"
                                        rows={2}
                                        className="w-full bg-gray-50 p-3.5 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-rose-400 outline-none transition resize-none" />
                                </div>
                            </div>

                            {/* Save Button - Fixed at bottom, always visible */}
                            <div className="p-6 pt-3 flex-shrink-0 bg-white border-t border-gray-100">
                                <button onClick={handleSave} disabled={!name.trim() || saving}
                                    className="w-full bg-gradient-to-l from-rose-500 to-red-500 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-200/50 disabled:opacity-50 active:scale-[0.98] transition">
                                    {saving ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" /> جاري الحفظ...</>
                                    ) : (
                                        <><Check className="w-5 h-5" /> {editingId ? 'تحديث الدواء' : 'حفظ الدواء'}</>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MedicineReminderView;
