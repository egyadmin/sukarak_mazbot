import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Package, ShoppingBag, TrendingUp, DollarSign, Plus, Search, LogOut,
    BarChart3, Bell, Truck, CheckCircle, XCircle, Clock, Eye, Edit3,
    Trash2, ChevronDown, AlertTriangle, ClipboardList, RefreshCw, X, Save,
    Image as ImageIcon, Settings, Users, Wallet, FileText, ArrowUpDown,
    Copy, Power, MessageSquare, Download, CreditCard, Building2, Shield,
    ChevronRight, Filter, Calendar, TrendingDown, Star, RotateCcw, Send,
    Printer, FileSpreadsheet, FileDown
} from 'lucide-react';
import { API_BASE } from '../api/config';
import { CATEGORIES, getCategoryLabel, getSubcategoryLabel, getSubcategories } from '../data/categoryData';

const API = `${API_BASE}/seller`;

const statusConfig = {
    confirmed: { label: 'تم التأكيد', color: 'bg-blue-500', text: 'text-blue-400', icon: '✅', light: 'bg-blue-500/15' },
    processing: { label: 'جاري التجهيز', color: 'bg-amber-500', text: 'text-amber-400', icon: '⏳', light: 'bg-amber-500/15' },
    shipped: { label: 'تم الشحن', color: 'bg-purple-500', text: 'text-purple-400', icon: '🚚', light: 'bg-purple-500/15' },
    delivered: { label: 'تم التوصيل', color: 'bg-emerald-500', text: 'text-emerald-400', icon: '📍', light: 'bg-emerald-500/15' },
    cancelled: { label: 'ملغي', color: 'bg-red-500', text: 'text-red-400', icon: '❌', light: 'bg-red-500/15' },
    pending: { label: 'قيد الانتظار', color: 'bg-orange-500', text: 'text-orange-400', icon: '❓', light: 'bg-orange-500/15' },
};

const nextStatus = { confirmed: 'processing', processing: 'shipped', shipped: 'delivered' };
const nextStatusLabel = { confirmed: 'بدء التجهيز', processing: 'تم الشحن', shipped: 'تم التوصيل' };
const categoryLabels = Object.fromEntries(CATEGORIES.map(c => [c.id, c.label]));
const notifIcons = { new_order: '🛍️', order_confirmed: '✅', order_shipped: '🚚', order_delivered: '📍', order_cancelled: '❌', return_requested: '🔄', return_approved: '✅', low_stock: '⚠️', payment_received: '💰', new_review: '⭐️' };

