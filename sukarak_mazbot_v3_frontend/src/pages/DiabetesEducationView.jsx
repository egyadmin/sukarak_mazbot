import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ArrowRight, ExternalLink, BookOpen } from 'lucide-react';

const DiabetesEducationView = () => {
    const navigate = useNavigate();

    const courses = [
        {
            title: 'كورس تثقيفي للسكري',
            desc: 'كل ما تحتاج معرفته عن مرض السكري وكيفية التعامل معه يومياً',
            icon: '🎯',
            gradient: 'from-indigo-500 to-blue-600',
            lightBg: 'bg-indigo-50',
            url: 'https://www.udemy.com/course/jnihfygs/?referralCode=476E1EE82187F2E00EEF',
        },
        {
            title: 'إدارة الوزن',
            desc: 'تعلم كيف تدير وزنك بطريقة صحية وفعالة مع مرض السكري',
            icon: '⚖️',
            gradient: 'from-emerald-500 to-teal-600',
            lightBg: 'bg-emerald-50',
            url: 'https://www.udemy.com/course/nnfltkmz/?referralCode=2E4181B9FFC242803EAA',
        },
        {
            title: 'دبلوم التغذية الرياضية',
            desc: 'أساسيات التغذية الرياضية وكيفية ممارسة الرياضة بأمان',
            icon: '🏃',
            gradient: 'from-orange-500 to-amber-600',
            lightBg: 'bg-orange-50',
            url: 'https://www.udemy.com/course/sports-nutrition-diploma/?referralCode=90261B91A42EFA1C92EC',
        },
        {
            title: 'دبلوم المكملات الغذائية',
            desc: 'تعرف على المكملات الغذائية المفيدة ودورها في صحتك',
            icon: '💊',
            gradient: 'from-purple-500 to-violet-600',
            lightBg: 'bg-purple-50',
            url: 'https://www.udemy.com/course/nutraceuticals-diploma-essentials/?referralCode=30AF53FBE8934FC6DFA2',
        },
    ];

    return (
        <div className="space-y-5 pb-24">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-xl shadow-sm active:scale-90 transition">
                    <ChevronLeft className="w-5 h-5 text-gray-500 rtl:rotate-180" />
                </button>
                <h1 className="text-xl font-black text-primary-dark">مدونة تثقيف السكري</h1>
                <ArrowRight className="w-4 h-4 text-gray-300 rtl:rotate-180" />
            </div>

            {/* Hero Banner with Courses */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-500 p-5 rounded-3xl text-white relative overflow-hidden space-y-5">
                <div className="absolute top-[-30px] right-[-30px] w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-[-20px] left-[-20px] w-28 h-28 bg-white/5 rounded-full blur-xl" />

                {/* Header Info */}
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <BookOpen className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h2 className="font-black text-lg mb-1">كورسات ودبلومات تعليمية</h2>
                        <p className="text-white/80 text-xs leading-relaxed max-w-[200px]">
                            مجموعة مختارة من أفضل الكورسات التعليمية
                        </p>
                    </div>
                </div>

                {/* Courses Grid Inside Banner */}
                <div className="relative z-10 grid grid-cols-2 gap-2.5">
                    {courses.map((course, idx) => (
                        <motion.a key={idx}
                            href={course.url} target="_blank" rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + (idx * 0.1) }}
                            className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 flex flex-col items-center text-center active:scale-95 transition-all shadow-sm"
                        >
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${course.gradient} flex items-center justify-center mb-2 shadow-md`}>
                                <span className="text-lg">{course.icon}</span>
                            </div>
                            <h3 className="font-black text-[10px] text-gray-800 mb-0.5 line-clamp-1">{course.title}</h3>
                            <p className="text-[8px] text-gray-500 leading-tight line-clamp-2">{course.desc}</p>
                        </motion.a>
                    ))}
                </div>
            </motion.div>

            {/* Blog Link */}
            <motion.button
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                onClick={() => navigate('/blog')}
                className="w-full bg-sky-50 border border-sky-100 p-4 rounded-2xl flex items-center justify-between active:scale-[0.98] transition-all"
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">📝</span>
                    <div>
                        <h3 className="font-black text-sm text-sky-700">مدونة تثقيف السكري</h3>
                        <p className="text-[10px] text-sky-500">مقالات ونصائح طبية يومية</p>
                    </div>
                </div>
                <ChevronLeft className="w-4 h-4 text-sky-400" />
            </motion.button>
        </div>
    );
};

export default DiabetesEducationView;
