import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Package, Truck, CheckCircle, XCircle, Clock, CreditCard, RefreshCw, FileText, ChevronDown, ShoppingBag, AlertTriangle, RotateCcw, Download, X, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { API_BASE } from '../api/config';
import InvoicePage from './InvoicePage';
import { formatPrice } from '../utils/currencyUtils';

const API = `${API_BASE}/market`;

const statusConfig = {
    confirmed: { label: 'تم التأكيد', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', emoji: '📋' },
    processing: { label: 'جاري التجهيز', icon: Package, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', emoji: '📦' },
    shipped: { label: 'تم الشحن', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', emoji: '🚚' },
    delivered: { label: 'تم التوصيل', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', emoji: '✅' },
    cancelled: { label: 'ملغى', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', emoji: '❌' },
    refunded: { label: 'تم الاسترجاع', icon: RotateCcw, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', emoji: '🔄' },
    pending: { label: 'بانتظار الدفع', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', emoji: '⏳' },
};

const paymentLabels = {
    card: { label: 'بطاقة بنكية', icon: '💳' },
    cod: { label: 'عند الاستلام', icon: '💵' },
    wallet: { label: 'المحفظة', icon: '👛' },
};

const getTimeline = (status) => {
    const steps = [
        { key: 'confirmed', label: 'تأكيد', icon: '📋', done: false },
        { key: 'processing', label: 'تجهيز', icon: '📦', done: false },
        { key: 'shipped', label: 'شحن', icon: '🚚', done: false },
        { key: 'delivered', label: 'توصيل', icon: '✅', done: false },
    ];
    const order = ['confirmed', 'processing', 'shipped', 'delivered'];
    const idx = order.indexOf(status);
    steps.forEach((s, i) => { s.done = i <= idx; });
    return steps;
};

const MyOrdersView = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [nursingBookings, setNursingBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mainTab, setMainTab] = useState('orders'); // 'orders' or 'services'
    const [activeTab, setActiveTab] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [refundingId, setRefundingId] = useState(null);
    const [showInvoice, setShowInvoice] = useState(null);
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const invoiceRef = useRef(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const [oRes, nRes] = await Promise.all([
                fetch(`${API}/orders?user_id=52`),
                fetch(`${API_BASE}/nursing/bookings`)
            ]);
            if (oRes.ok) setOrders(await oRes.json());
            if (nRes.ok) setNursingBookings(await nRes.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const tabs = [
        { id: 'all', label: 'الكل', emoji: '📋' },
        { id: 'confirmed', label: 'مؤكد', emoji: '✅' },
        { id: 'processing', label: 'جاري التجهيز', emoji: '📦' },
        { id: 'shipped', label: 'شحن', emoji: '🚚' },
        { id: 'delivered', label: 'مكتمل', emoji: '🎉' },
        { id: 'cancelled', label: 'ملغى', emoji: '❌' },
    ];

    const filteredOrders = (activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab))
        .slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const requestRefund = async (orderId) => {
        setRefundingId(orderId);
        try {
            await fetch(`${API}/orders/${orderId}/status?status=refunded`, { method: 'PUT' });
            fetchOrders();
        } catch (err) { console.error(err); }
        setRefundingId(null);
    };

    const cancelOrder = async (orderId) => {
        try {
            await fetch(`${API}/orders/${orderId}/status?status=cancelled`, { method: 'PUT' });
            fetchOrders();
        } catch (err) { console.error(err); }
    };

    const getTimeline = (status) => {
        const steps = [
            { key: 'confirmed', label: 'تم التأكيد', icon: '📋' },
            { key: 'processing', label: 'جاري التجهيز', icon: '📦' },
            { key: 'shipped', label: 'تم الشحن', icon: '🚚' },
            { key: 'delivered', label: 'تم التوصيل', icon: '✅' },
        ];
        const statusOrder = ['confirmed', 'processing', 'shipped', 'delivered'];
        const currentIdx = statusOrder.indexOf(status);
        return steps.map((s, i) => ({ ...s, done: i <= currentIdx, active: i === currentIdx }));
    };

    const formatDate = (iso) => {
        if (!iso) return '--';
        const d = new Date(iso);
        return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const formatDateShort = (iso) => {
        if (!iso) return '--';
        const d = new Date(iso);
        return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    // PDF DOWNLOAD
    const downloadInvoicePdf = async () => {
        if (!invoiceRef.current) return;
        setDownloadingPdf(true);
        try {
            const canvas = await html2canvas(invoiceRef.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                allowTaint: true,
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`فاتورة-${showInvoice.order_number}.pdf`);
        } catch (err) {
            console.error('PDF Error:', err);
        }
        setDownloadingPdf(false);
    };

    return (
        <div className="space-y-4 pb-32">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-xl shadow-sm active:scale-95 transition">
                        <ArrowRight className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-primary-dark">📦 طلباتي</h2>
                        <p className="text-[10px] text-gray-400">تتبع طلباتك وعرض فواتيرك بسهولة</p>
                    </div>
                </div>
            </div>

            {/* MAIN TABS */}
            <div className="flex p-1 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <button onClick={() => setMainTab('orders')}
                    className={`flex-1 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${mainTab === 'orders' ? 'bg-primary-emerald text-white shadow-md' : 'text-gray-400'}`}>
                    <ShoppingBag className="w-4 h-4" /> طلبات المتجر
                </button>
                <button onClick={() => setMainTab('services')}
                    className={`flex-1 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${mainTab === 'services' ? 'bg-primary-emerald text-white shadow-md' : 'text-gray-400'}`}>
                    <RefreshCw className="w-4 h-4" /> الخدمات الطبية
                </button>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-3 gap-2.5">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3.5 rounded-2xl text-white text-center relative overflow-hidden">
                    <div className="absolute -top-3 -left-3 w-12 h-12 bg-white/10 rounded-full" />
                    <p className="text-2xl font-black relative z-10">{orders.length}</p>
                    <p className="text-[10px] opacity-80">إجمالي الطلبات</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3.5 rounded-2xl text-white text-center relative overflow-hidden">
                    <div className="absolute -top-3 -left-3 w-12 h-12 bg-white/10 rounded-full" />
                    <p className="text-2xl font-black relative z-10">{orders.filter(o => o.status === 'delivered').length}</p>
                    <p className="text-[10px] opacity-80">مكتمل</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-amber-500 to-orange-500 p-3.5 rounded-2xl text-white text-center relative overflow-hidden">
                    <div className="absolute -top-3 -left-3 w-12 h-12 bg-white/10 rounded-full" />
                    <p className="text-2xl font-black relative z-10">{orders.filter(o => ['confirmed', 'processing', 'shipped'].includes(o.status)).length}</p>
                    <p className="text-[10px] opacity-80">نشط</p>
                </motion.div>
            </div>


            {/* ORDERS LIST */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white p-5 rounded-2xl animate-pulse">
                            <div className="h-5 bg-gray-100 rounded-lg w-2/3 mb-3" />
                            <div className="h-4 bg-gray-100 rounded-lg w-1/2 mb-2" />
                        </div>
                    ))}
                </div>
            ) : mainTab === 'orders' ? (
                <>
                    {/* Filter Tabs for Products */}
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {tabs.map(tab => {
                            const count = tab.id === 'all' ? orders.length : orders.filter(o => o.status === tab.id).length;
                            return (
                                <motion.button key={tab.id} whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`whitespace-nowrap px-3.5 py-2 rounded-2xl font-bold text-xs transition-all flex items-center gap-1.5
                                    ${activeTab === tab.id ? 'bg-primary-dark text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}>
                                    <span>{tab.emoji}</span> {tab.label}
                                    {count > 0 && <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'}`}>{count}</span>}
                                </motion.button>
                            );
                        })}
                    </div>

                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 mt-4">
                            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-400 font-bold text-lg mb-1">لا توجد طلبات</p>
                            <button onClick={() => navigate('/market')} className="bg-primary-emerald text-white px-6 py-2.5 rounded-xl font-bold text-sm mt-3">🛍️ تسوق الآن</button>
                        </div>
                    ) : (
                        <div className="space-y-3 mt-4">
                            {filteredOrders.map((order, idx) => {
                                const config = statusConfig[order.status] || statusConfig.pending;
                                const isExpanded = expandedOrder === order.id;
                                return (
                                    <motion.div key={order.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
                                        <div className="p-4 cursor-pointer" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <p className="font-black text-sm text-primary-dark">{order.order_number}</p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${config.bg} ${config.color} border ${config.border}`}>
                                                    {config.label}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <p className="text-xs text-gray-400">{order.items?.length || 0} منتج</p>
                                                <p className="font-black text-lg text-primary-emerald">{formatPrice(order.total_amount)}</p>
                                            </div>
                                        </div>
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3">
                                                    {/* Order Timeline */}
                                                    {!['cancelled', 'refunded'].includes(order.status) && (
                                                        <div className="flex items-center justify-between px-2">
                                                            {getTimeline(order.status).map((step, i) => (
                                                                <div key={step.key} className="flex flex-col items-center flex-1">
                                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs mb-1 ${step.done ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-300'}`}>
                                                                        {step.done ? '✓' : step.icon}
                                                                    </div>
                                                                    <span className={`text-[8px] font-bold ${step.done ? 'text-emerald-600' : 'text-gray-300'}`}>{step.label}</span>
                                                                    {i < 3 && <div className={`absolute w-8 h-0.5 ${step.done ? 'bg-emerald-400' : 'bg-gray-100'}`} style={{ marginTop: -18, marginRight: -32 }} />}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Product Items */}
                                                    {order.items?.length > 0 && (
                                                        <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                                                            <p className="text-[10px] font-bold text-gray-400 mb-1">📦 تفاصيل المنتجات</p>
                                                            {order.items.map((item, ii) => (
                                                                <div key={ii} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                                                                    <div className="flex-1">
                                                                        <p className="text-xs font-bold text-gray-700">{item.product_name}</p>
                                                                        <p className="text-[10px] text-gray-400">الكمية: {item.quantity} × {formatPrice(item.unit_price)}</p>
                                                                    </div>
                                                                    <p className="text-xs font-black text-primary-emerald">{formatPrice(item.total_price || (item.unit_price * item.quantity))}</p>
                                                                </div>
                                                            ))}
                                                            {/* Order Summary */}
                                                            <div className="pt-2 border-t border-gray-200 space-y-1">
                                                                {order.discount_amount > 0 && (
                                                                    <div className="flex justify-between text-[10px]">
                                                                        <span className="text-gray-400">الخصم</span>
                                                                        <span className="text-red-500 font-bold">-{formatPrice(order.discount_amount)}</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-between text-xs">
                                                                    <span className="text-gray-500 font-bold">الإجمالي</span>
                                                                    <span className="font-black text-primary-emerald">{formatPrice(order.total_amount)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Seller Info */}
                                                    {order.items?.[0]?.seller_name && (
                                                        <div className="bg-amber-50 rounded-xl p-3 flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-sm">🏪</div>
                                                            <div>
                                                                <p className="text-[10px] text-amber-500">التاجر</p>
                                                                <p className="text-xs font-bold text-amber-800">{order.items[0].seller_name}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Action Buttons */}
                                                    <div className="space-y-2">
                                                        <button onClick={() => setShowInvoice(order)} className="w-full bg-blue-50 text-blue-600 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
                                                            <FileText className="w-4 h-4" /> عرض الفاتورة
                                                        </button>

                                                        {/* Reorder Button */}
                                                        <button onClick={(e) => {
                                                            e.stopPropagation();
                                                            const cartItems = (order.items || []).map(item => ({
                                                                id: item.product_id,
                                                                title: item.product_name,
                                                                price: item.unit_price,
                                                                qty: item.quantity,
                                                            }));
                                                            localStorage.setItem('sukarak_reorder', JSON.stringify(cartItems));
                                                            navigate('/market', { state: { reorder: true } });
                                                        }} className="w-full bg-emerald-50 text-emerald-600 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
                                                            <RefreshCw className="w-4 h-4" /> إعادة الطلب
                                                        </button>

                                                        {/* Cancel Button */}
                                                        {['confirmed', 'processing'].includes(order.status) && (
                                                            <button onClick={() => cancelOrder(order.id)} className="w-full bg-red-50 text-red-600 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
                                                                <XCircle className="w-4 h-4" /> إلغاء الطلب
                                                            </button>
                                                        )}

                                                        {/* Return Request - within 7 days of delivery */}
                                                        {order.status === 'delivered' && order.delivered_at && (
                                                            (() => {
                                                                const deliveredDate = new Date(order.delivered_at || order.updated_at || order.created_at);
                                                                const now = new Date();
                                                                const daysSinceDelivery = Math.floor((now - deliveredDate) / (1000 * 60 * 60 * 24));
                                                                const canReturn = daysSinceDelivery <= 7;
                                                                return canReturn ? (
                                                                    <button onClick={() => requestRefund(order.id)} disabled={refundingId === order.id}
                                                                        className="w-full bg-orange-50 text-orange-600 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50">
                                                                        <RotateCcw className="w-4 h-4" />
                                                                        {refundingId === order.id ? 'جاري المعالجة...' : `طلب إرجاع (متبقي ${7 - daysSinceDelivery} أيام)`}
                                                                    </button>
                                                                ) : (
                                                                    <div className="w-full bg-gray-50 text-gray-400 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
                                                                        <AlertTriangle className="w-4 h-4" /> انتهت مهلة الإرجاع (7 أيام)
                                                                    </div>
                                                                );
                                                            })()
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </>
            ) : (
                <div className="space-y-3">
                    {nursingBookings.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                            <Package className="w-16 h-16 text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-400 font-bold text-lg mb-1">لا توجد حجوزات خدمات</p>
                            <button onClick={() => navigate('/nursing')} className="bg-primary-emerald text-white px-6 py-2.5 rounded-xl font-bold text-sm mt-3">🏥 احجز خدمة الآن</button>
                        </div>
                    ) : (
                        nursingBookings.map((b, idx) => (
                            <motion.div key={b.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
                                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-2xl">🏥</div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-black text-primary-dark text-sm">{b.service_name}</h4>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${b.status === 'confirmed' ? 'bg-blue-100 text-blue-600' :
                                            b.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                                                b.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                            }`}>{
                                                b.status === 'confirmed' ? 'مؤكد' :
                                                    b.status === 'completed' ? 'مكتمل' :
                                                        b.status === 'cancelled' ? 'ملغى' : 'قيد الانتظار'
                                            }</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {b.date} {b.time && `- ${b.time}`}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1"><Truck className="w-3 h-3" /> {b.address}</p>
                                    {b.nurse_name && (
                                        <div className="mt-2 pt-2 border-t border-gray-50 flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px]">👩‍⚕️</div>
                                            <span className="text-[10px] font-bold text-emerald-700">الممرضة: {b.nurse_name}</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            {/* PROFESSIONAL INVOICE MODAL */}
            <AnimatePresence>
                {showInvoice && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1100]">
                        <InvoicePage
                            order={{
                                order_number: showInvoice.order_number,
                                created_at: showInvoice.created_at,
                                status: showInvoice.status,
                                subtotal: showInvoice.subtotal || showInvoice.total_amount,
                                total: showInvoice.total_amount,
                                discount: showInvoice.discount_amount || 0,
                                tax: (showInvoice.subtotal || showInvoice.total_amount) * 0.15,
                                payment_method: showInvoice.payment_method,
                                seller_name: showInvoice.items?.[0]?.seller_name,
                                seller_company: showInvoice.items?.[0]?.seller_company,
                                seller_phone: showInvoice.items?.[0]?.seller_phone,
                                seller_email: showInvoice.items?.[0]?.seller_email,
                                seller_address: showInvoice.items?.[0]?.seller_address,
                                seller_tax_number: showInvoice.items?.[0]?.seller_tax_number,
                                seller_commercial_reg: showInvoice.items?.[0]?.seller_commercial_reg,
                            }}
                            items={(showInvoice.items || []).map(item => ({
                                title: item.product_name,
                                sku: item.product_sku || '',
                                price: item.unit_price,
                                offer_price: item.offer_price || 0,
                                qty: item.quantity,
                                seller_name: item.seller_name,
                                seller_company: item.seller_company,
                            }))}
                            buyer={{
                                name: showInvoice.customer_name || showInvoice.shipping_address?.name || '',
                                phone: showInvoice.customer_phone || showInvoice.shipping_address?.phone || '',
                                email: showInvoice.customer_email || '',
                                address: showInvoice.shipping_address?.address || showInvoice.shipping_address || '',
                            }}
                            onClose={() => setShowInvoice(null)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyOrdersView;