const SellerDashboard = () => {
    const [seller, setSeller] = useState(null);
    const [tab, setTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [orderFilter, setOrderFilter] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({ title: '', details: '', price: '', stock: '', category: '', sub_category: '', offer_price: '', brand: '', sku: '', offer_start_date: '', offer_end_date: '' });
    const [productImage, setProductImage] = useState(null);
    const [saving, setSaving] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifPanel, setShowNotifPanel] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [settings, setSettings] = useState(null);
    const [settingsForm, setSettingsForm] = useState({});
    const [statsPeriod, setStatsPeriod] = useState('all');
    const [salesReport, setSalesReport] = useState(null);
    const [returns, setReturns] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [selectedNotif, setSelectedNotif] = useState(null);
    const [mobileMenu, setMobileMenu] = useState(false);

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('admin_user') || 'null');
        if (!u || u.role !== 'seller') { window.location.href = '/admin/login'; return; }
        setSeller(u);
    }, []);

    const toast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };
    const fmt = (iso) => iso ? new Date(iso).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '--';

    const load = useCallback(async () => {
        if (!seller) return;
        setLoading(true);
        try {
            const [s, p, o, n, nc] = await Promise.all([
                fetch(`${API}/stats?seller_id=${seller.id}&period=${statsPeriod}`).then(r => r.json()),
                fetch(`${API}/products?seller_id=${seller.id}`).then(r => r.json()),
                fetch(`${API}/orders?seller_id=${seller.id}`).then(r => r.json()),
                fetch(`${API}/notifications?seller_id=${seller.id}&limit=20`).then(r => r.json()),
                fetch(`${API}/notifications/count?seller_id=${seller.id}`).then(r => r.json()),
            ]);
            setStats(s); setProducts(Array.isArray(p) ? p : []); setOrders(Array.isArray(o) ? o : []);
            setNotifications(Array.isArray(n) ? n : []); setUnreadCount(nc.unread_count || 0);
        } catch (e) { console.error(e); }
        setLoading(false);
    }, [seller, statsPeriod]);

    useEffect(() => { if (seller) load(); }, [seller, load]);

    const loadTabData = async (t) => {
        if (!seller) return;
        if (t === 'customers') { const d = await fetch(`${API}/customers?seller_id=${seller.id}`).then(r => r.json()); setCustomers(Array.isArray(d) ? d : []); }
        if (t === 'wallet') {
            const [w, tx, wd] = await Promise.all([
                fetch(`${API}/wallet?seller_id=${seller.id}`).then(r => r.json()),
                fetch(`${API}/wallet/transactions?seller_id=${seller.id}`).then(r => r.json()),
                fetch(`${API}/wallet/withdrawals?seller_id=${seller.id}`).then(r => r.json()),
            ]);
            setWallet(w); setTransactions(Array.isArray(tx) ? tx : []); setWithdrawals(Array.isArray(wd) ? wd : []);
        }
        if (t === 'reports') { const d = await fetch(`${API}/reports/sales?seller_id=${seller.id}`).then(r => r.json()); setSalesReport(d); }
        if (t === 'returns') { const d = await fetch(`${API}/returns?seller_id=${seller.id}`).then(r => r.json()); setReturns(Array.isArray(d) ? d : []); }
        if (t === 'settings') { const d = await fetch(`${API}/settings?seller_id=${seller.id}`).then(r => r.json()); setSettings(d); setSettingsForm(d); }
    };

    const changeTab = (t) => { setTab(t); loadTabData(t); setMobileMenu(false); };
    const updateOrderStatus = async (id, s) => { await fetch(`${API}/orders/${id}/status?status=${s}&seller_id=${seller.id}`, { method: 'PUT' }); toast('تم تحديث حالة الطلب'); load(); };
    const deleteProduct = async (id) => { if (!window.confirm('هل أنت متأكد؟')) return; await fetch(`${API}/products/${id}`, { method: 'DELETE' }); toast('تم حذف المنتج'); load(); };
    const toggleProduct = async (id) => { await fetch(`${API}/products/${id}/toggle`, { method: 'PUT' }); load(); };
    const markAllRead = async () => { await fetch(`${API}/notifications/read-all?seller_id=${seller.id}`, { method: 'PUT' }); setUnreadCount(0); setNotifications(n => n.map(x => ({ ...x, is_read: true }))); };

    const saveSettings = async () => {
        setSaving(true);
        await fetch(`${API}/settings?seller_id=${seller.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settingsForm) });
        setSaving(false); toast('تم حفظ الإعدادات');
    };

    const requestWithdraw = async () => {
        if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return;
        await fetch(`${API}/wallet/withdraw?seller_id=${seller.id}&amount=${withdrawAmount}`, { method: 'POST' });
        setWithdrawAmount(''); toast('تم إرسال الطلب'); loadTabData('wallet');
    };

    const filteredOrders = orderFilter === 'all' ? orders : orders.filter(o => o.status === orderFilter);
    const filteredProducts = searchTerm ? products.filter(p => p.title.includes(searchTerm)) : products;
    const glass = 'bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] shadow-2xl';
    const inputStyle = 'w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-400/50 transition placeholder:text-white/20';
    const selectStyle = 'w-full bg-[#1e293b] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-400/50 transition cursor-pointer [color-scheme:dark]';

    const sideItems = [
        { id: 'dashboard', label: 'لوحة التحكم', icon: BarChart3 },
        { id: 'orders', label: 'الطلبات', icon: ClipboardList, badge: orders.filter(o => o.status === 'confirmed').length },
        { id: 'products', label: 'المنتجات', icon: ShoppingBag },
        { id: 'customers', label: 'العملاء', icon: Users },
        { id: 'wallet', label: 'المحفظة', icon: Wallet },
        { id: 'reports', label: 'التقارير', icon: FileText },
        { id: 'returns', label: 'المرتجعات', icon: RotateCcw },
        { id: 'settings', label: 'الإعدادات', icon: Settings },
    ];

    if (!seller) return null;

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex font-cairo" dir="rtl">
            {toastMsg && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[1100] bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl">{toastMsg}</div>}

            <aside className={`w-64 bg-[#1e293b] border-l border-white/[0.06] flex flex-col hidden lg:flex`}>
                <div className="p-4 border-b border-white/[0.06] flex items-center gap-3">
                    <img src="/logo.png" className="w-10 h-10 rounded-xl" alt="" />
                    <div>
                        <h2 className="font-black text-sm">لوحة التاجر</h2>
                        <p className="text-[10px] text-emerald-400 font-bold">{seller?.name}</p>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1">
                    {sideItems.map(item => (
                        <button key={item.id} onClick={() => changeTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm ${tab === item.id ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/40'}`}>
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                            {item.badge > 0 && <span className="mr-auto bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full">{item.badge}</span>}
                        </button>
                    ))}
                </nav>
                {/* زر تسجيل الخروج */}
                <div className="p-3 border-t border-white/[0.06]">
                    <button onClick={() => { localStorage.removeItem('admin_user'); localStorage.removeItem('admin_token'); window.location.href = '/admin/login'; }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <LogOut className="w-5 h-5" />
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-6 overflow-y-auto">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-black">{sideItems.find(i => i.id === tab)?.label}</h1>
                    <div className="flex gap-3 items-center">
                        <button onClick={load} className="p-2.5 bg-white/[0.05] rounded-xl hover:bg-white/[0.1] transition" title="تحديث"><RefreshCw className="w-4 h-4" /></button>
                        <button onClick={() => setShowNotifPanel(!showNotifPanel)} className="p-2.5 bg-white/[0.05] rounded-xl relative hover:bg-white/[0.1] transition" title="الإشعارات">
                            <Bell className="w-4 h-4" />
                            {unreadCount > 0 && <span className="absolute -top-1 -left-1 bg-red-500 text-[8px] w-4 h-4 rounded-full flex items-center justify-center">{unreadCount}</span>}
                        </button>
                        {/* زر الخروج للموبايل */}
                        <button onClick={() => { localStorage.removeItem('admin_user'); localStorage.removeItem('admin_token'); window.location.href = '/admin/login'; }} className="p-2.5 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition text-red-400" title="تسجيل الخروج">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                {tab === 'dashboard' && stats && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-4 gap-6">
                            {[
                                { label: 'إجمالي المبيعات', value: stats.total_revenue, icon: DollarSign, color: 'from-emerald-500 to-teal-600' },
                                { label: 'طلبات جديدة', value: stats.pending_orders, icon: Bell, color: 'from-amber-500 to-orange-600' },
                                { label: 'تم التوصيل', value: stats.delivered_orders, icon: CheckCircle, color: 'from-blue-500 to-indigo-600' },
                                { label: 'المنتجات', value: stats.total_products, icon: ShoppingBag, color: 'from-purple-500 to-fuchsia-600' },
                            ].map((c, i) => (
                                <div key={i} className={`bg-gradient-to-br ${c.color} p-6 rounded-3xl shadow-xl`}>
                                    <c.icon className="w-8 h-8 opacity-20 mb-4" />
                                    <p className="text-2xl font-black">{c.value}</p>
                                    <p className="text-white/60 text-xs font-bold">{c.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className={`${glass} p-6 rounded-3xl`}>
                                <h3 className="font-black mb-4">الأكثر مبيعاً</h3>
                                {stats.top_products?.map((p, i) => (
                                    <div key={i} className="flex items-center gap-3 py-2">
                                        <span className="text-xs text-white/20 font-bold w-4">{i + 1}</span>
                                        <p className="text-xs font-bold flex-1">{p.name}</p>
                                        <p className="text-xs font-black text-emerald-400">{p.sales} SAR</p>
                                    </div>
                                ))}
                            </div>
                            <div className={`${glass} p-6 rounded-3xl`}>
                                <h3 className="font-black mb-4">آخر الطلبات</h3>
                                {orders.slice(0, 5).map(o => (
                                    <div key={o.id} className="flex items-center justify-between py-2">
                                        <p className="text-xs font-bold">{o.order_number}</p>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusConfig[o.status]?.light} ${statusConfig[o.status]?.text}`}>{statusConfig[o.status]?.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'products' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="relative w-64">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input placeholder="بحث..." className={`${inputStyle} pr-10`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                            <button onClick={() => setShowProductModal(true)} className="bg-emerald-500 p-3 rounded-xl flex items-center gap-2 font-bold"><Plus className="w-4 h-4" /> إضافة منتج</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map(p => (
                                <div key={p.id} className={`${glass} rounded-3xl p-4 overflow-hidden`}>
                                    <div className="h-32 bg-white/5 rounded-2xl mb-4 flex items-center justify-center">
                                        {p.img_url ? <img src={p.img_url} className="w-full h-full object-cover rounded-2xl" alt="" /> : <ShoppingBag className="opacity-10 w-10 h-10" />}
                                    </div>
                                    <p className="font-bold text-sm mb-1">{p.title}</p>
                                    <p className="text-[10px] text-white/30 mb-1">{getCategoryLabel(p.category)}{p.sub_category ? ' • ' + getSubcategoryLabel(p.category, p.sub_category) : ''}</p>
                                    <div className="flex justify-between items-center">
                                        <p className="text-emerald-400 font-bold">{p.price} SAR</p>
                                        <p className="text-[10px] text-white/20">المخزون: {p.stock}</p>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button onClick={() => { setEditingProduct(p); setProductForm({ title: p.title, details: p.details || '', price: p.price, stock: p.stock, category: p.category || '', sub_category: p.sub_category || '', offer_price: p.offer_price || '' }); setShowProductModal(true); }} className="flex-1 bg-white/5 p-2 rounded-lg text-[10px] font-bold">تعديل</button>
                                        <button onClick={() => deleteProduct(p.id)} className="bg-red-500/10 text-red-400 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══════ ORDERS TAB ═══════ */}
                {tab === 'orders' && (
                    <div className="space-y-6">
                        {/* ── ملخص أعداد الطلبات ── */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                                { id: 'all', label: 'الكل', count: orders.length, gradient: 'from-slate-500 to-slate-600' },
                                { id: 'confirmed', label: 'جديدة', count: orders.filter(o => o.status === 'confirmed').length, gradient: 'from-blue-500 to-blue-600' },
                                { id: 'processing', label: 'قيد التجهيز', count: orders.filter(o => o.status === 'processing').length, gradient: 'from-amber-500 to-amber-600' },
                                { id: 'shipped', label: 'تم الشحن', count: orders.filter(o => o.status === 'shipped').length, gradient: 'from-purple-500 to-purple-600' },
                                { id: 'delivered', label: 'تم التوصيل', count: orders.filter(o => o.status === 'delivered').length, gradient: 'from-emerald-500 to-emerald-600' },
                            ].map(f => (
                                <button key={f.id} onClick={() => setOrderFilter(f.id)} className={`p-4 rounded-2xl text-xs font-black transition-all ${orderFilter === f.id ? `bg-gradient-to-br ${f.gradient} shadow-lg scale-[1.02]` : 'bg-white/[0.05] text-white/40 hover:bg-white/[0.08]'}`}>
                                    <p className={`text-2xl font-black mb-1 ${orderFilter === f.id ? 'text-white' : 'text-white/60'}`}>{f.count}</p>
                                    <p>{f.label}</p>
                                </button>
                            ))}
                        </div>

                        {filteredOrders.length === 0 ? (
                            <div className={`${glass} rounded-3xl p-16 text-center`}>
                                <ClipboardList className="w-16 h-16 mx-auto opacity-10 mb-4" />
                                <p className="text-white/30 font-bold text-lg">لا توجد طلبات</p>
                                <p className="text-white/15 text-sm mt-2">لا توجد طلبات في هذا التصنيف</p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {filteredOrders.map(o => {
                                    const sc = statusConfig[o.status] || statusConfig.pending;
                                    const isExpanded = expandedOrder === o.id;
                                    return (
                                        <div key={o.id} className={`${glass} rounded-3xl overflow-hidden transition-all ${isExpanded ? 'ring-1 ring-white/10' : ''}`}>
                                            {/* ── شريط الحالة العلوي ── */}
                                            <div className={`h-1 ${sc.color}`} />

                                            {/* ── هيدر الطلب ── */}
                                            <div className="p-5 cursor-pointer" onClick={() => setExpandedOrder(isExpanded ? null : o.id)}>
                                                <div className="flex flex-wrap items-start justify-between gap-4">
                                                    {/* ── معلومات الطلب ── */}
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${sc.light}`}>
                                                            {sc.icon}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-black text-base">#{o.order_number}</p>
                                                                <span className={`${sc.light} ${sc.text} px-2.5 py-0.5 rounded-lg text-[10px] font-black`}>{sc.label}</span>
                                                            </div>
                                                            <p className="text-xs text-white/30 mt-1">{fmt(o.created_at)}</p>
                                                        </div>
                                                    </div>

                                                    {/* ── معلومات الزبون ── */}
                                                    <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-2.5">
                                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm">
                                                            {(o.user_name || o.customer_name || '?')[0]}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold">{o.user_name || o.customer_name || 'عميل'}</p>
                                                            <p className="text-[10px] text-white/25">عميل #{o.user_id}</p>
                                                        </div>
                                                    </div>

                                                    {/* ── معلومات الدفع ── */}
                                                    <div className="text-left">
                                                        <p className="font-black text-lg text-emerald-400">{o.seller_total || o.total_amount} <span className="text-xs text-white/20">SAR</span></p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[10px] text-white/20">{o.items?.length || 0} منتج</span>
                                                            {o.payment_method && <span className="text-[10px] bg-white/[0.05] px-2 py-0.5 rounded-md text-white/30">{o.payment_method === 'card' ? '💳 بطاقة' : o.payment_method === 'cod' ? '💵 عند الاستلام' : o.payment_method}</span>}
                                                        </div>
                                                    </div>

                                                    {/* ── سهم التوسيع ── */}
                                                    <ChevronDown className={`w-5 h-5 text-white/20 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                </div>
                                            </div>

                                            {/* ═══ التفاصيل الموسعة ═══ */}
                                            {isExpanded && (
                                                <div className="border-t border-white/[0.06]">
                                                    {/* ── المنتجات ── */}
                                                    <div className="p-5">
                                                        <h4 className="text-xs font-black text-white/30 mb-3 flex items-center gap-2">
                                                            <ShoppingBag className="w-3.5 h-3.5" /> المنتجات المطلوبة
                                                        </h4>
                                                        <div className="bg-white/[0.03] rounded-2xl overflow-hidden">
                                                            {o.items?.map((item, idx) => (
                                                                <div key={idx} className={`flex items-center justify-between p-4 ${idx > 0 ? 'border-t border-white/[0.04]' : ''}`}>
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] flex items-center justify-center text-lg">
                                                                            📦
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-bold">{item.product_name || item.product_title}</p>
                                                                            <p className="text-[10px] text-white/25">الكمية: {item.quantity} × {item.unit_price || item.price} SAR</p>
                                                                        </div>
                                                                    </div>
                                                                    <p className="font-black text-sm text-emerald-400">{item.total_price || item.total} SAR</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* ── ملخص الطلب + معلومات العميل ── */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                                                        {/* الملخص المالي */}
                                                        <div className="p-5 border-t border-white/[0.06]">
                                                            <h4 className="text-xs font-black text-white/30 mb-3 flex items-center gap-2">
                                                                <DollarSign className="w-3.5 h-3.5" /> ملخص الطلب
                                                            </h4>
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between text-sm">
                                                                    <span className="text-white/40">المجموع الفرعي</span>
                                                                    <span className="font-bold">{o.subtotal || o.total_amount} SAR</span>
                                                                </div>
                                                                {parseFloat(o.discount_amount || 0) > 0 && (
                                                                    <div className="flex justify-between text-sm">
                                                                        <span className="text-white/40">الخصم</span>
                                                                        <span className="font-bold text-red-400">-{o.discount_amount} SAR</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-between text-sm pt-2 border-t border-white/[0.06]">
                                                                    <span className="font-black">حصتك من الطلب</span>
                                                                    <span className="font-black text-emerald-400 text-lg">{o.seller_total || o.total_amount} SAR</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* بيانات التواصل */}
                                                        <div className="p-5 border-t border-white/[0.06] md:border-r md:border-r-white/[0.06]">
                                                            <h4 className="text-xs font-black text-white/30 mb-3 flex items-center gap-2">
                                                                <Users className="w-3.5 h-3.5" /> بيانات العميل
                                                            </h4>
                                                            <div className="space-y-2.5">
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <span className="text-white/20">👤</span>
                                                                    <span className="font-bold">{o.user_name || o.customer_name || '—'}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <span className="text-white/20">📞</span>
                                                                    <span className="text-white/50" dir="ltr">{o.customer_phone || '—'}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <span className="text-white/20">📍</span>
                                                                    <span className="text-white/50">{o.address || 'بدون عنوان'}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <span className="text-white/20">💳</span>
                                                                    <span className="text-white/50">{o.payment_method === 'card' ? 'بطاقة بنكية' : o.payment_method === 'cod' ? 'عند الاستلام' : o.payment_method || '—'}</span>
                                                                    {o.payment_status && <span className={`text-[9px] px-2 py-0.5 rounded-md font-black ${o.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{o.payment_status === 'paid' ? 'مدفوع' : 'لم يُدفع'}</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* ── سجل تغيير الحالة ── */}
                                                    {o.history && o.history.length > 0 && (
                                                        <div className="p-5 border-t border-white/[0.06]">
                                                            <h4 className="text-xs font-black text-white/30 mb-3">📋 سجل الحالة</h4>
                                                            <div className="flex gap-2 flex-wrap">
                                                                {o.history.map((h, i) => (
                                                                    <div key={i} className="flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-lg text-[10px]">
                                                                        <span className="text-white/20">{statusConfig[h.old_status]?.icon || '?'}</span>
                                                                        <span className="text-white/30">{statusConfig[h.old_status]?.label}</span>
                                                                        <ChevronRight className="w-3 h-3 text-white/10" />
                                                                        <span className={statusConfig[h.new_status]?.text}>{statusConfig[h.new_status]?.label}</span>
                                                                        <span className="text-white/10 mr-1">{fmt(h.created_at)}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* ── زر تحديث الحالة ── */}
                                                    {nextStatus[o.status] && (
                                                        <div className="p-5 border-t border-white/[0.06] bg-white/[0.02]">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <span className={`${sc.light} ${sc.text} px-3 py-1.5 rounded-xl text-xs font-black`}>{sc.icon} {sc.label}</span>
                                                                    <ChevronRight className="w-4 h-4 text-white/15" />
                                                                    <span className={`${statusConfig[nextStatus[o.status]]?.light} ${statusConfig[nextStatus[o.status]]?.text} px-3 py-1.5 rounded-xl text-xs font-black`}>
                                                                        {statusConfig[nextStatus[o.status]]?.icon} {statusConfig[nextStatus[o.status]]?.label}
                                                                    </span>
                                                                </div>
                                                                <button onClick={() => updateOrderStatus(o.id, nextStatus[o.status])} className="bg-gradient-to-l from-emerald-500 to-teal-600 px-6 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all active:scale-[0.97]">
                                                                    {nextStatusLabel[o.status]} ←
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ═══════ CUSTOMERS TAB ═══════ */}
                {tab === 'customers' && (
                    <div className="space-y-6">
                        {customers.length === 0 ? (
                            <div className={`${glass} rounded-3xl p-12 text-center`}>
                                <Users className="w-12 h-12 mx-auto opacity-10 mb-4" />
                                <p className="text-white/30 font-bold">لا يوجد عملاء بعد</p>
                            </div>
                        ) : (
                            <div className={`${glass} rounded-3xl overflow-hidden`}>
                                <table className="w-full text-sm">
                                    <thead><tr className="border-b border-white/[0.06] text-white/30 text-[10px]">
                                        <th className="p-4 text-right font-black">العميل</th>
                                        <th className="p-4 text-right font-black">الهاتف</th>
                                        <th className="p-4 text-right font-black">الطلبات</th>
                                        <th className="p-4 text-right font-black">إجمالي المشتريات</th>
                                        <th className="p-4 text-right font-black">آخر طلب</th>
                                    </tr></thead>
                                    <tbody>
                                        {customers.map(c => (
                                            <tr key={c.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                                                <td className="p-4 font-bold">{c.name}</td>
                                                <td className="p-4 text-white/40" dir="ltr">{c.phone}</td>
                                                <td className="p-4"><span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg text-[10px] font-black">{c.order_count}</span></td>
                                                <td className="p-4 font-black text-emerald-400">{c.total_spent} SAR</td>
                                                <td className="p-4 text-white/30 text-[10px]">{fmt(c.last_order)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ═══════ WALLET TAB ═══════ */}
                {tab === 'wallet' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-3xl shadow-xl">
                                <Wallet className="w-8 h-8 opacity-20 mb-3" />
                                <p className="text-2xl font-black">{wallet?.balance || 0} SAR</p>
                                <p className="text-white/60 text-xs font-bold">الرصيد المتاح</p>
                            </div>
                            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-3xl shadow-xl">
                                <Clock className="w-8 h-8 opacity-20 mb-3" />
                                <p className="text-2xl font-black">{wallet?.pending || 0} SAR</p>
                                <p className="text-white/60 text-xs font-bold">قيد المعالجة</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-3xl shadow-xl">
                                <TrendingUp className="w-8 h-8 opacity-20 mb-3" />
                                <p className="text-2xl font-black">{wallet?.total_earned || 0} SAR</p>
                                <p className="text-white/60 text-xs font-bold">إجمالي الأرباح</p>
                            </div>
                        </div>

                        <div className={`${glass} rounded-3xl p-6`}>
                            <h3 className="font-black mb-4">طلب سحب</h3>
                            <div className="flex gap-3">
                                <input type="number" placeholder="المبلغ" className={inputStyle + ' max-w-xs'} value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} />
                                <button onClick={requestWithdraw} className="bg-emerald-500 px-6 py-3 rounded-xl font-black text-sm">سحب</button>
                            </div>
                        </div>

                        <div className={`${glass} rounded-3xl p-6`}>
                            <h3 className="font-black mb-4">آخر المعاملات</h3>
                            {transactions.length === 0 ? <p className="text-white/20 text-sm">لا توجد معاملات</p> :
                                <div className="space-y-3">
                                    {transactions.map((tx, i) => (
                                        <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                                            <div>
                                                <p className="text-sm font-bold">{tx.description || tx.type}</p>
                                                <p className="text-[10px] text-white/20">{fmt(tx.created_at)}</p>
                                            </div>
                                            <p className={`font-black ${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{tx.amount > 0 ? '+' : ''}{tx.amount} SAR</p>
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    </div>
                )}

                {/* ═══════ REPORTS TAB ═══════ */}
                {tab === 'reports' && (
                    <div className="space-y-6">
                        {!salesReport ? (
                            <div className={`${glass} rounded-3xl p-12 text-center`}>
                                <FileText className="w-12 h-12 mx-auto opacity-10 mb-4" />
                                <p className="text-white/30 font-bold">جاري تحميل التقارير...</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    {[
                                        { label: 'إجمالي المبيعات', value: `${salesReport.total_sales || 0} SAR`, color: 'from-emerald-500 to-teal-600' },
                                        { label: 'عدد الطلبات', value: salesReport.total_orders || 0, color: 'from-blue-500 to-indigo-600' },
                                        { label: 'متوسط الطلب', value: `${salesReport.avg_order_value || 0} SAR`, color: 'from-purple-500 to-fuchsia-600' },
                                        { label: 'معدل الإرجاع', value: `${salesReport.return_rate || 0}%`, color: 'from-amber-500 to-orange-600' },
                                    ].map((c, i) => (
                                        <div key={i} className={`bg-gradient-to-br ${c.color} p-6 rounded-3xl shadow-xl`}>
                                            <p className="text-2xl font-black">{c.value}</p>
                                            <p className="text-white/60 text-xs font-bold">{c.label}</p>
                                        </div>
                                    ))}
                                </div>
                                {salesReport.by_category && (
                                    <div className={`${glass} rounded-3xl p-6`}>
                                        <h3 className="font-black mb-4">المبيعات حسب القسم</h3>
                                        <div className="space-y-3">
                                            {Object.entries(salesReport.by_category).map(([cat, val]) => (
                                                <div key={cat} className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                                                    <span className="text-sm font-bold">{categoryLabels[cat] || cat}</span>
                                                    <span className="text-emerald-400 font-black">{val} SAR</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* ═══════ RETURNS TAB ═══════ */}
                {tab === 'returns' && (
                    <div className="space-y-6">
                        {returns.length === 0 ? (
                            <div className={`${glass} rounded-3xl p-12 text-center`}>
                                <RotateCcw className="w-12 h-12 mx-auto opacity-10 mb-4" />
                                <p className="text-white/30 font-bold">لا توجد مرتجعات</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {returns.map(r => (
                                    <div key={r.id} className={`${glass} rounded-3xl p-5`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-black text-sm">طلب #{r.order_number}</p>
                                                <p className="text-[10px] text-white/30 mt-1">{r.reason}</p>
                                                <p className="text-[10px] text-white/20 mt-1">{fmt(r.created_at)}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${r.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : r.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                                {r.status === 'approved' ? 'مقبول' : r.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ═══════ SETTINGS TAB ═══════ */}
                {tab === 'settings' && (
                    <div className="space-y-6">
                        <div className={`${glass} rounded-3xl p-6`}>
                            <h3 className="font-black mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                                    <Settings className="w-5 h-5" />
                                </div>
                                إعدادات المتجر
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-white/30 text-[10px] font-black mb-1.5">اسم المتجر</label>
                                    <input className={inputStyle} value={settingsForm.store_name || ''} onChange={e => setSettingsForm({ ...settingsForm, store_name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-white/30 text-[10px] font-black mb-1.5">وصف المتجر</label>
                                    <textarea className={`${inputStyle} h-24`} value={settingsForm.store_description || ''} onChange={e => setSettingsForm({ ...settingsForm, store_description: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-white/30 text-[10px] font-black mb-1.5">رقم الهاتف</label>
                                        <input className={inputStyle} value={settingsForm.phone || ''} onChange={e => setSettingsForm({ ...settingsForm, phone: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-white/30 text-[10px] font-black mb-1.5">البريد الإلكتروني</label>
                                        <input className={inputStyle} value={settingsForm.email || ''} onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-white/30 text-[10px] font-black mb-1.5">العنوان</label>
                                        <input className={inputStyle} value={settingsForm.address || ''} onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-white/30 text-[10px] font-black mb-1.5">البلد</label>
                                        <select className={inputStyle} value={settingsForm.country || 'eg'} onChange={e => setSettingsForm({ ...settingsForm, country: e.target.value })}>
                                            <option value="eg" style={{ background: '#1e293b' }}>مصر 🇪🇬</option>
                                            <option value="sa" style={{ background: '#1e293b' }}>السعودية 🇸🇦</option>
                                            <option value="ae" style={{ background: '#1e293b' }}>الإمارات 🇦🇪</option>
                                            <option value="kw" style={{ background: '#1e293b' }}>الكويت 🇰🇼</option>
                                            <option value="bh" style={{ background: '#1e293b' }}>البحرين 🇧🇭</option>
                                            <option value="qa" style={{ background: '#1e293b' }}>قطر 🇶🇦</option>
                                            <option value="om" style={{ background: '#1e293b' }}>عُمان 🇴🇲</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={saveSettings} disabled={saving} className="bg-gradient-to-l from-emerald-500 to-teal-600 px-8 py-3 rounded-xl font-black disabled:opacity-50 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all">
                                        {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                                    </button>
                                    <button onClick={async () => {
                                        const pw = prompt('أدخل كلمة المرور الجديدة:');
                                        if (!pw) return;
                                        const res = await fetch(`${API}/seller/change-password`, {
                                            method: 'PUT', headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ seller_id: user.id, password: pw })
                                        });
                                        if (res.ok) alert('تم تغيير كلمة المرور بنجاح');
                                        else alert('حدث خطأ');
                                    }} className="bg-white/[0.05] border border-white/10 px-6 py-3 rounded-xl font-black text-sm text-white/50 hover:text-white hover:bg-white/[0.1] transition-all">
                                        🔑 تغيير كلمة المرور
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </main>

            {showProductModal && (
                <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={() => { setShowProductModal(false); setEditingProduct(null); }}>
                    <div className={`${glass} w-full max-w-md p-6 rounded-3xl max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                                <ShoppingBag className="w-5 h-5 text-white" />
                            </div>
                            {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                        </h3>
                        <form className="space-y-4" onSubmit={async (e) => {
                            e.preventDefault();
                            if (!seller) return;
                            if (!productForm.brand || !productForm.sku) { toast('يرجى تعبئة اسم الشركة والسيريال'); return; }
                            setSaving(true);
                            const formData = new FormData();
                            formData.append('seller_id', seller.id);
                            formData.append('title', productForm.title);
                            formData.append('details', productForm.details);
                            formData.append('price', productForm.price);
                            formData.append('stock', productForm.stock);
                            formData.append('category', productForm.category);
                            formData.append('sub_category', productForm.sub_category || '');
                            formData.append('brand', productForm.brand);
                            formData.append('sku', productForm.sku);
                            if (productForm.offer_price) formData.append('offer_price', productForm.offer_price);
                            if (productForm.offer_start_date) formData.append('offer_start_date', productForm.offer_start_date);
                            if (productForm.offer_end_date) formData.append('offer_end_date', productForm.offer_end_date);
                            if (productImage) formData.append('image', productImage);
                            try {
                                const url = editingProduct ? `${API}/products/${editingProduct.id}` : `${API}/products`;
                                const method = editingProduct ? 'PUT' : 'POST';
                                await fetch(url, { method, body: formData });
                                toast(editingProduct ? 'تم تعديل المنتج ✅' : 'تم إضافة المنتج ✅');
                                setShowProductModal(false);
                                setEditingProduct(null);
                                setProductForm({ title: '', details: '', price: '', stock: '', category: '', sub_category: '', offer_price: '', brand: '', sku: '', offer_start_date: '', offer_end_date: '' });
                                setProductImage(null);
                                loadTabData(tab);
                            } catch (err) { toast('حدث خطأ'); }
                            setSaving(false);
                        }}>
                            <input required placeholder="اسم المنتج" className={inputStyle} value={productForm.title} onChange={e => setProductForm({ ...productForm, title: e.target.value })} />
                            <textarea placeholder="الوصف" className={`${inputStyle} h-20`} value={productForm.details} onChange={e => setProductForm({ ...productForm, details: e.target.value })} />
                            {/* اسم الشركة والسيريال - مطلوب */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white/30 text-[10px] font-black mb-1.5">اسم الشركة *</label>
                                    <input required placeholder="اسم الشركة المصنعة" className={inputStyle} value={productForm.brand} onChange={e => setProductForm({ ...productForm, brand: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-white/30 text-[10px] font-black mb-1.5">السيريال (SKU) *</label>
                                    <input required placeholder="رقم المنتج" className={inputStyle} value={productForm.sku} onChange={e => setProductForm({ ...productForm, sku: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input required placeholder="السعر" type="number" className={inputStyle} value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} />
                                <input required placeholder="المخزون" type="number" className={inputStyle} value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} />
                            </div>
                            <input placeholder="سعر العرض (اختياري)" type="number" className={inputStyle} value={productForm.offer_price} onChange={e => setProductForm({ ...productForm, offer_price: e.target.value })} />
                            {/* تواريخ العرض */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white/30 text-[10px] font-black mb-1.5">بداية العرض</label>
                                    <input type="date" className={inputStyle} value={productForm.offer_start_date} onChange={e => setProductForm({ ...productForm, offer_start_date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-white/30 text-[10px] font-black mb-1.5">نهاية العرض</label>
                                    <input type="date" className={inputStyle} value={productForm.offer_end_date} onChange={e => setProductForm({ ...productForm, offer_end_date: e.target.value })} />
                                </div>
                            </div>
                            {/* القسم الرئيسي */}
                            <div>
                                <label className="block text-white/30 text-[10px] font-black mb-1.5">القسم الرئيسي *</label>
                                <select required value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value, sub_category: '' })} className={selectStyle}>
                                    <option value="" style={{ background: '#1e293b', color: '#fff' }}>اختر القسم</option>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id} style={{ background: '#1e293b', color: '#fff' }}>{cat.emoji} {cat.label}</option>
                                    ))}
                                </select>
                            </div>
                            {/* القسم الفرعي */}
                            {productForm.category && getSubcategories(productForm.category).length > 0 && (
                                <div>
                                    <label className="block text-white/30 text-[10px] font-black mb-1.5">القسم الفرعي</label>
                                    <select value={productForm.sub_category} onChange={e => setProductForm({ ...productForm, sub_category: e.target.value })} className={selectStyle}>
                                        <option value="" style={{ background: '#1e293b', color: '#fff' }}>اختر القسم الفرعي</option>
                                        {getSubcategories(productForm.category).map(sub => (
                                            <option key={sub.id} value={sub.id} style={{ background: '#1e293b', color: '#fff' }}>{sub.label}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {/* صورة المنتج */}
                            <div>
                                <label className="block text-white/30 text-[10px] font-black mb-1.5">صورة المنتج</label>
                                <input type="file" accept="image/*" onChange={e => setProductImage(e.target.files[0])} className={inputStyle} />
                            </div>
                            <button type="submit" disabled={saving} className="w-full bg-gradient-to-l from-emerald-500 to-teal-600 py-4 rounded-2xl font-black disabled:opacity-50 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all active:scale-[0.98]">
                                {saving ? 'جاري الحفظ...' : (editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerDashboard;
