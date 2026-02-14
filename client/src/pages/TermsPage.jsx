import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, FileText } from 'lucide-react';

const TermsPage = () => {
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
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h1 className="text-lg font-black text-gray-800">
                            {isRTL ? 'الشروط والأحكام' : 'Terms & Conditions'}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-5 py-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-200 mb-3">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-xl font-black text-gray-800">
                            {isRTL ? 'الشروط والأحكام – سكّرك مظبوط' : 'Terms & Conditions – Sokarak Mazbout'}
                        </h2>
                    </div>

                    {isRTL ? (
                        <div className="text-sm text-gray-600 leading-relaxed space-y-5">
                            <p className="text-gray-500 text-xs">تم تأسيس تطبيق سكّرك مظبوط عام 2026، وهو منصة تقنية متقدمة تهدف إلى تقديم معلومات وأدوات دعم وخدمات متنوعة من خلال شركاء معتمدين. باستخدامك لتطبيق سكّرك مظبوط، فإنك تقرّ بموافقتك الكاملة والملزمة على هذه الشروط والأحكام. وقد تخضع بعض الخدمات لشروط إضافية يتم توضيحها عند الاستخدام. كما يخضع استخدامك للتطبيق أيضًا لسياسة الخصوصية الخاصة بنا، والتي تُعد جزءًا لا يتجزأ من هذه الشروط.</p>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">أولًا: الأهلية القانونية واستخدام التطبيق</h3>
                                <p>باستخدامك للتطبيق، فإنك تقر وتتعهد بأن عمرك 18 عامًا أو أكثر، وأنك تتمتع بالأهلية القانونية الكاملة لإبرام هذا الاتفاق.</p>
                                <p className="mt-2">التطبيق غير موجه أو مخصص للأشخاص دون سن 18 عامًا، ولا نقوم عن قصد بجمع أي بيانات شخصية تخصهم. في حال كنت دون 18 عامًا، يُحظر عليك استخدام التطبيق أو إرسال أي بيانات شخصية من خلاله.</p>
                                <p className="mt-2">يتم تشغيل التطبيق من جمهورية مصر العربية والمملكة العربية السعودية، وتخضع البيانات الشخصية المقدمة لأحكام القوانين واللوائح المعمول بها في هاتين الدولتين.</p>
                                <p className="mt-2">وباستخدامك للتطبيق، فإنك توافق صراحة على السماح بجمع واستخدام ومعالجة ومشاركة بياناتك — بما في ذلك البيانات الشخصية وبيانات الاستخدام والموقع الجغرافي — لأغراض تشغيل التطبيق، إنشاء قواعد بيانات المستخدمين، تحسين جودة الخدمات، التطوير الفني، التحليل، التسويق، أو أي أغراض أخرى مرتبطة بالتطبيق، وذلك وفقًا لسياسة الخصوصية المعتمدة.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">ثانيًا: حقوق الملكية الفكرية والعلامات التجارية</h3>
                                <p>تقر بأن جميع المحتويات المتاحة عبر التطبيق، بما في ذلك — على سبيل المثال لا الحصر — النصوص، التصاميم، الرسومات، الصور، الشعارات، الأصوات، البرمجيات، قواعد البيانات، البرامج، الواجهات، وأسلوب العرض والتنظيم (ويُشار إليها مجتمعة بـ "المحتوى")، هي ملك حصري لتطبيق سكّرك مظبوط أو للجهات المالكة لها، ومحميّة بموجب قوانين الملكية الفكرية المعمول بها في مصر والسعودية والاتفاقيات الدولية ذات الصلة.</p>
                                <p className="mt-2">كما أن جميع العلامات التجارية والأسماء التجارية والشعارات المستخدمة داخل التطبيق، بما في ذلك اسم Sukarak Mazbout / سكّرك مظبوط، هي علامات مملوكة حصريًا للتطبيق، ولا يجوز نسخها أو استخدامها أو إعادة إنتاجها أو تعديلها أو نشرها كليًا أو جزئيًا دون موافقة كتابية مسبقة وصريحة من إدارة التطبيق.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">ثالثًا: التعويض وإخلاء المسؤولية</h3>
                                <p>يوافق المستخدم على تعويض وحماية وإبراء ذمة تطبيق سكّرك مظبوط، وإدارته، ومالكيه، وموظفيه، وممثليه، وشركائه، وخلفائه، من أي مطالبات أو خسائر أو أضرار أو تكاليف أو مصروفات (بما في ذلك أتعاب المحاماة) تنشأ عن: استخدامه أو إساءة استخدامه للتطبيق، عدم قدرته على استخدام التطبيق، أي منتجات أو خدمات تم الحصول عليها من خلال التطبيق، أي محتوى أو نشاط صادر من حسابه، مخالفته لأي بند من بنود هذه الشروط، انتهاكه لحقوق أي طرف ثالث، مخالفته لأي قوانين أو لوائح سارية.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">رابعًا: سياسة الاسترجاع والمسؤولية عن الطلبات</h3>
                                <p>لا يضمن التطبيق إتاحة خدمة الاسترجاع أو التواصل مع البائع إلا في حالة وجود تلف مثبت في الطلب. يتحمل البائع أو مقدم الخدمة مسؤولية رد المبلغ بعد خصم تكاليف الشحن الخاصة بإرجاع الطلب. في حال كانت تكلفة إعادة الشحن أعلى من قيمة المنتج، يحق للتطبيق أو البائع إلغاء عملية الاسترجاع دون أي تعويض، ويُعتبر المنتج متروكًا دون استرداد.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">خامسًا: إخلاء المسؤولية العامة</h3>
                                <p>يقر المستخدم بأن استخدام التطبيق أو أي من برامجه أو خدماته يتم على مسؤوليته الشخصية الكاملة. يتم توفير التطبيق والمحتوى والبرامج والخدمات وفق مبدأ "كما هي" و"حسب الإتاحة" دون أي ضمانات صريحة أو ضمنية.</p>
                                <p className="mt-2">وتخلي إدارة سكّرك مظبوط مسؤوليتها — إلى أقصى حد يسمح به القانون — عن أي ضمانات، صريحة أو ضمنية، بما في ذلك على سبيل المثال لا الحصر: ضمان القابلية للتسويق، الملاءمة لغرض معين، عدم التعدي على حقوق الغير.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">سادسًا: حدود المسؤولية القانونية</h3>
                                <p>إلى أقصى حد يسمح به القانون، لا تتحمل إدارة سكّرك مظبوط أي مسؤولية عن أي أضرار غير مباشرة أو عرضية أو تبعية، بما في ذلك — دون حصر — خسارة الأرباح، فقدان البيانات، فقدان السمعة، توقف الأعمال، أو تكاليف استبدال الخدمات أو المنتجات.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">سابعًا: القيود القانونية المحلية</h3>
                                <p>قد لا تسمح بعض القوانين أو الأنظمة في بعض الدول أو المناطق باستبعاد أو تقييد بعض أنواع المسؤولية، وفي هذه الحالة تُطبق القيود بالحد الأقصى المسموح به قانونًا فقط.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">ثامنًا: إنهاء الاستخدام</h3>
                                <p>في حال عدم رضاك عن أي جزء من التطبيق أو عن هذه الشروط، فإن الحل الوحيد والحصري هو التوقف عن استخدام التطبيق أو أي من خدماته.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">تاسعًا: عدم تقديم ضمانات طبية أو علاجية</h3>
                                <p>لا يقدم تطبيق سكّرك مظبوط أي تشخيص طبي أو علاج أو بديل عن استشارة الطبيب أو مقدم الرعاية الصحية المختص. جميع المعلومات، الأدوات، التوجيهات، البرامج، أو المحتويات المقدمة هي لأغراض توعوية وتنظيمية فقط، ولا تُعد توصية طبية مباشرة.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">عاشرًا: التواصل والدعم</h3>
                                <p>في حال وجود أي استفسارات بخصوص هذه الشروط والأحكام، يمكن التواصل مع فريق دعم سكّرك مظبوط عبر البريد الإلكتروني التالي: 📧 sukarakmazbout@gmail.com</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-600 leading-relaxed space-y-5">
                            <p className="text-gray-500 text-xs">Sukarak Mazbout was founded in 2026. This application is a high-technology platform that provides information, support tools, and services through partners. By using the Sukarak Mazbout application, you agree to these conditions.</p>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">Authority</h3>
                                <p>By using our Site, you represent and agree that you are at least 18 years of age or older and are fully able and competent to enter into the terms, conditions, representations, and warranties outlined in this Agreement. The Site is not intended or designed to attract users under the age of 18. We do not collect personal information from any person we know to be under the age of 18. The Site is operated from Egypt and KSA, and personal information sent to us is governed by the privacy policies of Egypt and KSA.</p>
                                <p className="mt-2">By using the Sukarak Mazbout application, you allow the sharing of your data, location, or any information the application needs, whether for the purpose of creating a database of users, or for the purpose of quality, improvement, marketing, or any other purposes related to the application.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">Copyright and Trademarks</h3>
                                <p>You acknowledge that all materials on the Site, such as Reviews and Rewards Programs, including the Site's design, text, graphics, sounds, pictures, software, and other files and the selection and arrangement thereof (collectively, "Materials"), are our property and are subject to and protected by Egypt and KSA copyright and other intellectual property laws and rights.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">Indemnification</h3>
                                <p>You agree to indemnify, defend and hold harmless Sukarak Mazbout from and against all losses, expenses, costs and damages including attorney's fees resulting from your use of or contact on the App, your use or your inability to use the application, any products or services purchased or obtained by you in connection with the Site, your violation of any terms of this Agreement, your breach of any rights of a third party, or your violation of any applicable laws, rules or regulations.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">Disclaimer of Warranties</h3>
                                <p>You agree that the use of the application or participation in any program is at your sole risk. The application, the programs, and the materials contained therein are provided on an "as is" and "as available" basis. Sukarak Mazbout entities expressly disclaim all warranties of any kind, whether express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">Limitation of Liability</h3>
                                <p>To the maximum extent permitted by applicable law, in no event shall Sukarak Mazbout entities be liable for any indirect, incidental, special or consequential damages (including damages for loss of business, loss of profits, loss of goodwill, loss of use, loss of data, cost of procuring substitute goods, services or information, litigation or the like).</p>
                                <p className="mt-2">(i) if you are a customer, the maximum liability of Sukarak Mazbout entities shall be limited to contact the seller or service provider for assistance. (ii) if you are a participant in any program, the maximum liability shall be limited to the followup under the applicable program during the 12 months prior to the date leading to liability.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">Medical Disclaimer</h3>
                                <p>Sokarak Mazbout does not provide medical diagnosis, treatment, or substitute for consultation with a licensed healthcare professional. All information, tools, guidance, programs, or content provided are for awareness and organizational purposes only, and do not constitute direct medical advice.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">Contact</h3>
                                <p>If you have any questions about this Agreement, contact with Sukarak Mazbout support team by sending to this email address: 📧 sukarakmazbout@gmail.com</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
