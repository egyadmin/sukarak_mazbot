import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react';

const MedicalServicesView = () => {
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const lang = i18n.language === 'ar' ? 'ar' : 'en';

    const services = [
        { label: lang === 'ar' ? 'منتجات العناية بالسكري' : 'Diabetes Care Products', desc: lang === 'ar' ? 'أجهزة قياس · شرائط · إبر · مستلزمات' : 'Monitors · Strips · Needles · Supplies', icon: '💊', path: '/market', gradient: 'from-emerald-400 to-teal-500', lightBg: 'bg-emerald-50' },
        { label: lang === 'ar' ? 'التحاليل الطبية' : 'Medical Tests', desc: lang === 'ar' ? 'احجز تحاليلك المعملية بسهولة' : 'Book your lab tests easily', icon: '🔬', path: '/medical-tests', gradient: 'from-blue-400 to-indigo-500', lightBg: 'bg-blue-50' },
        { label: lang === 'ar' ? 'التمريض المنزلي' : 'Home Nursing', desc: lang === 'ar' ? 'خدمة التمريض في منزلك' : 'Nursing service at your home', icon: '🏠', path: '/nursing', gradient: 'from-rose-400 to-pink-500', lightBg: 'bg-rose-50' },
        { label: lang === 'ar' ? 'استشارة طبيب' : 'Doctor Consultation', desc: lang === 'ar' ? 'تواصل مع أطباء متخصصين' : 'Connect with specialist doctors', icon: '🧑‍⚕️', path: '/appointments', gradient: 'from-teal-400 to-cyan-500', lightBg: 'bg-teal-50' },
        { label: lang === 'ar' ? 'نظام غذائي صحي' : 'Healthy Diet Plan', desc: lang === 'ar' ? 'خطط غذائية مخصصة للسكري' : 'Custom diet plans for diabetes', icon: '🥗', path: '/foods', gradient: 'from-lime-400 to-green-500', lightBg: 'bg-lime-50' },
        { label: lang === 'ar' ? 'مدونة تثقيف السكري' : 'Diabetes Education Blog', desc: lang === 'ar' ? 'مقالات ونصائح طبية' : 'Articles and medical tips', icon: '📖', path: '/blog', gradient: 'from-amber-400 to-orange-500', lightBg: 'bg-amber-50' },
    ];

    return (
        <div className="space-y-5 pb-4">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-xl shadow-sm active:scale-90 transition">
                    <ChevronLeft className="w-5 h-5 text-gray-500 rtl:rotate-180" />
                </button>
                <h1 className="text-xl font-black text-primary-dark">
                    {lang === 'ar' ? 'الخدمات الطبية' : 'Medical Services'}
                </h1>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {services.map((svc, i) => (
                    <motion.button key={i}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        onClick={() => navigate(svc.path)}
                        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 text-center active:scale-95 transition hover:shadow-md flex flex-col items-center gap-3">
                        <div className={`w-14 h-14 bg-gradient-to-br ${svc.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                            {svc.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-primary-dark leading-tight">{svc.label}</h3>
                            <p className="text-[10px] text-gray-400 mt-1">{svc.desc}</p>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default MedicalServicesView;
