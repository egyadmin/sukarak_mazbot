import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Info, Eye, Target } from 'lucide-react';

const AboutUsPage = () => {
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#f8fafc] pb-28" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
                <div className="max-w-lg mx-auto flex items-center gap-3 px-5 py-4">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 transition">
                        <ArrowRight className="w-5 h-5 text-gray-600 rtl:rotate-0 ltr:rotate-180" />
                    </button>
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <Info className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h1 className="text-lg font-black text-gray-800">
                            {isRTL ? 'من نحن' : 'About Us'}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-5 py-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                    {/* App Branding */}
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200 mb-3">
                            <span className="text-3xl">🩺</span>
                        </div>
                        <h2 className="text-xl font-black text-gray-800">
                            {isRTL ? 'سكّرك مظبوط' : 'Sokarak Mazbout'}
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">
                            {isRTL ? 'تطبيق صحي خدمي متكامل لمرضى السكري' : 'Comprehensive Health App for Diabetes Care'}
                        </p>
                    </div>

                    {isRTL ? (
                        <div className="text-sm text-gray-600 leading-relaxed space-y-6">
                            <div>
                                <h3 className="font-black text-gray-800 mb-3 text-base">من نحن</h3>
                                <p>سكّرك مظبوط هو تطبيق صحي خدمي متكامل موجّه لمرضى السكري، يهدف إلى مساعدتهم على إدارة حياتهم اليومية بشكل أذكى وأسهل، من خلال منظومة رقمية تجمع بين الأدوات الذكية، المحتوى التوعوي، والخدمات الصحية المساندة في مكان واحد.</p>
                                <p className="mt-3">يوفّر التطبيق قاعدة بيانات شاملة للأغذية، ونصائح عملية للتغذية والرياضة ونمط الحياة، إلى جانب حاسبات ذكية خاصة بالسكري، منبّه لتذكير الأدوية، وسجل صحي رقمي منظم يساعد المستخدم على المتابعة وتوثيق حالته بسهولة كما يقدّم بطاقات عضوية وخدمات دعم وتوجيه، مع إمكانية استخراج التقارير الصحية بطريقة آمنة وسلسة.</p>
                                <p className="mt-3">ويتيح سكّرك مظبوط أيضًا طلب عدد من الخدمات المرتبطة برعاية مرضى السكري مثل التحاليل الطبية، التمريض المنزلي، منتجات العناية بالسكري، وخدمات مساندة أخرى، بما يساعد على توفير تجربة متكاملة في مكان واحد.</p>
                            </div>

                            {/* Vision */}
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <Eye className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <h3 className="font-black text-emerald-800 text-base">رؤيتنا</h3>
                                </div>
                                <p className="text-emerald-700">أن نكون المنصة العربية الأولى والأكثر ثقة وتأثيرًا في دعم مرضى السكري وتحسين جودة حياتهم</p>
                            </div>

                            {/* Mission */}
                            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-5 border border-teal-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                                        <Target className="w-5 h-5 text-teal-600" />
                                    </div>
                                    <h3 className="font-black text-teal-800 text-base">رسالتنا</h3>
                                </div>
                                <p className="text-teal-700">تمكين مريض السكري من الفهم والمتابعة والتنظيم من خلال تجربة رقمية متكاملة تعتمد على التوعية، الأدوات الذكية، والخدمات المساندة، دون أن تكون بديلًا عن الرعاية الطبية المباشرة</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-600 leading-relaxed space-y-6">
                            <div>
                                <h3 className="font-black text-gray-800 mb-3 text-base">About Us</h3>
                                <p>Sokarak Mazbout is a comprehensive health-service application designed for diabetes patients, aiming to help them manage their daily lives smarter and easier through a digital ecosystem that combines smart tools, awareness content, and supporting health services in one place.</p>
                                <p className="mt-3">The app provides a comprehensive food database, practical tips for nutrition, exercise, and lifestyle, alongside smart diabetes calculators, medication reminders, and an organized digital health record that helps users track and document their condition easily. It also offers membership cards, support and guidance services, with the ability to generate health reports safely and seamlessly.</p>
                                <p className="mt-3">Sokarak Mazbout also enables ordering a range of services related to diabetes care, such as medical tests, home nursing, diabetes care products, and other supporting services, helping provide an integrated experience in one place.</p>
                            </div>

                            {/* Vision */}
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <Eye className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <h3 className="font-black text-emerald-800 text-base">Our Vision</h3>
                                </div>
                                <p className="text-emerald-700">To be the first and most trusted and impactful Arabic platform in supporting diabetes patients and improving their quality of life.</p>
                            </div>

                            {/* Mission */}
                            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-5 border border-teal-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                                        <Target className="w-5 h-5 text-teal-600" />
                                    </div>
                                    <h3 className="font-black text-teal-800 text-base">Our Mission</h3>
                                </div>
                                <p className="text-teal-700">Empowering diabetes patients in understanding, tracking, and organizing through a comprehensive digital experience that relies on awareness, smart tools, and supporting services, without being a substitute for direct medical care.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;
