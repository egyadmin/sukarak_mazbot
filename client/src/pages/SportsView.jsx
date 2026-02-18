import React, { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const allowedSports = [
    { name: 'المشي السريع', icon: '🚶', benefit: 'يحسن حساسية الأنسولين ويخفض السكر', duration: '30-45 دقيقة' },
    { name: 'السباحة', icon: '🏊', benefit: 'تمرين شامل للجسم بدون ضغط على المفاصل', duration: '20-30 دقيقة' },
    { name: 'ركوب الدراجة', icon: '🚴', benefit: 'يقوي القلب ويحرق السعرات بفعالية', duration: '30-45 دقيقة' },
    { name: 'التمارين الهوائية', icon: '💪', benefit: 'تحسين اللياقة والتحكم بالسكر', duration: '20-30 دقيقة' },
    { name: 'اليوجا', icon: '🧘', benefit: 'تقلل التوتر وتحسن مرونة الجسم', duration: '30-60 دقيقة' },
    { name: 'تمارين المقاومة', icon: '🏋️', benefit: 'بناء العضلات يحسن حرق الجلوكوز', duration: '20-30 دقيقة' },
    { name: 'الرقص', icon: '💃', benefit: 'ممتع ويحرق سعرات عالية', duration: '30-45 دقيقة' },
    { name: 'كرة السلة', icon: '🏀', benefit: 'تمرين كارديو ممتاز', duration: '30 دقيقة' },
    { name: 'كرة الطائرة', icon: '🏐', benefit: 'نشاط جماعي معتدل الشدة', duration: '30-45 دقيقة' },
    { name: 'التنس', icon: '🎾', benefit: 'يحسن التنسيق واللياقة', duration: '30 دقيقة' },
];

const forbiddenSports = [
    { name: 'رياضات القتال العنيفة', icon: '🥊', reason: 'خطر الإصابة وإرتفاع السكر المفاجئ بسبب الإجهاد الشديد', risk: 'عالي' },
    { name: 'الغوص العميق', icon: '🤿', reason: 'خطر انخفاض السكر تحت الماء وصعوبة التعامل معه', risk: 'عالي' },
    { name: 'تسلق الجبال الشاهقة', icon: '🧗', reason: 'الارتفاعات العالية تؤثر على مستوى السكر والأكسجين', risk: 'عالي' },
    { name: 'رفع الأثقال الثقيلة جداً', icon: '🏋️‍♂️', reason: 'يرفع ضغط الدم بشكل مفاجئ ويؤثر على الأوعية', risk: 'متوسط' },
    { name: 'سباقات الماراثون', icon: '🏃‍♂️', reason: 'إجهاد شديد طويل المدة يسبب نقص حاد في السكر', risk: 'عالي' },
    { name: 'القفز بالحبال (بانجي)', icon: '🪂', reason: 'إفراز أدرينالين مفاجئ يسبب ارتفاع السكر', risk: 'عالي' },
    { name: 'التزلج على الجليد', icon: '⛷️', reason: 'البرودة الشديدة تخفي أعراض انخفاض السكر', risk: 'متوسط' },
    { name: 'الرياضات الخطرة (باركور)', icon: '🤸', reason: 'خطر السقوط والإصابة مع بطء التئام الجروح', risk: 'عالي' },
];

const guidelines = [
    { id: 1, title: 'استشارة الطبيب', subtitle: 'إرشادات ونصائح', icon: '🩺', color: 'from-teal-500 to-emerald-500', details: 'استشر طبيبك قبل البدء في أي برنامج رياضي جديد. تأكد من أن النشاط البدني المختار مناسب لحالتك الصحية ومستوى السكر لديك.' },
    { id: 2, title: 'مراقبة مستويات السكر', subtitle: 'إرشادات ونصائح', icon: '📊', color: 'from-blue-500 to-indigo-500', details: 'قم بقياس مستوى السكر قبل وأثناء وبعد التمرين. إذا كان مستوى السكر أقل من 100 أو أعلى من 250، تجنب ممارسة الرياضة.' },
    { id: 3, title: 'المعدات المناسبة', subtitle: 'إرشادات ونصائح', icon: '👟', color: 'from-purple-500 to-pink-500', details: 'ارتدِ أحذية رياضية مريحة ومناسبة لحماية قدميك. استخدم جوارب قطنية ناعمة وتجنب ممارسة الرياضة حافي القدمين.' },
    { id: 4, title: 'احمل وجبة خفيفة', subtitle: 'إرشادات ونصائح', icon: '🍫', color: 'from-orange-500 to-amber-500', details: 'احمل دائماً وجبة خفيفة أو عصير عند ممارسة الرياضة لتجنب انخفاض السكر المفاجئ. توقف فوراً عند الشعور بالدوخة أو التعرق الشديد.' },
    { id: 5, title: 'توقيت التمرين', subtitle: 'إرشادات ونصائح', icon: '⏰', color: 'from-cyan-500 to-sky-500', details: 'مارس الرياضة بعد الأكل بساعة إلى ساعتين. تجنب التمرين في أوقات ذروة تأثير الأنسولين أو على معدة فارغة.' },
];

const SportsView = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('guidelines');
    const [expandedForbidden, setExpandedForbidden] = useState(null);

    return (
        <div className="space-y-6 pb-24 font-cairo" dir="rtl">
            <h2 className="text-2xl font-black text-primary-dark">الرياضة والنشاط البدني</h2>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button onClick={() => setActiveTab('guidelines')} className={`px-4 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === 'guidelines' ? 'bg-primary-emerald text-white shadow-lg shadow-emerald-200' : 'bg-white text-gray-400 border border-gray-100'}`}>
                    📋 الإرشادات
                </button>
                <button onClick={() => setActiveTab('allowed')} className={`px-4 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === 'allowed' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-white text-gray-400 border border-gray-100'}`}>
                    ✅ مسموحة
                </button>
                <button onClick={() => setActiveTab('forbidden')} className={`px-4 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === 'forbidden' ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-white text-gray-400 border border-gray-100'}`}>
                    🚫 ممنوعة
                </button>
            </div>

            {activeTab === 'guidelines' && (
                <div className="space-y-4">
                    {guidelines.map((g) => (
                        <motion.div key={g.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-50">
                            <div className="flex items-center gap-4 mb-3">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${g.color} flex items-center justify-center text-2xl shadow-lg`}>{g.icon}</div>
                                <div>
                                    <h4 className="font-black text-primary-dark">{g.title}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{g.subtitle}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">{g.details}</p>
                        </motion.div>
                    ))}
                </div>
            )}

            {activeTab === 'allowed' && (
                <div className="space-y-3">
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-5 rounded-3xl text-white relative overflow-hidden">
                        <div className="absolute -top-6 -left-6 w-28 h-28 bg-white/10 rounded-full" />
                        <div className="relative z-10 flex items-center gap-3">
                            <span className="text-4xl">✅</span>
                            <div>
                                <h3 className="font-black text-lg">رياضات مسموحة</h3>
                                <p className="text-white/70 text-xs">{allowedSports.length} رياضة آمنة لمرضى السكري</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {allowedSports.map((sport, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 flex items-start gap-4">
                                <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">{sport.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-black text-primary-dark text-sm">{sport.name}</h4>
                                        <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">✓ آمن</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 leading-relaxed">{sport.benefit}</p>
                                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold">
                                        <span>⏱️</span>
                                        <span>{sport.duration}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'forbidden' && (
                <div className="space-y-3">
                    <div className="bg-gradient-to-br from-red-500 to-rose-600 p-5 rounded-3xl text-white relative overflow-hidden">
                        <div className="absolute -top-6 -left-6 w-28 h-28 bg-white/10 rounded-full" />
                        <div className="relative z-10 flex items-center gap-3">
                            <span className="text-4xl">🚫</span>
                            <div>
                                <h3 className="font-black text-lg">رياضات ممنوعة</h3>
                                <p className="text-white/70 text-xs">تجنب هذه الرياضات لخطورتها على مرضى السكري</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                        <p className="text-xs text-amber-700 font-bold text-center">⚠️ هذه الرياضات قد تسبب مضاعفات خطيرة. استشر طبيبك دائماً.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {forbiddenSports.map((sport, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                onClick={() => setExpandedForbidden(expandedForbidden === i ? null : i)}
                                className="bg-white p-4 rounded-2xl shadow-sm border border-red-100 cursor-pointer hover:shadow-md transition-all">
                                <div className="flex items-start gap-4">
                                    <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">{sport.icon}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-black text-primary-dark text-sm">{sport.name}</h4>
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${sport.risk === 'عالي' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {sport.risk === 'عالي' ? '🔴 خطر عالي' : '🟡 خطر متوسط'}
                                            </span>
                                        </div>
                                        {expandedForbidden === i && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                                <p className="text-[11px] text-red-600 leading-relaxed bg-red-50 p-3 rounded-xl mt-2">
                                                    <span className="font-black">السبب: </span>{sport.reason}
                                                </p>
                                            </motion.div>
                                        )}
                                        {expandedForbidden !== i && (
                                            <p className="text-[10px] text-gray-400">اضغط لمعرفة السبب</p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            <button onClick={() => navigate('/health-tracking?tab=exercise')} className="w-full bg-primary-dark text-white py-4 rounded-3xl font-black flex items-center justify-center gap-3 shadow-xl shadow-primary-dark/20 active:scale-[0.98] transition">
                <Dumbbell className="w-6 h-6" /> سجل تمارينك الآن
            </button>
        </div>
    );
};

export default SportsView;
