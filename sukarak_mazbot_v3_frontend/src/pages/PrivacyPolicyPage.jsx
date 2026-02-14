import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Shield } from 'lucide-react';

const PrivacyPolicyPage = () => {
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#f8fafc] pb-28" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
                <div className="max-w-lg mx-auto flex items-center gap-3 px-5 py-4">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 transition">
                        <ArrowRight className="w-5 h-5 text-gray-600 rtl:rotate-0 ltr:rotate-180" />
                    </button>
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-teal-600" />
                        </div>
                        <h1 className="text-lg font-black text-gray-800">
                            {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-5 py-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                    {/* App Branding */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-200 mb-3">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-xl font-black text-gray-800">
                            {isRTL ? 'سياسة الخصوصية – سكّرك مظبوط' : 'Privacy Policy – Sokarak Mazbout'}
                        </h2>
                    </div>

                    {isRTL ? (
                        <div className="text-sm text-gray-600 leading-relaxed space-y-5">
                            <p className="text-gray-500 text-xs">يلتزم تطبيق سكّرك مظبوط بحماية خصوصية المستخدمين والتعامل مع بياناتهم بطريقة قانونية وآمنة وشفافة، وذلك وفقًا للأنظمة واللوائح المعمول بها. وباستخدامك للتطبيق، فإنك تقر بموافقتك على جمع واستخدام البيانات وفقًا لما هو موضح في هذه السياسة.</p>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">البيانات التي نقوم بجمعها</h3>
                                <p>قد نقوم بجمع البيانات التي يقدّمها المستخدم طوعًا عند التسجيل أو أثناء استخدام التطبيق، وتشمل على سبيل المثال لا الحصر: بيانات الحساب ووسائل التواصل، البيانات الصحية والمدخلات الخاصة بالمتابعة، بيانات التغذية ونمط الحياة والنشاط، طلبات الخدمات والعضويات، المراسلات مع الدعم الفني، بيانات الاستخدام والبيانات التقنية.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">استخدام البيانات</h3>
                                <p>تُستخدم البيانات للأغراض التالية: تشغيل التطبيق وإدارته، تقديم أدوات المتابعة والتنظيم الصحي، إنشاء التقارير والملخصات، إدارة العضويات والخدمات المطلوبة، تحسين الأداء وتجربة المستخدم، الدعم الفني والتواصل، التحليل الداخلي وتطوير الخدمات.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">البيانات الصحية</h3>
                                <p>جميع البيانات الصحية التي يُدخلها المستخدم تكون باختياره الكامل، وتُستخدم لأغراض تنظيمية وتوعوية فقط. ولا يُعد التطبيق وسيلة للتشخيص الطبي أو العلاج، ولا يُغني عن استشارة الطبيب أو مقدم الرعاية الصحية المختص.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">مشاركة البيانات</h3>
                                <p>لا يتم بيع أو تأجير أو مشاركة البيانات الشخصية مع أي طرف ثالث، باستثناء الحالات التالية: بموافقة صريحة من المستخدم، لتنفيذ خدمة يطلبها المستخدم (وبالحد الأدنى من البيانات اللازمة)، مع مزودي خدمات تقنيين ملتزمين بالسرية، إذا طُلب ذلك بموجب القوانين أو الجهات الرسمية المختصة.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">ملفات تعريف الارتباط (Cookies) والتحليلات</h3>
                                <p>قد يستخدم تطبيق سكّرك مظبوط ملفات تعريف الارتباط وتقنيات تحليل مشابهة بهدف: تحسين أداء التطبيق واستقراره، تحليل أنماط الاستخدام، تطوير الخدمات والخصائص، اكتشاف الأعطال وتحسين الجودة. لا تُستخدم ملفات الارتباط لجمع بيانات طبية حساسة، وتقتصر على أغراض تحليلية وتشغيلية فقط. يمكن للمستخدم التحكم في إعدادات ملفات الارتباط من خلال إعدادات الجهاز، مع العلم أن تعطيلها قد يؤثر على بعض وظائف التطبيق.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">حماية وأمن البيانات</h3>
                                <p>نطبق إجراءات تقنية وتنظيمية مناسبة لحماية البيانات من الوصول غير المصرح به أو التعديل أو الفقد أو سوء الاستخدام. ورغم ذلك، لا يمكن ضمان الأمان الكامل لأي نظام إلكتروني، ويقر المستخدم بإدراك هذا الأمر.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">حقوق المستخدم</h3>
                                <p>يحق للمستخدم الاطلاع على بياناته الشخصية، تعديل أو تحديث بياناته، طلب حذف البيانات، سحب الموافقة في أي وقت (عند الاقتضاء) وذلك من خلال إعدادات التطبيق أو عبر التواصل مع فريق الدعم.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">الاحتفاظ بالبيانات</h3>
                                <p>يتم الاحتفاظ بالبيانات فقط للمدة اللازمة لتحقيق الأغراض الموضحة في هذه السياسة، أو للامتثال للمتطلبات القانونية، ثم يتم حذفها أو إخفاء هويتها بشكل آمن.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">التعديلات على سياسة الخصوصية</h3>
                                <p>يحتفظ تطبيق سكّرك مظبوط بحقه في تعديل أو تحديث سياسة الخصوصية في أي وقت. وسيتم إخطار المستخدم بأي تغييرات جوهرية من خلال التطبيق أو القنوات الرسمية. ويُعد استمرار استخدام التطبيق بعد التحديث موافقة صريحة على السياسة المعدلة.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">التواصل معنا</h3>
                                <p>لأي استفسارات متعلقة بسياسة الخصوصية، يمكن التواصل عبر: 📧 sukarakmazbout@gmail.com</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-600 leading-relaxed space-y-5">
                            <p className="text-gray-500 text-xs">Sokarak Mazbout is committed to protecting users' privacy and handling personal data in a lawful, secure, and transparent manner, in accordance with applicable laws and regulations. By using the application, you acknowledge and agree to the collection and use of information as described in this Privacy Policy.</p>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">1. Information We Collect</h3>
                                <p>We may collect information that users voluntarily provide when registering or using the application, including but not limited to: Account and contact information, Health-related entries and follow-up data, Lifestyle, nutrition, and activity-related inputs, Service requests and membership details, Communications with support, Technical and usage-related data.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">2. Purpose of Data Use</h3>
                                <p>Collected data is used strictly for the following purposes: Operating and maintaining the application, Providing health organization and follow-up tools, Generating reports and summaries, Managing memberships and requested services, Improving functionality, performance, and user experience, Conducting internal analytics and service optimization, Providing technical support and communication.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">3. Health Data Disclaimer</h3>
                                <p>Any health-related data entered into the application is provided voluntarily by the user and is used for informational, organizational, and awareness purposes only. Sokarak Mazbout does not provide medical diagnosis, prescriptions, or treatment and does not replace consultation with a licensed healthcare professional.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">4. Data Sharing and Disclosure</h3>
                                <p>User data is not sold, rented, or traded to third parties. Data may only be shared in the following cases: With the user's explicit consent, When necessary to fulfill a requested service (limited to the minimum required data), With service providers supporting app operations under confidentiality obligations, When required by law, regulation, or official authorities.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">5. Cookies & Analytics</h3>
                                <p>Sokarak Mazbout may use cookies and similar tracking technologies to improve performance and user experience. These technologies may be used to analyze app usage and interaction patterns, improve functionality and stability, measure performance and detect errors, support internal analytics and development. Cookies and analytics tools do not collect sensitive personal or medical data and are used only for operational and analytical purposes. Users may control or disable cookies through their device or browser settings; however, some features may not function properly if disabled.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">6. Data Protection and Security</h3>
                                <p>We apply appropriate technical and organizational security measures to protect personal data against unauthorized access, alteration, misuse, or loss. While we take reasonable steps to safeguard data, no electronic system can guarantee absolute security, and users acknowledge this inherent risk.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">7. User Rights</h3>
                                <p>Users have the right to: Access their personal data, Update or correct their information, Request deletion of their data, Withdraw consent where applicable. Requests can be submitted through the application or by contacting customer support.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">8. Data Retention</h3>
                                <p>User data is retained only for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, or resolve disputes, after which it is securely deleted or anonymized.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">9. Policy Updates</h3>
                                <p>Sokarak Mazbout reserves the right to modify or update this Privacy Policy at any time. Material changes will be communicated through the application or official communication channels. Continued use of the application after updates constitutes acceptance of the revised policy.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">10. Contact Information</h3>
                                <p>For any questions or concerns regarding this Privacy Policy, please contact us via: 📧 sukarakmazbout@gmail.com</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
