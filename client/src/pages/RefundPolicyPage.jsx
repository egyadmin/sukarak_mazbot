import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, RotateCcw } from 'lucide-react';

const RefundPolicyPage = () => {
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
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                            <RotateCcw className="w-5 h-5 text-rose-600" />
                        </div>
                        <h1 className="text-lg font-black text-gray-800">
                            {isRTL ? 'سياسة الاسترجاع' : 'Refund Policy'}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-5 py-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-200 mb-3">
                            <RotateCcw className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-xl font-black text-gray-800">
                            {isRTL ? 'سياسة الاسترجاع – سكّرك مظبوط' : 'Returning Policy – Sokarak Mazbout'}
                        </h2>
                    </div>

                    {isRTL ? (
                        <div className="text-sm text-gray-600 leading-relaxed space-y-5">
                            <p className="text-gray-500 text-xs">تهدف سياسة الاسترجاع في تطبيق سكّرك مظبوط إلى تنظيم عملية إرجاع المنتجات بما يضمن حقوق المستخدمين والبائعين، وذلك وفقًا للشروط والأحكام التالية:</p>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">أولًا: شروط قبول طلبات الاسترجاع</h3>
                                <p>يحق للعميل طلب استرجاع المنتج خلال مدة لا تتجاوز 7 أيام من تاريخ الاستلام، بشرط استيفاء ما يلي:</p>
                                <ul className="list-disc list-inside mt-2 space-y-1.5">
                                    <li>أن يكون المنتج في حالته الأصلية دون استخدام.</li>
                                    <li>أن يكون مرفقًا بجميع الملصقات (Tags) والتغليف الأصلي.</li>
                                    <li>عدم تعرّض المنتج لأي تلف أو كسر أو تغيير في حالته.</li>
                                </ul>
                                <p className="mt-2">أي طلب استرجاع لا يستوفي هذه الشروط لن يتم قبوله.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">ثانيًا: آلية استرداد المبالغ</h3>
                                <p className="font-semibold text-gray-700 mt-2">الطلبات المدفوعة عند الاستلام (Cash on Delivery):</p>
                                <ul className="list-disc list-inside mt-1 space-y-1.5">
                                    <li>لا يتم رد المبالغ نقدًا.</li>
                                    <li>يتم تعويض العميل برصيد داخل التطبيق (Store Credit) يمكن استخدامه لاحقًا في عمليات شراء أخرى.</li>
                                    <li>تخضع أي عملية شراء لاحقة لنفس رسوم الشحن أو الدفع عند الاستلام – إن وُجدت.</li>
                                </ul>
                                <p className="font-semibold text-gray-700 mt-3">الطلبات المدفوعة ببطاقات الدفع الإلكتروني:</p>
                                <ul className="list-disc list-inside mt-1 space-y-1.5">
                                    <li>يتم رد المبلغ إلى نفس البطاقة المستخدمة في عملية الشراء.</li>
                                    <li>يبدأ تنفيذ رد المبلغ بعد استلام المنتج المرتجع من البائع خلال مدة لا تتجاوز 7 أيام من تاريخ الإرجاع.</li>
                                    <li>قد يستغرق ظهور المبلغ في حساب العميل البنكي حتى 14 يومًا وفقًا لسياسة البنك المُصدر للبطاقة.</li>
                                </ul>
                                <p className="mt-2 font-semibold text-gray-700">ملاحظات مهمة:</p>
                                <ul className="list-disc list-inside mt-1 space-y-1.5">
                                    <li>لا يتم رد رسوم الشحن أو رسوم الدفع عند الاستلام أو أي رسوم جمركية.</li>
                                    <li>يتم رد ضريبة القيمة المضافة الخاصة بالمنتج فقط.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">ثالثًا: المنتجات غير القابلة للاسترجاع</h3>
                                <p>نظرًا لطبيعة بعض المنتجات ومتطلبات السلامة الصحية والتخزين، لا يمكن استرجاع أو استبدال بعض الأصناف، ومنها على سبيل المثال لا الحصر:</p>
                                <ul className="list-disc list-inside mt-2 space-y-1.5">
                                    <li>المنتجات الغذائية والتغذية الصحية</li>
                                    <li>المكملات الغذائية</li>
                                    <li>منتجات العناية الشخصية أو الجلدية</li>
                                    <li>أي منتجات مختومة أو مغلقة بإحكام</li>
                                    <li>أي منتجات أخرى يحدد البائع عدم قابليتها للاسترجاع</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">رابعًا: طريقة تقديم طلب الاسترجاع</h3>
                                <p>لتقديم طلب استرجاع، يجب على العميل:</p>
                                <ul className="list-disc list-inside mt-2 space-y-1.5">
                                    <li>إرسال بريد إلكتروني إلى: sukarakmazbout@gmail.com</li>
                                    <li>إرفاق رقم الطلب.</li>
                                    <li>تحديد المنتج/المنتجات المراد إرجاعها.</li>
                                    <li>إرسال صور واضحة توضح حالة المنتج والتغليف الأصلي.</li>
                                </ul>
                                <p className="mt-2">في حال استيفاء الشروط، يقوم فريق الدعم بالتنسيق مع البائع لبدء إجراءات الاسترجاع.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">خامسًا: آلية إعادة الشحن</h3>
                                <ul className="list-disc list-inside space-y-1.5">
                                    <li>يجب على العميل طباعة بوليصة الشحن الخاصة بالإرجاع وإرفاقها مع المنتج.</li>
                                    <li>يتم تسليم الشحنة من خلال شركة الشحن المعتمدة لدى البائع فقط.</li>
                                    <li>لا يُسمح للعميل باختيار شركة شحن بديلة.</li>
                                    <li>بعد استلام المنتج من قِبل البائع والتأكد من مطابقته للشروط، يتم تنفيذ عملية رد المبلغ أو إضافة الرصيد حسب الحالة.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">سادسًا: حالات خاصة وتنبيهات مهمة</h3>
                                <ul className="list-disc list-inside space-y-1.5">
                                    <li>يجب إعادة المنتج خلال مدة لا تتجاوز 7 أيام من تاريخ الموافقة على طلب الإرجاع، وأي تأخير يؤدي إلى رفض الطلب.</li>
                                    <li>في حال إعادة منتجات غير مدرجة ضمن طلب الاسترجاع المعتمد، سيتم إرجاعها للعميل مع تحمّله كامل تكلفة الشحن.</li>
                                    <li>في حال إعادة منتج بحالة غير أصلية أو مستخدم، يتحمّل العميل تكاليف الشحن، ويحق للبائع رفض الاسترجاع.</li>
                                    <li>إذا كانت تكلفة إعادة الشحن أعلى من قيمة المنتج، يحق للبائع إلغاء عملية الاسترجاع وعدم إصدار أي تعويض.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">سابعًا: المنتجات التالفة أو المعيبة</h3>
                                <p>جميع المنتجات تخضع للفحص قبل الشحن، ومع ذلك في حال استلام منتج تالف أو به عيب، يجب على العميل التواصل مع خدمة العملاء خلال 48 ساعة من الاستلام عبر البريد الإلكتروني المذكور، مع إرفاق صور واضحة توضح العيب، ليتم اتخاذ الإجراء المناسب.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">ثامنًا: تأكيد الاستلام والمعالجة</h3>
                                <p>بعد استلام المنتج المرتجع، سيقوم فريق خدمة العملاء بإرسال رسالة تأكيد، والبدء في تنفيذ عملية رد الرصيد أو المبلغ وفقًا لما هو منصوص عليه في هذه السياسة.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-600 leading-relaxed space-y-5">
                            <div>
                                <h3 className="font-black text-gray-800 mb-2">Return Conditions</h3>
                                <p>Customers can request the return of the purchased item for the seller partner within 7 days from the date of delivery. Item must be in original condition, not used, along with the original tag.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">Refunding the Purchase</h3>
                                <p>Monetary refunds on Cash on Delivery purchases are not accepted. Orders can only be refunded as a store credit, which can be used for future purchases. Any future purchases will be subject to the same COD/shipping fees procedures if applicable. All Credit Card refunds will be credited back to the original payment card used for the transaction.</p>
                                <p className="mt-2">Shipping fees, Cash on Delivery fees, taxes, and/or customs duties incurred will not be refunded. Value Added Tax (VAT) on the product, however, will be refunded.</p>
                                <p className="mt-2">Refunds in-store credit can be processed once the item is returned to the seller (within 14 days from returning it to the shipped location), and a credit will appear in the customer's account within 24 hours.</p>
                                <p className="mt-2">A credit card refund can be processed once the item is returned to the seller (within 7 days from returning it to the shipped location), but it might take up to 14 days for the refund to show up on the credit card statement, depending on the customer's bank.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">Returns Exclusions</h3>
                                <p>For hygiene and storage environment purposes, some items cannot be exchanged or refunded by sellers, such as some Nutrition and Healthy Food and Skincare, and other similar items. Products that come in sealed packaging cannot be exchanged or refunded.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">Requesting Returns</h3>
                                <p>The customer should send an email to Customer Support team sukarakmazbout@gmail.com and provide the order number and the items he/she wish to return, within 7 days from the date of delivery. The customer should provide an image for the item showing its condition and the original tag/box. If the item meets the requirements, the support team will contact the seller to mediate the product return process.</p>
                            </div>

                            <div>
                                <h3 className="font-black text-gray-800 mb-2">Additional Information</h3>
                                <p>The item must be returned to the seller within 7 days. Any returns requested after the mentioned period will not be accepted. All items must be returned in their original packaging with all tags attached. The customer will not be allowed to choose their means of shipping the products; it will be returned through the shipping company/companies the seller works with only.</p>
                                <p className="mt-2">The return and refund process could be available only if the order is damaged. The seller will refund you for the products minus the additional shipping cost to return the order. If the cost to return the shipment is greater than the value of the products, your package will be abandoned, and no refund will be available.</p>
                                <p className="mt-2">All items are quality checked before dispatch; however, if you receive a damaged or faulty item, then please send an email to the Customer Support team at sukarakmazbout@gmail.com within 48 hours of receiving.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RefundPolicyPage;
