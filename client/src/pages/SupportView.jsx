import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Headset, Send, MessageSquare, Clock, CheckCircle2,
    AlertCircle, ChevronDown, ArrowRight, Plus, X,
    HelpCircle, Mail, Phone, MessageCircle, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_BASE } from '../api/config';

const SupportView = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const lang = i18n.language === 'ar' ? 'ar' : 'en';

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewTicket, setShowNewTicket] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [expandedTicket, setExpandedTicket] = useState(null);
    const [success, setSuccess] = useState(false);
    const [ratingTicket, setRatingTicket] = useState(null); // {id, rating, comment}
    const [ratingSubmitting, setRatingSubmitting] = useState(false);

    const [form, setForm] = useState({
        subject: '',
        message: '',
        priority: 'medium'
    });

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await fetch(`${API_BASE}/support/tickets/my`);
            if (res.ok) {
                const data = await res.json();
                setTickets(data);
            }
        } catch (err) {
            console.error('Error fetching tickets:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.subject || !form.message) return;

        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/support/tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                setSuccess(true);
                setForm({ subject: '', message: '', priority: 'medium' });
                setTimeout(() => {
                    setSuccess(false);
                    setShowNewTicket(false);
                    fetchTickets();
                }, 2000);
            }
        } catch (err) {
            console.error('Error submitting ticket:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', icon: Clock, label: lang === 'ar' ? 'قيد الانتظار' : 'Pending' };
            case 'replied': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: MessageSquare, label: lang === 'ar' ? 'تم الرد' : 'Replied' };
            case 'closed': return { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-100', icon: CheckCircle2, label: lang === 'ar' ? 'مغلق' : 'Closed' };
            default: return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', icon: AlertCircle, label: status };
        }
    };

    const priorities = [
        { id: 'low', label: lang === 'ar' ? 'منخفضة' : 'Low', color: 'bg-blue-500' },
        { id: 'medium', label: lang === 'ar' ? 'متوسطة' : 'Medium', color: 'bg-amber-500' },
        { id: 'high', label: lang === 'ar' ? 'عالية' : 'High', color: 'bg-red-500' },
    ];

    const submitRating = async (ticketId) => {
        if (!ratingTicket || ratingTicket.rating < 1) return;
        setRatingSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/support/tickets/${ticketId}/rate`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating: ratingTicket.rating, rating_comment: ratingTicket.comment || '' })
            });
            if (res.ok) {
                setRatingTicket(null);
                fetchTickets();
            }
        } catch (err) {
            console.error('Error rating ticket:', err);
        } finally {
            setRatingSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 pb-24">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-xl shadow-sm active:scale-95 transition">
                        <ArrowRight className={`w-5 h-5 text-gray-400 ${lang === 'ar' ? '' : 'rotate-180'}`} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-primary-dark">{lang === 'ar' ? 'الدعم الفني' : 'Support Center'}</h2>
                        <p className="text-[10px] text-gray-400 font-bold">{lang === 'ar' ? 'نحن هنا لمساعدتكم 24/7' : 'We are here to help 24/7'}</p>
                    </div>
                </div>
                <button onClick={() => setShowNewTicket(true)} className="bg-primary-emerald text-white p-3 rounded-2xl shadow-lg shadow-emerald-200/50">
                    <Plus className="w-6 h-6" />
                </button>
            </div>

            {/* Quick Contact Methods */}
            <div className="grid grid-cols-2 gap-3">
                <a href="https://wa.me/201027696380" target="_blank" rel="noreferrer"
                    className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-3xl text-white flex flex-col items-center gap-2 shadow-lg shadow-emerald-200/50 active:scale-95 transition">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        <MessageCircle className="w-6 h-6" />
                    </div>
                    <span className="font-black text-sm">{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                    <span className="text-[9px] text-white/70">{lang === 'ar' ? 'تواصل مباشر' : 'Direct chat'}</span>
                </a>
                <a href="mailto:sukarakmazbout@gmail.com"
                    className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-3xl text-white flex flex-col items-center gap-2 shadow-lg shadow-blue-200/50 active:scale-95 transition">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        <Mail className="w-6 h-6" />
                    </div>
                    <span className="font-black text-sm">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Us'}</span>
                    <span className="text-[9px] text-white/70">sukarakmazbout@gmail.com</span>
                </a>
            </div>


            {/* Tickets Section */}
            <div>
                <h3 className="font-black text-sm text-gray-700 mb-3">{lang === 'ar' ? '📋 تذاكر الدعم' : '📋 Support Tickets'}</h3>
                <div className="space-y-3">
                    {loading ? <div className="text-center py-10 font-bold text-gray-400">Loading...</div> : tickets.length === 0 ? (
                        <div className="text-center py-8 bg-white rounded-3xl border border-dashed border-gray-200">
                            <Headset className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                            <p className="text-gray-400 font-bold text-sm">{lang === 'ar' ? 'لا توجد تذاكر دعم' : 'No support tickets'}</p>
                            <p className="text-[10px] text-gray-300 mt-1">{lang === 'ar' ? 'اضغط + لإنشاء تذكرة جديدة' : 'Press + to create a new ticket'}</p>
                        </div>
                    ) : tickets.map((t, i) => {
                        const status = getStatusStyle(t.status);
                        const StatusIcon = status.icon;
                        const isExpanded = expandedTicket === t.id;
                        const createdDate = t.created_at ? new Date(t.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
                        const repliedDate = t.replied_at ? new Date(t.replied_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
                        return (
                            <motion.div key={t.id} layout
                                onClick={() => setExpandedTicket(isExpanded ? null : t.id)}
                                className={`bg-white rounded-3xl p-4 shadow-sm border space-y-3 cursor-pointer transition-all ${t.status === 'replied' ? 'border-emerald-200' : 'border-gray-50'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-black text-sm text-primary-dark">{t.subject}</h4>
                                        <p className="text-[10px] text-gray-400">{createdDate}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black ${status.bg} ${status.text} ${status.border} border`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {status.label}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl">
                                    <p className="text-[10px] text-gray-400 font-bold mb-1">{lang === 'ar' ? 'رسالتك:' : 'Your message:'}</p>
                                    <p className={`text-xs text-gray-600 ${isExpanded ? '' : 'line-clamp-2'}`}>{t.message}</p>
                                </div>
                                {isExpanded && t.admin_reply && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                        className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <MessageSquare className="w-3 h-3 text-emerald-500" />
                                            <p className="text-[10px] text-emerald-600 font-black">{lang === 'ar' ? 'رد الفريق الطبي:' : 'Team Reply:'}</p>
                                            <span className="text-[9px] text-emerald-400 mr-auto">{repliedDate}</span>
                                        </div>
                                        <p className="text-xs text-gray-700">{t.admin_reply}</p>
                                    </motion.div>
                                )}
                                {isExpanded && !t.admin_reply && t.status === 'pending' && (
                                    <div className="bg-amber-50 p-3 rounded-xl flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-amber-400" />
                                        <p className="text-[10px] text-amber-600 font-bold">{lang === 'ar' ? 'بانتظار رد الفريق الطبي...' : 'Waiting for team reply...'}</p>
                                    </div>
                                )}
                                {/* Rating section for closed tickets */}
                                {isExpanded && t.status === 'closed' && !t.rating && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                        className="bg-amber-50 p-4 rounded-xl border border-amber-100 space-y-3"
                                        onClick={e => e.stopPropagation()}>
                                        <p className="text-xs text-amber-700 font-black text-center">{lang === 'ar' ? '⭐ كيف تقيّم تجربتك مع فريق الدعم؟' : '⭐ How would you rate your support experience?'}</p>
                                        <div className="flex justify-center gap-2">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button key={star}
                                                    onClick={() => setRatingTicket({ id: t.id, rating: star, comment: ratingTicket?.comment || '' })}
                                                    className="transition-transform active:scale-90">
                                                    <Star className={`w-8 h-8 transition ${ratingTicket?.id === t.id && ratingTicket?.rating >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                                                </button>
                                            ))}
                                        </div>
                                        {ratingTicket?.id === t.id && ratingTicket?.rating > 0 && (
                                            <>
                                                <input
                                                    placeholder={lang === 'ar' ? 'تعليق (اختياري)...' : 'Comment (optional)...'}
                                                    value={ratingTicket?.comment || ''}
                                                    onChange={e => setRatingTicket({ ...ratingTicket, comment: e.target.value })}
                                                    className="w-full bg-white p-3 rounded-xl outline-none text-xs border border-amber-100"
                                                />
                                                <button onClick={() => submitRating(t.id)} disabled={ratingSubmitting}
                                                    className="w-full bg-amber-500 text-white py-3 rounded-xl font-black text-sm shadow-lg">
                                                    {ratingSubmitting ? '...' : (lang === 'ar' ? 'إرسال التقييم' : 'Submit Rating')}
                                                </button>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                                {/* Show existing rating */}
                                {t.rating && (
                                    <div className="flex items-center gap-2 bg-amber-50 p-2 rounded-xl">
                                        <span className="text-[10px] text-amber-600 font-black">{lang === 'ar' ? 'تقييمك:' : 'Your rating:'}</span>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} className={`w-4 h-4 ${s <= t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                        {t.rating_comment && <span className="text-[9px] text-gray-500 mr-auto">{t.rating_comment}</span>}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence>
                {showNewTicket && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm flex flex-col justify-end" onClick={() => setShowNewTicket(false)}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-black text-primary-dark">{lang === 'ar' ? 'تذكرة دعم جديدة' : 'New Support Ticket'}</h3>
                                <X onClick={() => setShowNewTicket(false)} className="w-6 h-6 text-gray-400 cursor-pointer" />
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input placeholder={lang === 'ar' ? 'الموضوع' : 'Subject'} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full bg-gray-50 p-4 rounded-2xl outline-none" />
                                <div className="flex gap-2">
                                    {priorities.map(p => (
                                        <button type="button" key={p.id} onClick={() => setForm({ ...form, priority: p.id })} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition ${form.priority === p.id ? 'bg-primary-dark text-white' : 'bg-gray-50 text-gray-400'}`}>{p.label}</button>
                                    ))}
                                </div>
                                <textarea placeholder={lang === 'ar' ? 'الرسالة' : 'Message'} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full bg-gray-50 p-4 rounded-2xl outline-none h-32" />
                                <button type="submit" disabled={submitting} className="w-full bg-primary-emerald text-white py-4 rounded-2xl font-black shadow-lg">
                                    {submitting ? '...' : (lang === 'ar' ? 'إرسال' : 'Send')}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SupportView;
