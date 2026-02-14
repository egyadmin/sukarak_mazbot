import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Crown, Star, Check, ChevronLeft, Gift, Sparkles,
    CreditCard, Loader2, X, Award, Heart, Search, Plus
} from 'lucide-react';
import { API_BASE } from '../api/config';

const MembershipCardsView = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const lang = i18n.language === 'ar' ? 'ar' : 'en';
    const [cards, setCards] = useState([]);
    const [mySubscription, setMySubscription] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [ordering, setOrdering] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const iconMap = { silver: <Star className="w-8 h-8" />, gold: <Crown className="w-8 h-8" />, platinum: <Award className="w-8 h-8" /> };
    const cardBgMap = { silver: 'from-slate-400 to-slate-600', gold: 'from-amber-400 to-yellow-600', platinum: 'from-violet-500 to-indigo-700' };
    const glowMap = { silver: 'shadow-slate-200/60', gold: 'shadow-amber-200/60', platinum: 'shadow-violet-200/60' };
    const borderMap = { silver: 'border-slate-200', gold: 'border-amber-200', platinum: 'border-violet-200' };
    const gradientMap = { silver: 'from-gray-300 via-gray-100 to-gray-300', gold: 'from-yellow-300 via-amber-200 to-yellow-400', platinum: 'from-violet-300 via-purple-200 to-indigo-300' };

    useEffect(() => {
        const load = async () => {
            try {
                const [cardsRes, subRes] = await Promise.all([
                    fetch(`${API_BASE}/membership/cards`),
                    fetch(`${API_BASE}/membership/cards/my-subscription`),
                ]);
                if (cardsRes.ok) setCards(await cardsRes.json());
                if (subRes.ok) {
                    const sub = await subRes.json();
                    setMySubscription(sub);
                }
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        load();
    }, []);

    const handleOrder = async (card) => {
        setOrdering(true);
        try {
            // Try XPay payment first
            const res = await fetch(`${API_BASE}/payments/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payment_type: 'membership',
                    amount: card.prices?.SA || 0,
                    currency: 'SAR',
                    card_type: card.card_type,
                    user: { id: 1, name: 'User', email: 'user@app.com', phone: '0500000000' }
                })
            });
            const data = await res.json();
            if (data.iframe_url) {
                // Open XPay payment iframe
                window.open(data.iframe_url, '_blank');
                setOrdering(false);
                setSelectedCard(null);
                return;
            }
        } catch (err) {
            console.log('XPay not available, using direct:', err);
        }

        // Fallback - direct subscription
        try {
            const res = await fetch(`${API_BASE}/membership/cards/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    card_type: card.card_type,
                    amount: card.prices?.SA || 0,
                    currency: 'SAR',
                })
            });
            if (res.ok) {
                setOrderSuccess(true);
                const sub = await res.json();
                setMySubscription({ card_type: card.card_type, status: 'active' });
                setTimeout(() => { setOrderSuccess(false); setSelectedCard(null); }, 2500);
            }
        } catch (err) { console.error(err); }
        setOrdering(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-emerald" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl shadow-sm active:scale-90 transition">
                    <ChevronLeft className="w-5 h-5 text-gray-500 rtl:rotate-180" />
                </button>
                <h1 className="text-xl font-black text-primary-dark flex items-center gap-2">
                    🏆 {lang === 'ar' ? 'بطاقات العضوية' : 'Membership Cards'}
                </h1>
            </div>

            {/* Active Subscription */}
            {mySubscription && mySubscription.card_type && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-emerald-500 to-teal-600 p-5 rounded-3xl text-white relative overflow-hidden">
                    <div className="absolute top-[-20px] right-[-20px] w-28 h-28 bg-white/10 rounded-full blur-xl" />
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Check className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-white/70 text-xs">{lang === 'ar' ? 'اشتراكك الحالي' : 'Current Subscription'}</p>
                            <p className="font-black text-lg">{lang === 'ar' ? mySubscription.card_name_ar : mySubscription.card_name_en || mySubscription.card_type}</p>
                        </div>
                    </div>
                    {mySubscription.end_date && (
                        <p className="text-xs text-white/60 mt-2">{lang === 'ar' ? 'صالح حتى' : 'Valid until'}: {mySubscription.end_date}</p>
                    )}
                </motion.div>
            )}

            {/* Intro Banner */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-primary-dark via-primary-emerald to-teal-500 p-6 rounded-3xl text-white relative overflow-hidden">
                <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                        <span className="text-xs font-bold text-white/80">{lang === 'ar' ? 'عضوية حصرية' : 'Exclusive Membership'}</span>
                    </div>
                    <h2 className="text-lg font-black mb-1">{lang === 'ar' ? 'اشترك الآن واستمتع بمزايا فائقة' : 'Subscribe now & enjoy premium benefits'}</h2>
                    <p className="text-xs text-white/70">{lang === 'ar' ? 'اختر الباقة المناسبة واحصل على خصومات، كورسات مجانية، وخدمات طبية مميزة' : 'Choose the right plan and get discounts, free courses, and premium medical services'}</p>
                </div>
            </motion.div>

            {/* Search Bar */}
            <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                <Search className="w-5 h-5 text-gray-300" />
                <input
                    type="text"
                    placeholder={lang === 'ar' ? 'ابحث عن بطاقة...' : 'Search for a card...'}
                    className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 w-full placeholder:text-gray-300"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Cards from DB */}
            <div className="space-y-5">
                {cards.filter(c =>
                    (c.name_ar && c.name_ar.toLowerCase().includes(search.toLowerCase())) ||
                    (c.name_en && c.name_en.toLowerCase().includes(search.toLowerCase())) ||
                    (c.card_type && c.card_type.toLowerCase().includes(search.toLowerCase()))
                ).map((card, idx) => {
                    const isGold = card.card_type === 'gold';
                    return (
                        <motion.div key={card.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.15 }}
                            className={`relative bg-white rounded-[28px] shadow-lg ${glowMap[card.card_type] || ''} border ${borderMap[card.card_type] || 'border-gray-200'} overflow-hidden`}>

                            {isGold && (
                                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-1.5 text-[10px] font-black tracking-wider uppercase">
                                    ⭐ {lang === 'ar' ? 'الأكثر طلباً' : 'Most Popular'} ⭐
                                </div>
                            )}

                            <div className={`p-6 ${isGold ? 'pt-10' : ''}`}>
                                {/* Card Visual */}
                                <div className={`bg-gradient-to-br ${cardBgMap[card.card_type] || 'from-gray-400 to-gray-600'} rounded-2xl p-5 mb-5 relative overflow-hidden shadow-xl`}>
                                    <div className="absolute top-[-20px] right-[-20px] w-28 h-28 bg-white/10 rounded-full blur-xl" />
                                    <div className="relative flex items-center justify-between text-white">
                                        <div>
                                            <p className="text-white/60 text-[10px] mb-0.5">{lang === 'ar' ? 'سُكَّرك مظبوط' : 'Sukarak Mazboot'}</p>
                                            <p className="text-lg font-black">{lang === 'ar' ? card.name_ar : card.name_en}</p>
                                        </div>
                                        <div className="text-white/80">{iconMap[card.card_type] || <Star className="w-8 h-8" />}</div>
                                    </div>
                                    <div className="mt-4 flex items-end gap-1 text-white">
                                        <span className="text-3xl font-black">{card.prices?.SA || 0}</span>
                                        <span className="text-sm font-bold text-white/70 mb-1">SAR / {lang === 'ar' ? 'سنوياً' : 'year'}</span>
                                    </div>
                                    <div className="absolute bottom-3 left-5 flex gap-1.5">
                                        {[...Array(4)].map((_, i) => <div key={i} className="w-6 h-1 bg-white/20 rounded-full" />)}
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="space-y-3 mb-5">
                                    {(lang === 'ar' ? card.features_ar : card.features_en).map((feat, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${gradientMap[card.card_type] || 'from-gray-200 to-gray-300'} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-600 leading-relaxed">{feat}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <button onClick={() => setSelectedCard(card)}
                                    className={`w-full bg-gradient-to-l ${cardBgMap[card.card_type] || 'from-gray-400 to-gray-600'} text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all`}>
                                    <CreditCard className="w-5 h-5" />
                                    {lang === 'ar' ? 'اطلب الآن' : 'Order Now'}
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Gift Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-3xl border border-pink-100 overflow-hidden relative">
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-pink-200/20 rounded-full blur-2xl" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200/50">
                            <Gift className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-black text-pink-700">{lang === 'ar' ? 'إهداء باقة' : 'Gift a Package'}</h3>
                            <p className="text-[10px] text-pink-400">{lang === 'ar' ? 'اختر الباقة' : 'Choose plan'}</p>
                        </div>
                        <span className="mr-auto bg-pink-500 text-white text-[9px] px-2.5 py-1 rounded-full font-black">🎀 {lang === 'ar' ? 'هدية' : 'Gift'}</span>
                    </div>
                    <div className="space-y-2 mb-4">
                        {(lang === 'ar'
                            ? ['أهدِ أحبائك باقة صحية', 'اختر أي باقة من القائمة', 'رسالة إهداء مخصصة', 'كارت إهداء رقمي أنيق']
                            : ['Gift your loved ones a health package', 'Choose any plan', 'Custom gift message', 'Elegant digital gift card']
                        ).map((f, fi) => (
                            <div key={fi} className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-gray-600 font-bold">{f}</span>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => alert(lang === 'ar' ? 'ميزة الإهداء قريباً! 🎁' : 'Gift feature coming soon! 🎁')}
                        className="w-full bg-gradient-to-l from-pink-500 to-rose-500 text-white py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-200/50 active:scale-[0.98] transition">
                        🎁 {lang === 'ar' ? 'أهدِ الآن' : 'Gift Now'}
                    </button>
                </div>
            </motion.div>

            {/* Order Modal */}
            <AnimatePresence>
                {selectedCard && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm flex items-end justify-center"
                        onClick={() => !ordering && setSelectedCard(null)}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="w-full max-w-lg bg-white rounded-t-3xl p-6 space-y-5"
                            onClick={e => e.stopPropagation()}>
                            {orderSuccess ? (
                                <div className="text-center py-8">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                        className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check className="w-10 h-10 text-emerald-500" />
                                    </motion.div>
                                    <h3 className="text-xl font-black text-primary-dark">{lang === 'ar' ? 'تم الطلب بنجاح! 🎉' : 'Order Placed! 🎉'}</h3>
                                    <p className="text-sm text-gray-400 mt-2">{lang === 'ar' ? 'سيتم تفعيل بطاقتك خلال 24 ساعة' : 'Your card will be activated within 24 hours'}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-black text-primary-dark text-lg">{lang === 'ar' ? 'تأكيد الطلب' : 'Confirm Order'}</h3>
                                        <button onClick={() => setSelectedCard(null)} className="p-2 bg-gray-100 rounded-xl"><X className="w-4 h-4 text-gray-400" /></button>
                                    </div>
                                    <div className={`bg-gradient-to-br ${cardBgMap[selectedCard.card_type] || 'from-gray-400 to-gray-600'} p-5 rounded-2xl text-white`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white/60 text-xs">{lang === 'ar' ? 'سُكَّرك مظبوط' : 'Sukarak Mazboot'}</p>
                                                <p className="font-black text-lg">{lang === 'ar' ? selectedCard.name_ar : selectedCard.name_en}</p>
                                            </div>
                                            {iconMap[selectedCard.card_type]}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">{lang === 'ar' ? 'رسوم الاشتراك السنوي' : 'Annual subscription'}</span>
                                            <span className="font-black text-gray-700">{selectedCard.prices?.SA || 0} SAR</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">{lang === 'ar' ? 'ضريبة القيمة المضافة (15%)' : 'VAT (15%)'}</span>
                                            <span className="font-black text-gray-700">{((selectedCard.prices?.SA || 0) * 0.15).toFixed(2)} SAR</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-2 flex justify-between">
                                            <span className="font-black text-primary-dark">{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                                            <span className="font-black text-primary-emerald text-lg">{((selectedCard.prices?.SA || 0) * 1.15).toFixed(2)} SAR</span>
                                        </div>
                                    </div>
                                    <button onClick={() => handleOrder(selectedCard)} disabled={ordering}
                                        className="w-full bg-gradient-to-l from-primary-dark to-primary-emerald text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 active:scale-[0.98] transition">
                                        {ordering ? <><Loader2 className="w-5 h-5 animate-spin" /> {lang === 'ar' ? 'جاري الطلب...' : 'Processing...'}</> :
                                            <><CreditCard className="w-5 h-5" /> {lang === 'ar' ? 'تأكيد الدفع' : 'Confirm Payment'}</>}
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MembershipCardsView;
